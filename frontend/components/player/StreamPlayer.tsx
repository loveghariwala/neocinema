"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Play from "lucide-react/dist/esm/icons/play";
import X from "lucide-react/dist/esm/icons/x";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down";
import Monitor from "lucide-react/dist/esm/icons/monitor";
import Layers from "lucide-react/dist/esm/icons/layers";
import AlertCircle from "lucide-react/dist/esm/icons/alert-circle";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw";



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
    { name: "OMEGA", providerId: 11 },
    { name: "ALPHA", providerId: 1 },
    { name: "GAMMA", providerId: 3 },
    { name: "DELTA", providerId: 4 },
    { name: "EPSILON", providerId: 5 },
    { name: "ZETA", providerId: 6 },
    { name: "ETA", providerId: 7 },
    { name: "THETA", providerId: 8 },
    { name: "IOTA", providerId: 9 },
    { name: "KAPPA", providerId: 10 },
    { name: "LAMBDA", providerId: 12 },
    { name: "MU", providerId: 13 },
    { name: "NU", providerId: 14 },
    { name: "XI", providerId: 15 },
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
    const [hasClickedAd, setHasClickedAd] = useState(false);
    const loadTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (autoPlay) {
            setIsPlaying(true);

            // Hide ?play=true from the URL bar for a cleaner look
            if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                if (url.searchParams.has("play")) {
                    url.searchParams.delete("play");
                    window.history.replaceState({}, document.title, url.pathname + url.search);
                }
            }
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
        if (provider === 1) return `${atob("aHR0cHM6Ly9wbGF5ZXIudmlkZWFzeS5uZXQv")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 3) return `${atob("aHR0cHM6Ly92aWRsaW5rLnByby8=")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}?primaryColor=dc2626`;
        if (provider === 4) return `${atob("aHR0cHM6Ly9hdXRvZW1iZWQuY28v")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 5) return `${atob("aHR0cHM6Ly93d3cuMmVtYmVkLmNjL2VtYmVkLw==")}${tmdbId}`;
        if (provider === 6) return `${atob("aHR0cHM6Ly9ub250b25nby53aW4vZW1iZWQv")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 7) return `${atob("aHR0cHM6Ly92aWRzcmMuY2MvdjIvZW1iZWQv")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 8) return `${atob("aHR0cHM6Ly9tb3ZpZXNhcGkuY2x1Yi8=")}${typePath}/${tmdbId}${isTv ? `-${selectedSeason}-${selectedEpisode}` : ""}`;
        if (provider === 9) return `${atob("aHR0cHM6Ly92aWRzcmMubWUvZW1iZWQv")}${typePath}?tmdb=${tmdbId}${isTv ? `&season=${selectedSeason}&episode=${selectedEpisode}` : ""}`;
        if (provider === 10) return `${atob("aHR0cHM6Ly92aWRzcmMuaW4vZW1iZWQv")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 11) return `${atob("aHR0cHM6Ly92aWRuZXN0LmZ1bi8=")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 12) return `${atob("aHR0cHM6Ly92aWRuZXN0LmZ1bi8=")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}?server=gama`;
        if (provider === 13) return `${atob("aHR0cHM6Ly92aWRuZXN0LmZ1bi8=")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}?server=alfa`;
        if (provider === 14) return `${atob("aHR0cHM6Ly92aWRuZXN0LmZ1bi8=")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}?server=lamda`;
        if (provider === 15) return `${atob("aHR0cHM6Ly92aWRuZXN0LmZ1bi8=")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}?server=sigma`;
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

    const handleInitialPlay = () => {
        if (!hasClickedAd) {
            // Check if it is a mobile device
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            // Adsterra Smart Link Integration (Popunder) - Desktop Only
            if (!isMobile) {
                window.open("https://www.effectivecpmnetwork.com/khge4vq0f?key=0bc9ee47ad5de40ae42fce1eae3506e2", "_blank");
            }
            setHasClickedAd(true);
        }
        setIsPlaying(true);
    };

    if (!isPlaying) {
        return (
            <button
                onClick={handleInitialPlay}
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
            <div className="relative w-full h-full md:max-w-[98vw] md:max-h-[96vh] md:rounded-[2rem] border-0 md:border md:border-white/10 bg-neutral-950 shadow-[0_0_150px_rgba(220,38,38,0.25)] flex flex-col overflow-hidden">
                {/* ─── Top Bar ────────────────────────────────────────── */}
                <div className="relative z-[1000] flex flex-wrap items-center justify-between gap-2 sm:gap-4 bg-black/95 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3.5 backdrop-blur-3xl border-b border-white/5 md:rounded-t-[2.5rem]">
                    {/* Left: Title / Branding */}
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-red-600 block mb-0.5">Streaming Mode</span>
                        <h2 className="text-[11px] sm:text-sm md:text-base font-black text-white text-glow truncate">
                            {title} {isTv && <span className="text-neutral-400 font-bold ml-1 sm:ml-2">S{selectedSeason} E{selectedEpisode}</span>}
                        </h2>
                    </div>

                    {/* Close Button — always visible top-right on mobile */}
                    <button
                        onClick={() => setIsPlaying(false)}
                        className="rounded-full bg-white/10 p-2 sm:p-1.5 md:p-2 text-white transition-all hover:bg-red-600 hover:rotate-90 border border-white/20 backdrop-blur-md group flex-shrink-0 order-last sm:order-none touch-manipulation"
                    >
                        <X className="h-5 w-5 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
                    </button>

                    {/* Series Selectors — full width row on mobile, inline on larger */}
                    {isTv && activeSeasons.length > 0 && (
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto order-last sm:order-none flex-shrink-0">
                            {/* Season Selector */}
                            <div className="relative flex-1 sm:flex-initial">
                                <button
                                    onClick={() => {
                                        setShowSeasonDropdown(!showSeasonDropdown);
                                        setShowEpisodeDropdown(false);
                                    }}
                                    className={`flex items-center justify-center gap-1.5 sm:gap-2.5 rounded-xl w-full sm:w-auto px-3 py-2.5 sm:py-2 text-[10px] sm:text-xs font-black text-white border transition-all touch-manipulation ${showSeasonDropdown
                                        ? "bg-red-600 border-red-500 ring-2 ring-red-600/20"
                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                        }`}
                                >
                                    <Layers size={14} className={`sm:w-3 sm:h-3 ${showSeasonDropdown ? "text-white" : "text-red-600"}`} />
                                    <span className="opacity-70">S</span>{selectedSeason}
                                    <ChevronDown size={12} className={`transition-transform duration-300 ${showSeasonDropdown ? "rotate-180" : ""}`} />
                                </button>

                                <>
                                    {showSeasonDropdown && (
                                        <div
                                            className="absolute top-full left-0 right-0 sm:right-auto mt-2 z-[1100] max-h-56 sm:w-40 overflow-y-auto rounded-xl border border-white/10 bg-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl p-1.5"
                                        >
                                            {activeSeasons.map((s) => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => {
                                                        setSelectedSeason(s.season_number);
                                                        setSelectedEpisode(1);
                                                        setShowSeasonDropdown(false);
                                                    }}
                                                    className={`w-full rounded-lg px-3 py-2.5 sm:py-2 text-left text-xs sm:text-[11px] font-bold transition-all mb-1 last:mb-0 touch-manipulation ${selectedSeason === s.season_number
                                                        ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                                                        : "text-neutral-400 hover:bg-white/10 hover:text-white"
                                                        }`}
                                                >
                                                    Season {s.season_number}
                                                    <span className="block text-[9px] text-neutral-300 font-medium">{s.episode_count} Episodes</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            </div>

                            {/* Episode Selector */}
                            <div className="relative flex-1 sm:flex-initial">
                                <button
                                    onClick={() => {
                                        setShowEpisodeDropdown(!showEpisodeDropdown);
                                        setShowSeasonDropdown(false);
                                    }}
                                    className={`flex items-center justify-center gap-1.5 sm:gap-2.5 rounded-xl w-full sm:w-auto px-3 py-2.5 sm:py-2 text-[10px] sm:text-xs font-black text-white border transition-all touch-manipulation ${showEpisodeDropdown
                                        ? "bg-red-600 border-red-500 ring-2 ring-red-600/20"
                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                        }`}
                                >
                                    <Monitor size={14} className={`sm:w-3 sm:h-3 ${showEpisodeDropdown ? "text-white" : "text-red-600"}`} />
                                    <span className="opacity-70">E</span>{selectedEpisode}
                                    <ChevronDown size={12} className={`transition-transform duration-300 ${showEpisodeDropdown ? "rotate-180" : ""}`} />
                                </button>

                                <>
                                    {showEpisodeDropdown && (
                                        <div
                                            className="absolute top-full right-0 left-0 sm:left-auto sm:right-0 mt-2 z-[1100] max-h-56 sm:w-56 overflow-y-auto rounded-xl border border-white/10 bg-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl p-2"
                                        >
                                            <div className="grid grid-cols-5 sm:grid-cols-4 gap-1.5">
                                                {Array.from({ length: currentSeasonData?.episode_count || 1 }, (_, i) => i + 1).map((e) => (
                                                    <button
                                                        key={e}
                                                        onClick={() => {
                                                            setSelectedEpisode(e);
                                                            setShowEpisodeDropdown(false);
                                                        }}
                                                        className={`rounded-lg h-9 sm:h-8 flex items-center justify-center text-[11px] sm:text-[10px] font-black transition-all touch-manipulation ${selectedEpisode === e
                                                            ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                                                            : "text-neutral-500 hover:bg-white/10 hover:text-white"
                                                            }`}
                                                    >
                                                        {e}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── Iframe Container ─────────────────────────────── */}
                <div className="relative flex-grow bg-black overflow-hidden min-h-[40vh] sm:min-h-0">
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-neutral-950 z-20">
                            <div className="relative h-24 w-24">
                                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                                <div className="absolute inset-0 rounded-full border-t-4 border-red-600 animate-spin" />
                                <div className="absolute inset-4 rounded-full border-b-2 border-red-500/30 animate-pulse" />
                            </div>
                            <div className="text-center px-4">
                                <h3 className="text-base sm:text-lg font-black text-white tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2">Establishing Stream</h3>
                                <p className="text-[10px] sm:text-xs text-neutral-400 font-bold max-w-sm mx-auto leading-relaxed">
                                    TRYING SERVER: {SERVERS[selectedServerIndex]?.name || "UNKNOWN"} ({Math.min(selectedServerIndex + 1, SERVERS.length)} OF {SERVERS.length}). AUTO-SWITCHING IF UNAVAILABLE...
                                </p>
                            </div>
                        </div>
                    )}

                    {streamFailed && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 sm:gap-6 bg-neutral-950 z-30 px-6">
                            <div className="rounded-full bg-red-600/10 p-4 sm:p-6 border border-red-600/20">
                                <AlertCircle size={36} className="text-red-500 sm:w-12 sm:h-12" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-2 sm:mb-3">Content Unavailable</h3>
                                <p className="text-xs sm:text-sm text-neutral-400 font-medium max-w-sm mx-auto leading-relaxed mb-4 sm:mb-6">
                                    This title is not available on any of our streaming servers right now. This usually happens with lesser-known or region-restricted content.
                                </p>
                                <button
                                    onClick={handleRetryAll}
                                    className="flex items-center gap-2 mx-auto rounded-full bg-red-600 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-black text-white transition-all hover:bg-red-700 hover:scale-105 touch-manipulation"
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
                        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 rounded-full bg-black/60 px-4 py-2 sm:px-6 sm:py-2.5 backdrop-blur-md border border-white/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none w-[90%] sm:w-auto justify-center">
                            <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                            <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-wider sm:tracking-widest">Tip: Switch servers if the stream doesn&apos;t start</span>
                        </div>
                    )}
                </div>

                {/* ─── Bottom Server Bar ─────────────────────────────── */}
                <div className="bg-black/95 border-t border-white/5 px-3 py-2.5 sm:px-6 sm:py-4 md:px-8 md:py-5 flex items-center gap-3 sm:gap-4 md:gap-6 md:rounded-b-[2.5rem] select-none">
                    <div className="flex-shrink-0">
                        <span className="text-[10px] sm:text-sm md:text-base font-black text-red-300 uppercase tracking-wider whitespace-nowrap">
                            HD SERVER
                        </span>
                    </div>
                    <div className="flex gap-1.5 sm:gap-2 flex-grow overflow-x-auto scrollbar-hide pb-0.5 -mb-0.5 snap-x snap-mandatory">
                        {SERVERS.map((server, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleServerChange(idx)}
                                className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase transition-all tracking-wider border-b-[3px] cursor-pointer flex-shrink-0 snap-start touch-manipulation ${selectedServerIndex === idx
                                    ? "bg-[#0090d0] text-white border-[#006090] shadow-lg shadow-sky-900/30 translate-y-0 active:translate-y-[2px] active:border-b-0"
                                    : "bg-[#555] hover:bg-[#606060] text-white border-[#333] active:translate-y-[2px] active:border-b-0"
                                    }`}
                            >
                                {server.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(playerUI, document.body);
}
