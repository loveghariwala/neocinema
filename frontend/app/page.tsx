import HeroBanner from "@/components/hero/HeroBanner";
import HomeFAQ from "@/components/seo/HomeFAQ";
import HomePageInteractive from "@/components/home/HomePageInteractive";
import { getTrendingFromServer, discoverContentFromServer, getMovieDetails } from "@/services/movieService";
import { Metadata } from "next";

export const revalidate = 3600; // ISR: refresh every 1 hour

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

export const metadata: Metadata = {
    alternates: {
        canonical: baseUrl,
    },
};

export default async function HomePage() {
    let trendingMovies: any[] = [];
    let trendingSeries: any[] = [];
    let topRatedMovies: any[] = [];
    let topRatedSeries: any[] = [];
    let trendingHindi: any[] = [];
    let spiderManMovie: any = null;

    try {
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

        trendingMovies = trendingMoviesRes?.results || [];
        trendingSeries = trendingSeriesRes?.results || [];
        topRatedMovies = topRatedMoviesRes?.results || [];
        topRatedSeries = topRatedSeriesRes?.results || [];
        trendingHindi = trendingHindiRes?.results || [];
        spiderManMovie = spiderManData || null;
    } catch (err) {
        console.error("Home page server data fetch error:", err);
    }

    const heroMovies = trendingMovies.slice(0, 8);
    if (spiderManMovie) {
        const exists = heroMovies.some((m: any) => String(m.id || m.tmdbId || m._id) === "969681");
        if (!exists) {
            heroMovies.unshift(spiderManMovie);
        }
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