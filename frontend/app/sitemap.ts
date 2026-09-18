import { MetadataRoute } from 'next';
import { COLLECTIONS } from '@/lib/collections';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { WATCH_LANDINGS } from '@/lib/watch-landings';
import { tmdbService, TTL } from '@/lib/tmdb';
import { BLOCKED_IDS, NOINDEX_IDS } from '@/lib/blockedIds';
import { SITE_URL } from '@/lib/seo';

// No `revalidate` — the static-assets cache is read-only; data is refreshed by the daily cron rebuild.

// lastModified is set only where it's a real date. Google ignores lastmod on sites
// where it's always "now", which is what stamping every URL with the build time does.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const excludedIds = new Set([...BLOCKED_IDS, ...NOINDEX_IDS]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/movies`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/series`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/vibe-finder`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/contact`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const collectionRoutes: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const watchLandingRoutes: MetadataRoute.Sitemap = WATCH_LANDINGS.map((l) => ({
    url: `${baseUrl}/watch/${l.slug}`,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Popular + trending cover what people search for this week; vote_count.desc adds
  // the evergreen classics that keep getting searched for years.
  // No catch: a TMDB failure returns 500 instead of a sitemap missing every title.
  const pages = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
  const [moviePages, seriesPages, peoplePages] = await Promise.all([
    Promise.all([
      ...pages(10).map((page) => tmdbService.discoverMovies({ page, sort_by: 'popularity.desc' }, TTL.detail)),
      ...pages(5).map((page) => tmdbService.discoverMovies({ page, sort_by: 'vote_count.desc' }, TTL.detail)),
      ...pages(3).map((page) => tmdbService.getTrending('movie', 'week', page, TTL.detail)),
    ]),
    Promise.all([
      ...pages(10).map((page) => tmdbService.discoverTv({ page, sort_by: 'popularity.desc' }, TTL.detail)),
      ...pages(5).map((page) => tmdbService.discoverTv({ page, sort_by: 'vote_count.desc' }, TTL.detail)),
      ...pages(3).map((page) => tmdbService.getTrending('tv', 'week', page, TTL.detail)),
    ]),
    Promise.all(pages(5).map((page) => tmdbService.getPopularPeople(page, TTL.detail))),
  ]);

  const titleRoutes = (results: any[], path: 'movies' | 'series'): MetadataRoute.Sitemap => {
    const seen = new Set<string>();
    return results
      .map((item) => item?.tmdbId && String(item.tmdbId))
      .filter((id): id is string => {
        if (!id || excludedIds.has(id) || seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .map((id) => ({ url: `${baseUrl}/${path}/${id}`, changeFrequency: 'weekly' as const, priority: 0.8 }));
  };

  const movieRoutes = titleRoutes(moviePages.flatMap((p) => p.results || []), 'movies');
  const seriesRoutes = titleRoutes(seriesPages.flatMap((p) => p.results || []), 'series');

  const seenPeople = new Set<number>();
  const personRoutes: MetadataRoute.Sitemap = peoplePages
    .flat()
    .filter((p) => p.id && !p.adult && !seenPeople.has(p.id) && seenPeople.add(p.id))
    .map((p) => ({ url: `${baseUrl}/person/${p.id}`, changeFrequency: 'weekly', priority: 0.6 }));

  return [
    ...staticRoutes,
    ...collectionRoutes,
    ...watchLandingRoutes,
    ...blogRoutes,
    ...movieRoutes,
    ...seriesRoutes,
    ...personRoutes,
  ];
}
