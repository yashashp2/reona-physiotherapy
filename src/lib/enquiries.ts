import 'server-only';
import { createHmac } from 'node:crypto';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { bookingSchema, contactSchema } from './validation';
import { practice, services } from '@/config/practice';

const response = (status: number, message: string, extra: Record<string, string> = {}) =>
  Response.json({ message }, { status, headers: { 'Cache-Control': 'no-store', ...extra } });
async function readLimitedJson(request: Request) {
  if (Number(request.headers.get('content-length') || 0) > 8192) throw new Error('too-large');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('invalid');
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > 8192) {
      await reader.cancel();
      throw new Error('too-large');
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
}
export async function handleEnquiry(request: Request, kind: 'booking' | 'contact') {
  const configuredOrigin = process.env.SITE_URL;
  let allowedOrigin: string | null = null;
  try {
    allowedOrigin = configuredOrigin
      ? new URL(configuredOrigin).origin
      : process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:3000'
        : null;
  } catch {
    return response(503, 'The enquiry service is temporarily unavailable. Please try again later.');
  }
  if (!allowedOrigin || request.headers.get('origin') !== allowedOrigin)
    return response(
      403,
      'This request could not be verified. Please use the form on this website.',
    );
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return response(415, 'Please submit the website form.');
  let raw: unknown;
  try {
    raw = await readLimitedJson(request);
  } catch (e) {
    return response(
      e instanceof Error && e.message === 'too-large' ? 413 : 400,
      'The request could not be read. Please check the form and try again.',
    );
  }
  const parsed = (kind === 'booking' ? bookingSchema : contactSchema).safeParse(raw);
  if (!parsed.success)
    return response(422, 'Please check all required fields and your preferred date.');
  const data = parsed.data;
  if (data.website) return response(422, 'The request could not be accepted. Please try again.');
  const {
    RESEND_API_KEY,
    ENQUIRY_FROM,
    ENQUIRY_TO,
    UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN,
    RATE_LIMIT_SECRET,
  } = process.env;
  if (
    !practice.launchReady ||
    !RESEND_API_KEY ||
    !ENQUIRY_FROM ||
    !ENQUIRY_TO ||
    !UPSTASH_REDIS_REST_URL ||
    !UPSTASH_REDIS_REST_TOKEN ||
    !RATE_LIMIT_SECRET ||
    process.env.ENQUIRIES_ENABLED !== 'true'
  ) {
    return response(
      503,
      'Online enquiries are not available yet. Your request has not been sent. Please use an approved contact method once published.',
    );
  }
  const hash = (value: string) =>
    createHmac('sha256', RATE_LIMIT_SECRET).update(value).digest('hex');
  // Vercel overwrites x-vercel-forwarded-for. On other hosts all traffic shares
  // a conservative bucket until a trusted-proxy IP adapter is installed.
  const ip =
    process.env.VERCEL === '1'
      ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      : 'self-hosted';
  try {
    const redis = new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN });
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: false,
      prefix: 'reona:enquiry',
      timeout: 3000,
    });
    const limits = await Promise.all([
      limiter.limit(hash(`ip:${ip}`)),
      limiter.limit(hash(`email:${data.email.toLowerCase()}`)),
    ]);
    if (limits.some((r) => r.reason === 'timeout'))
      return response(
        503,
        'The enquiry service is temporarily unavailable. Please try again later.',
      );
    if (limits.some((r) => !r.success))
      return response(429, 'Too many requests. Please wait 15 minutes before trying again.', {
        'Retry-After': '900',
      });
    const subjectLabel = kind === 'booking' ? 'Appointment request' : 'Contact enquiry';
    const detail =
      'service' in data
        ? `Service: ${services.find((s) => s.slug === data.service)?.title || 'Advice on appointment type'}\nPreferred date: ${data.date}\nPreferred time: ${data.time} (UK time)`
        : `Topic: ${data.topic}`;
    const key = hash(`${kind}:${data.requestId}:${JSON.stringify(data)}`);
    const resend = new Resend(RESEND_API_KEY);
    // Plain text prevents user-controlled HTML. Do not log request bodies or provider errors.
    const notification = await resend.emails.send(
      {
        from: ENQUIRY_FROM,
        to: ENQUIRY_TO,
        replyTo: data.email,
        subject: `${subjectLabel} — website`,
        text: `${subjectLabel}\n\nName: ${data.name}\nEmail: ${data.email}\nTelephone: ${data.phone}\n${detail}\n\nPrivacy notice acknowledged. No clinical information requested.\nReference: ${data.requestId}\n\nAn appointment request is not a confirmed booking.`,
      },
      { idempotencyKey: `notification/${key}` },
    );
    if (notification.error)
      return response(502, 'We could not send your request. Please try again later.');
    let acknowledgementSent = false;
    try {
      const acknowledgement = await resend.emails.send(
        {
          from: ENQUIRY_FROM,
          to: data.email,
          subject: `${subjectLabel} received — ${practice.brand}`,
          text: `Hello ${data.name},\n\nThank you. Your ${kind === 'booking' ? 'appointment request' : 'contact enquiry'} has been received by the enquiry service and forwarded to the practice.\n\nThis is not a confirmed appointment. The practice will need to agree availability, suitability, fees and appointment details with you.\n\nPlease do not reply with medical histories or sensitive health information. This inbox is not an emergency service. In a medical emergency call 999.\n\n${practice.brand}\nReference: ${data.requestId}`,
        },
        { idempotencyKey: `acknowledgement/${key}` },
      );
      acknowledgementSent = !acknowledgement.error;
    } catch {
      /* Practice notification already accepted; do not encourage duplicate requests. */
    }
    return response(
      200,
      acknowledgementSent
        ? 'Your request has been sent to the practice. An acknowledgement email has been requested. This is not a confirmed appointment.'
        : 'Your request has been sent to the practice, but we could not send your acknowledgement email. You do not need to submit it again. This is not a confirmed appointment.',
    );
  } catch {
    return response(503, 'The enquiry service is temporarily unavailable. Please try again later.');
  }
}
