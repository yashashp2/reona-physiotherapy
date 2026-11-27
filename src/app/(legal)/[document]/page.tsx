import { notFound } from 'next/navigation';
import Link from 'next/link';
import { legal } from '@/config/legal';
import { PageIntro, ReviewNote } from '@/components/ui';
import { metadata } from '@/lib/seo';
export function generateStaticParams() {
  return Object.keys(legal).map((document) => ({ document }));
}
export async function generateMetadata({ params }: { params: Promise<{ document: string }> }) {
  const { document } = await params;
  const page = legal[document];
  return page ? metadata(page.title, page.introduction, `/${document}`) : {};
}
export default async function LegalPage({ params }: { params: Promise<{ document: string }> }) {
  const { document } = await params;
  const page = legal[document];
  if (!page) notFound();
  return (
    <>
      <PageIntro
        eyebrow="Practice information"
        title={page.title}
        description={page.introduction}
      />
      <div className="container content-bottom">
        <article className="legal-content prose">
          <ReviewNote>
            Draft template — practice-owner review required before public launch. This document and
            the website’s technical features do not establish legal or UK GDPR compliance.
          </ReviewNote>
          {page.sections.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              {s.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
          <h2>Further information</h2>
          <p>
            <Link href="/contact">Contact the practice</Link> or visit the{' '}
            <a href="https://ico.org.uk/" target="_blank" rel="noreferrer">
              Information Commissioner’s Office (opens in a new tab)
            </a>{' '}
            for data protection guidance.
          </p>
        </article>
      </div>
    </>
  );
}
