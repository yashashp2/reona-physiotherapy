import Link from 'next/link';
import { practice, visibleServices } from '@/config/practice';
import { PageIntro, CheckList, ReviewNote } from '@/components/ui';
import { RequestForm } from '@/components/request-form';
import { metadata } from '@/lib/seo';
export const generateMetadata = () =>
  metadata(
    'Request an appointment',
    'Request a physiotherapy appointment with Reona Barretto. The practice will confirm availability, fees and appointment details.',
    '/book',
  );
export default async function Book({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const available = visibleServices();
  return (
    <>
      <PageIntro
        eyebrow="Appointments"
        title="Your first step starts here."
        description="Share your appointment preferences. A request gives the practice the details needed to discuss the next step with you."
      />
      <div className="container content-bottom">
        {!practice.launchReady && (
          <ReviewNote>
            Online enquiries are not enabled in this preview. You can explore the form, but no
            request will be sent until the practice and email service are ready.
          </ReviewNote>
        )}
        {practice.bookingUrl && /^https:\/\//.test(practice.bookingUrl) && (
          <div className="review-note">
            <div>
              <p>
                Prefer the practice’s appointment management system? You will leave this website.
                The provider’s privacy notice will apply.
              </p>
              <a className="text-link" href={practice.bookingUrl} rel="noreferrer" target="_blank">
                Open secure booking provider (new tab)
              </a>
            </div>
          </div>
        )}
        <div className="booking-layout">
          <RequestForm
            kind="booking"
            services={available.map((s) => ({ slug: s.slug, title: s.title }))}
            defaultService={available.some((s) => s.slug === service) ? service : 'not-sure'}
          />
          <aside className="booking-aside">
            <div>
              <h2>What happens next?</h2>
              <CheckList
                items={[
                  'The practice reviews your request.',
                  'Availability and suitability are discussed.',
                  'Fees and appointment details are agreed.',
                  'The practice confirms your booking.',
                ]}
              />
            </div>
            <div>
              <h2>A little preparation.</h2>
              <p>
                You don’t need to share health details now. An assessment is the right setting to
                discuss your clinical needs.
              </p>
              <Link href="/faq" className="text-link mt-4">
                Read the appointment FAQs
              </Link>
            </div>
            <div>
              <h2>Need urgent help?</h2>
              <p>
                This website is not monitored for emergencies and does not provide emergency medical
                services. For a medical emergency, call 999.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
