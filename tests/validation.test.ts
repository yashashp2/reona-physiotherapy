import { describe, expect, it } from 'vitest';
import {
  bookingSchema,
  contactSchema,
  londonDate,
  validAppointmentDate,
} from '../src/lib/validation';
const base = {
  name: 'Test Person',
  email: 'test@example.com',
  phone: '07700900000',
  privacy: true,
  website: '',
  requestId: '52ef7148-7217-41bb-92b4-66adb72b6b3a',
};
describe('data minimisation and validation', () => {
  it('accepts a complete appointment request', () =>
    expect(
      bookingSchema.safeParse({ ...base, service: 'not-sure', date: londonDate(), time: 'Morning' })
        .success,
    ).toBe(true));
  it('rejects unrequested clinical fields', () =>
    expect(
      contactSchema.safeParse({ ...base, topic: 'Pricing', symptoms: 'health data' }).success,
    ).toBe(false));
  it.each(['2020-01-01', '2030-02-30', '2026-13-01', 'not-a-date', '2099-01-01'])(
    'rejects invalid or out-of-range date %s',
    (date) => expect(validAppointmentDate(date)).toBe(false),
  );
  it('rejects a nonexistent service', () =>
    expect(
      bookingSchema.safeParse({ ...base, service: 'invented', date: londonDate(), time: 'Morning' })
        .success,
    ).toBe(false));
  it('requires a privacy acknowledgement', () =>
    expect(contactSchema.safeParse({ ...base, privacy: false, topic: 'Pricing' }).success).toBe(
      false,
    ));
  it('rejects header injection in name', () =>
    expect(
      contactSchema.safeParse({
        ...base,
        name: 'Test\r\nBcc: victim@example.com',
        topic: 'Pricing',
      }).success,
    ).toBe(false));
  it('uses London day at a BST boundary', () =>
    expect(londonDate(new Date('2026-06-01T23:30:00Z'))).toBe('2026-06-02'));
});
