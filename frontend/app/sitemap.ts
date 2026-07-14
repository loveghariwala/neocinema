import { MetadataRoute } from 'next';
import { COLLECTIONS } from '@/lib/collections';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { WATCH_LANDINGS } from '@/lib/watch-landings';
import { tmdbService } from '@/lib/tmdb';

export const revalidate = 86400; // Cache for 24 hours to prevent Cloudflare Worker resource limits

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.neocinematv.com';

  // Use a stable date for static content — not new Date() which changes every crawl
  // and teaches Google to ignore your lastmod signals entirely
  const stableDate = new Date('2026-06-30');
  const weeklyDate = new Date('2026-06-29');

  // ────────────────────────────────────────────────────────────────────────────
  // PRIORITY 1: Blog posts — placed FIRST so Google indexes them earliest
  // ────────────────────────────────────────────────────────────────────────────
  const blogRoutes: MetadataRoute.Sitemap = [
    // Blog index page
    { url: `${baseUrl}/blog`, lastModified: weeklyDate, changeFrequency: 'weekly', priority: 0.9 },
    // Individual blog posts
    ...BLOG_POSTS.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ];

  // ────────────────────────────────────────────────────────────────────────────
  // PRIORITY 2: Spider-Man movies — high-value content, index early
  // ────────────────────────────────────────────────────────────────────────────
  const spiderManMovieIds = [
    969681, // Spider-Man: Brand New Day
    828168, // Beyond the Spider-Verse
    634649, // No Way Home
    569094, // Across the Spider-Verse
    557,    // Spider-Man (2002)
    558,    // Spider-Man 2
    559,    // Spider-Man 3
  ];

  const spiderManRoutes: MetadataRoute.Sitemap = spiderManMovieIds.map(id => ({
    url: `${baseUrl}/movies/${id}`,
    lastModified: stableDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // ────────────────────────────────────────────────────────────────────────────
  // PRIORITY 3: Core static pages
  // ────────────────────────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/movies`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/series`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: stableDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/collections`, lastModified: weeklyDate, changeFrequency: 'weekly', priority: 0.9 },
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

  // ────────────────────────────────────────────────────────────────────────────
  // Watch landing pages (genre/language hubs) & collection routes
  // ────────────────────────────────────────────────────────────────────────────
  const watchLandingRoutes: MetadataRoute.Sitemap = WATCH_LANDINGS.map((l) => ({
    url: `${baseUrl}/watch/${l.slug}`,
    lastModified: weeklyDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: weeklyDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // ────────────────────────────────────────────────────────────────────────────
  // Dynamic TMDB routes: trending + popular movies & series (3 pages each)
  // Wrapped in try/catch so builds don't fail when TMDB_API_KEY is unavailable
  // ────────────────────────────────────────────────────────────────────────────
  let dynamicMovieRoutes: MetadataRoute.Sitemap = [];
  let dynamicSeriesRoutes: MetadataRoute.Sitemap = [];

  try {
    const [
      trendingMovies1, trendingMovies2, trendingMovies3,
      trendingSeries1, trendingSeries2, trendingSeries3,
      popularMovies1, popularMovies2, popularMovies3,
      popularSeries1, popularSeries2, popularSeries3,
    ] = await Promise.all([
      // Trending movies (3 pages ≈ 60 movies)
      tmdbService.getTrending('movie', 'week', 1).catch(() => ({ results: [] })),
      tmdbService.getTrending('movie', 'week', 2).catch(() => ({ results: [] })),
      tmdbService.getTrending('movie', 'week', 3).catch(() => ({ results: [] })),
      // Trending series (3 pages ≈ 60 series)
      tmdbService.getTrending('tv', 'week', 1).catch(() => ({ results: [] })),
      tmdbService.getTrending('tv', 'week', 2).catch(() => ({ results: [] })),
      tmdbService.getTrending('tv', 'week', 3).catch(() => ({ results: [] })),
      // Popular movies (3 pages ≈ 60 movies)
      tmdbService.discoverMovies({ page: 1 }).catch(() => ({ results: [] })),
      tmdbService.discoverMovies({ page: 2 }).catch(() => ({ results: [] })),
      tmdbService.discoverMovies({ page: 3 }).catch(() => ({ results: [] })),
      // Popular series (3 pages ≈ 60 series)
      tmdbService.discoverTv({ page: 1 }).catch(() => ({ results: [] })),
      tmdbService.discoverTv({ page: 2 }).catch(() => ({ results: [] })),
      tmdbService.discoverTv({ page: 3 }).catch(() => ({ results: [] })),
    ]);

    // Merge all movie results, deduplicate by tmdbId
    const allMovies = [
      ...trendingMovies1.results, ...trendingMovies2.results, ...trendingMovies3.results,
      ...popularMovies1.results, ...popularMovies2.results, ...popularMovies3.results,
    ];
    const seenMovieIds = new Set<number>();
    dynamicMovieRoutes = allMovies
      .filter((m: any) => {
        if (!m.tmdbId || seenMovieIds.has(m.tmdbId)) return false;
        seenMovieIds.add(m.tmdbId);
        return true;
      })
      .map((m: any) => ({
        url: `${baseUrl}/movies/${m.tmdbId}`,
        lastModified: m.releaseDate && !isNaN(new Date(m.releaseDate).getTime()) ? new Date(m.releaseDate) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    // Merge all series results, deduplicate by tmdbId
    const allSeries = [
      ...trendingSeries1.results, ...trendingSeries2.results, ...trendingSeries3.results,
      ...popularSeries1.results, ...popularSeries2.results, ...popularSeries3.results,
    ];
    const seenSeriesIds = new Set<number>();
    dynamicSeriesRoutes = allSeries
      .filter((s: any) => {
        if (!s.tmdbId || seenSeriesIds.has(s.tmdbId)) return false;
        seenSeriesIds.add(s.tmdbId);
        return true;
      })
      .map((s: any) => ({
        url: `${baseUrl}/series/${s.tmdbId}`,
        lastModified: s.releaseDate && !isNaN(new Date(s.releaseDate).getTime()) ? new Date(s.releaseDate) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch (error) {
    // Silently fail — sitemap will still contain all static, blog, and Spider-Man routes
    console.warn('[Sitemap] TMDB dynamic fetch failed, using static routes only:', error);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Assemble final sitemap — ORDER MATTERS for Google crawl priority:
  //   1. Blog posts (index first)
  //   2. Spider-Man movies (index first)
  //   3. Core static pages
  //   4. Watch landings & collections
  //   5. Dynamic trending/popular movies & series
  // ────────────────────────────────────────────────────────────────────────────
  const allRoutes = [
    ...blogRoutes,
    ...spiderManRoutes,
    ...staticRoutes,
    ...watchLandingRoutes,
    ...collectionRoutes,
    ...dynamicMovieRoutes,
    ...dynamicSeriesRoutes,
  ];

  // Deduplicate by URL (first occurrence wins, preserving priority order)
  const seen = new Set<string>();
  return allRoutes.filter(route => {
    if (seen.has(route.url)) return false;
    seen.add(route.url);
    return true;
  });
}
