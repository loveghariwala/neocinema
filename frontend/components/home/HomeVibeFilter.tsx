"use client";

import { Dices, Sparkles, Flame, Film, Tv, Compass } from 'lucide-react';

interface HomeVibeFilterProps {
    activeCategory: string;
    onSelectCategory: (cat: string) => void;
    onOpenRoulette: () => void;
}

const CATEGORIES = [
    { id: "all", label: "🔥 Trending All", icon: Flame },
    { id: "action", label: "💥 Action & Thriller", icon: Film },
    { id: "scifi", label: "🧠 Sci-Fi & Mystery", icon: Compass },
    { id: "kdrama", label: "🥢 K-Drama Hits", icon: Tv },
    { id: "anime", label: "🎌 Anime Series", icon: Tv },
    { id: "horror", label: "👻 Late Night Horror", icon: Film },
    { id: "comedy", label: "🍿 Comedy", icon: Film },
];

export default function HomeVibeFilter({ activeCategory, onSelectCategory, onOpenRoulette }: HomeVibeFilterProps) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl border border-white/10 bg-neutral-900/80 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                
                {/* Left Category Scroll */}
                <div className="flex items-center gap-2.5 overflow-x-auto overflow-y-hidden w-full md:w-auto scrollbar-none py-1">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onSelectCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer active:scale-95 shrink-0 ${
                                    isActive
                                        ? "bg-red-600 text-white shadow-lg shadow-red-950/80 border border-red-500/40 scale-105"
                                        : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"
                                }`}
                            >
                                <Icon size={14} className={isActive ? "text-white" : "text-neutral-500"} />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Right Interactive Roulette Launcher */}
                <button
                    onClick={onOpenRoulette}
                    className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-red-600 to-pink-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-purple-950/60 transition-all hover:scale-105 active:scale-95 shrink-0 border border-white/20 cursor-pointer"
                >
                    <Dices size={16} className="animate-spin-slow group-hover:rotate-180 transition-transform" />
                    <span>AI Movie Roulette 🎲</span>
                    <Sparkles size={14} className="text-yellow-400 animate-pulse" />
                </button>
            </div>
        </div>
    );
}
