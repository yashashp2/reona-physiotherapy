import { practice } from '@/config/practice';
import { PageIntro, ReviewNote } from '@/components/ui';
import { RequestForm } from '@/components/request-form';
import { metadata } from '@/lib/seo';
export const generateMetadata = () =>
  metadata(
    'Contact',
    'Ask about appointment availability, pricing and practice information. Approved business contact details will be published here.',
    '/contact',
  );
export default function Contact() {
  return (
    <>
      <PageIntro
        eyebrow="Get in touch"
        title="Let’s find your next step."
        description="For appointment enquiries and practical questions about the practice. Please keep health information for your clinical appointment."
      />
      <div className="container content-bottom">
        {!practice.launchReady && (
          <ReviewNote>
            Business contact details and clinic arrangements are awaiting approval. The enquiry
            service is not yet enabled.
          </ReviewNote>
        )}
        <div className="booking-layout">
          <RequestForm kind="contact" services={[]} />
          <aside className="contact-details">
            <div className="contact-detail">
              <h3>Business email</h3>
              {practice.contact.email ? (
                <a href={`mailto:${practice.contact.email}`}>{practice.contact.email}</a>
              ) : (
                <p>Approved email address to be published.</p>
              )}
            </div>
            <div className="contact-detail">
              <h3>Telephone</h3>
              {practice.contact.phone ? (
                <a href={`tel:${practice.contact.phone.replace(/\s/g, '')}`}>
                  {practice.contact.phone}
                </a>
              ) : (
                <p>Approved business number to be published.</p>
              )}
            </div>
            <div className="contact-detail">
              <h3>Clinic locations</h3>
              {practice.clinics.length ? (
                practice.clinics.map((c) => (
                  <p key={c.name}>
                    {c.name}
                    <br />
                    {c.address}
                    <br />
                    {c.postcode}
                  </p>
                ))
              ) : (
                <p>Bookable clinic locations are awaiting confirmation.</p>
              )}
            </div>
            <div className="contact-detail">
              <h3>Service areas</h3>
              <p>
                {practice.serviceAreas.length
                  ? practice.serviceAreas.join(', ')
                  : 'Service areas, including any home visits, are awaiting confirmation.'}
              </p>
            </div>
            <div className="contact-detail">
              <h3>Working hours</h3>
              <p>
                {practice.workingHours.length
                  ? practice.workingHours.join(' · ')
                  : 'Appointment hours are awaiting confirmation.'}
              </p>
            </div>
            <p className="small">Not an emergency service. For a medical emergency, call 999.</p>
          </aside>
        </div>
      </div>
    </>
  );
}
