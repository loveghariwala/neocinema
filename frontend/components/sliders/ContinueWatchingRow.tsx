"use client";

import { useEffect, useState, useRef } from "react";
import { getWatchHistory, WatchProgress } from "@/services/historyService";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Play, Trash2 } from "lucide-react";
import { getTmdbImageUrl } from "@/lib/tmdb";

export default function ContinueWatchingRow() {
    const [history, setHistory] = useState<WatchProgress[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHistory(getWatchHistory());
        setIsLoaded(true);
    }, []);

    const clearHistory = () => {
        localStorage.removeItem("neocinema_watch_history");
        setHistory([]);
    };

    const handleScroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const amount = direction === "left" ? -350 : 350;
            scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
        }
    };

    if (!isLoaded || history.length === 0) return null;

    const getImage = (path: string) => {
        return getTmdbImageUrl(path, "w500");
    };

    return (
        <div className="w-full my-8 px-4 sm:px-8 relative group/row">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500">
                        <Clock size={18} />
                    </div>
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                        CONTINUE WATCHING
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    {/* Navigation Arrow Buttons */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => handleScroll("left")}
                            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-red-600 hover:border-red-500 text-white transition-all cursor-pointer active:scale-95 touch-manipulation"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => handleScroll("right")}
                            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-red-600 hover:border-red-500 text-white transition-all cursor-pointer active:scale-95 touch-manipulation"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <button
                        onClick={clearHistory}
                        className="text-xs font-bold text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-1.5 ml-2"
                    >
                        <Trash2 size={13} />
                        <span className="hidden sm:inline">Clear History</span>
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex items-center gap-4 overflow-x-auto scrollbar-hide py-2 scroll-smooth"
            >
                {history.map((item) => (
                    <Link
                        key={`${item.type}-${item.id}`}
                        href={`/${item.type === "tv" ? "series" : "movies"}/${item.id}${item.type === "tv" ? `?season=${item.season || 1}&episode=${item.episode || 1}` : ""}`}
                        className="group flex-shrink-0 w-64 sm:w-72 rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 transition-all hover:scale-[1.03] hover:border-red-500/50 shadow-xl"
                    >
                        <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                            <img
                                src={getImage(item.backdrop_path || item.poster_path)}
                                alt={item.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                            
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="rounded-full bg-red-600 p-3 text-white shadow-xl shadow-red-600/50 group-hover:scale-110 transition-transform">
                                    <Play fill="currentColor" size={20} />
                                </div>
                            </div>

                            {item.type === "tv" && (
                                <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                                    S{item.season} E{item.episode}
                                </div>
                            )}

                            {/* Simulated Watch Progress Indicator Bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                                <div className="h-full bg-red-600 rounded-r-full" style={{ width: "65%" }} />
                            </div>
                        </div>

                        <div className="p-3">
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate">{item.title}</h4>
                            <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-wider">
                                {item.type === "tv" ? `Season ${item.season} • Episode ${item.episode}` : "Movie"}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
