'use client';
import { useId, useRef, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
  bookingSchema,
  contactSchema,
  londonDate,
  timeOptions,
  topicOptions,
  type BookingInput,
  type ContactInput,
} from '@/lib/validation';
type Values = BookingInput & Partial<Pick<ContactInput, 'topic'>>;
export function RequestForm({
  kind,
  services,
  defaultService = 'not-sure',
}: {
  kind: 'booking' | 'contact';
  services: { slug: string; title: string }[];
  defaultService?: string;
}) {
  const formId = useId();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  // A stable request ID survives retries in this mounted form, never stored on disk.
  const requestId = useRef<string>('');
  const schema = kind === 'booking' ? bookingSchema : contactSchema;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<BookingInput | ContactInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      website: '',
      privacy: false,
      requestId: '',
      ...(kind === 'booking' ? { service: defaultService } : {}),
    },
    shouldFocusError: true,
  });
  const fieldErrors = errors as FieldErrors<Values>;
  const field = (key: keyof Values) => ({
    id: `${formId}-${key}`,
    'aria-invalid': !!fieldErrors[key],
    'aria-describedby': fieldErrors[key] ? `${formId}-${key}-error` : undefined,
  });
  const error = (key: keyof Values) =>
    fieldErrors[key] ? (
      <span className="field-error" id={`${formId}-${key}-error`}>
        {fieldErrors[key]?.message}
      </span>
    ) : null;
  async function submit(values: BookingInput | ContactInput) {
    setStatus(null);
    try {
      const result = await fetch(kind === 'booking' ? '/api/appointments' : '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const body = await result.json();
      setStatus({
        ok: result.ok,
        message:
          typeof body.message === 'string'
            ? body.message
            : 'Something went wrong. Please try again.',
      });
    } catch {
      setStatus({
        ok: false,
        message:
          'We could not connect to the enquiry service. Your request has not been confirmed as sent. Please try again.',
      });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }
  return (
    <form
      className="form-card request-form"
      noValidate
      onSubmit={(event) => {
        if (!requestId.current) requestId.current = crypto.randomUUID();
        setValue('requestId', requestId.current);
        void handleSubmit(submit)(event);
      }}
      aria-label={kind === 'booking' ? 'Appointment request' : 'Contact enquiry'}
    >
      <div className="form-grid">
        <div className="field full">
          <label htmlFor={`${formId}-name`}>Full name</label>
          <input
            {...register('name')}
            {...field('name')}
            autoComplete="name"
            maxLength={100}
            required
          />
          {error('name')}
        </div>
        <div className="field">
          <label htmlFor={`${formId}-email`}>Email address</label>
          <input
            {...register('email')}
            {...field('email')}
            type="email"
            autoComplete="email"
            maxLength={254}
            required
          />
          {error('email')}
        </div>
        <div className="field">
          <label htmlFor={`${formId}-phone`}>Telephone number</label>
          <input
            {...register('phone')}
            {...field('phone')}
            type="tel"
            autoComplete="tel"
            maxLength={25}
            required
          />
          {error('phone')}
        </div>
        {kind === 'booking' ? (
          <>
            <div className="field full">
              <label htmlFor={`${formId}-service`}>Preferred service</label>
              <select {...register('service')} {...field('service')} required>
                <option value="not-sure">I’m not sure — please advise</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.title}
                  </option>
                ))}
              </select>
              {error('service')}
            </div>
            <div className="field">
              <label htmlFor={`${formId}-date`}>Preferred appointment date</label>
              <input
                {...register('date')}
                {...field('date')}
                type="date"
                min={londonDate()}
                required
              />
              {error('date')}
            </div>
            <div className="field">
              <label htmlFor={`${formId}-time`}>Preferred time (UK)</label>
              <select {...register('time')} {...field('time')} defaultValue="" required>
                <option value="" disabled>
                  Select a preference
                </option>
                {timeOptions.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {error('time')}
            </div>
          </>
        ) : (
          <div className="field full">
            <label htmlFor={`${formId}-topic`}>Enquiry topic</label>
            <select {...register('topic')} {...field('topic')} defaultValue="" required>
              <option value="" disabled>
                Select a topic
              </option>
              {topicOptions.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            {error('topic')}
          </div>
        )}
      </div>
      <div className="trap" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Leave this field empty</label>
        <input id={`${formId}-website`} {...register('website')} tabIndex={-1} autoComplete="off" />
      </div>
      <p className="form-help">
        All fields are required. Please do not send medical histories, diagnoses or symptoms through
        this form. We only ask for contact and appointment details.
      </p>
      <label className="privacy-check" htmlFor={`${formId}-privacy`}>
        <input type="checkbox" {...register('privacy')} {...field('privacy')} required />
        <span>
          I have read the <Link href="/privacy">privacy notice</Link> and understand how my enquiry
          details will be used.
        </span>
      </label>
      {error('privacy')}
      <button className="button" type="submit" disabled={isSubmitting || status?.ok}>
        {isSubmitting
          ? 'Sending your request…'
          : status?.ok
            ? 'Request sent'
            : kind === 'booking'
              ? 'Send Appointment Request'
              : 'Send Enquiry'}
      </button>
      <p className="form-help">
        An appointment request is not a confirmed booking. The practice must confirm availability
        and details with you.
      </p>
      {status && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role={status.ok ? 'status' : 'alert'}
          className={`form-status ${status.ok ? '' : 'error'}`}
        >
          {status.message}
        </div>
      )}
    </form>
  );
}
