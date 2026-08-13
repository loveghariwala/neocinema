"use client";

import { useEffect, useState } from "react";
import HeroBanner from "@/components/hero/HeroBanner";
import MovieRow from "@/components/sliders/MovieRow";
import ContinueWatchingRow from "@/components/sliders/ContinueWatchingRow";
import HomeFAQ from "@/components/seo/HomeFAQ";
import { getTrendingFromServer, discoverContentFromServer, getMovieDetails } from "@/services/movieService";

export default function HomePage() {
    const [data, setData] = useState<{
        trendingMovies: any[];
        trendingSeries: any[];
        topRatedMovies: any[];
        topRatedSeries: any[];
        trendingHindi: any[];
        spiderManMovie: any;
    }>({
        trendingMovies: [],
        trendingSeries: [],
        topRatedMovies: [],
        topRatedSeries: [],
        trendingHindi: [],
        spiderManMovie: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function fetchHomeData() {
            try {
                const [trendingMoviesRes, trendingSeriesRes, topRatedMoviesRes, topRatedSeriesRes, trendingHindiRes, spiderManMovie] =
                    await Promise.all([
                        getTrendingFromServer("movie", "week", "1"),
                        getTrendingFromServer("tv", "week", "1"),
                        discoverContentFromServer("movie", { sort_by: "popularity.desc", with_genres: "27,878", page: "1" }),
                        discoverContentFromServer("tv", { sort_by: "vote_average.asc", rating_min: "8.3", rating_max: "9.0", page: "1", language: "ko", with_genres: "80" }),
                        discoverContentFromServer("movie", { sort_by: "popularity.desc", language: "hi", page: "1" }),
                        getMovieDetails("969681", "movie"),
                    ]);

                if (mounted) {
                    setData({
                        trendingMovies: trendingMoviesRes?.results || [],
                        trendingSeries: trendingSeriesRes?.results || [],
                        topRatedMovies: topRatedMoviesRes?.results || [],
                        topRatedSeries: topRatedSeriesRes?.results || [],
                        trendingHindi: trendingHindiRes?.results || [],
                        spiderManMovie: spiderManMovie || null,
                    });
                }
            } catch (err) {
                console.error("Home page data fetch error:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchHomeData();
        return () => { mounted = false; };
    }, []);

    const { trendingMovies, trendingSeries, topRatedMovies, topRatedSeries, trendingHindi, spiderManMovie } = data;

    const heroMovies = trendingMovies.slice(0, 8);
    if (spiderManMovie) {
        const exists = heroMovies.some((m: any) => String(m.id || m.tmdbId || m._id) === "969681");
        if (!exists) {
            heroMovies.unshift(spiderManMovie);
        }
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <h1 className="sr-only">Best Trending Movies to Stream at Home for Free</h1>

            {loading ? (
                <div className="relative h-[70vh] sm:h-[80vh] w-full animate-pulse bg-neutral-900/80 flex items-center justify-center">
                    <div className="space-y-4 text-center">
                        <div className="h-8 w-48 bg-neutral-800 rounded mx-auto" />
                        <div className="h-4 w-72 bg-neutral-800/60 rounded mx-auto" />
                    </div>
                </div>
            ) : (
                heroMovies.length > 0 && <HeroBanner movies={heroMovies} />
            )}

            <div className="relative z-20 -mt-4 sm:-mt-6 max-w-7xl mx-auto space-y-10 sm:space-y-14 px-4 sm:px-6 lg:px-8 pb-20">
                <div>
                    <ContinueWatchingRow />
                </div>

                {loading ? (
                    <div className="space-y-10 py-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="space-y-4 animate-pulse">
                                <div className="h-6 w-40 bg-neutral-800 rounded" />
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="aspect-[2/3] bg-neutral-900 rounded-xl" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>

            <HomeFAQ />
        </main>
    );
}