"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Play, X, ChevronDown, Monitor, Layers, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Season {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
}

interface StreamPlayerProps {
    tmdbId: number;
    imdbId?: string;
    title: string;
    isTv?: boolean;
    seasons?: Season[];
}

export default function StreamPlayer({ tmdbId, imdbId, title, isTv = false, seasons = [] }: StreamPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [provider, setProvider] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    // Series state
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [selectedEpisode, setSelectedEpisode] = useState(1);
    const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
    const [showEpisodeDropdown, setShowEpisodeDropdown] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Filter out specials (season 0) if any, unless user wants them
    const activeSeasons = useMemo(() =>
        seasons.filter(s => s.season_number > 0)
        , [seasons]);

    const currentSeasonData = useMemo(() =>
        activeSeasons.find(s => s.season_number === selectedSeason) || activeSeasons[0]
        , [activeSeasons, selectedSeason]);

    const typePath = isTv ? "tv" : "movie";

    const streamUrl = useMemo(() => {
        const id = imdbId || tmdbId;
        if (provider === 1) return `https://vidsrc.pm/embed/${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 2) return `https://vidsrc.xyz/embed/${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 3) return `https://embed.su/embed/${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 4) return `https://vidlink.pro/${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}?primaryColor=dc2626`;
        if (provider === 5) return `https://autoembed.cc/embed/${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        return `https://vidsrc.pm/embed/${typePath}/${tmdbId}`;
    }, [provider, tmdbId, imdbId, isTv, selectedSeason, selectedEpisode]);

    // Reset loading state when stream changes
    useEffect(() => {
        setIsLoading(true);
    }, [streamUrl]);

    if (!isPlaying) {
        return (
            <button
                onClick={() => setIsPlaying(true)}
                className="flex items-center gap-3 rounded-full bg-red-600 px-10 py-5 font-black text-white transition-all hover:scale-105 hover:bg-red-700 hover:red-glow group shadow-[0_0_30px_rgba(220,38,38,0.4)]"
            >
                <div className="rounded-full bg-white/20 p-1 group-hover:bg-white/40 transition-colors">
                    <Play fill="currentColor" size={24} />
                </div>
                <span className="text-lg tracking-tight">WATCH NOW</span>
            </button>
        );
    }

    if (!mounted) return null;

    const playerUI = (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500">
            {/* Global Close Button (Always on Top) */}
            <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-4 right-4 md:top-8 md:right-8 z-[100001] rounded-full bg-white/10 p-3 text-white transition-all hover:bg-red-600 hover:rotate-90 border border-white/20 backdrop-blur-md shadow-2xl group"
            >
                <X size={32} className="transition-transform group-hover:scale-110" />
            </button>

            <div className="relative w-full h-full md:max-w-[90vw] md:max-h-[85vh] md:rounded-[2.5rem] border-0 md:border md:border-white/10 bg-neutral-950 shadow-[0_0_150px_rgba(220,38,38,0.25)] flex flex-col overflow-visible">
                
                {/* ─── Top Bar ────────────────────────────────────────── */}
                <div className="relative z-[1000] flex items-center justify-between bg-neutral-900/95 px-4 py-4 md:px-8 md:py-6 backdrop-blur-3xl border-b border-white/5 md:rounded-t-[2.5rem]">
                    <div className="flex items-center gap-4 md:gap-10 w-full">
                        {/* Info Section */}
                        <div className="hidden lg:block min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 block mb-1">Streaming Mode</span>
                            <h2 className="text-base md:text-lg font-black text-white text-glow truncate max-w-[200px] xl:max-w-md">
                                {title} {isTv && <span className="text-neutral-500 font-bold ml-2">S{selectedSeason} E{selectedEpisode}</span>}
                            </h2>
                        </div>
                        
                        <div className="h-10 w-px bg-white/10 hidden lg:block flex-shrink-0" />

                        {/* Server Toggle */}
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest text-center hidden sm:block">Select Server</span>
                                <div className="flex items-center gap-1.5 rounded-xl bg-white/5 p-1 border border-white/10">
                                    {[
                                        { id: 1, name: "ALPHA" },
                                        { id: 2, name: "BETA" },
                                        { id: 3, name: "GAMMA" },
                                        { id: 4, name: "DELTA" },
                                        { id: 5, name: "EPSILON" }
                                    ].map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => setProvider(p.id)}
                                            className={`rounded-lg px-3 py-1.5 text-[9px] font-black transition-all ${
                                                provider === p.id 
                                                    ? "bg-red-600 text-white shadow-lg shadow-red-600/40" 
                                                    : "text-neutral-500 hover:text-white hover:bg-white/5"
                                            }`}
                                        >
                                            {p.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Info (only shows title briefly) */}
                            <div className="lg:hidden">
                                <h2 className="text-xs font-black text-white truncate max-w-[100px]">
                                    {title}
                                </h2>
                            </div>
                        </div>

                        {/* Series Selectors */}
                        {isTv && activeSeasons.length > 0 && (
                            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                                {/* Season Selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowSeasonDropdown(!showSeasonDropdown);
                                            setShowEpisodeDropdown(false);
                                        }}
                                        className={`flex items-center gap-2 sm:gap-3 rounded-2xl px-3 py-2 md:px-5 md:py-3 text-[10px] md:text-xs font-black text-white border transition-all shadow-xl ${
                                            showSeasonDropdown 
                                                ? "bg-red-600 border-red-500 ring-4 ring-red-600/20" 
                                                : "bg-white/5 border-white/10 hover:bg-white/10"
                                        }`}
                                    >
                                        <Layers size={16} className={showSeasonDropdown ? "text-white" : "text-red-600"} />
                                        <span className="hidden sm:inline opacity-70">SEASON</span> {selectedSeason}
                                        <ChevronDown size={16} className={`transition-transform duration-300 ${showSeasonDropdown ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showSeasonDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full right-0 mt-2 z-[1100] max-h-72 w-48 overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl p-2 custom-scrollbar"
                                            >
                                                {activeSeasons.map((s) => (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => {
                                                            setSelectedSeason(s.season_number);
                                                            setSelectedEpisode(1);
                                                            setShowSeasonDropdown(false);
                                                        }}
                                                        className={`w-full rounded-xl px-4 py-3 text-left text-xs font-bold transition-all mb-1 last:mb-0 ${selectedSeason === s.season_number
                                                            ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                                                            : "text-neutral-400 hover:bg-white/10 hover:text-white"
                                                            }`}
                                                    >
                                                        Season {s.season_number}
                                                        <span className="block text-[10px] opacity-60 font-medium">{s.episode_count} Episodes</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Episode Selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowEpisodeDropdown(!showEpisodeDropdown);
                                            setShowSeasonDropdown(false);
                                        }}
                                        className={`flex items-center gap-2 sm:gap-3 rounded-2xl px-3 py-2 md:px-5 md:py-3 text-[10px] md:text-xs font-black text-white border transition-all shadow-xl ${
                                            showEpisodeDropdown 
                                                ? "bg-red-600 border-red-500 ring-4 ring-red-600/20" 
                                                : "bg-white/5 border-white/10 hover:bg-white/10"
                                        }`}
                                    >
                                        <Monitor size={16} className={showEpisodeDropdown ? "text-white" : "text-red-600"} />
                                        <span className="hidden sm:inline opacity-70">EPISODE</span> {selectedEpisode}
                                        <ChevronDown size={16} className={`transition-transform duration-300 ${showEpisodeDropdown ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showEpisodeDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full right-0 mt-2 z-[1100] max-h-72 w-64 overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl p-3 custom-scrollbar"
                                            >
                                                <div className="grid grid-cols-4 gap-2">
                                                    {Array.from({ length: currentSeasonData?.episode_count || 1 }, (_, i) => i + 1).map((e) => (
                                                        <button
                                                            key={e}
                                                            onClick={() => {
                                                                setSelectedEpisode(e);
                                                                setShowEpisodeDropdown(false);
                                                            }}
                                                            className={`rounded-xl h-10 flex items-center justify-center text-xs font-black transition-all ${selectedEpisode === e
                                                                ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                                                                : "text-neutral-500 hover:bg-white/10 hover:text-white"
                                                                }`}
                                                        >
                                                            {e}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── Iframe Container ─────────────────────────────── */}
                <div className="relative flex-grow bg-black md:rounded-b-[2.5rem] overflow-hidden">
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-neutral-950 z-20">
                            <div className="relative h-24 w-24">
                                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                                <div className="absolute inset-0 rounded-full border-t-4 border-red-600 animate-spin" />
                                <div className="absolute inset-4 rounded-full border-b-2 border-red-500/30 animate-pulse" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-black text-white tracking-[0.3em] uppercase mb-2">Establishing Stream</h3>
                                <p className="text-xs text-neutral-500 font-bold max-w-xs mx-auto leading-relaxed">
                                    PLEASE WAIT WHILE WE INITIALIZE THE SERVER. IF LOADING TAKES TOO LONG, TRY SWITCHING SERVERS.
                                </p>
                            </div>
                        </div>
                    )}

                    <iframe
                        key={streamUrl}
                        src={streamUrl}
                        className="h-full w-full border-none shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        allowFullScreen
                        referrerPolicy="origin"
                        allow="autoplay; encrypted-media"
                        onLoad={() => setIsLoading(false)}
                    />

                    {/* Server Help Hint */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full bg-black/60 px-6 py-2.5 backdrop-blur-md border border-white/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <AlertCircle size={14} className="text-red-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Tip: Switch servers if the stream doesn't start</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(playerUI, document.body);
}
