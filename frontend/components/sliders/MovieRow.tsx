"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";

import MovieCard from "../cards/MovieCard";


interface Props {
    title: string;
    movies: any[];
    moreLink?: string;
    className?: string;
}

export default function MovieRow({
    title,
    movies,
    moreLink,
    className,
}: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);
    const isInView = true;

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeft(scrollLeft > 0);
            setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    // Auto-scroll every 10 seconds to infinity
    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                // Check if we are at the end
                if (scrollLeft >= scrollWidth - clientWidth - 10) {
                    // Loop back to start
                    scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    // Scroll right by one view width
                    const scrollTo = scrollLeft + clientWidth;
                    scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
                }
            }
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const containerVariants: any = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, x: 50 },
        show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <section ref={containerRef} className={`relative mb-24 overflow-hidden ${className || ""}`}>
            {/* Header Section */}
            <div
                className="mb-8 flex items-end justify-between px-6 md:px-16 gap-6"
            >
                <div className="flex items-end gap-4 flex-shrink-0">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase">
                        {title}
                        <span className="block h-1 w-1/2 bg-red-600 mt-2 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                    </h2>
                </div>
                {/* <div className="h-px flex-1 bg-gradient-to-r from-red-600/40 via-red-600/10 to-transparent mb-2" /> */}
                {moreLink && (
                    <Link
                        href={moreLink}
                        className="group flex items-center gap-2 mb-1 px-4 py-2 text-sm font-bold text-neutral-400 transition-all hover:text-white flex-shrink-0"
                    >
                        Explore All
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-red-500" />
                    </Link>
                )}
            </div>

            <div className="relative px-6 md:px-16 group/row">
                {/* LEFT ARROW - Fade on hover */}
                <button
                    onClick={() => scroll("left")}
                    disabled={!showLeft}
                    aria-label="Scroll left"
                    className={`absolute left-0 md:left-4 top-1/2 z-40 -translate-y-1/2 flex items-center justify-center p-2 transition-all duration-500 ${!showLeft ? "opacity-0 pointer-events-none" : "opacity-0 group-hover/row:opacity-100 hover:scale-110"}`}
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-xl shadow-2xl transition-colors hover:bg-red-600/90 hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                        <ChevronLeft size={24} />
                    </div>
                </button>

                {/* SLIDER CONTAINER */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-[20px] overflow-x-auto scroll-smooth pb-12 pt-4 next-gen-scrollbar snap-x snap-mandatory"
                >
                    {movies?.map((movie, index) => (
                        <div
                            key={movie._id || movie.tmdbId || index}
                            className="w-[calc(50%-10px)] md:w-[calc(33.33%-13.33px)] lg:w-[calc(20%-16px)] flex-shrink-0 snap-start snap-always"
                        >
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>

                {/* RIGHT ARROW - Fade on hover */}
                <button
                    onClick={() => scroll("right")}
                    disabled={!showRight}
                    aria-label="Scroll right"
                    className={`absolute right-0 md:right-4 top-1/2 z-40 -translate-y-1/2 flex items-center justify-center p-2 transition-all duration-500 ${!showRight ? "opacity-0 pointer-events-none" : "opacity-0 group-hover/row:opacity-100 hover:scale-110"}`}
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-xl shadow-2xl transition-colors hover:bg-red-600/90 hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                        <ChevronRight size={24} />
                    </div>
                </button>

                {/* Edge Fades */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-12 w-16 bg-gradient-to-r from-background to-transparent z-30" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-12 w-16 bg-gradient-to-l from-background to-transparent z-30" />
            </div>
        </section>
    );
}