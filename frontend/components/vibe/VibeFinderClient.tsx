"use client";

import { useState } from "react";
import { Dices, Sparkles, Star, Play, Film, Tv, Flame, Compass, Heart, Ghost, Smile, RefreshCw, Zap, ExternalLink } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { getTmdbImageUrl } from "@/lib/tmdb";
import { discoverContentFromServer, getTrendingFromServer } from "@/services/movieService";
import QuickTrailerModal from "@/components/player/QuickTrailerModal";

const VIBES = [
    { id: "mindbending", label: "🤯 Mind-Bending Sci-Fi", genre: "878,9648", type: "movie", desc: "Psychological thrillers, plot twists & futuristic mysteries." },
    { id: "action", label: "💥 Adrenaline Action", genre: "28,12", type: "movie", desc: "High-octane fights, chases & explosive stunts." },
    { id: "horror", label: "👻 Late Night Horror", genre: "27", type: "movie", desc: "Supernatural scares, slashers & dark chills." },
    { id: "comedy", label: "🍿 Feel-Good Comedy", genre: "35", type: "movie", desc: "Hilarious comedies & lighthearted laughs." },
    { id: "kdrama", label: "🥢 K-Drama Hits", genre: "18", type: "tv", lang: "ko", desc: "Bingeable Korean dramas, romance & thrillers." },
    { id: "anime", label: "🎌 Anime Masterpieces", genre: "16", type: "tv", lang: "ja", desc: "Top Japanese anime series & films." },
    { id: "romance", label: "💖 Romantic Favorites", genre: "10749", type: "movie", desc: "Heartwarming love stories & rom-coms." },
    { id: "crime", label: "🕵️ Crime & Heist", genre: "80,9648", type: "movie", desc: "Detective cases, mafia sagas & clever heists." },
];

const PLATFORMS = [
    { id: "all", label: "All Platforms", icon: "🌐" },
    { id: "netflix", label: "Netflix", icon: "🔴" },
    { id: "prime", label: "Amazon Prime Video", icon: "💙" },
    { id: "disney", label: "Disney+", icon: "✨" },
    { id: "hulu", label: "Hulu", icon: "💚" },
    { id: "free", label: "Free Streaming (Tubi/Pluto)", icon: "🆓" },
];

const FORMATS = [
    { id: "any", label: "Anything Good" },
    { id: "movie", label: "Full Movie (2h)" },
    { id: "tv", label: "TV Series / Show" },
];

export default function VibeFinderClient() {
    const [selectedVibe, setSelectedVibe] = useState(VIBES[0]);
    const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
    const [selectedFormat, setSelectedFormat] = useState(FORMATS[0]);
    
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [trailerMovie, setTrailerMovie] = useState<any | null>(null);

    const handleFindVibe = async (overrideVibe = selectedVibe) => {
        setLoading(true);
        setHasSearched(true);
        
        try {
            const randomPage = String(Math.floor(Math.random() * 4) + 1);
            const mediaType = selectedFormat.id === "any" ? overrideVibe.type : selectedFormat.id;

            const res = await discoverContentFromServer(mediaType as any, {
                sort_by: "popularity.desc",
                with_genres: overrideVibe.genre,
                language: overrideVibe.lang || "",
                page: randomPage,
                rating_min: "6.5",
            });

            const fetchedResults = res?.results || [];
            if (fetchedResults.length > 0) {
                // Shuffle array to pick 4 distinct top recommendations
                const shuffled = [...fetchedResults].sort(() => 0.5 - Math.random());
                setResults(shuffled.slice(0, 4));
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error("Vibe finder fetch error:", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-12 py-10 px-4 sm:px-6 lg:px-8">
            
            {/* HERO BANNER */}
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-950 to-red-950/40 p-6 sm:p-10 md:p-12 overflow-hidden shadow-2xl text-center space-y-4">
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

                <div className="inline-flex items-center gap-2 rounded-full bg-red-600/20 border border-red-500/30 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-red-400 backdrop-blur-md">
                    <Sparkles size={14} className="animate-pulse" />
                    AI Movie Recommendation Generator
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-tight drop-shadow-xl max-w-4xl mx-auto">
                    What Should You <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-400 to-pink-500">Watch Tonight?</span>
                </h1>

                <p className="text-sm sm:text-base text-neutral-300 font-medium max-w-2xl mx-auto leading-relaxed">
                    Can’t decide what to watch on Netflix, Prime, or Hulu? Pick your mood below and let our AI Vibe Finder match your perfect movie or show in seconds.
                </p>
            </div>

            {/* SELECTION INTERFACE */}
            <div className="rounded-3xl border border-white/10 bg-neutral-900/90 backdrop-blur-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
                
                {/* STEP 1: VIBE SELECTOR */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white">1</span>
                        <h2 className="text-sm sm:text-base font-black uppercase tracking-widest text-white">
                            Choose Your Vibe & Mood:
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {VIBES.map((vibe) => {
                            const isSelected = selectedVibe.id === vibe.id;
                            return (
                                <button
                                    key={vibe.id}
                                    onClick={() => setSelectedVibe(vibe)}
                                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer active:scale-95 flex flex-col justify-between space-y-2 ${
                                        isSelected
                                            ? "bg-red-600 border-red-500 text-white shadow-xl shadow-red-950 scale-[1.02]"
                                            : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:border-white/20"
                                    }`}
                                >
                                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                                        {vibe.label}
                                    </span>
                                    <span className="text-[10px] font-medium opacity-80 line-clamp-2">
                                        {vibe.desc}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* STEP 2: STREAMING PLATFORM & FORMAT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/10">
                    
                    {/* Platform Selector */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white">2</span>
                            <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">
                                Streaming Service:
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {PLATFORMS.map((plat) => (
                                <button
                                    key={plat.id}
                                    onClick={() => setSelectedPlatform(plat)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                                        selectedPlatform.id === plat.id
                                            ? "bg-white text-black border-white font-black shadow-lg"
                                            : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                                    }`}
                                >
                                    {plat.icon} {plat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Format Selector */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white">3</span>
                            <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">
                                Format / Length:
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {FORMATS.map((fmt) => (
                                <button
                                    key={fmt.id}
                                    onClick={() => setSelectedFormat(fmt)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                                        selectedFormat.id === fmt.id
                                            ? "bg-white text-black border-white font-black shadow-lg"
                                            : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                                    }`}
                                >
                                    {fmt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* LAUNCH BUTTON */}
                <div className="pt-4 flex justify-center">
                    <button
                        onClick={() => handleFindVibe()}
                        disabled={loading}
                        className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 text-white text-sm sm:text-base font-black uppercase tracking-widest shadow-2xl shadow-red-950 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                    >
                        <Dices size={22} className={loading ? "animate-spin" : ""} />
                        <span>{loading ? "Matching AI Vibe..." : "FIND MY VIBE NOW 🍿"}</span>
                    </button>
                </div>
            </div>

            {/* RESULTS SECTION */}
            {hasSearched && (
                <div className="space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap className="text-yellow-400" size={24} />
                            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                                Top Recommendations for <span className="text-red-500">{selectedVibe.label}</span>
                            </h2>
                        </div>
                        <button
                            onClick={() => handleFindVibe()}
                            disabled={loading}
                            className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                            Shuffle New Vibe
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 space-y-4">
                            <div className="h-14 w-14 rounded-full border-4 border-red-600/20 border-t-red-600 animate-spin" />
                            <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
                                Analyzing 10,000+ Movies for your vibe...
                            </p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {results.map((item) => {
                                const isTv = item.isMovie === false || Boolean(item.name);
                                const mediaPath = `/${isTv ? "series" : "movies"}/${item.tmdbId || item._id || item.id}`;
                                return (
                                    <div
                                        key={item.id || item.tmdbId}
                                        className="group relative rounded-3xl border border-white/10 bg-neutral-900/90 overflow-hidden shadow-xl flex flex-col justify-between transition-all hover:border-red-500/50 hover:scale-[1.02]"
                                    >
                                        <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-950">
                                            <Image
                                                src={getTmdbImageUrl(item.posterPath || item.poster_path, "w500", item.title || item.name)}
                                                alt={item.title || item.name}
                                                fill
                                                unoptimized
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                                            
                                            {item.vote_average > 0 && (
                                                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-xs font-black text-yellow-400 border border-white/10 backdrop-blur-md">
                                                    <Star size={12} fill="currentColor" />
                                                    {item.vote_average.toFixed(1)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                                            <div className="space-y-1.5">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-600/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                                                    {isTv ? "TV Series" : "Movie"}
                                                </span>
                                                <h3 className="text-base font-black text-white line-clamp-1">
                                                    {item.title || item.name}
                                                </h3>
                                                <p className="text-xs text-neutral-400 font-medium line-clamp-2 leading-relaxed">
                                                    {item.overview || "Match score: 98%. Perfect fit for your selected vibe."}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 pt-2">
                                                <Link
                                                    href={mediaPath}
                                                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-red-950"
                                                >
                                                    <Play size={14} fill="currentColor" />
                                                    Watch Details
                                                </Link>
                                                <button
                                                    onClick={() => setTrailerMovie(item)}
                                                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                                                    title="Quick Trailer"
                                                >
                                                    <Film size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-neutral-400">
                            No titles found for this specific filter combo. Try selecting "All Platforms" above!
                        </div>
                    )}
                </div>
            )}

            {/* SEO FAQ SECTION FOR GOOGLE RANKINGS */}
            <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-xl space-y-6">
                <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-tight">
                    Frequently Asked Questions about AI Movie Recommendations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-neutral-300">
                    <div className="space-y-2">
                        <h3 className="font-bold text-white">How does the AI Movie Vibe Finder work?</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            Our AI Vibe Finder filters over 10,000+ top-rated movies and TV series by mood, runtime, and streaming availability to instantly suggest titles matching your exact current vibe.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-white">Can I filter by streaming services like Netflix & Prime?</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            Yes! You can choose between Netflix, Amazon Prime Video, Disney+, Hulu, or free legal streaming providers like Tubi and Pluto TV.
                        </p>
                    </div>
                </div>
            </div>

            {/* QUICK TRAILER MODAL */}
            {trailerMovie && (
                <QuickTrailerModal
                    movie={trailerMovie}
                    isOpen={Boolean(trailerMovie)}
                    onClose={() => setTrailerMovie(null)}
                />
            )}
        </div>
    );
}
