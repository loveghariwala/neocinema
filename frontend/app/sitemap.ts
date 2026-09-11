import { MetadataRoute } from 'next';
import { COLLECTIONS } from '@/lib/collections';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { tmdbService } from '@/lib/tmdb';
import { BLOCKED_IDS, NOINDEX_IDS } from '@/lib/blockedIds';

export const revalidate = 604800; // Cache for 1 week

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.neocinematv.com';
  const currentDate = new Date();

  // Combined set of IDs to exclude from sitemap
  const excludedIds = new Set([...BLOCKED_IDS, ...NOINDEX_IDS]);

  // 1. Home Page
  const homeRoute: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // 2. AI Vibe Finder
  const vibeFinderRoute: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/vibe-finder`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 3. Collections (Main hub + all collection landing pages)
  const collectionRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/collections`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...COLLECTIONS.map((c) => ({
      url: `${baseUrl}/collections/${c.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];

  // 4. All Blog Pages (Main blog listing + all blog articles)
  const blogRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...BLOG_POSTS.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ];

  // 5. Static listing pages (only page 1 — page 2+ is noindex)
  const listingRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/movies`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // 6. Popular & Trending Movies (~250 top movies)
  let movieRoutes: MetadataRoute.Sitemap = [];
  try {
    const moviePagePromises = [
      ...Array.from({ length: 10 }, (_, i) =>
        tmdbService.discoverMovies({ page: i + 1, sort_by: 'popularity.desc' })
      ),
      ...Array.from({ length: 3 }, (_, i) =>
        tmdbService.getTrending('movie', 'week', i + 1)
      ),
    ];

    const moviePages = await Promise.all(moviePagePromises);

    const seenMovieIds = new Set<number>();
    const allMovies = moviePages.flatMap((page) => page.results || []);

    movieRoutes = allMovies
      .filter((movie: any) => {
        if (!movie || !movie.tmdbId) return false;
        const id = String(movie.tmdbId);
        if (excludedIds.has(id) || seenMovieIds.has(movie.tmdbId)) return false;
        seenMovieIds.add(movie.tmdbId);
        return true;
      })
      .map((movie: any) => ({
        url: `${baseUrl}/movies/${movie.tmdbId}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch (error) {
    console.warn('[Sitemap] Failed to fetch movies from TMDB:', error);
  }

  // 7. Popular & Trending Series (~250 top series)
  let seriesRoutes: MetadataRoute.Sitemap = [];
  try {
    const seriesPagePromises = [
      ...Array.from({ length: 10 }, (_, i) =>
        tmdbService.discoverTv({ page: i + 1, sort_by: 'popularity.desc' })
      ),
      ...Array.from({ length: 3 }, (_, i) =>
        tmdbService.getTrending('tv', 'week', i + 1)
      ),
    ];

    const seriesPages = await Promise.all(seriesPagePromises);

    const seenSeriesIds = new Set<number>();
    const allSeries = seriesPages.flatMap((page) => page.results || []);

    seriesRoutes = allSeries
      .filter((series: any) => {
        if (!series || !series.tmdbId) return false;
        const id = String(series.tmdbId);
        if (excludedIds.has(id) || seenSeriesIds.has(series.tmdbId)) return false;
        seenSeriesIds.add(series.tmdbId);
        return true;
      })
      .map((series: any) => ({
        url: `${baseUrl}/series/${series.tmdbId}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch (error) {
    console.warn('[Sitemap] Failed to fetch series from TMDB:', error);
  }

  return [
    ...homeRoute,
    ...vibeFinderRoute,
    ...collectionRoutes,
    ...blogRoutes,
    ...listingRoutes,
    ...movieRoutes,
    ...seriesRoutes,
  ];
}
