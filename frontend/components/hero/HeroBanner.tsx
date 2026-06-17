"use client";

import { motion } from "framer-motion";
import { Play, Info, Star } from "lucide-react";
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

    // Text reveal animation variants
    const containerVariants: import("framer-motion").Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.3 }
        }
    };

    const itemVariants: import("framer-motion").Variants = {
        hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
        show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { type: "spring", stiffness: 200, damping: 20 }
        }
    };

    return (
        <section className="relative h-[85vh] sm:h-[90vh] md:h-[100vh] w-full overflow-hidden bg-black">
            {/* Background Image with Continuous Ken Burns Zoom */}
            <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 will-change-transform"
            >
                {backdropUrl ? (
                    <Image
                        src={`https://image.tmdb.org/t/p/w1280${backdropUrl}`}
                        alt={title}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover opacity-80"
                    />
                ) : (
                    <div className="h-full w-full bg-neutral-900" />
                )}
            </motion.div>

            {/* Next-Gen Vignette Gradients */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)] opacity-40" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-end pb-24 pt-28 md:justify-center md:pb-0 px-5 sm:px-8 md:px-16 lg:px-24">
                <motion.div
                    className="max-w-4xl w-full"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {/* Badge */}
                    <motion.div variants={itemVariants} className="mb-3 sm:mb-4 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1.5 rounded-full bg-red-600/20 px-2.5 py-1 sm:px-3 sm:py-1 text-[9px] sm:text-xs font-black tracking-[0.2em] text-red-500 backdrop-blur-md border border-red-500/20">
                            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500"></span>
                            </span>
                            TRENDING NOW
                        </span>
                        {movie.vote_average && (
                            <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-yellow-500">
                                <Star size={12} fill="currentColor" />
                                {movie.vote_average.toFixed(1)}
                            </span>
                        )}
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        variants={itemVariants}
                        className="mb-3 sm:mb-4 pb-1 lg:pb-4 text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 leading-[1.1] filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] break-words"
                    >
                        {title}
                    </motion.h1>

                    {/* Overview */}
                    <motion.p
                        variants={itemVariants}
                        className="mb-6 sm:mb-8 max-w-2xl text-xs sm:text-sm md:text-lg lg:text-xl font-medium leading-relaxed text-neutral-300 line-clamp-3 md:line-clamp-4 drop-shadow-lg"
                    >
                        {movie.overview}
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div variants={itemVariants} className="flex items-center gap-4 flex-wrap relative z-50 pointer-events-auto">
                        <Link
                            href={`${linkBase}/${id}?play=true`}
                            className="group relative flex items-center gap-3 rounded-full bg-white px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-black text-black transition-all hover:bg-neutral-200 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white shadow-[0_0_40px_rgba(255,255,255,0.6)] opacity-0 transition-opacity group-hover:opacity-100" />
                            <Play fill="currentColor" size={20} className="relative z-10 transition-transform group-hover:scale-110" />
                            <span className="relative z-10">WATCH NOW</span>
                        </Link>

                        <Link
                            href={`${linkBase}/${id}`}
                            className="group flex items-center gap-3 rounded-full bg-neutral-900/40 px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-bold text-white backdrop-blur-xl transition-all hover:bg-white/10 border border-white/10 hover:border-white/30"
                        >
                            <Info size={20} className="transition-transform group-hover:scale-110 text-neutral-400 group-hover:text-white" />
                            <span>MORE INFO</span>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}