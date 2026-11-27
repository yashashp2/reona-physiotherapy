import { visibleServices } from '@/config/practice';
import { PageIntro, ServiceCard, CTA, ReviewNote } from '@/components/ui';
import { metadata } from '@/lib/seo';
export const generateMetadata = () =>
  metadata(
    'Physiotherapy services',
    'Explore proposed physiotherapy services including musculoskeletal care, sports rehabilitation and exercise therapy.',
    '/services',
  );
export default function Services() {
  return (
    <>
      <PageIntro
        eyebrow="Our treatments"
        title="Care for the way you want to move."
        description="Your assessment is the starting point. Together, we can explore the approach that suits your needs and goals."
      />
      <div className="container content-bottom">
        <ReviewNote>
          These are proposed independent service categories. Availability and clinical suitability
          must be confirmed before an appointment is agreed.
        </ReviewNote>
        <div className="three-grid">
          {visibleServices().map((s) => (
            <ServiceCard service={s} key={s.slug} />
          ))}
        </div>
      </div>
      <CTA />
    </>
  );
}
