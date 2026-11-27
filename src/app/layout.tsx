import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/ui';
import { practice } from '@/config/practice';
import { siteUrl, jsonLd, practiceSchema } from '@/lib/seo';
import './globals.css';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: practice.brand, template: `%s | ${practice.brand}` },
  description:
    'Personalised physiotherapy, rehabilitation and movement support with Reona Barretto.',
  robots: { index: practice.launchReady, follow: practice.launchReady },
  twitter: { card: 'summary_large_image' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {!practice.launchReady && (
          <div className="preview-banner">
            Practice preview · Services and business details awaiting confirmation.{' '}
            <Link href="/about#professional-information">Preview information</Link>
          </div>
        )}
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <div className="mobile-book">
          <Link href="/book" className="button">
            Book an Appointment
          </Link>
        </div>
        {practice.launchReady && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLd(practiceSchema()),
            }}
          />
        )}
      </body>
    </html>
  );
}
