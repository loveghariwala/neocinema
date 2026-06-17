import HeroBanner from "@/components/hero/HeroBanner";
import MovieRow from "@/components/sliders/MovieRow";
import { getTrendingFromServer, discoverContentFromServer, getTopRatedMovies } from "@/services/movieService";
import { Metadata } from "next";
import { cache } from "react";

export const revalidate = 300; // ISR: regenerate home page every 5 minutes

// ─── Cached data fetch (shared between generateMetadata + page render) ───────
const getHomeDataCached = cache(async () => {
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

    return { trendingMovies, trendingSeries, topRatedMovies, topRatedSeries };
});

// ─── Dynamic Metadata (SEO keywords auto-generated from live movie data) ─────
export async function generateMetadata(): Promise<Metadata> {
    const { trendingMovies, trendingSeries } = await getHomeDataCached();

    // Auto-inject real trending movie & series titles as SEO keywords
    const movieKeywords = trendingMovies
        .slice(0, 10)
        .map((m: any) => m.title || m.name)
        .filter(Boolean);
    const seriesKeywords = trendingSeries
        .slice(0, 10)
        .map((s: any) => s.title || s.name)
        .filter(Boolean);

    return {
        title: 'Watch Free Movies Online in HD | NeoCinema',
        description: 'Stream top-rated free movies, series, and anime on NeoCinema. AI-powered recommendations, fast streaming, no ads, HD quality.',
        keywords: [
            'NeoCinema',
            'fmovies',
            '123movies',
            'soap2day',
            'watchsomoi',
            'movies7',
            'moviesjoy',
            '123freemovies',
            'fmoxies',
            '300mbmovies',
            'moviesflix',
            'free movies',
            'watch movies online free',
            'HD movies',
            'trending movies',
            'top rated series',
            'AI movie recommendations',
            'stream series online',
            '4K movies',
            '1080p streaming',
            ...movieKeywords,
            ...seriesKeywords,
        ],
        alternates: {
            canonical: '/',
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title: "Watch Free Movies & Series Online | NeoCinema",
            description: "Discover the best movies and TV series with NeoCinema's AI-powered recommendations. Experience an ultra-dark cinematic UI with personalized content discovery.",
            url: '/',
            type: "website",
            images: [{ url: "/neocinema_logo.png", width: 800, height: 600, alt: "NeoCinema — AI Movie & TV Series Discovery" }],
        },
        twitter: {
            card: "summary_large_image",
            title: "Watch Free Movies & Series Online | NeoCinema",
            description: "Discover the best movies and TV series with NeoCinema's AI-powered recommendations.",
            images: ["/neocinema_logo.png"],
        },
    };
}

// ─── Page Component ──────────────────────────────────────────────────────────
export default async function HomePage() {
    const { trendingMovies, trendingSeries, topRatedMovies, topRatedSeries } =
        await getHomeDataCached();

    const heroMovie = trendingMovies[0] || null;
    return (
        <main className="min-h-screen">
            <h1 className="sr-only">NeoCinema - AI Powered Movie & TV Series Discovery</h1>
            {heroMovie && <HeroBanner movie={heroMovie} />}

            <div className="relative z-20 -mt-32 space-y-24 px-6 pb-20 pt-32 md:px-16 pointer-events-none">
                {trendingMovies.length > 0 && (
                    <div className="pointer-events-auto">
                        <MovieRow
                            title="Trending Movies"
                            movies={trendingMovies}
                            className="pt-10"
                            moreLink="/movies?sort=popularity.desc"
                        />
                    </div>
                )}

                {trendingSeries.length > 0 && (
                    <div className="pointer-events-auto">
                        <MovieRow
                            title="Trending Series"
                            movies={trendingSeries}
                            moreLink="/series?sort=popularity.desc"
                        />
                    </div>
                )}

                {topRatedMovies.length > 0 && (
                    <div className="pointer-events-auto">
                        <MovieRow
                            title="Top Rated Movies"
                            movies={topRatedMovies}
                            moreLink="/movies?sort=vote_average.desc"
                        />
                    </div>
                )}

                {topRatedSeries.length > 0 && (
                    <div className="pointer-events-auto">
                        <MovieRow
                            title="Top Rated Series"
                            movies={topRatedSeries}
                            moreLink="/series?sort=vote_average.desc"
                        />
                    </div>
                )}
            </div>
        </main>
    );
}