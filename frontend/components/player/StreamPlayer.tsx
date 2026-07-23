"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { AlertCircle, ChevronDown, ChevronLeft, ChevronRight, Layers, Monitor, Play, RefreshCw, Server, Shield, ShieldCheck, Signal, Zap } from 'lucide-react';
import { saveWatchProgress } from "@/services/historyService";

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
    posterPath?: string;
    backdropPath?: string;
    isTv?: boolean;
    seasons?: Season[];
    autoPlay?: boolean;
    initialSeason?: number;
    initialEpisode?: number;
}

interface ServerConfig {
    name: string;
    providerId: number;
    baseUrl: string;
    encryption: "AES-256" | "SSL/TLS" | "E2E" | "AES-128";
    quality: "4K" | "1080p" | "720p";
    speed: 1 | 2 | 3;
}

const SERVERS: ServerConfig[] = [
    { name: "ALPHA", providerId: 1, baseUrl: "https://vidnest.fun", encryption: "AES-256", quality: "4K", speed: 3 },
    { name: "BETA", providerId: 2, baseUrl: "https://vidsrc.sbs/embed", encryption: "SSL/TLS", quality: "1080p", speed: 3 },
    { name: "GAMMA", providerId: 3, baseUrl: "https://player.videasy.to", encryption: "SSL/TLS", quality: "1080p", speed: 3 },
    { name: "DELTA", providerId: 4, baseUrl: "https://vidlink.pro", encryption: "SSL/TLS", quality: "1080p", speed: 3 },
    { name: "EPSILON", providerId: 5, baseUrl: "https://vidfast.vc", encryption: "AES-256", quality: "4K", speed: 3 },
    { name: "ZETA", providerId: 6, baseUrl: "https://peachify.pro/embed", encryption: "AES-256", quality: "4K", speed: 2 },
    { name: "ETA", providerId: 7, baseUrl: "https://www.vidking.net/embed", encryption: "E2E", quality: "1080p", speed: 3 },
];

const encryptionColor: Record<string, string> = {
    "AES-256": "text-emerald-400",
    "SSL/TLS": "text-cyan-400",
    "E2E": "text-violet-400",
    "AES-128": "text-amber-400",
};

const encryptionBg: Record<string, string> = {
    "AES-256": "bg-emerald-500/10 border-emerald-500/20",
    "SSL/TLS": "bg-cyan-500/10 border-cyan-500/20",
    "E2E": "bg-violet-500/10 border-violet-500/20",
    "AES-128": "bg-amber-500/10 border-amber-500/20",
};

const qualityColor: Record<string, string> = {
    "4K": "text-yellow-400 bg-yellow-500/15 border-yellow-500/30",
    "1080p": "text-sky-400 bg-sky-500/10 border-sky-500/20",
    "720p": "text-neutral-400 bg-neutral-500/10 border-neutral-500/20",
};

export default function StreamPlayer({
    tmdbId,
    imdbId,
    title,
    posterPath,
    backdropPath,
    isTv = false,
    seasons = [],
    autoPlay = false,
    initialSeason = 1,
    initialEpisode = 1
}: StreamPlayerProps) {
    const [selectedServerIndex, setSelectedServerIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [streamFailed, setStreamFailed] = useState(false);
    const [triedServerIndices, setTriedServerIndices] = useState<number[]>([]);
    const [showServerPanel, setShowServerPanel] = useState(false);
    const loadTimerRef = useRef<NodeJS.Timeout | null>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);

    // Series state
    const [selectedSeason, setSelectedSeason] = useState(initialSeason);
    const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);
    const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
    const [showEpisodeDropdown, setShowEpisodeDropdown] = useState(false);

    useEffect(() => {
        setSelectedSeason(initialSeason);
        setSelectedEpisode(initialEpisode);
    }, [initialSeason, initialEpisode]);

    // Automatically record watch progress to localStorage
    useEffect(() => {
        if (!tmdbId || !title) return;
        saveWatchProgress({
            id: tmdbId,
            title,
            poster_path: posterPath || "",
            backdrop_path: backdropPath || "",
            type: isTv ? "tv" : "movie",
            season: isTv ? selectedSeason : undefined,
            episode: isTv ? selectedEpisode : undefined,
            serverIndex: selectedServerIndex,
        });
    }, [tmdbId, title, posterPath, backdropPath, isTv, selectedSeason, selectedEpisode, selectedServerIndex]);

    // Active seasons filtering
    const activeSeasons = useMemo(() => seasons.filter(s => s.season_number > 0), [seasons]);
    const currentSeasonData = useMemo(() =>
        activeSeasons.find(s => s.season_number === selectedSeason) || activeSeasons[0]
        , [activeSeasons, selectedSeason]);

    const typePath = isTv ? "tv" : "movie";

    // Embed URL construction with requested parameters: autoplay, nextButton, episodeSelector
    const streamUrl = useMemo(() => {
        const server = SERVERS[selectedServerIndex] || SERVERS[0];
        const tvParams = "autoplay=1&autoPlay=true&nextButton=true&autoNext=true&episodeSelector=true&nextEpisode=true";
        const movieParams = "autoplay=1&autoPlay=true";
        const params = isTv ? tvParams : movieParams;

        // Server 3: Videasy
        if (server.providerId === 3) {
            return `https://player.videasy.to/${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}?color=dc2626&${params}`;
        }

        // Server 4: VidLink Pro
        if (server.providerId === 4) {
            return `https://vidlink.pro/${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}?primaryColor=dc2626&${params}`;
        }

        return `${server.baseUrl}/${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}?${params}`;
    }, [selectedServerIndex, tmdbId, typePath, isTv, selectedSeason, selectedEpisode]);

    // Reset loading state when stream changes
    useEffect(() => {
        setIsLoading(true);
        setStreamFailed(false);
    }, [streamUrl]);

    // Auto-try next server after 15 seconds of loading
    useEffect(() => {
        if (!isLoading) {
            if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
            return;
        }

        loadTimerRef.current = setTimeout(() => {
            const newTried = [...triedServerIndices, selectedServerIndex];
            setTriedServerIndices(newTried);

            const nextServerIndex = SERVERS.findIndex((_, idx) => !newTried.includes(idx));
            if (nextServerIndex !== -1) {
                setSelectedServerIndex(nextServerIndex);
            } else {
                setIsLoading(false);
                setStreamFailed(true);
            }
        }, 15000);

        return () => {
            if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
        };
    }, [isLoading, selectedServerIndex, triedServerIndices]);

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
        setShowServerPanel(false);
    }, []);

    // TV episode navigation helper functions
    const handleNextEpisode = useCallback(() => {
        const totalEpisodes = currentSeasonData?.episode_count || 1;
        if (selectedEpisode < totalEpisodes) {
            setSelectedEpisode(prev => prev + 1);
        } else if (selectedSeason < activeSeasons.length) {
            setSelectedSeason(prev => prev + 1);
            setSelectedEpisode(1);
        }
    }, [selectedEpisode, currentSeasonData, selectedSeason, activeSeasons.length]);

    const handlePrevEpisode = useCallback(() => {
        if (selectedEpisode > 1) {
            setSelectedEpisode(prev => prev - 1);
        } else if (selectedSeason > 1) {
            const prevSeason = activeSeasons.find(s => s.season_number === selectedSeason - 1);
            setSelectedSeason(selectedSeason - 1);
            setSelectedEpisode(prevSeason?.episode_count || 1);
        }
    }, [selectedEpisode, selectedSeason, activeSeasons]);

    const SignalBars = ({ level }: { level: number }) => (
        <div className="flex items-end gap-[2px] h-3">
            {[1, 2, 3].map((bar) => (
                <div
                    key={bar}
                    className={`w-[3px] rounded-full transition-all duration-300 ${bar <= level
                        ? level === 3 ? "bg-emerald-400" : level === 2 ? "bg-amber-400" : "bg-red-400"
                        : "bg-white/10"
                        }`}
                    style={{ height: `${bar * 4}px` }}
                />
            ))}
        </div>
    );

    const currentServer = SERVERS[selectedServerIndex];
    const maxEpisodes = currentSeasonData?.episode_count || 1;
    const hasNextEpisode = isTv && (selectedEpisode < maxEpisodes || selectedSeason < activeSeasons.length);
    const hasPrevEpisode = isTv && (selectedEpisode > 1 || selectedSeason > 1);

    return (
        <div id="inline-stream-player" ref={playerContainerRef} className="w-full my-6 sm:my-8 rounded-2xl md:rounded-3xl border border-white/10 bg-neutral-950/90 shadow-[0_20px_80px_rgba(0,0,0,0.8)] transition-all duration-500 backdrop-blur-2xl relative z-30">
            {/* Click-outside Backdrop for Dropdowns */}
            {(showSeasonDropdown || showEpisodeDropdown) && (
                <div
                    className="fixed inset-0 z-[80] bg-black/10"
                    onClick={() => {
                        setShowSeasonDropdown(false);
                        setShowEpisodeDropdown(false);
                    }}
                />
            )}

            {/* ─── Top Player Bar ────────────────────────────────────────── */}
            <div className="relative z-50 flex flex-wrap items-center justify-between gap-2.5 bg-neutral-900/90 px-3 py-2.5 sm:px-6 sm:py-4 border-b border-white/5 backdrop-blur-xl">
                {/* Left: Stream Info */}
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-red-500">
                            STREAMING PLAYER
                        </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <ShieldCheck size={12} className="text-emerald-400" />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-emerald-400">
                            {currentServer.encryption} SECURED
                        </span>
                    </div>
                </div>

                {/* Right: TV Controls (Season/Episode & Prev/Next) */}
                {isTv && activeSeasons.length > 0 && (
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                        {/* Prev Episode Button */}
                        <button
                            onClick={handlePrevEpisode}
                            disabled={!hasPrevEpisode}
                            className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition-all border touch-manipulation active:scale-95 ${hasPrevEpisode
                                ? "bg-white/5 hover:bg-red-600 hover:border-red-500 text-white cursor-pointer"
                                : "bg-white/[0.02] border-white/5 text-neutral-600 cursor-not-allowed"
                                }`}
                        >
                            <ChevronLeft size={15} />
                            <span>PREV</span>
                        </button>

                        {/* Season Dropdown */}
                        <div className="relative z-50">
                            <button
                                onClick={() => {
                                    setShowSeasonDropdown(!showSeasonDropdown);
                                    setShowEpisodeDropdown(false);
                                }}
                                className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-black text-white border transition-all touch-manipulation active:scale-95 ${showSeasonDropdown ? "bg-red-600 border-red-500 shadow-lg shadow-red-900/40" : "bg-white/5 border-white/10 hover:bg-white/10"
                                    }`}
                            >
                                <Layers size={14} className="text-red-500" />
                                <span>S{selectedSeason}</span>
                                <ChevronDown size={13} className={`transition-transform duration-200 ${showSeasonDropdown ? "rotate-180" : ""}`} />
                            </button>

                            {showSeasonDropdown && (
                                <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 z-[9999] max-h-64 w-44 overflow-y-auto rounded-xl border border-white/15 bg-neutral-900/98 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 backdrop-blur-2xl touch-manipulation">
                                    {activeSeasons.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => {
                                                setSelectedSeason(s.season_number);
                                                setSelectedEpisode(1);
                                                setShowSeasonDropdown(false);
                                            }}
                                            className={`w-full rounded-lg px-3 py-2.5 text-left text-xs font-bold transition-all mb-1 ${selectedSeason === s.season_number
                                                ? "bg-red-600 text-white"
                                                : "text-neutral-300 hover:bg-white/10 hover:text-white"
                                                }`}
                                        >
                                            Season {s.season_number}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Episode Dropdown */}
                        <div className="relative z-50">
                            <button
                                onClick={() => {
                                    setShowEpisodeDropdown(!showEpisodeDropdown);
                                    setShowSeasonDropdown(false);
                                }}
                                className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-black text-white border transition-all touch-manipulation active:scale-95 ${showEpisodeDropdown ? "bg-red-600 border-red-500 shadow-lg shadow-red-900/40" : "bg-white/5 border-white/10 hover:bg-white/10"
                                    }`}
                            >
                                <Monitor size={14} className="text-red-500" />
                                <span>E{selectedEpisode}</span>
                                <ChevronDown size={13} className={`transition-transform duration-200 ${showEpisodeDropdown ? "rotate-180" : ""}`} />
                            </button>

                            {showEpisodeDropdown && (
                                <div className="absolute top-full right-0 mt-2 z-[9999] max-h-64 w-60 sm:w-64 overflow-y-auto rounded-xl border border-white/15 bg-neutral-900/98 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2.5 backdrop-blur-2xl touch-manipulation">
                                    <div className="text-[10px] font-black uppercase text-neutral-400 px-1 mb-2 tracking-wider">
                                        Select Episode
                                    </div>
                                    <div className="grid grid-cols-5 gap-1.5">
                                        {Array.from({ length: maxEpisodes }, (_, i) => i + 1).map((e) => (
                                            <button
                                                key={e}
                                                onClick={() => {
                                                    setSelectedEpisode(e);
                                                    setShowEpisodeDropdown(false);
                                                }}
                                                className={`rounded-lg h-9 flex items-center justify-center text-xs font-black transition-all touch-manipulation active:scale-95 ${selectedEpisode === e
                                                    ? "bg-red-600 text-white shadow-md shadow-red-900/40"
                                                    : "text-neutral-300 hover:bg-white/10 hover:text-white bg-white/[0.03]"
                                                    }`}
                                            >
                                                {e}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Next Episode Button */}
                        <button
                            onClick={handleNextEpisode}
                            disabled={!hasNextEpisode}
                            className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition-all border touch-manipulation active:scale-95 ${hasNextEpisode
                                ? "bg-red-600/90 border-red-500 hover:bg-red-600 text-white cursor-pointer shadow-lg shadow-red-900/30"
                                : "bg-white/[0.02] border-white/5 text-neutral-600 cursor-not-allowed"
                                }`}
                        >
                            <span>NEXT</span>
                            <ChevronRight size={15} />
                        </button>
                    </div>
                )}
            </div>

            {/* ─── 16:9 Aspect Ratio Iframe Screen ───────────────────────── */}
            <div className="relative w-full aspect-video bg-black overflow-hidden group">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-950 z-20">
                        <div className="relative h-20 w-20">
                            <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                            <div className="absolute inset-0 rounded-full border-t-4 border-red-600 animate-spin" />
                            <div className="absolute inset-2 rounded-full border-b-2 border-red-500/30 animate-pulse" />
                        </div>
                        <div className="text-center px-4">
                            <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-[0.2em]">Connecting Stream</h4>
                            <p className="text-[10px] sm:text-xs text-neutral-400 font-bold mt-1">
                                SERVER: <span className="text-red-400">{currentServer.name}</span> ({selectedServerIndex + 1}/{SERVERS.length})
                            </p>
                        </div>
                    </div>
                )}

                {streamFailed && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-950 z-30 px-6">
                        <div className="rounded-full bg-red-600/10 p-4 border border-red-600/20">
                            <AlertCircle size={36} className="text-red-500" />
                        </div>
                        <div className="text-center max-w-md">
                            <h4 className="text-base font-black text-white mb-1">Server Unavailable</h4>
                            <p className="text-xs text-neutral-400 mb-4">
                                Stream failed to respond. Please try switching servers below or retry all.
                            </p>
                            <button
                                onClick={handleRetryAll}
                                className="flex items-center gap-2 mx-auto rounded-full bg-red-600 px-5 py-2 text-xs font-black text-white hover:bg-red-700 transition-all"
                            >
                                <RefreshCw size={14} />
                                RETRY ALL SERVERS
                            </button>
                        </div>
                    </div>
                )}

                <iframe
                    key={streamUrl}
                    src={streamUrl}
                    className="w-full h-full border-none"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                    allow="autoplay; encrypted-media"
                    onLoad={() => {
                        setIsLoading(false);
                        setStreamFailed(false);
                    }}
                />

                {/* Overlay Server Selection Grid */}
                {showServerPanel && (
                    <div className="absolute inset-0 z-40 bg-black/95 backdrop-blur-2xl p-4 sm:p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Server size={16} className="text-red-500" />
                                <h4 className="text-xs font-black uppercase text-white tracking-widest">Select HD Server Provider</h4>
                            </div>
                            <button
                                onClick={() => setShowServerPanel(false)}
                                className="text-neutral-400 hover:text-white text-xs uppercase font-bold"
                            >
                                Close
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {SERVERS.map((server, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleServerChange(idx)}
                                    className={`p-3 rounded-xl border text-left transition-all ${selectedServerIndex === idx
                                        ? "bg-red-600/20 border-red-500 text-white"
                                        : "bg-white/5 border-white/10 hover:bg-white/10 text-neutral-300"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-black tracking-wider">{server.name}</span>
                                        <SignalBars level={server.speed} />
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${encryptionBg[server.encryption]} ${encryptionColor[server.encryption]}`}>
                                            {server.encryption}
                                        </span>
                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${qualityColor[server.quality]}`}>
                                            {server.quality}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ─── Bottom Server Selector Bar ──────────────────────────── */}
            <div className="bg-neutral-900/95 border-t border-white/10 px-4 py-3 sm:px-5 sm:py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 py-1">
                    <span className="text-xs font-black text-red-500 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1.5">
                        <Server size={14} className="text-red-500" />
                        SERVERS:
                    </span>
                    {SERVERS.map((server, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleServerChange(idx)}
                            className={`px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap flex items-center gap-1.5 border cursor-pointer touch-manipulation active:scale-95 ${selectedServerIndex === idx
                                ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/40"
                                : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/15 hover:text-white"
                                }`}
                        >
                            <ShieldCheck size={13} className={selectedServerIndex === idx ? "text-white" : encryptionColor[server.encryption]} />
                            <span>{server.name}</span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${selectedServerIndex === idx ? "bg-white/20 text-white" : `${encryptionBg[server.encryption]} ${encryptionColor[server.encryption]}`}`}>
                                {server.encryption}
                            </span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setShowServerPanel(!showServerPanel)}
                    className="flex-shrink-0 text-xs font-black text-neutral-300 hover:text-white uppercase tracking-wider underline hidden md:block px-2.5 py-1.5 rounded-lg hover:bg-white/5"
                >
                    {showServerPanel ? "HIDE GRID" : "GRID VIEW"}
                </button>
            </div>
        </div>
    );
}
