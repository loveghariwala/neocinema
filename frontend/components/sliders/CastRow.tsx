"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";


import Image from "next/image";

interface Props {
    cast: any[];
}

export default function CastRow({ cast }: Props) {
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

    if (!cast || cast.length === 0) return null;

    return (
        <section ref={containerRef} className="relative w-full overflow-hidden">
            <div className="mb-10 flex items-center gap-6 px-0 md:px-0">
                <h3 className="text-xl font-black uppercase tracking-tighter text-white">Starring Cast</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-red-600/50 to-transparent" />
            </div>

            <div className="relative group/row">
                {/* LEFT ARROW */}
                <button
                    onClick={() => scroll("left")}
                    disabled={!showLeft}
                    aria-label="Scroll left"
                    className={`absolute left-0 top-1/2 z-40 -translate-y-1/2 -mt-4 flex items-center justify-center p-2 transition-all duration-500 ${!showLeft ? "opacity-0 pointer-events-none" : "opacity-0 group-hover/row:opacity-100 hover:scale-110"}`}
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-xl shadow-2xl transition-colors hover:bg-red-600/90 hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                        <ChevronLeft size={24} />
                    </div>
                </button>

                {/* SLIDER CONTAINER */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-6 overflow-x-auto scroll-smooth pb-10 next-gen-scrollbar snap-x snap-mandatory"
                >
                    {cast.map((actor: any) => (
                        <div
                            key={actor.id || actor._id}
                            className="min-w-[160px] md:min-w-[180px] flex-shrink-0 snap-start block"
                        >
                            <Link href={`/person/${actor.id || actor._id}`} className="group cursor-pointer block" aria-label={`View details for ${actor.name}`}>
                                <div
                                    className="relative aspect-[2/3] mb-4 w-full overflow-hidden rounded-2xl bg-neutral-950 shadow-xl border border-white/[0.05] transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105 group-hover:border-white/20 group-hover:shadow-[0_20px_50px_rgba(220,38,38,0.3)]"
                                >
                                    {actor.profilePath ? (
                                        <Image src={`https://image.tmdb.org/t/p/w342${actor.profilePath}`} alt={actor.name} fill sizes="180px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-[10px] font-black uppercase text-neutral-500 bg-neutral-900">NO PHOTO</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
                                </div>
                                <h4 className="text-base font-black text-white group-hover:text-red-500 transition-colors drop-shadow-md">{actor.name}</h4>
                                <p className="text-sm font-medium text-neutral-300 line-clamp-2">{actor.character}</p>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* RIGHT ARROW */}
                <button
                    onClick={() => scroll("right")}
                    disabled={!showRight}
                    aria-label="Scroll right"
                    className={`absolute right-0 top-1/2 z-40 -translate-y-1/2 -mt-4 flex items-center justify-center p-2 transition-all duration-500 ${!showRight ? "opacity-0 pointer-events-none" : "opacity-0 group-hover/row:opacity-100 hover:scale-110"}`}
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-xl shadow-2xl transition-colors hover:bg-red-600/90 hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                        <ChevronRight size={24} />
                    </div>
                </button>
                
                {/* Edge Fades */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-10 w-12 bg-gradient-to-r from-background to-transparent z-30" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-10 w-12 bg-gradient-to-l from-background to-transparent z-30" />
            </div>
        </section>
    );
}
