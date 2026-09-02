"use client";

import { useState } from "react";
import MovieRow from "@/components/sliders/MovieRow";
import Top10Row from "@/components/sliders/Top10Row";
import ContinueWatchingRow from "@/components/sliders/ContinueWatchingRow";
import HomeVibeFilter from "@/components/home/HomeVibeFilter";
import MovieRouletteModal from "@/components/ui/MovieRouletteModal";
import QuickTrailerModal from "@/components/player/QuickTrailerModal";
import AdsterraNativeBanner from "@/components/ads/AdsterraNativeBanner";
import { discoverContentFromServer } from "@/services/movieService";

interface HomePageInteractiveProps {
    initialData: {
        trendingMovies: any[];
        trendingSeries: any[];
        topRatedMovies: any[];
        topRatedSeries: any[];
        trendingHindi: any[];
    };
}

export default function HomePageInteractive({ initialData }: HomePageInteractiveProps) {
    const {
        trendingMovies,
        trendingSeries,
        topRatedMovies,
        topRatedSeries,
        trendingHindi,
    } = initialData;

    // Interactive Modals State
    const [isRouletteOpen, setIsRouletteOpen] = useState(false);
    const [selectedTrailerMovie, setSelectedTrailerMovie] = useState<any>(null);
    const [activeVibeCategory, setActiveVibeCategory] = useState("all");
    const [vibeMovies, setVibeMovies] = useState<any[]>([]);
    const [vibeLoading, setVibeLoading] = useState(false);

    const handleSelectCategory = async (cat: string) => {
        setActiveVibeCategory(cat);
        if (cat === "all") {
            setVibeMovies([]);
            return;
        }

        setVibeLoading(true);
        try {
            let res;
            if (cat === "action") {
                res = await discoverContentFromServer("movie", { sort_by: "popularity.desc", with_genres: "28", page: "1" });
            } else if (cat === "scifi") {
                res = await discoverContentFromServer("movie", { sort_by: "popularity.desc", with_genres: "878", page: "1" });
            } else if (cat === "kdrama") {
                res = await discoverContentFromServer("tv", { sort_by: "popularity.desc", language: "ko", with_genres: "18", page: "1" });
            } else if (cat === "anime") {
                res = await discoverContentFromServer("tv", { sort_by: "popularity.desc", language: "ja", with_genres: "16", page: "1" });
            } else if (cat === "horror") {
                res = await discoverContentFromServer("movie", { sort_by: "popularity.desc", with_genres: "27", page: "1" });
            } else if (cat === "comedy") {
                res = await discoverContentFromServer("movie", { sort_by: "popularity.desc", with_genres: "35", page: "1" });
            }
            setVibeMovies(res?.results || []);
        } catch (e) {
            console.error("Vibe filter error:", e);
        } finally {
            setVibeLoading(false);
        }
    };

    return (
        <>
            {/* Interactive Vibe & AI Roulette Filter Ribbon */}
            <HomeVibeFilter
                activeCategory={activeVibeCategory}
                onSelectCategory={handleSelectCategory}
                onOpenRoulette={() => setIsRouletteOpen(true)}
            />

            <div className="relative z-20 max-w-7xl mx-auto space-y-10 sm:space-y-14 px-4 sm:px-6 lg:px-8 pb-20">
                <div>
                    <ContinueWatchingRow />
                </div>

                {/* Vibe Category Dynamic Row */}
                {activeVibeCategory !== "all" && (
                    <div>
                        {vibeLoading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-6 w-40 bg-neutral-800 rounded" />
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="aspect-[2/3] bg-neutral-900 rounded-xl" />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            vibeMovies.length > 0 && (
                                <MovieRow
                                    title={`Explore: ${activeVibeCategory.toUpperCase()}`}
                                    movies={vibeMovies}
                                    moreLink={`/search?q=${activeVibeCategory}`}
                                />
                            )
                        )}
                    </div>
                )}

                {/* Netflix-Style Top 10 Showcase */}
                {trendingMovies.length >= 5 && (
                    <Top10Row
                        title="TOP 10 MOVIES THIS WEEK"
                        movies={trendingMovies}
                        onOpenTrailer={(movie) => setSelectedTrailerMovie(movie)}
                    />
                )}

                <AdsterraNativeBanner />

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

            {/* Interactive Roulettes & Trailer Modals */}
            <MovieRouletteModal
                isOpen={isRouletteOpen}
                onClose={() => setIsRouletteOpen(false)}
                onOpenTrailer={(movie) => {
                    setIsRouletteOpen(false);
                    setSelectedTrailerMovie(movie);
                }}
            />

            <QuickTrailerModal
                movie={selectedTrailerMovie}
                isOpen={Boolean(selectedTrailerMovie)}
                onClose={() => setSelectedTrailerMovie(null)}
            />
        </>
    );
}
