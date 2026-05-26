"use client";

import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroBanner({
    movie,
}: any) {
    if (!movie) return null;
    const id = movie._id || movie.tmdbId || movie.id;
    const isTv = movie.isMovie === false || movie.media_type === "tv" || movie.name !== undefined;
    const linkBase = isTv ? "/series" : "/movies";
    const backdropUrl = movie.backdropPath || movie.backdrop_path;
    const title = movie.title || movie.name || "Unknown";

    return (
        <section className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] w-full overflow-hidden">
            {/* Background Image */}
            <motion.div 
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0"
            >
                {backdropUrl && (
                    <Image
                        src={`https://image.tmdb.org/t/p/w1280${backdropUrl}`}
                        alt={title}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-end pb-20 md:items-center px-6 md:px-16">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <span className="mb-3 inline-block rounded-full bg-red-600/20 px-3.5 py-1 text-xs font-bold tracking-wider text-red-500 backdrop-blur-md">
                            TRENDING NOW
                        </span>
                        
                        <h1 className="mb-3 text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-glow line-clamp-2 md:line-clamp-none">
                            {title}
                        </h1>

                        <p className="mb-6 line-clamp-2 sm:line-clamp-3 text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl">
                            {movie.overview}
                        </p>

                        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                            <Link 
                                href={`${linkBase}/${id}?play=true`}
                                className="flex items-center gap-2 rounded-full bg-white px-5 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm md:text-base font-bold text-black transition-all hover:scale-105 hover:bg-neutral-200 shadow-lg shadow-white/5"
                            >
                                <Play fill="currentColor" size={16} />
                                Watch Now
                            </Link>
                            <Link 
                                href={`${linkBase}/${id}`}
                                className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm md:text-base font-bold text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 border border-white/20"
                            >
                                <Info size={16} />
                                More Info
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}