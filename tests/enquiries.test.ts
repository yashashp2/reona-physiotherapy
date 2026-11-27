import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ send: vi.fn(), limit: vi.fn() }));
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mocks.send };
  },
}));
vi.mock('@upstash/redis', () => ({ Redis: class {} }));
vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: class {
    static slidingWindow() {
      return {};
    }
    limit = mocks.limit;
  },
}));
import { handleEnquiry } from '../src/lib/enquiries';
import { practice } from '../src/config/practice';
import { londonDate } from '../src/lib/validation';
const body = {
  name: 'Test Person',
  email: 'test@example.com',
  phone: '07700900000',
  privacy: true,
  website: '',
  requestId: '52ef7148-7217-41bb-92b4-66adb72b6b3a',
  topic: 'Pricing',
};
function request(value: unknown = body, origin = 'https://practice.example') {
  return new Request('https://practice.example/api/contact', {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify(value),
  });
}
beforeEach(() => {
  vi.stubEnv('SITE_URL', 'https://practice.example');
  vi.stubEnv('ENQUIRIES_ENABLED', 'true');
  for (const key of [
    'RESEND_API_KEY',
    'ENQUIRY_FROM',
    'ENQUIRY_TO',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'RATE_LIMIT_SECRET',
  ])
    vi.stubEnv(key, 'unit-test-value');
  practice.launchReady = true;
  mocks.send.mockReset().mockResolvedValue({ data: { id: 'mock' }, error: null });
  mocks.limit.mockReset().mockResolvedValue({ success: true, reason: undefined });
});
afterEach(() => {
  practice.launchReady = false;
  vi.unstubAllEnvs();
});
describe('enquiry boundary with mocked providers', () => {
  it('rejects cross-origin requests', async () => {
    expect((await handleEnquiry(request(body, 'https://other.example'), 'contact')).status).toBe(
      403,
    );
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it('rejects malformed JSON', async () => {
    const r = new Request('https://practice.example/api/contact', {
      method: 'POST',
      headers: { origin: 'https://practice.example', 'content-type': 'application/json' },
      body: '{',
    });
    expect((await handleEnquiry(r, 'contact')).status).toBe(400);
  });
  it('rejects oversized body', async () =>
    expect(
      (await handleEnquiry(request({ ...body, name: 'x'.repeat(9000) }), 'contact')).status,
    ).toBe(413));
  it('rejects invalid data', async () =>
    expect((await handleEnquiry(request({ ...body, email: 'bad' }), 'contact')).status).toBe(422));
  it('rejects honeypot submissions', async () => {
    expect(
      (await handleEnquiry(request({ ...body, website: 'bot.example' }), 'contact')).status,
    ).toBe(422);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it('does not send in preview', async () => {
    practice.launchReady = false;
    expect((await handleEnquiry(request(), 'contact')).status).toBe(503);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it('fails closed with missing credentials', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    expect((await handleEnquiry(request(), 'contact')).status).toBe(503);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it('enforces shared rate limits', async () => {
    mocks.limit.mockResolvedValue({ success: false });
    const r = await handleEnquiry(request(), 'contact');
    expect(r.status).toBe(429);
    expect(r.headers.get('Retry-After')).toBe('900');
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it('fails closed when limiter times out with success true', async () => {
    mocks.limit.mockResolvedValue({ success: true, reason: 'timeout' });
    expect((await handleEnquiry(request(), 'contact')).status).toBe(503);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it('fails closed on Redis exception', async () => {
    mocks.limit.mockRejectedValue(new Error('provider failure'));
    expect((await handleEnquiry(request(), 'contact')).status).toBe(503);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it('sends plain-text notifications then acknowledgement with idempotency keys', async () => {
    const r = await handleEnquiry(request(), 'contact');
    expect(r.status).toBe(200);
    expect(mocks.send).toHaveBeenCalledTimes(2);
    expect(mocks.send.mock.calls[0][0].html).toBeUndefined();
    expect(mocks.send.mock.calls[0][1].idempotencyKey).toMatch(/^notification\//);
    expect(mocks.send.mock.calls[1][0].text).toContain('not a confirmed appointment');
  });
  it('handles booking route with preferred date', async () => {
    const { topic, ...base } = body;
    expect(topic).toBe('Pricing');
    const r = await handleEnquiry(
      request({ ...base, service: 'not-sure', date: londonDate(), time: 'Morning' }),
      'booking',
    );
    expect(r.status).toBe(200);
    expect(mocks.send.mock.calls[0][0].text).toContain('Preferred date:');
  });
  it('does not acknowledge a failed practice notification', async () => {
    mocks.send.mockResolvedValueOnce({ error: { message: 'private provider details' } });
    const r = await handleEnquiry(request(), 'contact');
    expect(r.status).toBe(502);
    expect(mocks.send).toHaveBeenCalledTimes(1);
    expect(await r.text()).not.toContain('private provider');
  });
  it('does not encourage duplicate requests after acknowledgement failure', async () => {
    mocks.send
      .mockResolvedValueOnce({ error: null })
      .mockRejectedValueOnce(new Error('provider failure'));
    const r = await handleEnquiry(request(), 'contact');
    expect(r.status).toBe(200);
    expect((await r.json()).message).toContain('do not need to submit it again');
  });
  it('reuses delivery idempotency key on retry', async () => {
    await handleEnquiry(request(), 'contact');
    await handleEnquiry(request(), 'contact');
    expect(mocks.send.mock.calls[0][1]).toEqual(mocks.send.mock.calls[2][1]);
  });
  it('hashes email and network identifiers before Redis', async () => {
    await handleEnquiry(request(), 'contact');
    for (const args of mocks.limit.mock.calls) {
      expect(args[0]).toMatch(/^[a-f0-9]{64}$/);
      expect(args[0]).not.toContain('test@example.com');
    }
  });
});
