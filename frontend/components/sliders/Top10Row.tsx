"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";
import { getTmdbImageUrl } from "@/lib/tmdb";
import { Star } from 'lucide-react';

interface Top10RowProps {
    title: string;
    movies: any[];
    onOpenTrailer?: (movie: any) => void;
}

export default function Top10Row({ title, movies, onOpenTrailer }: Top10RowProps) {
    const rowRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: "left" | "right") => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollAmount = direction === "left" ? -clientWidth * 0.7 : clientWidth * 0.7;
            rowRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: "smooth" });
        }
    };

    const top10 = (movies || []).slice(0, 10);
    if (top10.length === 0) return null;

    return (
        <section className="relative my-8 pointer-events-auto">
            {/* Header */}
            <div className="mb-6 flex items-end justify-between px-4 sm:px-6 md:px-16 gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-500 shadow-lg shadow-red-950">
                        <Flame size={22} className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                            {title}
                        </h2>
                        <p className="text-xs text-neutral-400 font-medium">
                            Most watched titles this week
                        </p>
                    </div>
                </div>

                {/* Arrow Navigation Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleScroll("left")}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-neutral-900/80 text-white backdrop-blur-md transition-all hover:bg-red-600 hover:border-red-500 cursor-pointer active:scale-95"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => handleScroll("right")}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-neutral-900/80 text-white backdrop-blur-md transition-all hover:bg-red-600 hover:border-red-500 cursor-pointer active:scale-95"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Slider Container */}
            <div
                ref={rowRef}
                className="flex items-center gap-6 sm:gap-10 overflow-x-auto overflow-y-hidden touch-pan-x overscroll-x-contain px-4 sm:px-6 md:px-16 pt-4 pb-8 scrollbar-none scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {top10.map((movie: any, index: number) => {
                    const id = movie._id || movie.tmdbId || movie.id;
                    const linkBase = movie.isMovie === false || movie.name ? "/series" : "/movies";
                    const movieTitle = movie.title || movie.name || "Unknown";
                    const posterUrl = getTmdbImageUrl(movie.posterPath || movie.poster_path, "w342", movieTitle);
                    const rank = index + 1;
                    const rating = movie.rating ?? movie.vote_average ?? 0;

                    return (
                        <div
                            key={`${id}-${rank}`}
                            className="relative flex items-end shrink-0 group select-none cursor-pointer"
                            style={{ minWidth: "220px", width: "240px" }}
                        >
                            {/* Giant Stylized Rank Number */}
                            <span
                                className="absolute -left-6 sm:-left-8 bottom-0 z-0 text-[7rem] sm:text-[9rem] font-black leading-none tracking-tighter text-transparent select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:scale-110 group-hover:text-red-600/30"
                                style={{
                                    WebkitTextStroke: "2px rgba(255,255,255,0.25)",
                                }}
                            >
                                {rank}
                            </span>

                            {/* Card Body */}
                            <div className="relative z-10 ml-12 sm:ml-16 w-full aspect-[2/3] overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-105 group-hover:border-red-500/40 group-hover:shadow-[0_20px_50px_rgba(220,38,38,0.4)]">
                                <Link href={`${linkBase}/${id}`} prefetch={false} className="block w-full h-full">
                                    <Image
                                        src={posterUrl}
                                        alt={movieTitle}
                                        fill
                                        unoptimized
                                        className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                                    />
                                    {/* Rating badge */}
                                    {rating > 0 && (
                                        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-black text-yellow-400 border border-white/10 backdrop-blur-md">
                                            <Star size={10} fill="currentColor" />
                                            {typeof rating === "number" ? rating.toFixed(1) : "N/A"}
                                        </div>
                                    )}
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                                    <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                                        <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">
                                            #{rank} IN TOP 10
                                        </span>
                                        <h3 className="text-sm font-black text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                                            {movieTitle}
                                        </h3>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
