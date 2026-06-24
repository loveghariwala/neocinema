"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Play, X, ChevronDown, Monitor, Layers, AlertCircle, RefreshCw } from "lucide-react";
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
    autoPlay?: boolean;
    initialSeason?: number;
    initialEpisode?: number;
}
const SERVERS = [
    { name: "NEO 1", providerId: 1 },
    { name: "NEO 2", providerId: 2 },
    { name: "NEO 3", providerId: 3 },
    { name: "NEO 4", providerId: 4 },
    { name: "NEO 5", providerId: 5 },
    { name: "NEO 6", providerId: 6 },
    { name: "NEO 7", providerId: 7 },
    { name: "NEO 8", providerId: 8 },
    { name: "NEO 9", providerId: 9 },
    { name: "NEO 10", providerId: 10 },
    { name: "NEO 11", providerId: 11 },
    { name: "NEO 12", providerId: 12 },
    { name: "NEO 13", providerId: 13 },
    { name: "NEO 14", providerId: 14 },
    { name: "NEO 15", providerId: 15 },
    { name: "NEO 16", providerId: 16 },
    { name: "NEO 17", providerId: 17 },
    { name: "NEO 18", providerId: 18 },
    { name: "NEO 19", providerId: 19 },
    { name: "NEO 20", providerId: 20 },
    { name: "NEO 21", providerId: 21 },
    { name: "NEO 22", providerId: 22 },
    { name: "NEO 23", providerId: 23 },
    { name: "NEO 24", providerId: 24 },
];

export default function StreamPlayer({
    tmdbId,
    imdbId,
    title,
    isTv = false,
    seasons = [],
    autoPlay = false,
    initialSeason = 1,
    initialEpisode = 1
}: StreamPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedServerIndex, setSelectedServerIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [streamFailed, setStreamFailed] = useState(false);
    const [triedServerIndices, setTriedServerIndices] = useState<number[]>([]);
    const loadTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (autoPlay) {
            setIsPlaying(true);
        }
    }, [autoPlay]);

    // Series state
    const [selectedSeason, setSelectedSeason] = useState(initialSeason);
    const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);
    const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
    const [showEpisodeDropdown, setShowEpisodeDropdown] = useState(false);

    useEffect(() => {
        setSelectedSeason(initialSeason);
        setSelectedEpisode(initialEpisode);
    }, [initialSeason, initialEpisode]);

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
        const provider = SERVERS[selectedServerIndex]?.providerId ?? 1;
        // Base64 encoded domains to prevent DMCA bots from scanning the Vercel source code
        if (provider === 1) return `${atob("aHR0cHM6Ly92aWRzcmMubWUvZW1iZWQv")}${typePath}?tmdb=${tmdbId}${isTv ? `&season=${selectedSeason}&episode=${selectedEpisode}` : ""}`;
        if (provider === 2) return `${atob("aHR0cHM6Ly92aWRuZXN0LmZ1bi9lbWJlZC8=")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 3) return `${atob("aHR0cHM6Ly92aWRzcmMudG8vZW1iZWQv")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 4) return `${atob("aHR0cHM6Ly9wbGF5ZXIudmlkZWFzeS5uZXQv")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 5) return `${atob("aHR0cHM6Ly9lbWJlZC5zbWFzaHlzdHJlYW0uY29tL3BsYXllcmUucGhwP3RtZGI9")}${tmdbId}${isTv ? `&season=${selectedSeason}&episode=${selectedEpisode}` : ""}`;
        if (provider === 6) return `${atob("aHR0cHM6Ly92aWRsaW5rLnByby8=")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}?primaryColor=dc2626`;
        if (provider === 7) return `${atob("aHR0cHM6Ly92aWRzcmMuY2MvdjIvZW1iZWQv")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 8) return `${atob("aHR0cHM6Ly93d3cuMmVtYmVkLmNjL2VtYmVkLw==")}${tmdbId}`;
        if (provider === 9) return `${atob("aHR0cHM6Ly92aWRzcmMuaW4vZW1iZWQv")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 10) return `${atob("aHR0cHM6Ly9hdXRvZW1iZWQuY28v")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 11) return `${atob("aHR0cHM6Ly9ub250b25nby53aW4vZW1iZWQv")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 12) return `${atob("aHR0cHM6Ly9tb3ZpZXNhcGkuY2x1Yi8=")}${typePath}/${tmdbId}${isTv ? `-${selectedSeason}-${selectedEpisode}` : ""}`;
        if (provider === 13) return `${atob("aHR0cHM6Ly92aWRzcmMucG0vZW1iZWQv")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 14) return `${atob("aHR0cHM6Ly92aWRzcmMudmlwL2VtYmVkLw==")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 15) return `${atob("aHR0cHM6Ly92aWRzcmMueHl6L2VtYmVkLw==")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 16) return `${atob("aHR0cHM6Ly92aWRzcmMucHJvL2VtYmVkLw==")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 17) return `${atob("aHR0cHM6Ly9wbGF5ZXIuY2luZXByby5wcm8vZW1iZWQv")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 18) return `${atob("aHR0cHM6Ly9mbW92aWVzLnBzL2VtYmVkLw==")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 19) return `${atob("aHR0cHM6Ly92aWRib3gudG8vZW1iZWQv")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 20) return `${atob("aHR0cHM6Ly9hcGkuZmxpeGhxLnRvL2VtYmVkLw==")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 21) return `${atob("aHR0cHM6Ly9ibGFja3ZpZC5zcGFjZS9lbWJlZD90bWRiPQ==")}${tmdbId}${isTv ? `&season=${selectedSeason}&episode=${selectedEpisode}` : ""}`;
        if (provider === 22) return `${atob("aHR0cHM6Ly9tb3ZpZWhkLnByby9lbWJlZC8=")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 23) return `${atob("aHR0cHM6Ly9wbGF5LmZsaXhoZC5jYy9lbWJlZC8=")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 24) return `${atob("aHR0cHM6Ly9tb3ZpZXMudmlwL2VtYmVkLw==")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        
        return `${atob("aHR0cHM6Ly9wbGF5ZXIudmlkZWFzeS5uZXQv")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
    }, [selectedServerIndex, tmdbId, typePath, isTv, selectedSeason, selectedEpisode]);

    // Reset loading state when stream changes
    useEffect(() => {
        setIsLoading(true);
        setStreamFailed(false);
    }, [streamUrl]);

    // Auto-try next server after 15 seconds of loading
    useEffect(() => {
        if (!isPlaying || !isLoading) {
            if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
            return;
        }

        loadTimerRef.current = setTimeout(() => {
            const newTried = [...triedServerIndices, selectedServerIndex];
            setTriedServerIndices(newTried);

            // Find next untried server index
            const nextServerIndex = SERVERS.findIndex((_, idx) => !newTried.includes(idx));
            if (nextServerIndex !== -1) {
                setSelectedServerIndex(nextServerIndex);
            } else {
                // All servers tried
                setIsLoading(false);
                setStreamFailed(true);
            }
        }, 15000);

        return () => {
            if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
        };
    }, [isPlaying, isLoading, selectedServerIndex, triedServerIndices]);

    const handleRetryAll = useCallback(() => {
        setTriedServerIndices([]);
        setStreamFailed(false);
        setSelectedServerIndex(0);
        setIsLoading(true);
    }, []);

    const handleServerChange = useCallback((index: number) => {
        setSelectedServerIndex(index);
        setIsLoading(true);
        setStreamFailed(false);
        setTriedServerIndices([]);
    }, []);

    if (!isPlaying) {
        return (
            <button
                onClick={() => setIsPlaying(true)}
                className="flex items-center gap-2 sm:gap-3 rounded-full bg-red-600 px-6 py-3.5 sm:px-8 sm:py-4 md:px-10 md:py-5 font-black text-white transition-all hover:scale-105 hover:bg-red-700 hover:red-glow group shadow-[0_0_30px_rgba(220,38,38,0.4)]"
            >
                <div className="rounded-full bg-white/20 p-1 group-hover:bg-white/40 transition-colors">
                    <Play fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </div>
                <span className="text-sm sm:text-base md:text-lg tracking-tight text-white">WATCH NOW</span>
            </button>
        );
    }

    if (!mounted) return null;

    const playerUI = (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500">
            {/* Global Close Button (Always on Top) */}
            <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-4 right-4 md:top-8 md:right-8 z-[100001] rounded-full bg-white/10 p-2 md:p-3 text-white transition-all hover:bg-red-600 hover:rotate-90 border border-white/20 backdrop-blur-md shadow-2xl group"
            >
                <X className="h-5 w-5 md:h-8 md:w-8 transition-transform group-hover:scale-110" />
            </button>

            <div className="relative w-full h-full md:max-w-[90vw] md:max-h-[85vh] md:rounded-[2.5rem] border-0 md:border md:border-white/10 bg-neutral-950 shadow-[0_0_150px_rgba(220,38,38,0.25)] flex flex-col overflow-visible">

                {/* ─── Top Bar ────────────────────────────────────────── */}
                <div className="relative z-[1000] flex flex-col gap-4 bg-black/95 px-4 py-4 md:px-8 md:py-6 backdrop-blur-3xl border-b border-white/5 md:rounded-t-[2.5rem] lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                    {/* Top Row: Title / Branding (Left) and Close Button Space / Close Button (Right) */}
                    <div className="flex items-center justify-between w-full lg:w-auto pr-14 lg:pr-0">
                        <div className="min-w-0">
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-red-600 block mb-0.5">Streaming Mode</span>
                            <h2 className="text-sm md:text-lg font-black text-white text-glow truncate max-w-[220px] sm:max-w-sm md:max-w-md xl:max-w-xl">
                                {title} {isTv && <span className="text-neutral-500 font-bold ml-2">S{selectedSeason} E{selectedEpisode}</span>}
                            </h2>
                        </div>
                    </div>

                    {/* Bottom Row / Main Controls: Series Selectors */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto lg:ml-auto">
                        {/* Series Selectors */}
                        {isTv && activeSeasons.length > 0 && (
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                {/* Season Selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowSeasonDropdown(!showSeasonDropdown);
                                            setShowEpisodeDropdown(false);
                                        }}
                                        className={`flex items-center gap-1.5 sm:gap-2.5 rounded-xl px-3 py-2 text-[9px] sm:text-xs font-black text-white border transition-all ${showSeasonDropdown
                                            ? "bg-red-600 border-red-500 ring-2 ring-red-600/20"
                                            : "bg-white/5 border-white/10 hover:bg-white/10"
                                            }`}
                                    >
                                        <Layers size={12} className={showSeasonDropdown ? "text-white" : "text-red-600"} />
                                        <span className="opacity-70">S</span>{selectedSeason}
                                        <ChevronDown size={12} className={`transition-transform duration-300 ${showSeasonDropdown ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showSeasonDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-0 mt-2 z-[1100] max-h-56 w-40 overflow-y-auto rounded-xl border border-white/10 bg-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl p-1.5 custom-scrollbar"
                                            >
                                                {activeSeasons.map((s) => (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => {
                                                            setSelectedSeason(s.season_number);
                                                            setSelectedEpisode(1);
                                                            setShowSeasonDropdown(false);
                                                        }}
                                                        className={`w-full rounded-lg px-3 py-2 text-left text-[11px] font-bold transition-all mb-1 last:mb-0 ${selectedSeason === s.season_number
                                                            ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                                                            : "text-neutral-400 hover:bg-white/10 hover:text-white"
                                                            }`}
                                                    >
                                                        Season {s.season_number}
                                                        <span className="block text-[9px] opacity-60 font-medium">{s.episode_count} Episodes</span>
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
                                        className={`flex items-center gap-1.5 sm:gap-2.5 rounded-xl px-3 py-2 text-[9px] sm:text-xs font-black text-white border transition-all ${showEpisodeDropdown
                                            ? "bg-red-600 border-red-500 ring-2 ring-red-600/20"
                                            : "bg-white/5 border-white/10 hover:bg-white/10"
                                            }`}
                                    >
                                        <Monitor size={12} className={showEpisodeDropdown ? "text-white" : "text-red-600"} />
                                        <span className="opacity-70">E</span>{selectedEpisode}
                                        <ChevronDown size={12} className={`transition-transform duration-300 ${showEpisodeDropdown ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showEpisodeDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-0 mt-2 z-[1100] max-h-56 w-56 overflow-y-auto rounded-xl border border-white/10 bg-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl p-2 custom-scrollbar"
                                            >
                                                <div className="grid grid-cols-4 gap-1.5">
                                                    {Array.from({ length: currentSeasonData?.episode_count || 1 }, (_, i) => i + 1).map((e) => (
                                                        <button
                                                            key={e}
                                                            onClick={() => {
                                                                setSelectedEpisode(e);
                                                                setShowEpisodeDropdown(false);
                                                            }}
                                                            className={`rounded-lg h-8 flex items-center justify-center text-[10px] font-black transition-all ${selectedEpisode === e
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
                <div className="relative flex-grow bg-black overflow-hidden">
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-neutral-950 z-20">
                            <div className="relative h-24 w-24">
                                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                                <div className="absolute inset-0 rounded-full border-t-4 border-red-600 animate-spin" />
                                <div className="absolute inset-4 rounded-full border-b-2 border-red-500/30 animate-pulse" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-black text-white tracking-[0.3em] uppercase mb-2">Establishing Stream</h3>
                                <p className="text-xs text-neutral-500 font-bold max-w-sm mx-auto leading-relaxed">
                                    TRYING SERVER: {SERVERS[selectedServerIndex]?.name || "UNKNOWN"} ({Math.min(selectedServerIndex + 1, SERVERS.length)} OF {SERVERS.length}). AUTO-SWITCHING IF UNAVAILABLE...
                                </p>
                            </div>
                        </div>
                    )}

                    {streamFailed && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-neutral-950 z-30">
                            <div className="rounded-full bg-red-600/10 p-6 border border-red-600/20">
                                <AlertCircle size={48} className="text-red-500" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-black text-white tracking-tight mb-3">Content Unavailable</h3>
                                <p className="text-sm text-neutral-400 font-medium max-w-sm mx-auto leading-relaxed mb-6">
                                    This title is not available on any of our streaming servers right now. This usually happens with lesser-known or region-restricted content.
                                </p>
                                <button
                                    onClick={handleRetryAll}
                                    className="flex items-center gap-2 mx-auto rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white transition-all hover:bg-red-700 hover:scale-105"
                                >
                                    <RefreshCw size={16} />
                                    RETRY ALL SERVERS
                                </button>
                            </div>
                        </div>
                    )}

                    <iframe
                        key={streamUrl}
                        src={streamUrl}
                        className="h-full w-full border-none shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        allowFullScreen
                        referrerPolicy="no-referrer"
                        allow="autoplay; encrypted-media"
                        onLoad={() => {
                            setIsLoading(false);
                            setStreamFailed(false);
                        }}
                    />

                    {/* Server Help Hint */}
                    {!isLoading && !streamFailed && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full bg-black/60 px-6 py-2.5 backdrop-blur-md border border-white/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <AlertCircle size={14} className="text-red-500" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Tip: Switch servers if the stream doesn&apos;t start</span>
                        </div>
                    )}
                </div>

                {/* ─── Bottom Server Bar ─────────────────────────────── */}
                <div className="bg-black/95 border-t border-white/5 px-6 py-4 md:px-8 md:py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 md:rounded-b-[2.5rem] select-none">
                    <div className="flex-shrink-0">
                        <span className="text-sm md:text-base font-black text-red-300 uppercase tracking-wider">
                            HD SERVER
                        </span>
                    </div>
                    <div className="flex flex-col gap-2 flex-grow">
                        <div className="flex flex-wrap gap-2">
                            {SERVERS.slice(0, 8).map((server, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleServerChange(idx)}
                                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded text-[10px] md:text-[11px] font-black uppercase transition-all tracking-wider border-b-[3px] cursor-pointer ${selectedServerIndex === idx
                                        ? "bg-[#0090d0] text-white border-[#006090] shadow-lg shadow-sky-900/30 translate-y-0 active:translate-y-[2px] active:border-b-0"
                                        : "bg-[#555] hover:bg-[#606060] text-white border-[#333] active:translate-y-[2px] active:border-b-0"
                                        }`}
                                >
                                    {server.name}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {SERVERS.slice(8, 15).map((server, idx) => {
                                const realIdx = idx + 8;
                                return (
                                    <button
                                        key={realIdx}
                                        onClick={() => handleServerChange(realIdx)}
                                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded text-[10px] md:text-[11px] font-black uppercase transition-all tracking-wider border-b-[3px] cursor-pointer ${selectedServerIndex === realIdx
                                            ? "bg-[#0090d0] text-white border-[#006090] shadow-lg shadow-sky-900/30 translate-y-0 active:translate-y-[2px] active:border-b-0"
                                            : "bg-[#555] hover:bg-[#606060] text-white border-[#333] active:translate-y-[2px] active:border-b-0"
                                            }`}
                                    >
                                        {server.name}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {SERVERS.slice(15, 22).map((server, idx) => {
                                const realIdx = idx + 15;
                                return (
                                    <button
                                        key={realIdx}
                                        onClick={() => handleServerChange(realIdx)}
                                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded text-[10px] md:text-[11px] font-black uppercase transition-all tracking-wider border-b-[3px] cursor-pointer ${selectedServerIndex === realIdx
                                            ? "bg-[#0090d0] text-white border-[#006090] shadow-lg shadow-sky-900/30 translate-y-0 active:translate-y-[2px] active:border-b-0"
                                            : "bg-[#555] hover:bg-[#606060] text-white border-[#333] active:translate-y-[2px] active:border-b-0"
                                            }`}
                                    >
                                        {server.name}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {SERVERS.slice(22, 24).map((server, idx) => {
                                const realIdx = idx + 22;
                                return (
                                    <button
                                        key={realIdx}
                                        onClick={() => handleServerChange(realIdx)}
                                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded text-[10px] md:text-[11px] font-black uppercase transition-all tracking-wider border-b-[3px] cursor-pointer ${selectedServerIndex === realIdx
                                            ? "bg-[#0090d0] text-white border-[#006090] shadow-lg shadow-sky-900/30 translate-y-0 active:translate-y-[2px] active:border-b-0"
                                            : "bg-[#555] hover:bg-[#606060] text-white border-[#333] active:translate-y-[2px] active:border-b-0"
                                            }`}
                                    >
                                        {server.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(playerUI, document.body);
}
