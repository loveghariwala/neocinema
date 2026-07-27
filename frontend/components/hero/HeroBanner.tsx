"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Info, Play, Star } from 'lucide-react';
import Link from "next/link";
import { getTmdbImageUrl } from "@/lib/tmdb";

export default function HeroBanner({
    movies = [],
    movie,
}: any) {
    const list = useMemo(() => {
        if (movies && movies.length > 0) return movies;
        if (movie) return [movie];
        return [];
    }, [movies, movie]);

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (list.length <= 1) return;
        if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) return;

        const timer = setInterval(() => {
            if (document.visibilityState === "visible") {
                setCurrentIndex((prev) => (prev + 1) % list.length);
            }
        }, 10000); // Auto-rotation every 10 seconds on desktop only
        return () => clearInterval(timer);
    }, [list.length]);

    if (!list || list.length === 0) return null;

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % list.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + list.length) % list.length);
    };

    const currentItem = list[currentIndex] || {};

    return (
        <section className="relative w-full min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] overflow-hidden bg-neutral-950 flex flex-col justify-end">
            {/* Background Slides */}
            <div className="absolute inset-0 z-0">
                {list.map((item: any, index: number) => {
                    const isActive = index === currentIndex;
                    const itemBackdrop = item.backdropPath || item.backdrop_path || item.posterPath || item.poster_path;
                    return (
                        <div
                            key={item._id || item.tmdbId || item.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                isActive ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            {itemBackdrop ? (
                                <picture className="absolute inset-0 h-full w-full">
                                    <source media="(max-width: 768px)" srcSet={getTmdbImageUrl(itemBackdrop, "w780")} />
                                    <source media="(min-width: 769px)" srcSet={getTmdbImageUrl(itemBackdrop, "w1280")} />
                                    <img
                                        src={getTmdbImageUrl(itemBackdrop, "w1280")}
                                        alt={item.title || item.name}
                                        className="h-full w-full object-cover opacity-80"
                                        style={{
                                            animation: isActive ? "ken-burns 40s linear infinite alternate" : "none",
                                        }}
                                        fetchPriority={index === 0 ? "high" : "low"}
                                    />
                                </picture>
                            ) : (
                                <div className="h-full w-full bg-neutral-900" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Next-Gen Vignette Gradients */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-1" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-1" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)] opacity-40 z-1" />

            {/* Content */}
            <div className="relative z-10 flex flex-1 flex-col justify-end pb-24 pt-28 sm:pb-28 md:pb-32 px-5 sm:px-8 md:px-16 lg:px-24">
                <div className="grid grid-cols-1 grid-rows-1 max-w-4xl w-full">
                    {list.map((item: any, index: number) => {
                        const isActive = index === currentIndex;
                        const itemTitle = item.title || item.name || "Unknown";
                        const itemId = item._id || item.tmdbId || item.id;
                        const itemIsTv = item.isMovie === false || item.media_type === "tv" || item.name !== undefined;
                        const itemLinkBase = itemIsTv ? "/series" : "/movies";

                        return (
                            <div
                                key={itemId}
                                className={`col-start-1 row-start-1 flex flex-col justify-end transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
                                    isActive
                                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto z-10 filter blur-none"
                                        : "opacity-0 translate-y-8 scale-95 pointer-events-none z-0 filter blur-sm"
                                }`}
                            >
                                {/* Badge & Rating */}
                                <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-3">
                                    <span className="flex items-center gap-1.5 rounded-full bg-red-600/20 px-2.5 py-1 sm:px-3 sm:py-1 text-[9px] sm:text-xs font-black tracking-[0.2em] text-red-500 backdrop-blur-md border border-red-500/20">
                                        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500"></span>
                                        </span>
                                        TRENDING NOW
                                    </span>
                                    {item.vote_average && (
                                        <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-yellow-500">
                                            <Star size={12} fill="currentColor" />
                                            {item.vote_average.toFixed(1)}
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h1
                                    className="mb-3 sm:mb-4 pb-1 lg:pb-4 text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 leading-[1.1] filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] break-words"
                                >
                                    {itemTitle}
                                </h1>

                                {/* Overview */}
                                <p
                                    className="mb-6 sm:mb-8 max-w-2xl text-xs sm:text-sm md:text-lg lg:text-xl font-medium leading-relaxed text-neutral-300 line-clamp-3 md:line-clamp-4 drop-shadow-lg"
                                >
                                    {item.overview}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-4 flex-wrap relative z-50 pointer-events-auto">
                                    <Link
                                        href={`${itemLinkBase}/${itemId}?play=true`}
                                        aria-label={`Watch ${itemTitle} now`}
                                        className="group relative flex items-center gap-3 rounded-full bg-white px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-black text-black transition-all hover:bg-neutral-200 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white shadow-[0_0_40px_rgba(255,255,255,0.6)] opacity-0 transition-opacity group-hover:opacity-100" />
                                        <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 transition-all duration-700 ease-in-out group-hover:translate-x-[150%] group-hover:opacity-100 z-10 skew-x-[-20deg]" />

                                        <Play fill="currentColor" size={20} className="relative z-20 transition-transform group-hover:scale-110" />
                                        <span className="relative z-20">WATCH NOW</span>
                                    </Link>

                                    <Link
                                        href={`${itemLinkBase}/${itemId}`}
                                        aria-label={`More info about ${itemTitle}`}
                                        className="group flex items-center gap-3 rounded-full bg-neutral-900/40 px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-bold text-white backdrop-blur-xl transition-all hover:bg-white/10 border border-white/10 hover:border-white/30"
                                    >
                                        <Info size={20} className="transition-transform group-hover:scale-110 text-neutral-400 group-hover:text-white" />
                                        <span>MORE INFO<span className="sr-only"> about {itemTitle}</span></span>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Arrows */}
            {list.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 hover:bg-red-600/80 text-white border border-white/10 hover:border-red-500/20 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 hover:bg-red-600/80 text-white border border-white/10 hover:border-red-500/20 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}
        </section>
    );
}
