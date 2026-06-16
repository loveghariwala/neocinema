import { MetadataRoute } from 'next';
import { getTrendingFromServer } from '@/services/movieService';
import { COLLECTIONS } from '@/lib/collections';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://neocinematv.vercel.app';

  // 1. Get Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9, // High priority for our SEO long-tail pages
    },
  ];

  // 1.5 Get Dynamic Collections
  const collectionRoutes: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // 2. Fetch Dynamic Movies
  const trendingMovies = await getTrendingFromServer("movie");
  const movies = trendingMovies?.results || [];
  const movieRoutes: MetadataRoute.Sitemap = movies.map((movie: any) => ({
    url: `${baseUrl}/movies/${movie.id || movie.tmdbId}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Fetch Dynamic Series
  const trendingSeries = await getTrendingFromServer("tv");
  const seriesList = trendingSeries?.results || [];
  const seriesRoutes: MetadataRoute.Sitemap = seriesList.map((series: any) => ({
    url: `${baseUrl}/series/${series.id || series.tmdbId}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...collectionRoutes, ...movieRoutes, ...seriesRoutes];
}
