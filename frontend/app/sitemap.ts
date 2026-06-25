import { MetadataRoute } from 'next';
import { COLLECTIONS } from '@/lib/collections';
import { tmdbService } from '@/lib/tmdb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.neocinematv.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/movies`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/series`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ];

  const collectionRoutes: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamically fetch top 100 Trending Movies
  let trendingMovieRoutes: MetadataRoute.Sitemap = [];
  try {
      const [mPage1, mPage2] = await Promise.all([
          tmdbService.getTrending("movie", "week", 1),
          tmdbService.getTrending("movie", "week", 2)
      ]);
      const movies = [...(mPage1.results || []), ...(mPage2.results || [])];
      trendingMovieRoutes = movies.map((m: any) => ({
          url: `${baseUrl}/movies/${m.tmdbId}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
      }));
  } catch(e) {}

  // Dynamically fetch top 100 Trending Series
  let trendingSeriesRoutes: MetadataRoute.Sitemap = [];
  try {
      const [sPage1, sPage2] = await Promise.all([
          tmdbService.getTrending("tv", "week", 1),
          tmdbService.getTrending("tv", "week", 2)
      ]);
      const series = [...(sPage1.results || []), ...(sPage2.results || [])];
      trendingSeriesRoutes = series.map((s: any) => ({
          url: `${baseUrl}/series/${s.tmdbId}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
      }));
  } catch(e) {}

  return [...staticRoutes, ...collectionRoutes, ...trendingMovieRoutes, ...trendingSeriesRoutes];
}
