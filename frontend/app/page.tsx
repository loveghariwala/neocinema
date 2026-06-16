import HeroBanner from "@/components/hero/HeroBanner";
import MovieRow from "@/components/sliders/MovieRow";
import { getTrendingFromServer, discoverContentFromServer, getTopRatedMovies } from "@/services/movieService";
import { Metadata } from "next";

export const revalidate = 300; // ISR: regenerate home page every 5 minutes

export const metadata: Metadata = {
    title: 'Watch Free Movies Online in HD | NeoCinema',
    description: 'Stream top-rated free movies, series, and anime on NeoCinema. Fast streaming, no ads, HD quality.',
    keywords: ['free-movies', 'watch movies online free', 'NeoCinema free series', 'IMDb Top 250 movies', 'Top rated movies', 'top rated series', 'trending movies', 'trending series', 'search movies', 'search series', 'movies', 'series', 'anime', 'HD movies', 'fast streaming', 'no ads', '720p', '1080p', '2160p', '4K', 'free movies no sign up', 'free movies no account', 'free movies no registration', 'free movies without sign up', 'free movies without account', 'free movies without registration'],
    alternates: { canonical: '/' },
    openGraph: {
        title: "Home | NeoCinema - AI Movie Discovery",
        description: "Discover the best movies and TV series with NeoCinema's AI-powered recommendations. Experience an ultra-dark cinematic UI with personalized content discovery.",
        url: '/',
        type: "website",
        images: [{ url: "/neocinema_logo.png", width: 800, height: 600, alt: "NeoCinema Home" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Home | NeoCinema - AI Movie Discovery",
        description: "Discover the best movies and TV series with NeoCinema's AI-powered recommendations.",
        images: ["/neocinema_logo.png"],
    }
};

export default async function HomePage() {
    // Fetch from external API via our fallback service
    const [trendingMoviesRes, trendingSeriesRes, topRatedMoviesRes, topRatedSeriesRes] =
        await Promise.all([
            getTrendingFromServer("movie", "week", "1"),
            getTrendingFromServer("tv", "week", "1"),
            getTopRatedMovies(),
            discoverContentFromServer("tv", { sort_by: "vote_average.desc", rating_min: "5", page: "1" }),
        ]);

    const trendingMovies = trendingMoviesRes?.results || [];
    const trendingSeries = trendingSeriesRes?.results || [];
    const topRatedMovies = topRatedMoviesRes || [];
    const topRatedSeries = topRatedSeriesRes?.results || [];

    const heroMovie = trendingMovies[0] || null;
    return (
        <main className="min-h-screen">
            <h1 className="sr-only">NeoCinema - AI Powered Movie & TV Series Discovery</h1>
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