import { z } from 'zod';
import { visibleServices } from '@/config/practice';
export function londonDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
export function validAppointmentDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  const latest = new Date();
  latest.setUTCFullYear(latest.getUTCFullYear() + 1);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value &&
    value >= londonDate() &&
    value <= londonDate(latest)
  );
}
export const timeOptions = ['Morning', 'Afternoon', 'Evening', 'No preference'] as const;
export const topicOptions = [
  'Appointment availability',
  'Pricing',
  'Clinic access',
  'Practice information',
  'Existing appointment',
  'Privacy or complaints',
] as const;
const name = z
  .string()
  .trim()
  .min(2, 'Enter your full name.')
  .max(100, 'Use no more than 100 characters.')
  .refine((v) => !/[\r\n<>\x00-\x1f]/.test(v), 'Please enter a name without special markup.');
const common = {
  name,
  email: z.email('Enter a valid email address.').max(254),
  phone: z
    .string()
    .trim()
    .min(7, 'Enter a contact telephone number.')
    .max(25)
    .regex(/^\+?[\d\s()\-]+$/, 'Enter a valid telephone number.')
    .refine((v) => v.replace(/\D/g, '').length >= 7, 'Enter a valid telephone number.'),
  privacy: z.boolean().refine((v) => v, 'Please acknowledge the privacy notice.'),
  website: z.string().max(200),
  requestId: z.uuid(),
};
export const bookingSchema = z
  .object({
    ...common,
    service: z
      .string()
      .refine(
        (v) => v === 'not-sure' || visibleServices().some((s) => s.slug === v),
        'Choose an available service.',
      ),
    date: z
      .string()
      .refine(validAppointmentDate, 'Choose a valid date from today to one year ahead.'),
    time: z.enum(timeOptions, { error: 'Choose your preferred time.' }),
  })
  .strict();
export const contactSchema = z
  .object({ ...common, topic: z.enum(topicOptions, { error: 'Choose an enquiry topic.' }) })
  .strict();
export type BookingInput = z.infer<typeof bookingSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
