"use client";

import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import Link from "next/link";

export default function HeroBanner({
    movie,
}: any) {
    if (!movie) return null;
    const id = movie._id || movie.tmdbId || movie.id;
    const isTv = movie.isMovie === false || movie.media_type === "tv" || movie.name !== undefined;
    const linkBase = isTv ? "/series" : "/movies";

    return (
        <section className="relative h-[85vh] w-full overflow-hidden">
            {/* Background Image */}
            <motion.div 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
            >
                <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center px-6 md:px-16">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <span className="mb-4 inline-block rounded-full bg-red-600/20 px-4 py-1 text-sm font-bold tracking-wider text-red-500 backdrop-blur-md">
                            TRENDING NOW
                        </span>
                        
                        <h1 className="mb-4 text-5xl font-black tracking-tight text-glow md:text-7xl">
                            {movie.title}
                        </h1>

                        <p className="mb-8 line-clamp-3 text-lg text-neutral-300 md:text-xl">
                            {movie.overview}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link 
                                href={`${linkBase}/${id}?play=true`}
                                className="flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-black transition-all hover:scale-105 hover:bg-neutral-200"
                            >
                                <Play fill="currentColor" size={20} />
                                Watch Now
                            </Link>
                            <Link 
                                href={`${linkBase}/${id}`}
                                className="flex items-center gap-2 rounded-full bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 border border-white/20"
                            >
                                <Info size={20} />
                                More Info
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}