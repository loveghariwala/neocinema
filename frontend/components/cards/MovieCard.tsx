"use client";

import Link from "next/link";

import Star from "lucide-react/dist/esm/icons/star";
import Play from "lucide-react/dist/esm/icons/play";

import Image from "next/image";
import { useState, useEffect } from "react";

interface MovieCardProps {
    movie: any;
    priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
    // Support both local DB (_id) and external API (tmdbId) formats
    const id = movie._id || movie.tmdbId;
    const linkBase = movie.isMovie === false ? "/series" : "/movies";
    const title = movie.title || movie.name || "Unknown";
    const posterUrl = movie.posterPath
        ? movie.posterPath.startsWith("http")
            ? movie.posterPath
            : `https://image.tmdb.org/t/p/w342${movie.posterPath}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=1a1a1a&color=dc2626&size=300&bold=true`;
    
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=1a1a1a&color=dc2626&size=300&bold=true`;

    const rating = movie.rating ?? movie.vote_average ?? 0;
    const genre = movie.genres?.[0] || "Unknown";
    const year = movie.releaseDate
        ? new Date(movie.releaseDate).getFullYear()
        : movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "";

    // Track error state only, preventing 80 hydration re-renders on page load
    const [hasError, setHasError] = useState(false);
    useEffect(() => {
        setHasError(false);
    }, [movie.posterPath]);

    return (
        <Link href={`${linkBase}/${id}`} prefetch={false} className="block group w-full h-full" aria-label={`View details for ${title}`}>
            <div
                className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-neutral-950 shadow-xl border border-white/[0.05] transition-all duration-500 ease-out group-hover:border-white/20 group-hover:shadow-[0_20px_50px_rgba(220,38,38,0.3)] group-hover:-translate-y-2 group-hover:scale-[1.03]"
            >
                {/* Poster Image */}
                <div className="absolute inset-0 bg-neutral-900">
                    <Image
                        src={hasError ? fallbackUrl : posterUrl}
                        alt={title}
                        fill
                        priority={priority}
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 15vw"
                        className="object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100 group-hover:blur-[2px]"
                        onError={() => setHasError(true)}
                    />
                </div>

                {/* Rating Badge */}
                {rating > 0 && (
                    <div className="absolute right-3 top-3 z-20 flex items-center gap-1 sm:gap-1.5 rounded-full bg-black/60 px-2 py-0.5 sm:px-2.5 sm:py-1 backdrop-blur-xl border border-white/10 opacity-90 transition-opacity group-hover:opacity-100 shadow-lg">
                        <Star size={10} className="text-yellow-500 sm:size-3" fill="currentColor" />
                        <span className="text-[9px] sm:text-[11px] font-black tracking-wider text-white">
                            {typeof rating === "number" ? rating.toFixed(1) : "N/A"}
                        </span>
                    </div>
                )}

                {/* Top Left: Badges */}
                <div className="absolute left-3 top-3 z-30 flex flex-col items-start gap-1 sm:gap-2">
                    {movie.isMovie === false && (
                        <div className="rounded-md bg-blue-600/80 px-2 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                            <span className="inline sm:hidden">TV</span>
                            <span className="hidden sm:inline">SERIES</span>
                        </div>
                    )}
                </div>

                {/* Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
                
                {/* Secondary Hover Gradient (Red Glow) */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Glass Shine Sweep Animation */}
                <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-1000 ease-in-out group-hover:translate-x-[150%] group-hover:opacity-100 z-30 skew-x-[-20deg] pointer-events-none" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 flex flex-col justify-end translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 z-20">
                    <h3 className="mb-2 text-sm md:text-base font-black leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] break-words w-full">
                        {title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {genre !== "Unknown" && (
                            <span className="rounded bg-red-600/90 px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-md shadow-[0_0_10px_rgba(220,38,38,0.5)] truncate max-w-[75%]">
                                {genre}
                            </span>
                        )}
                        {year && (
                            <span className="text-[9px] sm:text-[10px] font-bold text-neutral-200 drop-shadow-md whitespace-nowrap">
                                {year}
                            </span>
                        )}
                    </div>
                </div>

                {/* Center Play Button (Hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100 z-10 scale-90 group-hover:scale-100">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/90 pl-1 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-transform hover:scale-110">
                        <Play size={24} className="text-white drop-shadow-md" fill="currentColor" />
                    </div>
                </div>
            </div>
        </Link>
    );
}