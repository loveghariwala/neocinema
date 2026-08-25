import { MetadataRoute } from 'next';
import { COLLECTIONS } from '@/lib/collections';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { WATCH_LANDINGS } from '@/lib/watch-landings';
import { tmdbService } from '@/lib/tmdb';
import { isMovieBlocked, isMovieNoIndex } from '@/lib/blockedIds';

export const revalidate = 86400; // Cache for 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.neocinematv.com';
  const currentDate = new Date();

  // ────────────────────────────────────────────────────────────────────────────
  // PRIORITY 1: Blog posts
  // ────────────────────────────────────────────────────────────────────────────
  const blogRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/blog`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    ...BLOG_POSTS.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ];

  // ────────────────────────────────────────────────────────────────────────────
  // PRIORITY 2: High-value individual movie pages
  // ────────────────────────────────────────────────────────────────────────────
  const spiderManMovieIds = [969681, 828168, 634649, 569094, 557, 558, 559];
  const spiderManRoutes: MetadataRoute.Sitemap = spiderManMovieIds
    .filter(id => !isMovieBlocked(id))
    .map(id => ({
      url: `${baseUrl}/movies/${id}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

  // ────────────────────────────────────────────────────────────────────────────
  // PRIORITY 3: Core static pages
  // ────────────────────────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: currentDate, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/vibe-finder`, lastModified: currentDate, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/movies`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/series`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/collections`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/cookies`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/dmca`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // ────────────────────────────────────────────────────────────────────────────
  // Watch landing pages & collection routes
  // ────────────────────────────────────────────────────────────────────────────
  const watchLandingRoutes: MetadataRoute.Sitemap = WATCH_LANDINGS.map((l) => ({
    url: `${baseUrl}/watch/${l.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // ────────────────────────────────────────────────────────────────────────────
  // ALL MOVIES & SERIES: Fetch 25 pages each from trending + discover
  // 25 pages × 20 items = 500 per endpoint, ~2000+ unique movies & series
  // ────────────────────────────────────────────────────────────────────────────
  let dynamicMovieRoutes: MetadataRoute.Sitemap = [];
  let dynamicSeriesRoutes: MetadataRoute.Sitemap = [];

  try {
    // Helper to fetch multiple pages in parallel
    const fetchPages = async (
      fetcher: (page: number) => Promise<{ results: any[] }>,
      maxPages: number
    ) => {
      const pages = Array.from({ length: maxPages }, (_, i) => i + 1);
      const results = await Promise.all(
        pages.map(page => fetcher(page).catch(() => ({ results: [] })))
      );
      return results.flatMap(r => r.results);
    };

    // Fetch 8 pages from each source (trending + discover for movies and series) -> 32 subrequests total, safe for Cloudflare Free (max 50)
    const [trendingMovies, discoverMovies, trendingSeries, discoverSeries] = await Promise.all([
      fetchPages(page => tmdbService.getTrending('movie', 'week', page), 8),
      fetchPages(page => tmdbService.discoverMovies({ page }), 8),
      fetchPages(page => tmdbService.getTrending('tv', 'week', page), 8),
      fetchPages(page => tmdbService.discoverTv({ page }), 8),
    ]);

    // Deduplicate movies by tmdbId & filter out blocked / no-index IDs
    const allMovies = [...trendingMovies, ...discoverMovies];
    const seenMovieIds = new Set<number>();
    dynamicMovieRoutes = allMovies
      .filter((m: any) => {
        if (!m.tmdbId || seenMovieIds.has(m.tmdbId) || isMovieBlocked(m.tmdbId) || isMovieNoIndex(m.tmdbId)) return false;
        seenMovieIds.add(m.tmdbId);
        return true;
      })
      .map((m: any) => ({
        url: `${baseUrl}/movies/${m.tmdbId}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    // Deduplicate series by tmdbId & filter out blocked / no-index IDs
    const allSeries = [...trendingSeries, ...discoverSeries];
    const seenSeriesIds = new Set<number>();
    dynamicSeriesRoutes = allSeries
      .filter((s: any) => {
        if (!s.tmdbId || seenSeriesIds.has(s.tmdbId) || isMovieBlocked(s.tmdbId) || isMovieNoIndex(s.tmdbId)) return false;
        seenSeriesIds.add(s.tmdbId);
        return true;
      })
      .map((s: any) => ({
        url: `${baseUrl}/series/${s.tmdbId}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.warn('[Sitemap] Dynamic fetch failed, using static routes:', error);
  }

  const allRoutes = [
    ...blogRoutes,
    ...spiderManRoutes,
    ...staticRoutes,
    ...watchLandingRoutes,
    ...collectionRoutes,
    ...dynamicMovieRoutes,
    ...dynamicSeriesRoutes,
  ];

  const seen = new Set<string>();
  return allRoutes.filter(route => {
    if (seen.has(route.url)) return false;
    seen.add(route.url);
    return true;
  });
}
