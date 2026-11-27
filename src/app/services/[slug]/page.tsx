import Link from 'next/link';
import { notFound } from 'next/navigation';
import { visibleServices } from '@/config/practice';
import {
  Breadcrumbs,
  Eyebrow,
  Photo,
  CheckList,
  FAQs,
  ServiceCard,
  ReviewNote,
  CTA,
} from '@/components/ui';
import { metadata } from '@/lib/seo';
export function generateStaticParams() {
  return visibleServices().map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = visibleServices().find((s) => s.slug === slug);
  return s ? metadata(s.title, s.description, `/services/${slug}`) : {};
}
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = visibleServices().find((s) => s.slug === slug);
  if (!s) notFound();
  return (
    <>
      <div className="container pt-8">
        <Breadcrumbs items={[{ label: 'Services', href: '/services' }, { label: s.title }]} />
        <section className="service-detail-hero">
          <div>
            <Eyebrow>PERSONALISED CARE</Eyebrow>
            <h1>{s.title}</h1>
            <p className="lead">{s.description}</p>
            {!s.confirmed && (
              <p className="status-label">Proposed service · availability to be confirmed</p>
            )}
            <div className="button-row">
              <Link className="button" href={`/book?service=${s.slug}`}>
                Request an Appointment
              </Link>
            </div>
          </div>
          <Photo
            src={s.image}
            alt={`Illustrative ${s.title.toLowerCase()} photograph, not the practice`}
          />
        </section>
      </div>
      <section className="section section-white">
        <div className="container service-body">
          <div className="prose">
            <h2>{s.short}</h2>
            <p>{s.description}</p>
            <h2>Who might this be suitable for?</h2>
            <p>
              An assessment is needed to understand whether this approach is right for you.
              Potential concerns include:
            </p>
            <CheckList items={s.suitable} />
            <h2>What you can expect</h2>
            <p>{s.approach}</p>
            <h2>Working towards your goals</h2>
            <p>{s.benefit}</p>
            <h2>Your comfort comes first</h2>
            <p>
              Treatment options, consent and any relevant precautions would be discussed with you.
              You can ask questions, decline a technique or ask to stop. If another type of care is
              more appropriate, this should be explained.
            </p>
          </div>
          <aside className="sidebar-card">
            <Eyebrow>YOUR FIRST STEP</Eyebrow>
            <h2>Start with a conversation.</h2>
            <p>
              No two journeys are the same. An assessment helps establish what support may be
              appropriate.
            </p>
            <CheckList
              items={[
                'Individual assessment',
                'Clear explanations',
                'A plan discussed with you',
                'Progress reviewed together',
              ]}
            />
            <Link className="button" href={`/book?service=${s.slug}`}>
              Request an Appointment
            </Link>
            <ReviewNote>
              Requests are not confirmed bookings. This service is subject to availability and scope
              confirmation.
            </ReviewNote>
          </aside>
        </div>
      </section>
      <section className="section container">
        <div className="faq-layout">
          <div>
            <Eyebrow>GOOD TO KNOW</Eyebrow>
            <h2>Before you begin.</h2>
          </div>
          <FAQs
            items={[
              {
                question: 'Is this treatment right for me?',
                answer:
                  'Suitability depends on your assessment, preferences and any relevant health considerations. A website cannot establish whether a treatment is appropriate for an individual.',
                confirmed: true,
              },
              {
                question: 'What does this service cost?',
                answer:
                  'Prices and session durations are awaiting confirmation. Please check with the practice before arranging an appointment.',
                confirmed: false,
              },
              {
                question: 'Can I book this service now?',
                answer:
                  'You may submit an appointment request once the enquiry service is enabled. The practice must confirm availability, suitability and the appointment details.',
                confirmed: false,
              },
            ]}
          />
        </div>
      </section>
      <section className="container content-bottom">
        <Eyebrow>EXPLORE OTHER APPROACHES</Eyebrow>
        <h2 className="mb-8">Related treatments.</h2>
        <div className="three-grid">
          {visibleServices()
            .filter((x) => x.slug !== s.slug)
            .slice(0, 3)
            .map((x) => (
              <ServiceCard key={x.slug} service={x} />
            ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
