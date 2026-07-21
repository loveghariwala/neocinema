import { MetadataRoute } from 'next';
import { COLLECTIONS } from '@/lib/collections';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { WATCH_LANDINGS } from '@/lib/watch-landings';
import { tmdbService } from '@/lib/tmdb';

export const revalidate = 86400; // Cache for 24 hours to prevent Cloudflare Worker resource limits

export async function generateSitemaps() {
  // id: 0 = static & core routes
  // id: 1 = trending & popular movies
  // id: 2 = trending & popular series
  return [{ id: 0 }, { id: 1 }, { id: 2 }];
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.neocinematv.com';
  const currentDate = new Date();

  if (id === 0) {
    // ────────────────────────────────────────────────────────────────────────────
    // Core Static, Blog, Collections (ID: 0)
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

    const spiderManMovieIds = [969681, 828168, 634649, 569094, 557, 558, 559];
    const spiderManRoutes: MetadataRoute.Sitemap = spiderManMovieIds.map(movieId => ({
      url: `${baseUrl}/movies/${movieId}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    const staticRoutes: MetadataRoute.Sitemap = [
      { url: baseUrl, lastModified: currentDate, changeFrequency: 'daily', priority: 1 },
      { url: `${baseUrl}/movies`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
      { url: `${baseUrl}/series`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
      { url: `${baseUrl}/search`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/collections`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${baseUrl}/cookies`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.3 },
      { url: `${baseUrl}/disclaimer`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.3 },
      { url: `${baseUrl}/best-fmovies-alternative-2026`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/fmovies-vs-neocinema`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/duta-movie-21-alternative`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    ];

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

    return [...blogRoutes, ...spiderManRoutes, ...staticRoutes, ...watchLandingRoutes, ...collectionRoutes];
  }

  if (id === 1) {
    // ────────────────────────────────────────────────────────────────────────────
    // Dynamic Movies (ID: 1)
    // ────────────────────────────────────────────────────────────────────────────
    try {
      const [
        t1, t2, t3, t4, t5,
        p1, p2, p3, p4, p5,
      ] = await Promise.all([
        tmdbService.getTrending('movie', 'week', 1).catch(() => ({ results: [] })),
        tmdbService.getTrending('movie', 'week', 2).catch(() => ({ results: [] })),
        tmdbService.getTrending('movie', 'week', 3).catch(() => ({ results: [] })),
        tmdbService.getTrending('movie', 'week', 4).catch(() => ({ results: [] })),
        tmdbService.getTrending('movie', 'week', 5).catch(() => ({ results: [] })),
        tmdbService.discoverMovies({ page: 1 }).catch(() => ({ results: [] })),
        tmdbService.discoverMovies({ page: 2 }).catch(() => ({ results: [] })),
        tmdbService.discoverMovies({ page: 3 }).catch(() => ({ results: [] })),
        tmdbService.discoverMovies({ page: 4 }).catch(() => ({ results: [] })),
        tmdbService.discoverMovies({ page: 5 }).catch(() => ({ results: [] })),
      ]);

      const allMovies = [
        ...t1.results, ...t2.results, ...t3.results, ...t4.results, ...t5.results,
        ...p1.results, ...p2.results, ...p3.results, ...p4.results, ...p5.results,
      ];

      const seenMovieIds = new Set<number>();
      return allMovies
        .filter((m: any) => {
          if (!m.tmdbId || seenMovieIds.has(m.tmdbId)) return false;
          seenMovieIds.add(m.tmdbId);
          return true;
        })
        .map((m: any) => ({
          url: `${baseUrl}/movies/${m.tmdbId}`,
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
    } catch (error) {
      console.warn('[Sitemap] Movie fetch failed:', error);
      return [];
    }
  }

  if (id === 2) {
    // ────────────────────────────────────────────────────────────────────────────
    // Dynamic Series (ID: 2)
    // ────────────────────────────────────────────────────────────────────────────
    try {
      const [
        t1, t2, t3, t4, t5,
        p1, p2, p3, p4, p5,
      ] = await Promise.all([
        tmdbService.getTrending('tv', 'week', 1).catch(() => ({ results: [] })),
        tmdbService.getTrending('tv', 'week', 2).catch(() => ({ results: [] })),
        tmdbService.getTrending('tv', 'week', 3).catch(() => ({ results: [] })),
        tmdbService.getTrending('tv', 'week', 4).catch(() => ({ results: [] })),
        tmdbService.getTrending('tv', 'week', 5).catch(() => ({ results: [] })),
        tmdbService.discoverTv({ page: 1 }).catch(() => ({ results: [] })),
        tmdbService.discoverTv({ page: 2 }).catch(() => ({ results: [] })),
        tmdbService.discoverTv({ page: 3 }).catch(() => ({ results: [] })),
        tmdbService.discoverTv({ page: 4 }).catch(() => ({ results: [] })),
        tmdbService.discoverTv({ page: 5 }).catch(() => ({ results: [] })),
      ]);

      const allSeries = [
        ...t1.results, ...t2.results, ...t3.results, ...t4.results, ...t5.results,
        ...p1.results, ...p2.results, ...p3.results, ...p4.results, ...p5.results,
      ];

      const seenSeriesIds = new Set<number>();
      return allSeries
        .filter((s: any) => {
          if (!s.tmdbId || seenSeriesIds.has(s.tmdbId)) return false;
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
      console.warn('[Sitemap] Series fetch failed:', error);
      return [];
    }
  }

  return [];
}
