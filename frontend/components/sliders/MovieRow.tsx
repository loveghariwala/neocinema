"use client";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "../cards/MovieCard";

interface Props {
    title: string;
    movies: any[];
}

export default function MovieRow({
    title,
    movies,
}: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            setShowLeft(scrollRef.current.scrollLeft > 0);
        }
    };

    return (
        <section className="relative mb-24 overflow-hidden">
            <div className="mb-8 flex items-center justify-between px-6 md:px-16">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-1.5 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                    <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
                        {title}
                    </h2>
                </div>
                <div className="h-px flex-1 mx-12 bg-gradient-to-r from-red-600/40 via-red-600/10 to-transparent" />
            </div>

            <div className="relative px-6 md:px-16">
                {/* LEFT ARROW */}
                <button
                    onClick={() => scroll("left")}
                    disabled={!showLeft}
                    className={`absolute left-0 md:left-2 top-1/2 z-50 -translate-y-1/2 flex items-center justify-center p-2 transition-all duration-300 ${!showLeft ? "opacity-30 cursor-not-allowed" : "opacity-100 hover:scale-110"}`}
                >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white backdrop-blur-xl shadow-2xl transition-colors hover:bg-red-600 hover:border-red-500">
                        <ChevronLeft size={32} />
                    </div>
                </button>

                {/* SLIDER CONTAINER */}
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-[20px] overflow-x-auto scroll-smooth pb-12 pt-4 scrollbar-hide snap-x snap-mandatory"
                >
                    {movies?.map((movie, index) => (
                        <div 
                            key={movie._id || movie.tmdbId || index} 
                            className="w-[calc(50%-10px)] md:w-[calc(33.33%-13.33px)] lg:w-[calc(25%-15px)] flex-shrink-0 snap-start snap-always"
                        >
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>

                {/* RIGHT ARROW */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 md:right-2 top-1/2 z-50 -translate-y-1/2 flex items-center justify-center p-2 opacity-100 transition-all duration-300 hover:scale-110"
                >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white backdrop-blur-xl shadow-2xl transition-colors hover:bg-red-600 hover:border-red-500">
                        <ChevronRight size={32} />
                    </div>
                </button>

            </div>
        </section>


    );
}