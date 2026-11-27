import type { MetadataRoute } from 'next';
import { practice } from '@/config/practice';
import { siteUrl } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      ...(practice.launchReady ? { allow: '/', disallow: '/api/' } : { disallow: '/' }),
    },
    ...(practice.launchReady ? { sitemap: `${siteUrl.replace(/\/$/, '')}/sitemap.xml` } : {}),
  };
}
