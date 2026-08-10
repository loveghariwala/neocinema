import HeroBanner from "@/components/hero/HeroBanner";
import MovieRow from "@/components/sliders/MovieRow";
import ContinueWatchingRow from "@/components/sliders/ContinueWatchingRow";
import AdsterraNativeBanner from "@/components/ads/AdsterraNativeBanner";
import HomeFAQ from "@/components/seo/HomeFAQ";
import { getTrendingFromServer, discoverContentFromServer, getTopRatedMovies, getMovieDetails } from "@/services/movieService";
import { Metadata } from "next";
import { cache } from "react";

export const revalidate = 3600; // ISR: regenerate home page every 60 minutes

// ─── Cached data fetch (shared between generateMetadata + page render) ───────
const getHomeDataCached = cache(async () => {
    const [trendingMoviesRes, trendingSeriesRes, topRatedMoviesRes, topRatedSeriesRes, trendingHindiRes, spiderManMovie] =
        await Promise.all([
            getTrendingFromServer("movie", "week", "1"),
            getTrendingFromServer("tv", "week", "1"),
            discoverContentFromServer("movie", { sort_by: "popularity.desc", with_genres: "27,878", page: "1" }),
            discoverContentFromServer("tv", { sort_by: "vote_average.asc", rating_min: "8.3", rating_max: "9.0", page: "1", language: "ko", with_genres: "80" }),
            discoverContentFromServer("movie", { sort_by: "popularity.desc", language: "hi", page: "1" }),
            getMovieDetails("969681", "movie"),
        ]);

    const trendingMovies = trendingMoviesRes?.results || [];
    const trendingSeries = trendingSeriesRes?.results || [];
    const topRatedMovies = topRatedMoviesRes?.results || [];
    const topRatedSeries = topRatedSeriesRes?.results || [];
    const trendingHindi = trendingHindiRes?.results || [];

    return { trendingMovies, trendingSeries, topRatedMovies, topRatedSeries, trendingHindi, spiderManMovie };
});

import { isMovieBlocked } from "@/lib/blockedIds";

// ─── Dynamic Metadata (SEO keywords auto-generated from live movie data) ─────
export async function generateMetadata(): Promise<Metadata> {
    const { trendingMovies, trendingSeries } = await getHomeDataCached();

    const isAllowed = (item: any) => !isMovieBlocked(item.id || item.tmdbId || item._id);

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
        title: { absolute: "Watch Free Movies Online in HD | Neocinema Advanced Multi-Genre Discovery" },
        description: 'Discover trending movies and TV series on Neocinema. Use our unique multi-genre selection and advanced filtering to combine genres, filter by ratings/years, and sort precisely to find the perfect movie to watch online free.',
        keywords: [
            'filter movies by multiple genres',
            'combine movie genres filter',
            'precise movie discovery sort',
            'advanced movie search filter',
            'best trending movies to stream at home for free',
            'what new movies to watch online free this week',
            'top hd movies to stream without paying',
            'good movies to watch right now free online',
            'Neocinema',
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
            title: "Best Trending Movies to Stream with Advanced Multi-Genre Filtering | Neocinema",
            description: "Use our unique multi-genre selection and advanced filtering to combine genres, filter by ratings/years, and sort precisely to find the perfect movie to watch online free on Neocinema.",
            url: '/',
            type: "website",
            images: [{ url: "/og_banner.png", width: 1200, height: 630, alt: "Neocinema — Discover Movies & Series" }],
        },
        twitter: {
            card: "summary_large_image",
            title: "Advanced Multi-Genre Movie Filtering & Streaming | Neocinema",
            description: "Combine multiple genres, filter by ratings/years, and sort precisely to discover the perfect movie.",
            images: ["/og_banner.png"],
        },
    };
}

// ─── Page Component ──────────────────────────────────────────────────────────
export default async function HomePage() {
    const { trendingMovies, trendingSeries, topRatedMovies, topRatedSeries, trendingHindi, spiderManMovie } =
        await getHomeDataCached();

    const heroMovies = trendingMovies.slice(0, 8);
    if (spiderManMovie) {
        const exists = heroMovies.some((m: any) => String(m.id || m.tmdbId || m._id) === "969681");
        if (!exists) {
            heroMovies.unshift(spiderManMovie);
        }
    }
    return (
        <main className="min-h-screen">
            <h1 className="sr-only">Best Trending Movies to Stream at Home for Free</h1>
            {heroMovies.length > 0 && <HeroBanner movies={heroMovies} />}

            <div className="relative z-20 -mt-4 sm:-mt-6 max-w-7xl mx-auto space-y-10 sm:space-y-14 px-4 sm:px-6 lg:px-8 pb-20">
                <div>
                    <ContinueWatchingRow />
                </div>

                {trendingMovies.length > 0 && (
                    <MovieRow
                        title="Trending Movies"
                        movies={trendingMovies}
                        moreLink="/movies?sort=popularity.desc"
                        priority={true}
                    />
                )}

                {trendingSeries.length > 0 && (
                    <MovieRow
                        title="Trending Series"
                        movies={trendingSeries}
                        moreLink="/series?sort=popularity.desc"
                    />
                )}

                {trendingHindi.length > 0 && (
                    <MovieRow
                        title="Trending Hindi Movies"
                        movies={trendingHindi}
                        moreLink="/movies?language=hi"
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

            <HomeFAQ />
        </main>
    );
}