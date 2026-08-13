"use client";

import { useState } from "react";
import { Dices, Sparkles, Star, X, Play, RefreshCw, Film, Tv, Flame } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { getTmdbImageUrl } from "@/lib/tmdb";
import { discoverContentFromServer, getTrendingFromServer } from "@/services/movieService";

interface MovieRouletteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenTrailer?: (movie: any) => void;
}

const MOODS = [
    { id: "trending", label: "🔥 Top Trending", icon: "🔥", params: { type: "movie", genre: "" } },
    { id: "action", label: "💥 Adrenaline Action", icon: "💥", params: { type: "movie", genre: "28" } },
    { id: "scifi", label: "🧠 Mind-Bending Sci-Fi", icon: "🧠", params: { type: "movie", genre: "878,9648" } },
    { id: "kdrama", label: "🥢 Top K-Dramas", icon: "🥢", params: { type: "tv", genre: "18", lang: "ko" } },
    { id: "anime", label: "🎌 Anime Hits", icon: "🎌", params: { type: "tv", genre: "16", lang: "ja" } },
    { id: "horror", label: "👻 Late Night Horror", icon: "👻", params: { type: "movie", genre: "27" } },
    { id: "comedy", label: "🍿 Feel-Good Comedy", icon: "🍿", params: { type: "movie", genre: "35" } },
    { id: "romance", label: "💖 Romantic Favorites", icon: "💖", params: { type: "movie", genre: "10749" } },
];

export default function MovieRouletteModal({ isOpen, onClose, onOpenTrailer }: MovieRouletteModalProps) {
    const [selectedMood, setSelectedMood] = useState(MOODS[0]);
    const [spinning, setSpinning] = useState(false);
    const [resultMovie, setResultMovie] = useState<any>(null);

    if (!isOpen) return null;

    const handleSpin = async (mood = selectedMood) => {
        setSpinning(true);
        setResultMovie(null);

        try {
            let list: any[] = [];
            const randomPage = String(Math.floor(Math.random() * 5) + 1);

            if (mood.id === "trending") {
                const res = await getTrendingFromServer(mood.params.type as any, "week", randomPage);
                list = res?.results || [];
            } else {
                const res = await discoverContentFromServer(mood.params.type as any, {
                    sort_by: "popularity.desc",
                    with_genres: mood.params.genre,
                    language: mood.params.lang || "",
                    page: randomPage,
                    rating_min: "6.5"
                });
                list = res?.results || [];
            }

            if (list.length > 0) {
                const randomIndex = Math.floor(Math.random() * list.length);
                const picked = list[randomIndex];
                // Artificial delay for smooth spin effect
                setTimeout(() => {
                    setResultMovie(picked);
                    setSpinning(false);
                }, 700);
            } else {
                setSpinning(false);
            }
        } catch (err) {
            console.error("Spin error:", err);
            setSpinning(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl animate-fade-in">
            {/* Backdrop Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-950/40 via-purple-950/20 to-black pointer-events-none" />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/90 shadow-[0_0_80px_rgba(220,38,38,0.25)] backdrop-blur-2xl p-6 sm:p-8 space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-500 shadow-lg shadow-red-950">
                            <Dices size={24} className={spinning ? "animate-spin" : ""} />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                                Movie <span className="text-red-500">Roulette</span>
                                <Sparkles size={16} className="text-yellow-500 animate-pulse" />
                            </h2>
                            <p className="text-xs text-neutral-400 font-medium">
                                Can’t decide what to watch? Pick a vibe & let AI surprise you!
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2.5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Vibe Chips */}
                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-neutral-400">
                        Select Your Vibe:
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                        {MOODS.map((mood) => (
                            <button
                                key={mood.id}
                                onClick={() => {
                                    setSelectedMood(mood);
                                    handleSpin(mood);
                                }}
                                disabled={spinning}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                                    selectedMood.id === mood.id
                                        ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/50 scale-105"
                                        : "bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:border-white/20"
                                }`}
                            >
                                {mood.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Result Area */}
                <div className="min-h-[260px] rounded-2xl border border-white/10 bg-neutral-950/80 p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
                    {spinning ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-8">
                            <div className="relative">
                                <div className="h-16 w-16 rounded-full border-4 border-red-600/20 border-t-red-500 animate-spin" />
                                <Dices size={24} className="absolute inset-0 m-auto text-red-500 animate-pulse" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
                                Shuffling 10,000+ Movies & Shows...
                            </p>
                        </div>
                    ) : resultMovie ? (
                        <div className="flex flex-col sm:flex-row gap-5 items-center w-full relative z-10">
                            {/* Backdrop / Poster */}
                            <div className="relative w-32 sm:w-40 aspect-[2/3] rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-2xl">
                                <Image
                                    src={getTmdbImageUrl(resultMovie.posterPath || resultMovie.poster_path, "w342", resultMovie.title || resultMovie.name)}
                                    alt={resultMovie.title || resultMovie.name}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                                {resultMovie.vote_average > 0 && (
                                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-black text-yellow-400 border border-white/10 backdrop-blur-md">
                                        <Star size={10} fill="currentColor" />
                                        {resultMovie.vote_average.toFixed(1)}
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-grow space-y-3 text-center sm:text-left">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-600/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                                        {resultMovie.isMovie === false || resultMovie.name ? "TV SERIES" : "MOVIE"}
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-black text-white line-clamp-2 leading-tight">
                                        {resultMovie.title || resultMovie.name}
                                    </h3>
                                </div>

                                <p className="text-xs text-neutral-300 font-medium line-clamp-3 leading-relaxed">
                                    {resultMovie.overview || "No overview available for this title."}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                                    <Link
                                        href={`/${resultMovie.isMovie === false || resultMovie.name ? "series" : "movies"}/${resultMovie.tmdbId || resultMovie._id || resultMovie.id}?play=true`}
                                        onClick={onClose}
                                        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-red-900/50 flex items-center gap-2"
                                    >
                                        <Play size={14} fill="currentColor" />
                                        Watch Now
                                    </Link>

                                    {onOpenTrailer && (
                                        <button
                                            onClick={() => {
                                                onOpenTrailer(resultMovie);
                                            }}
                                            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 flex items-center gap-2 cursor-pointer"
                                        >
                                            <Film size={14} />
                                            Trailer
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-3 py-8 text-center">
                            <Dices size={40} className="text-neutral-600" />
                            <p className="text-sm font-bold text-neutral-300">
                                Select a vibe above or click spin below!
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-2">
                    <button
                        onClick={() => handleSpin(selectedMood)}
                        disabled={spinning}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white text-sm font-black uppercase tracking-wider shadow-xl shadow-red-950/80 transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={spinning ? "animate-spin" : ""} />
                        {spinning ? "Spinning..." : "SPIN AGAIN 🎲"}
                    </button>
                </div>
            </div>
        </div>
    );
}
