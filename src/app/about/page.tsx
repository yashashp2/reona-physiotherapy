import Link from 'next/link';
import { practice } from '@/config/practice';
import { PageIntro, Portrait, Eyebrow, CheckList, CTA, ReviewNote } from '@/components/ui';
import { metadata } from '@/lib/seo';
export const generateMetadata = () =>
  metadata(
    'About Reona',
    'Meet Reona Barretto. Explore her physiotherapy qualifications, clinical experience and patient-centred approach.',
    '/about',
  );
export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="About Reona"
        title="A person-first approach to physiotherapy."
        description="Clinical knowledge, practical support and time to understand what matters to you."
      />
      <section className="container split content-bottom">
        <Portrait large />
        <div className="split-copy">
          <Eyebrow>HELLO, I’M REONA</Eyebrow>
          <h2>
            Helping you move
            <br />
            towards your goals.
          </h2>
          <p>{practice.biography}</p>
          <p>{practice.philosophy}</p>
          <div className="quote-line">
            “A plan should work for your life, as well as your recovery.”
          </div>
          <p>
            My clinical work has included assessments, manual therapy, exercise programmes and
            supporting people with day-to-day mobility. I value clear explanations and an approach
            that can adapt as your needs change.
          </p>
          <Link className="text-link" href="/book">
            Discuss an appointment
          </Link>
        </div>
      </section>
      <section className="section section-white" id="professional-information">
        <div className="container split">
          <div>
            <Eyebrow>EDUCATION & DEVELOPMENT</Eyebrow>
            <h2>
              A foundation in
              <br />
              movement science.
            </h2>
            <div className="mt-8">
              {practice.qualifications.map((q) => (
                <div className="education-card" key={q.title}>
                  <h3>{q.title}</h3>
                  <p>{q.institution}</p>
                  <p>{q.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3>Certifications & professional information</h3>
            <CheckList items={practice.certifications} />
            <div className="mt-6">
              {practice.registrations.map((r) => (
                <p className="mb-3" key={r.title}>
                  <a className="text-link" href={r.url} target="_blank" rel="noreferrer">
                    {r.title} — verification resource
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </p>
              ))}
            </div>
            <ReviewNote>
              Qualifications and membership statements are drawn from the supplied CVs. Current HCPC
              registration and CSP membership must be independently verified before public launch.
              No registration number has been supplied.
            </ReviewNote>
          </div>
        </div>
      </section>
      <section className="section container">
        <Eyebrow>EXPERIENCE THAT INFORMS MY CARE</Eyebrow>
        <h2>
          From clinical knowledge
          <br />
          to everyday movement.
        </h2>
        <div className="timeline">
          {practice.experience.map((e) => (
            <article className="timeline-item" key={e.organisation}>
              <p>
                {e.start}
                {e.end ? ` – ${e.end}` : ' · end date under review'}
              </p>
              <div>
                <h3>{e.role}</h3>
                <strong>
                  {e.organisation} · {e.location}
                </strong>
                <p>{e.summary}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="caption">
          These are professional experience locations, not a list of bookable clinics.
        </p>
      </section>
      <CTA />
    </>
  );
}
