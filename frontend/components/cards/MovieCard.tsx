"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Play } from "lucide-react";
import WatchlistButton from "@/components/watchlist/WatchlistButton";
import Image from "next/image";
import { useState, useEffect } from "react";

interface MovieCardProps {
    movie: any;
}

export default function MovieCard({ movie }: MovieCardProps) {
    // Support both local DB (_id) and external API (tmdbId) formats
    const id = movie._id || movie.tmdbId;
    const linkBase = movie.isMovie === false ? "/series" : "/movies";
    const posterUrl = movie.posterPath
        ? movie.posterPath.startsWith("http")
            ? movie.posterPath
            : `https://image.tmdb.org/t/p/w342${movie.posterPath}`
        : "/placeholder.jpg";
    const title = movie.title || movie.name || "Unknown";
    const rating = movie.rating ?? movie.vote_average ?? 0;
    const genre = movie.genres?.[0] || "Unknown";
    const year = movie.releaseDate
        ? new Date(movie.releaseDate).getFullYear()
        : movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "";
    const lang = movie.language || movie.original_language || "";

    const [imgSrc, setImgSrc] = useState(posterUrl);
    useEffect(() => {
        setImgSrc(posterUrl);
    }, [posterUrl]);

    return (
        <Link href={`${linkBase}/${id}`} className="block group">
            <motion.div
                whileHover={{ scale: 1.00, y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-xl border border-white/5 transition-all group-hover:border-white/20 group-hover:shadow-[0_0_40px_rgba(220,38,38,0.3)]"
            >
                {/* Poster Image */}
                <div className="absolute inset-0">
                    <Image
                        src={imgSrc}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 15vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => {
                            setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=1a1a1a&color=dc2626&size=300&bold=true`);
                        }}
                    />
                </div>

                {/* Rating Badge */}
                <div className="absolute right-3 top-3 z-20 flex items-center gap-1 sm:gap-1.5 rounded-full bg-black/50 px-2 py-0.5 sm:px-2.5 sm:py-1 backdrop-blur-md border border-white/10 opacity-90 transition-opacity group-hover:opacity-100">
                    <Star size={10} className="text-yellow-500 sm:size-3" fill="currentColor" />
                    <span className="text-[9px] sm:text-[11px] font-black tracking-wider text-white">
                        {typeof rating === "number" ? rating.toFixed(1) : "N/A"}
                    </span>
                </div>

                {/* Top Left: Watchlist Toggle & Badges Container */}
                <div className="absolute left-3 top-3 z-30 flex items-center gap-1 sm:gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 relative flex items-center justify-center">
                        <WatchlistButton movie={movie} variant="compact" />
                    </div>
                    
                    {lang && lang !== "en" && (
                        <div className="rounded-md bg-red-600/80 px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-sm border border-white/5 shadow-md">
                            {lang.toUpperCase()}
                        </div>
                    )}
                    {movie.isMovie === false && (
                        <div className="rounded-md bg-blue-600/80 px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-sm border border-white/5 shadow-md">
                            <span className="inline sm:hidden">TV</span>
                            <span className="hidden sm:inline">Series</span>
                        </div>
                    )}
                </div>

                {/* Bottom Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                    <h3 className="mb-1 line-clamp-2 text-lg font-black leading-tight text-white shadow-black drop-shadow-md">
                        {title}
                    </h3>

                    <div className="flex items-center gap-2 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
                        <span className="rounded bg-red-600/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                            {genre}
                        </span>
                        {year && (
                            <span className="text-xs font-bold text-neutral-300">
                                {year}
                            </span>
                        )}
                    </div>
                </div>

                {/* Center Play Button (Hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 pl-1 backdrop-blur-md border border-white/30 shadow-2xl transition-transform hover:scale-110">
                        <Play size={24} className="text-white" fill="currentColor" />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}