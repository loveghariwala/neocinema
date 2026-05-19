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
}

export default function StreamPlayer({ tmdbId, imdbId, title, isTv = false, seasons = [], autoPlay = false }: StreamPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [provider, setProvider] = useState(4);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [streamFailed, setStreamFailed] = useState(false);
    const [triedServers, setTriedServers] = useState<number[]>([]);
    const loadTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (autoPlay) {
            setIsPlaying(true);
        }
    }, [autoPlay]);

    // Server order: DELTA first, then others
    const serverOrder = [4, 1, 2, 3, 5];

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
        if (provider === 4) return `https://vidlink.pro/${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}?primaryColor=dc2626`;
        if (provider === 1) return `https://autoembed.co/${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 2) return `https://www.2embed.cc/embed/${tmdbId}`;
        if (provider === 3) return `https://nontongo.win/embed/${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 5) return `https://player.videasy.net/${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        return `https://vidlink.pro/${typePath}/${tmdbId}?primaryColor=dc2626`;
    }, [provider, tmdbId, typePath, isTv, selectedSeason, selectedEpisode]);

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
            const newTried = [...triedServers, provider];
            setTriedServers(newTried);

            // Find next untried server
            const nextServer = serverOrder.find(s => !newTried.includes(s));
            if (nextServer) {
                setProvider(nextServer);
            } else {
                // All servers tried
                setIsLoading(false);
                setStreamFailed(true);
            }
        }, 15000);

        return () => {
            if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
        };
    }, [isPlaying, isLoading, provider, triedServers]);

    const handleRetryAll = useCallback(() => {
        setTriedServers([]);
        setStreamFailed(false);
        setProvider(4);
        setIsLoading(true);
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
                <div className="relative z-[1000] flex flex-col gap-4 bg-neutral-900/95 px-4 py-4 md:px-8 md:py-6 backdrop-blur-3xl border-b border-white/5 md:rounded-t-[2.5rem] lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                    {/* Top Row: Title / Branding (Left) and Close Button Space / Close Button (Right) */}
                    <div className="flex items-center justify-between w-full lg:w-auto pr-14 lg:pr-0">
                        <div className="min-w-0">
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-red-600 block mb-0.5">Streaming Mode</span>
                            <h2 className="text-sm md:text-lg font-black text-white text-glow truncate max-w-[220px] sm:max-w-sm md:max-w-md xl:max-w-xl">
                                {title} {isTv && <span className="text-neutral-500 font-bold ml-2">S{selectedSeason} E{selectedEpisode}</span>}
                            </h2>
                        </div>
                    </div>

                    {/* Bottom Row / Main Controls: Server & Series Selectors */}
                    <div className="flex flex-wrap items-end gap-3 sm:gap-4 w-full lg:w-auto lg:flex-nowrap lg:items-center lg:gap-6 lg:ml-auto">
                        {/* Server Toggle */}
                        <div className="flex flex-col gap-1 flex-grow sm:flex-initial min-w-0">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Select Server</span>
                            <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1 border border-white/10 overflow-x-auto scrollbar-none whitespace-nowrap">
                                {[
                                    { id: 4, name: "DELTA" },
                                    { id: 1, name: "ALPHA" },
                                    { id: 2, name: "BETA" },
                                    { id: 3, name: "GAMMA" },
                                    { id: 5, name: "EPSILON" }
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setProvider(p.id)}
                                        className={`rounded-lg px-2 py-1.5 sm:px-3 text-[9px] font-black transition-all ${provider === p.id
                                                ? "bg-red-600 text-white shadow-lg shadow-red-600/40"
                                                : "text-neutral-500 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>

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
                                    TRYING SERVER {serverOrder.indexOf(provider) + 1} OF {serverOrder.length}. AUTO-SWITCHING IF UNAVAILABLE...
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
            </div>
        </div>
    );

    return createPortal(playerUI, document.body);
}
