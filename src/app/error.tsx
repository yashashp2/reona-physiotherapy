'use client';
import Link from 'next/link';
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container empty-state">
      <h1>Something interrupted your visit.</h1>
      <p>Please try loading this page again. No appointment has been confirmed.</p>
      <div className="button-row">
        <button className="button" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="button button-outline">
          Return home
        </Link>
      </div>
    </section>
  );
}
