import HeroBanner from "@/components/hero/HeroBanner";
import MovieRow from "@/components/sliders/MovieRow";
import { getTrendingFromServer, discoverContentFromServer } from "@/services/movieService";

export const revalidate = 300; // ISR: regenerate home page every 5 minutes

export default async function HomePage() {
    // Fetch from external API via our fallback service
    const [trendingMoviesRes, trendingSeriesRes, topRatedMoviesRes, topRatedSeriesRes] =
        await Promise.all([
            getTrendingFromServer("movie", "week", "1"),
            getTrendingFromServer("tv", "week", "1"),
            discoverContentFromServer("movie", { sort_by: "vote_average.desc", rating_min: "7", page: "1" }),
            discoverContentFromServer("tv", { sort_by: "vote_average.desc", rating_min: "7", page: "1" }),
        ]);

    const trendingMovies = trendingMoviesRes?.results || [];
    const trendingSeries = trendingSeriesRes?.results || [];
    const topRatedMovies = topRatedMoviesRes?.results || [];
    const topRatedSeries = topRatedSeriesRes?.results || [];

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