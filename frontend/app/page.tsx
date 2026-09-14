import HeroBanner from "@/components/hero/HeroBanner";
import HomeFAQ from "@/components/seo/HomeFAQ";
import HomePageInteractive from "@/components/home/HomePageInteractive";
import { getTrendingFromServer, discoverContentFromServer, getMovieDetails } from "@/services/movieService";
import { Metadata } from "next";

export const revalidate = 3600; // 1 h, matches TTL.list in lib/tmdb.ts

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

export const metadata: Metadata = {
    alternates: {
        canonical: baseUrl,
    },
};

// Client component props are serialized into the page payload next to the HTML, so
// pass only the fields MovieCard, Top10Row and HeroBanner actually read.
function toCard(item: any) {
    return {
        tmdbId: item.tmdbId,
        title: item.title,
        posterPath: item.posterPath,
        rating: item.rating,
        releaseDate: item.releaseDate,
        genres: item.genres?.slice(0, 1), // MovieCard shows only the first
        isMovie: item.isMovie,
    };
}

function toHeroSlide(item: any) {
    return { ...toCard(item), overview: item.overview, backdropPath: item.backdropPath };
}

export default async function HomePage() {
    // No catch: a TMDB failure renders error.tsx (500) instead of an empty home page
    // that ISR would cache. On revalidation, the previous good page keeps serving.
    const [
        trendingMoviesRes,
        trendingSeriesRes,
        topRatedMoviesRes,
        topRatedSeriesRes,
        trendingHindiRes,
        spiderManData,
    ] = await Promise.all([
        getTrendingFromServer("movie", "week", "1"),
        getTrendingFromServer("tv", "week", "1"),
        discoverContentFromServer("movie", { sort_by: "popularity.desc", with_genres: "27,878", page: "1" }),
        discoverContentFromServer("tv", { sort_by: "vote_average.asc", rating_min: "8.3", rating_max: "9.0", page: "1", language: "ko", with_genres: "80" }),
        discoverContentFromServer("movie", { sort_by: "popularity.desc", language: "hi", page: "1" }),
        getMovieDetails("969681", "movie"),
    ]);

    const rawTrendingMovies: any[] = trendingMoviesRes?.results || [];
    const trendingMovies = rawTrendingMovies.map(toCard);
    const trendingSeries = (trendingSeriesRes?.results || []).map(toCard);
    const topRatedMovies = (topRatedMoviesRes?.results || []).map(toCard);
    const topRatedSeries = (topRatedSeriesRes?.results || []).map(toCard);
    const trendingHindi = (trendingHindiRes?.results || []).map(toCard);

    const heroMovies = rawTrendingMovies.slice(0, 8).map(toHeroSlide);
    if (spiderManData && !heroMovies.some((m) => m.tmdbId === 969681)) {
        heroMovies.unshift(toHeroSlide(spiderManData));
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <h1 className="sr-only">Neocinema — Discover Movies, TV Series & Anime Online</h1>

            {/* Server-rendered Hero Banner with real movie data for search engines & users */}
            {heroMovies.length > 0 && <HeroBanner movies={heroMovies} />}

            {/* Interactive Client Section (Vibe Filter, Top 10, Rows, Modals) */}
            <HomePageInteractive
                initialData={{
                    trendingMovies,
                    trendingSeries,
                    topRatedMovies,
                    topRatedSeries,
                    trendingHindi,
                }}
            />

            {/* Server-rendered FAQ & Semantic Rich Results Schema */}
            <HomeFAQ />
        </main>
    );
}