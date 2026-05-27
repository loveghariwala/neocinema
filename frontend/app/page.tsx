import HeroBanner from "@/components/hero/HeroBanner";
import MovieRow from "@/components/sliders/MovieRow";
import { getAIServiceUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

const AI_SERVICE_URL = getAIServiceUrl();

async function fetchFromAI(endpoint: string) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout
        const res = await fetch(`${AI_SERVICE_URL}/api/ai${endpoint}`, {
            next: { revalidate: 300 }, // Cache for 5 minutes
            signal: controller.signal,
        });
        clearTimeout(timeout);
        if (res.ok) {
            const data = await res.json();
            return data.results || [];
        }
    } catch (e) {
        console.error(`Failed to fetch ${endpoint}:`, e);
    }
    return [];
}

export default async function HomePage() {
    // Fetch from external API via our FastAPI service
    const [trendingMovies, trendingSeries, topRatedMovies, topRatedSeries] =
        await Promise.all([
            fetchFromAI("/trending/movie?time_window=week"),
            fetchFromAI("/trending/tv?time_window=week"),
            fetchFromAI("/discover/movies?sort_by=vote_average.desc&rating_min=7&page=1"),
            fetchFromAI("/discover/series?sort_by=vote_average.desc&rating_min=7&page=1"),
        ]);

    const heroMovie = trendingMovies[0] || null;

    return (
        <main className="min-h-screen">
            {heroMovie && <HeroBanner movie={heroMovie} />}

            <div className="relative z-20 -mt-32 space-y-24 px-6 pb-20 pt-32 md:px-16">
                {trendingMovies.length > 0 && (
                    <MovieRow 
                        title="Trending Movies" 
                        movies={trendingMovies} 
                        className="pt-10" 
                        moreLink="/movies?sort=popularity.desc" 
                    />
                )}

                {trendingSeries.length > 0 && (
                    <MovieRow 
                        title="Trending Series" 
                        movies={trendingSeries} 
                        moreLink="/series?sort=popularity.desc" 
                    />
                )}

                {topRatedMovies.length > 0 && (
                    <MovieRow 
                        title="Top Rated Movies" 
                        movies={topRatedMovies} 
                        moreLink="/movies?sort=vote_average.desc" 
                    />
                )}

                {topRatedSeries.length > 0 && (
                    <MovieRow 
                        title="Top Rated Series" 
                        movies={topRatedSeries} 
                        moreLink="/series?sort=vote_average.desc" 
                    />
                )}
            </div>
        </main>
    );
}