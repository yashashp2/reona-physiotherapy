import Link from 'next/link';
import { practice, conditions } from '@/config/practice';
import { PageIntro, CTA, ReviewNote, CheckList } from '@/components/ui';
import { metadata } from '@/lib/seo';
export const generateMetadata = () =>
  metadata(
    'Conditions and concerns',
    'Explore potential areas of physiotherapy support for pain, stiffness, mobility and rehabilitation. Clinical suitability requires assessment.',
    '/conditions',
  );
export default function Conditions() {
  const visible = conditions.filter((c) => c.enabled && (!practice.launchReady || c.confirmed));
  return (
    <>
      <PageIntro
        eyebrow="Conditions & concerns"
        title="For the movements that matter to you."
        description="Whether you want to get back to an activity or feel more confident in everyday movement, an individual assessment helps identify a suitable next step."
      />
      <div className="container content-bottom">
        <ReviewNote>
          These are potential areas of support. Conditions will only remain published at launch when
          they are within Reona’s confirmed independent clinical scope.
        </ReviewNote>
        <div className="split">
          <div className="sidebar-card">
            <h2>Potential areas of support</h2>
            <CheckList items={visible.map((c) => c.title)} />
          </div>
          <div className="prose">
            <h2>Start with understanding.</h2>
            <p>
              Similar symptoms can have different causes. Your assessment considers your movement,
              relevant history and goals before treatment options are discussed.
            </p>
            <h2>A plan that can adapt.</h2>
            <p>
              Your care may include advice, tailored exercises or other appropriate techniques.
              Progress and the number of appointments vary. Sometimes further assessment or support
              from another professional is needed.
            </p>
            <p>
              This website provides general information, not a diagnosis or individual medical
              advice. It does not provide emergency care.
            </p>
            <Link href="/services" className="text-link">
              Explore treatment approaches
            </Link>
          </div>
        </div>
      </div>
      <CTA />
    </>
  );
}
