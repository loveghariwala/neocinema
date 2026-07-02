import HeroBanner from "@/components/hero/HeroBanner";
import MovieRow from "@/components/sliders/MovieRow";
import AdsterraNativeBanner from "@/components/ads/AdsterraNativeBanner";
import HomeFAQ from "@/components/seo/HomeFAQ";
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
        title: 'Best Trending Movies to Stream at Home for Free | NeoCinema',
        description: 'Discover what new movies to watch online free this week. Stream top HD movies without paying and find good movies to watch right now free online on NeoCinema.',
        keywords: [
            'best trending movies to stream at home for free',
            'what new movies to watch online free this week',
            'top hd movies to stream without paying',
            'good movies to watch right now free online',
            'NeoCinema',
            'movie streaming 2026',
            'watch movies online',
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
            title: "Best Trending Movies to Stream at Home for Free | NeoCinema",
            description: "Discover what new movies to watch online free this week. Stream top HD movies without paying and find good movies to watch right now free online on NeoCinema.",
            url: '/',
            type: "website",
            images: [{ url: "/og_banner.jpg", width: 1200, height: 630, alt: "NeoCinema — Discover Movies & Series" }],
        },
        twitter: {
            card: "summary_large_image",
            title: "Best Trending Movies to Stream at Home for Free | NeoCinema",
            description: "Discover what new movies to watch online free this week. Stream top HD movies without paying.",
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
            <h1 className="sr-only">Best Trending Movies to Stream at Home for Free</h1>
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
            
            <HomeFAQ />
        </main>
    );
}