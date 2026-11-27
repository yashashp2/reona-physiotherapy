import Link from 'next/link';
import { Leaf, ShieldCheck, Check } from 'lucide-react';
import { practice, visibleServices, conditions, faqs } from '@/config/practice';
import {
  Eyebrow,
  Photo,
  Portrait,
  Credentials,
  ServiceCard,
  FAQs,
  CTA,
  Testimonials,
  CheckList,
} from '@/components/ui';
import { Reveal } from '@/components/reveal';
import { metadata } from '@/lib/seo';
export const generateMetadata = () =>
  metadata(
    'Personalised physiotherapy',
    'Move better, feel stronger and live confidently. Explore personalised physiotherapy and rehabilitation with Reona Barretto.',
    '/',
  );
export default function Home() {
  const allServices = visibleServices();
  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <Eyebrow>PERSONALISED PHYSIOTHERAPY</Eyebrow>
          <h1>
            Move better.
            <br />
            Feel stronger.
            <br />
            <em>Live confidently.</em>
          </h1>
          <p className="lead">
            Personalised, evidence-based physiotherapy designed to support your recovery, improve
            mobility and help you return to the activities that matter most.
          </p>
          <div className="button-row">
            <Link className="button" href="/book">
              Book an Appointment
            </Link>
            <Link className="button button-outline" href="/services">
              Explore Treatments
            </Link>
          </div>
          <p className="hero-footnote">
            <ShieldCheck size={17} /> Thoughtful care. Built around you.
          </p>
        </div>
        <div className="hero-visual">
          {practice.portrait ? (
            <Portrait large />
          ) : (
            <Photo
              src="/images/assessment.jpg"
              alt="Illustrative physiotherapy assessment of a patient’s shoulder and back; not Reona or her clinic"
              className="hero-photo"
              priority
            />
          )}
          <div className="hero-note">
            <Leaf size={32} strokeWidth={1.25} />
            <div>
              <strong>Your movement. Your journey.</strong>
              <small>Individual care, every step of the way.</small>
            </div>
          </div>
        </div>
      </section>
      <Credentials />
      <section className="section container">
        <Reveal>
          <div className="section-heading">
            <div>
              <Eyebrow>CARE THAT MOVES WITH YOU</Eyebrow>
              <h2>
                A little support.
                <br />A meaningful difference.
              </h2>
            </div>
            <p>
              From everyday movement to returning to sport, explore an approach shaped around your
              needs.
            </p>
          </div>
          <div className="three-grid">
            {allServices.map((s, index) => (
              <ServiceCard key={s.slug} service={s} image={index < 3} />
            ))}
          </div>
        </Reveal>
      </section>
      <section className="section section-white">
        <div className="container split">
          <Portrait />
          <div className="split-copy">
            <Eyebrow>HELLO, I’M REONA</Eyebrow>
            <h2>
              A personal approach
              <br />
              to your wellbeing.
            </h2>
            <p>{practice.biography}</p>
            <p>{practice.philosophy}</p>
            <div className="qualification-pills">
              <span>MSc Sports & Exercise Science</span>
              <span>Bachelor of Physiotherapy</span>
            </div>
            <Link className="text-link" href="/about">
              Get to know Reona
            </Link>
          </div>
        </div>
      </section>
      <section className="section condition-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>FIND YOUR WAY FORWARD</Eyebrow>
              <h2>What brings you here?</h2>
            </div>
            <Link href="/conditions" className="text-link">
              Explore conditions
            </Link>
          </div>
          <div className="condition-grid">
            {conditions
              .filter((c) => c.enabled && (!practice.launchReady || c.confirmed))
              .map((c) => (
                <div key={c.title}>
                  <Check aria-hidden="true" />
                  <span>{c.title}</span>
                </div>
              ))}
          </div>
          <p className="caption">
            Potential areas of support. Independent clinical scope and service availability are
            awaiting confirmation.
          </p>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <Eyebrow>A CLEAR PATH, TOGETHER</Eyebrow>
            <h2>Your care, step by step.</h2>
          </div>
          <p>A collaborative process, with space to listen, understand and adapt.</p>
        </div>
        <div className="four-grid journey">
          {[
            [
              'Book a consultation',
              'Tell us your appointment preferences. Your appointment is confirmed by the practice.',
            ],
            [
              'Understand your needs',
              'A personalised assessment explores your movement, priorities and goals.',
            ],
            [
              'Build your programme',
              'Discuss a treatment approach and achievable steps that fit into your life.',
            ],
            ['Review and progress', 'Reflect on what’s changing and adapt your plan together.'],
          ].map(([title, text]) => (
            <div className="journey-card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section why-section">
        <div className="container split">
          <div className="split-copy">
            <Eyebrow>MORE THAN A TREATMENT</Eyebrow>
            <h2>
              Care that sees
              <br />
              the whole person.
            </h2>
            <p>Your goals are individual. Your physiotherapy should be too.</p>
            <CheckList
              items={[
                'Evidence-informed clinical decisions',
                'A programme tailored to your priorities',
                'Postgraduate education and clinical experience',
                'Hands-on assessment and practical guidance',
                'Care that respects your comfort and choices',
                'A focus on long-term everyday function',
              ]}
            />
          </div>
          <Photo
            src="/images/exercise.jpg"
            alt="Illustrative rehabilitation session with a therapist guiding an exercise"
            className="why-photo"
          />
        </div>
      </section>
      <Testimonials />
      <section className="section container faq-layout">
        <div>
          <Eyebrow>A FEW THINGS YOU MIGHT ASK</Eyebrow>
          <h2>
            Let’s make your
            <br />
            first step easier.
          </h2>
          <p>Helpful information before your appointment.</p>
          <Link href="/faq" className="text-link">
            All frequently asked questions
          </Link>
        </div>
        <FAQs items={faqs} />
      </section>
      <CTA />
    </>
  );
}
