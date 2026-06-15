import HeroBanner from "@/components/hero/HeroBanner";
import MovieRow from "@/components/sliders/MovieRow";
import { getTrendingFromServer, discoverContentFromServer, getTopRatedMovies } from "@/services/movieService";
import { Metadata } from "next";

export const revalidate = 300; // ISR: regenerate home page every 5 minutes

export const metadata: Metadata = {
    title: "Home",
    description: "Discover the best movies and TV series with NeoCinema's AI-powered recommendations. Experience an ultra-dark cinematic UI with personalized content discovery.",
    keywords: ["movie recommendations", "AI streaming discovery", "top rated movies", "trending series", "NeoCinema home"],
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