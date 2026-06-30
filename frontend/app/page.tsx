
import HeroBanner from "@/components/hero/HeroBanner";
import MovieRow from "@/components/sliders/MovieRow";
import AdsterraNativeBanner from "@/components/ads/AdsterraNativeBanner";
import { getTrendingFromServer, discoverContentFromServer, getTopRatedMovies } from "@/services/movieService";
import { Metadata } from "next";
import { cache } from "react";

export const revalidate = 300; // ISR: regenerate home page every 5 minutes

// ─── Cached data fetch (shared between generateMetadata + page render) ───────
const getHomeDataCached = cache(async () => {
    const [trendingMoviesRes, trendingSeriesRes, topRatedMoviesRes, topRatedSeriesRes, trendingHindiRes] =
        await Promise.all([
            getTrendingFromServer("movie", "week", "1"),
            getTrendingFromServer("tv", "week", "1"),
            discoverContentFromServer("movie", { sort_by: "popularity.desc", with_genres: "27,878", page: "1" }),
            discoverContentFromServer("tv", { sort_by: "vote_average.asc", rating_min: "8.3", rating_max: "9.0", page: "1", language: "ko", with_genres: "80" }),
            discoverContentFromServer("movie", { sort_by: "popularity.desc", language: "hi", page: "1" }),
        ]);

    const trendingMovies = trendingMoviesRes?.results || [];
    const trendingSeries = trendingSeriesRes?.results || [];
    const topRatedMovies = topRatedMoviesRes?.results || [];
    const topRatedSeries = topRatedSeriesRes?.results || [];
    const trendingHindi = trendingHindiRes?.results || [];

    return { trendingMovies, trendingSeries, topRatedMovies, topRatedSeries, trendingHindi };
});

// ─── Dynamic Metadata (SEO keywords auto-generated from live movie data) ─────
export async function generateMetadata(): Promise<Metadata> {
    const { trendingMovies, trendingSeries } = await getHomeDataCached();

    const blockedIds = ["1180798", "1064137", "1154268", "260471", "1173900", "490005", "1628522", "852042"];
    const isAllowed = (item: any) => !blockedIds.includes(String(item.id || item.tmdbId || item._id));

    // Auto-inject real trending movie & series titles as SEO keywords
    const movieKeywords = trendingMovies
        .filter(isAllowed)
        .slice(0, 10)
        .map((m: any) => m.title || m.name)
        .filter(Boolean);

    const seriesKeywords = trendingSeries
        .filter(isAllowed)
        .slice(0, 10)
        .map((s: any) => s.title || s.name)
        .filter(Boolean);

    return {
        title: 'NeoCinema — Discover Movies, Series & Anime in HD',
        description: 'Explore trending movies, top-rated TV series, and anime on NeoCinema. AI-powered recommendations, curated collections, and a cinematic browsing experience.',
        keywords: [
            'NeoCinema',
            'movie streaming 2026',
            'watch movies online',
            'best movies 2026',
            'trending movies this week',
            'top rated series 2026',
            'bollywood movies online',
            'korean drama streaming',
            'anime english sub',
            'movie recommendations',
            'AI movie discovery',
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
            title: "NeoCinema — Discover Movies, Series & Anime in HD",
            description: "Explore trending movies, top-rated TV series, and anime on NeoCinema. AI-powered recommendations and a cinematic browsing experience.",
            url: '/',
            type: "website",
            images: [{ url: "/og_banner.png", width: 1200, height: 630, alt: "NeoCinema — Discover Movies & Series" }],
        },
        twitter: {
            card: "summary_large_image",
            title: "NeoCinema — Discover Movies, Series & Anime in HD",
            description: "Explore trending movies, top-rated TV series, and anime with AI-powered recommendations.",
            images: ["/neocinema_logo.png"],
        },
    };
}

// ─── Page Component ──────────────────────────────────────────────────────────
export default async function HomePage() {
    const { trendingMovies, trendingSeries, topRatedMovies, topRatedSeries, trendingHindi } =
        await getHomeDataCached();

    const heroMovie = trendingMovies[0] || null;
    return (
        <main className="min-h-screen">
            <h1 className="sr-only">NeoCinema — Discover Trending Movies, Series & Anime in HD</h1>
            {heroMovie && <HeroBanner movie={heroMovie} />}

            <div className="relative z-20 -mt-32 space-y-24 px-6 pb-20 pt-32 md:px-16 pointer-events-none">
                {trendingMovies.length > 0 && (
                    <div className="pointer-events-auto">
                        <MovieRow
                            title="Trending Movies"
                            movies={trendingMovies}
                            className="pt-10"
                            moreLink="/movies?sort=popularity.desc"
                            priority={true}
                        />
                    </div>
                )}

                {/* Adsterra Native Banner (Matches the horizontal layout) */}
                <AdsterraNativeBanner />

                {trendingSeries.length > 0 && (
                    <div className="pointer-events-auto">
                        <MovieRow
                            title="Trending Series"
                            movies={trendingSeries}
                            moreLink="/series?sort=popularity.desc"
                        />
                    </div>
                )}

                {trendingHindi.length > 0 && (
                    <div className="pointer-events-auto">
                        <MovieRow
                            title="Trending Hindi Movies"
                            movies={trendingHindi}
                            moreLink="/movies?language=hi"
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