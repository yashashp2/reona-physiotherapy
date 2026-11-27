import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  Footprints,
  Hand,
  HeartPulse,
  Dumbbell,
  PersonStanding,
  Brain,
  Circle,
  ShieldCheck,
  GraduationCap,
  Check,
  Plus,
} from 'lucide-react';
import { practice, visibleServices, type Service, type FAQ } from '@/config/practice';
import { jsonLd, siteUrl } from '@/lib/seo';
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const all = [{ label: 'Home', href: '/' }, ...items];
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {all.map((item, i) => (
            <li key={item.label}>
              {i > 0 && <span aria-hidden="true">/</span>}
              {item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: all.map((x, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: x.label,
              ...(x.href ? { item: new URL(x.href, siteUrl).href } : {}),
            })),
          }),
        }}
      />
    </>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-intro container">
      <Breadcrumbs items={[{ label: eyebrow }]} />
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
    </section>
  );
}
export function Photo({
  src,
  alt,
  className = '',
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`photo ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 640px"
        preload={priority}
        className="object-cover"
      />
      <span className="photo-label">Illustrative photography</span>
    </div>
  );
}
export function Portrait({ large = false }: { large?: boolean }) {
  return practice.portrait ? (
    <div className={`portrait ${large ? 'large' : ''}`}>
      <Image
        src={practice.portrait.src}
        alt={practice.portrait.alt}
        fill
        sizes="(max-width: 700px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  ) : (
    <div className={`portrait portrait-fallback ${large ? 'large' : ''}`}>
      <div className="portrait-lines" aria-hidden="true" />
      <span className="monogram" aria-hidden="true">
        rb.
      </span>
      <div className="portrait-caption">
        <span>{practice.name}</span>
        <small>{practice.title} · MSc · BPT</small>
        <small>Professional portrait coming soon</small>
      </div>
    </div>
  );
}
export function Credentials() {
  return (
    <section className="credentials" aria-label="Qualifications and professional registrations">
      <div className="container credentials-grid">
        {practice.registrations.map((registration) => (
          <div key={registration.title}>
            <ShieldCheck />
            <span>
              {registration.title}
              <small>
                {registration.verified ? registration.description : 'Verification pending'}
              </small>
            </span>
          </div>
        ))}
        {practice.qualifications.map((qualification) => (
          <div key={qualification.title}>
            <GraduationCap />
            <span>
              {qualification.title}
              <small>{qualification.institution}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
const icons = {
  activity: Activity,
  running: Footprints,
  hands: Hand,
  heart: HeartPulse,
  exercise: Dumbbell,
  mobility: PersonStanding,
  brain: Brain,
  cupping: Circle,
};
export function ServiceCard({ service, image = false }: { service: Service; image?: boolean }) {
  const Icon = icons[service.icon];
  return (
    <article className={`service-card ${image ? 'with-image' : ''}`}>
      {image && (
        <Photo src={service.image} alt={`Illustrative ${service.title.toLowerCase()} setting`} />
      )}
      <div className="service-card-content">
        <Icon className="service-icon" size={28} strokeWidth={1.4} />
        <h3>
          <Link href={`/services/${service.slug}`}>{service.title}</Link>
        </h3>
        <p>{service.description}</p>
        {!service.confirmed && <small className="status-label">Proposed service</small>}
        <Link className="text-link" href={`/services/${service.slug}`}>
          Explore treatment<span className="sr-only">: {service.title}</span>
        </Link>
      </div>
    </article>
  );
}
export function FAQs({ items }: { items: FAQ[] }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details key={item.question}>
          <summary>
            {item.question}
            <Plus size={19} aria-hidden="true" />
          </summary>
          <div className="faq-answer">
            <p>{item.answer}</p>
            {!item.confirmed && (
              <small className="status-label">Practice details to be confirmed</small>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
export function CTA() {
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <div>
          <Eyebrow>YOUR NEXT CHAPTER</Eyebrow>
          <h2>
            Take the first step towards
            <br className="desktop-break" /> better movement.
          </h2>
          <p>Let’s start with what matters to you.</p>
        </div>
        <div className="button-row">
          <Link className="button button-ivory" href="/book">
            Book an Appointment
          </Link>
          <Link className="button button-light-outline" href="/contact">
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}
export function ReviewNote({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="review-note">
      <ShieldCheck size={20} />
      <p>
        {children ||
          'This is a practice preview. Services, registration status and business details require confirmation before public launch.'}
      </p>
    </aside>
  );
}
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((x) => (
        <li key={x}>
          <Check size={18} aria-hidden="true" />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}
export function Testimonials() {
  const approved = practice.testimonials.filter((x) => x.authorised);
  if (!approved.length) return null;
  return (
    <section className="section container">
      <Eyebrow>PATIENT EXPERIENCES</Eyebrow>
      <h2>In their own words.</h2>
      <div className="three-grid">
        {approved.map((t, i) => (
          <blockquote className="quote-card" key={i}>
            <p>“{t.quote}”</p>
            <cite>{t.name}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand">
            <span>{practice.name}.</span>
            <small>PHYSIOTHERAPY</small>
          </Link>
          <p>
            Thoughtful care.
            <br />
            Meaningful movement.
          </p>
          <p className="small">
            Personalised physiotherapy in the UK.
            <br />
            {practice.launchReady
              ? practice.serviceAreas.join(' · ')
              : 'Practice details awaiting confirmation.'}
          </p>
        </div>
        <div>
          <h2>Explore</h2>
          {[
            ['/about', 'About Reona'],
            ['/services', 'Treatments'],
            ['/conditions', 'Conditions'],
            ['/pricing', 'Pricing'],
            ['/faq', 'FAQs'],
            ['/book', 'Appointments'],
            ['/contact', 'Contact'],
          ].map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          <h2>Treatments</h2>
          {visibleServices()
            .slice(0, 5)
            .map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`}>
                {s.title}
              </Link>
            ))}
        </div>
        <div>
          <h2>Professional information</h2>
          {practice.registrations.map((r) => (
            <a key={r.title} href={r.url} target="_blank" rel="noreferrer">
              {r.title.startsWith('HCPC')
                ? 'Check the HCPC register'
                : 'CSP practitioner directory'}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
          {practice.contact.email && (
            <a href={`mailto:${practice.contact.email}`}>{practice.contact.email}</a>
          )}
          {practice.contact.phone && (
            <a href={`tel:${practice.contact.phone.replace(/\s/g, '')}`}>
              {practice.contact.phone}
            </a>
          )}
          {practice.socialLinks.map((s) => (
            <a href={s.url} key={s.url} rel="noreferrer" target="_blank">
              {s.label}
            </a>
          ))}
          <p className="small">
            Not an emergency service.
            <br />
            For a medical emergency, call 999.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <small>
          © {new Date().getUTCFullYear()} {practice.brand}
        </small>
        <div>
          {[
            ['/privacy', 'Privacy'],
            ['/terms', 'Terms'],
            ['/complaints', 'Complaints'],
            ['/accessibility', 'Accessibility'],
          ].map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
