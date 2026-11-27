import type { Metadata } from 'next';
import { practice } from '@/config/practice';
export const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
export function metadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    keywords: [
      'physiotherapy',
      practice.name,
      ...practice.serviceAreas.map((area) => `physiotherapy ${area}`),
    ],
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${practice.brand}`,
      description,
      url: path,
      type: 'website',
      locale: 'en_GB',
      siteName: practice.brand,
      images: ['/opengraph-image'],
    },
  };
}
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
export function practiceSchema() {
  if (!practice.launchReady) return null;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#practitioner`,
        name: practice.name,
        jobTitle: practice.title,
        url: siteUrl,
        alumniOf: practice.qualifications.map((q) => ({
          '@type': 'EducationalOrganization',
          name: q.institution,
        })),
      },
      ...(practice.clinics.length
        ? [
            {
              '@type': 'MedicalBusiness',
              '@id': `${siteUrl}/#practice`,
              name: practice.brand,
              url: siteUrl,
              employee: { '@id': `${siteUrl}/#practitioner` },
              ...(practice.contact.email ? { email: practice.contact.email } : {}),
              ...(practice.contact.phone ? { telephone: practice.contact.phone } : {}),
              areaServed: practice.serviceAreas,
              address: practice.clinics.map((c) => ({
                '@type': 'PostalAddress',
                streetAddress: c.address,
                postalCode: c.postcode,
                addressCountry: 'GB',
              })),
            },
          ]
        : []),
    ],
  };
}
