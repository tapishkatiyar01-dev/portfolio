import { getSiteUrl } from '@/lib/siteMetadata';

export default function sitemap() {
  const siteUrl = getSiteUrl();
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
