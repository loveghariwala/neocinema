"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Play } from "lucide-react";
import WatchlistButton from "@/components/watchlist/WatchlistButton";

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
            : `https://image.tmdb.org/t/p/w500${movie.posterPath}`
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

    return (
        <Link href={`${linkBase}/${id}`} className="block group">
            <motion.div
                whileHover={{ scale: 1.00, y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-xl border border-white/5 transition-all group-hover:border-white/20 group-hover:shadow-[0_0_40px_rgba(220,38,38,0.3)]"
            >
                {/* Poster Image */}
                <img
                    src={posterUrl}
                    alt={title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=1a1a1a&color=dc2626&size=300&bold=true`;
                    }}
                />

                {/* Rating Badge */}
                <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-md border border-white/10 opacity-90 transition-opacity group-hover:opacity-100">
                    <Star size={12} className="text-yellow-500" fill="currentColor" />
                    <span className="text-[11px] font-black tracking-wider text-white">
                        {typeof rating === "number" ? rating.toFixed(1) : "N/A"}
                    </span>
                </div>

                {/* Language Badge */}
                {lang && lang !== "en" && (
                    <div className="absolute left-3 top-3 z-20 rounded-full bg-red-600/80 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                        {lang.toUpperCase()}
                    </div>
                )}

                {/* Watchlist Toggle */}
                <div className="absolute left-3 top-3 z-30">
                    <WatchlistButton movie={movie} variant="compact" />
                </div>

                {/* Type Badge for series */}
                {movie.isMovie === false && (
                    <div className="absolute left-3 top-3 z-20 rounded-md bg-blue-600/80 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                        Series
                    </div>
                )}

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