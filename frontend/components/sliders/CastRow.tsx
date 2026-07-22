"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import Image from "next/image";

interface Props {
    cast: any[];
}

export default function CastRow({ cast }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeft(scrollLeft > 5);
            setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    if (!cast || cast.length === 0) return null;

    return (
        <section className="relative w-full overflow-hidden my-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-4 w-1 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
                    <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        STARRING CAST
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll("left")}
                        disabled={!showLeft}
                        className={`p-2 rounded-full border transition-all ${
                            showLeft
                                ? "bg-white/5 border-white/10 hover:bg-red-600 hover:border-red-500 text-white cursor-pointer"
                                : "bg-white/[0.02] border-white/5 text-neutral-600 cursor-not-allowed"
                        }`}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!showRight}
                        className={`p-2 rounded-full border transition-all ${
                            showRight
                                ? "bg-white/5 border-white/10 hover:bg-red-600 hover:border-red-500 text-white cursor-pointer"
                                : "bg-white/[0.02] border-white/5 text-neutral-600 cursor-not-allowed"
                        }`}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Slider Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide snap-x snap-mandatory"
            >
                {cast.map((actor: any) => (
                    <div
                        key={actor.id || actor._id}
                        className="w-[140px] sm:w-[170px] md:w-[190px] flex-shrink-0 snap-start block"
                    >
                        <Link
                            href={`/person/${actor.id || actor._id}`}
                            className="group block rounded-2xl p-2 bg-neutral-900/40 border border-white/5 hover:border-red-500/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(220,38,38,0.25)] backdrop-blur-xl"
                        >
                            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-neutral-950 mb-3 border border-white/5">
                                {actor.profilePath ? (
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w342${actor.profilePath}`}
                                        alt={actor.name}
                                        fill
                                        sizes="200px"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-neutral-500 bg-neutral-900 gap-2">
                                        <User size={32} />
                                        <span className="text-[10px] font-black uppercase">NO PHOTO</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                            </div>

                            <h4 className="text-xs sm:text-sm font-black text-white truncate group-hover:text-red-400 transition-colors">
                                {actor.name}
                            </h4>
                            {actor.character && (
                                <p className="text-[10px] sm:text-xs font-semibold text-neutral-400 truncate mt-0.5">
                                    as {actor.character}
                                </p>
                            )}
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
