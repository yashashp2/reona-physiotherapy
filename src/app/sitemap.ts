import type { MetadataRoute } from 'next';
import { practice, visibleServices } from '@/config/practice';
import { siteUrl } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  if (!practice.launchReady) return [];
  return [
    '',
    '/about',
    '/services',
    '/conditions',
    '/pricing',
    '/book',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
    '/complaints',
    '/accessibility',
    ...visibleServices().map((s) => `/services/${s.slug}`),
  ].map((path) => ({ url: `${siteUrl.replace(/\/$/, '')}${path}` }));
}
