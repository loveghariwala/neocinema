"use client";


import MovieCard from "../cards/MovieCard";
import { Film, Loader2, Tv } from 'lucide-react';


interface Props {
    movies: any[];
    isLoading: boolean;
    isMovie: boolean;
}

export default function BrowseGrid({ movies, isLoading, isMovie }: Props) {
    if (isLoading) {
        return null;
    }

    if (!movies || movies.length === 0) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02] text-center backdrop-blur-xl">
                <div className="mb-4 rounded-full bg-neutral-800/50 p-5">
                    {isMovie ? (
                        <Film size={36} className="text-neutral-600" />
                    ) : (
                        <Tv size={36} className="text-neutral-600" />
                    )}
                </div>
                <h3 className="text-xl font-bold text-white">No results found</h3>
                <p className="mt-2 text-sm text-neutral-500">
                    Try adjusting your filters or search query
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie: any, index: number) => (
                <div
                    key={movie._id || movie.tmdbId || index}
                >
                    <MovieCard movie={movie} />
                </div>
            ))}
        </div>
    );
}
