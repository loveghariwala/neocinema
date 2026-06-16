// frontend/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getTrendingMovies } from '@/services/movieService'; // Your fetch logic

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://neocinematv.vercel.app';

  // 1. Get Static Pages
  const staticRoutes = [
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
  ];

  // 2. Fetch Dynamic Movies (Example fetching top 1000 movies)
  const movies = await getTrendingMovies();

  const movieRoutes = movies.map((movie: any) => ({
    url: `${baseUrl}/movies/${movie.tmdbId || movie._id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...movieRoutes];
}
