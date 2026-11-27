import { faqs } from '@/config/practice';
import { PageIntro, FAQs, CTA } from '@/components/ui';
import { metadata } from '@/lib/seo';
export const generateMetadata = () =>
  metadata(
    'Frequently asked questions',
    'Prepare for your physiotherapy appointment with information about assessment, referrals, clothing, fees and session planning.',
    '/faq',
  );
export default function FAQPage() {
  return (
    <>
      <PageIntro
        eyebrow="Frequently asked questions"
        title="A little clarity before you begin."
        description="Practical information for your first step. Any practice arrangements still being confirmed are labelled below."
      />
      <div className="container content-bottom">
        <div className="max-w-3xl">
          <FAQs items={faqs} />
        </div>
      </div>
      <CTA />
    </>
  );
}
