import { MetadataRoute } from 'next';
import { COLLECTIONS } from '@/lib/collections';

/**
 * Optimized sitemap — only includes static and collection routes.
 * 
 * WHY: Dynamic movie/series pages from TMDB trending were causing
 * Googlebot to generate millions of edge requests, exceeding Vercel's
 * free tier limit. Trending results change constantly, so Googlebot
 * re-crawls all URLs on every sitemap fetch.
 * 
 * Individual movie/series pages are still indexable via internal links
 * and Google's natural crawling — they don't need to be in the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.neocinematv.com';

  // Static pages with realistic lastModified dates (not new Date() which
  // signals to crawlers that the page has changed and needs re-crawling)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Collection pages (fixed set, not dynamic API calls)
  const collectionRoutes: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: new Date('2026-06-01'),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticRoutes, ...collectionRoutes];
}
