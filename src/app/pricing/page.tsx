import Link from 'next/link';
import { practice, prices, visibleServices } from '@/config/practice';
import { PageIntro, CTA, ReviewNote } from '@/components/ui';
import { metadata } from '@/lib/seo';
export const generateMetadata = () =>
  metadata(
    'Pricing',
    'Explore appointment types and enquire about physiotherapy pricing. Prices and session durations are awaiting confirmation.',
    '/pricing',
  );
export default function Pricing() {
  const available = visibleServices();
  const visible = prices.filter(
    (p) =>
      p.enabled &&
      (!practice.launchReady || p.confirmed) &&
      (!p.serviceSlug || available.some((s) => s.slug === p.serviceSlug)),
  );
  return (
    <>
      <PageIntro
        eyebrow="Pricing"
        title="Clear information. Considered care."
        description="The right appointment starts with understanding your needs. Fees and session lengths will be agreed before your appointment is confirmed."
      />
      <div className="container content-bottom">
        <ReviewNote>
          Prices and appointment durations have not been supplied. The options below are proposed
          offerings, not confirmed availability.
        </ReviewNote>
        <div className="three-grid">
          {visible.map((p) => (
            <article className="pricing-card" key={p.title}>
              <p className="eyebrow">{p.confirmed ? 'APPOINTMENT' : 'PROPOSED OFFERING'}</p>
              <h2>{p.title}</h2>
              <div className="price">
                {p.amountGBP === null
                  ? 'Contact for pricing'
                  : new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(
                      p.amountGBP,
                    )}
              </div>
              <p className="mt-3">
                {p.durationMinutes
                  ? `${p.durationMinutes} minutes`
                  : 'Session duration to be confirmed'}
              </p>
              <Link
                className="button button-outline"
                href={p.serviceSlug ? `/book?service=${p.serviceSlug}` : '/contact'}
              >
                Enquire about this option
              </Link>
            </article>
          ))}
        </div>
        <div className="prose mt-12">
          <h2>Changes and cancellations</h2>
          <p>
            {practice.cancellationPolicy ||
              'The cancellation and rescheduling policy is awaiting owner approval. Please ask for the applicable terms before agreeing an appointment.'}
          </p>
          <h2>Payment</h2>
          <p>
            Payment methods and payment timing must be confirmed with the practice. No payment is
            collected through this website.
          </p>
        </div>
      </div>
      <CTA />
    </>
  );
}
