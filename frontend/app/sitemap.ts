import { MetadataRoute } from 'next';
import { COLLECTIONS } from '@/lib/collections';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { WATCH_LANDINGS } from '@/lib/watch-landings';
import { tmdbService } from '@/lib/tmdb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.neocinematv.com';

  // Use a stable date for static content — not new Date() which changes every crawl
  // and teaches Google to ignore your lastmod signals entirely
  const stableDate = new Date('2026-06-30');
  const weeklyDate = new Date('2026-06-29');

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/movies`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/series`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: stableDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/collections`, lastModified: weeklyDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: weeklyDate, changeFrequency: 'weekly', priority: 0.8 },
    // Legal & trust pages (critical for E-E-A-T)
    { url: `${baseUrl}/about`, lastModified: stableDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: stableDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: stableDate, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: stableDate, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/cookies`, lastModified: stableDate, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: stableDate, changeFrequency: 'monthly', priority: 0.3 },
    // High-value SEO landing pages
    { url: `${baseUrl}/best-fmovies-alternative-2024`, lastModified: stableDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/duta-movie-21-alternative`, lastModified: stableDate, changeFrequency: 'monthly', priority: 0.8 },
  ];

  // Blog posts
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Watch landing pages (genre/language hubs)
  const watchLandingRoutes: MetadataRoute.Sitemap = WATCH_LANDINGS.map((l) => ({
    url: `${baseUrl}/watch/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Fetch Top 30 Movies (Lightweight - no similar pages)
  let trendingMovieRoutes: MetadataRoute.Sitemap = [];
  try {
      const [mPage1, mPage2] = await Promise.all([
          tmdbService.getTrending("movie", "week", 1),
          tmdbService.getTrending("movie", "week", 2)
      ]);
      const movies = [...(mPage1.results || []), ...(mPage2.results || [])].slice(0, 30);
      trendingMovieRoutes = movies.map((m: any) => ({
          url: `${baseUrl}/movies/${m.tmdbId}`,
          lastModified: weeklyDate,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
      }));
  } catch(e) {}

  // Fetch Top 30 Series (Lightweight - no similar pages)
  let trendingSeriesRoutes: MetadataRoute.Sitemap = [];
  try {
      const [sPage1, sPage2] = await Promise.all([
          tmdbService.getTrending("tv", "week", 1),
          tmdbService.getTrending("tv", "week", 2)
      ]);
      const series = [...(sPage1.results || []), ...(sPage2.results || [])].slice(0, 30);
      trendingSeriesRoutes = series.map((s: any) => ({
          url: `${baseUrl}/series/${s.tmdbId}`,
          lastModified: weeklyDate,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
      }));
  } catch(e) {}

  const allRoutes = [
    ...staticRoutes,
    ...blogRoutes,
    ...watchLandingRoutes,
    ...collectionRoutes,
    ...trendingMovieRoutes,
    ...trendingSeriesRoutes,
  ];

  const seen = new Set<string>();
  return allRoutes.filter(route => {
    if (seen.has(route.url)) return false;
    seen.add(route.url);
    return true;
  });
}

