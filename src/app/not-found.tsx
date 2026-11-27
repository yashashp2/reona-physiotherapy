import Link from 'next/link';
import { Eyebrow } from '@/components/ui';
export default function NotFound() {
  return (
    <section className="container empty-state">
      <Eyebrow>PAGE NOT FOUND</Eyebrow>
      <h1>A small detour.</h1>
      <p>We couldn’t find that page. Let’s get you back to a helpful place.</p>
      <div className="button-row">
        <Link className="button" href="/">
          Return home
        </Link>
        <Link className="button button-outline" href="/services">
          Explore treatments
        </Link>
      </div>
    </section>
  );
}
