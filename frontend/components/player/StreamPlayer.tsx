"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, ChevronDown, Layers, Monitor, Play, RefreshCw, Shield, ShieldCheck, Signal, X, Zap, Lock, Server, Wifi } from 'lucide-react';



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

interface ServerConfig {
    name: string;
    providerId: number;
    encryption: "AES-256" | "SSL/TLS" | "E2E" | "AES-128";
    quality: "4K" | "1080p" | "720p";
    speed: 1 | 2 | 3; // signal bars
}

const SERVERS: ServerConfig[] = [
    { name: "OMEGA", providerId: 11, encryption: "AES-256", quality: "4K", speed: 3 },
    { name: "ALPHA", providerId: 1, encryption: "AES-256", quality: "4K", speed: 3 },
    { name: "GAMMA", providerId: 3, encryption: "SSL/TLS", quality: "1080p", speed: 3 },
    { name: "SIGMA", providerId: 22, encryption: "AES-256", quality: "4K", speed: 2 },
    { name: "EPSILON", providerId: 5, encryption: "SSL/TLS", quality: "1080p", speed: 2 },
    { name: "LAMBDA", providerId: 12, encryption: "AES-256", quality: "4K", speed: 3 },
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
    const [showServerPanel, setShowServerPanel] = useState(false);
    const [hoveredServer, setHoveredServer] = useState<number | null>(null);
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

    useEffect(() => {
        if (isPlaying) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isPlaying]);

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
        if (provider === 5) return `${atob("aHR0cHM6Ly93d3cuMmVtYmVkLmNjL2VtYmVkLw==")}${tmdbId}`;
        if (provider === 11) return `${atob("aHR0cHM6Ly92aWRuZXN0LmZ1bi8=")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}`;
        if (provider === 12) return `${atob("aHR0cHM6Ly92aWRuZXN0LmZ1bi8=")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}?server=gama`;
        if (provider === 22) return `${atob("aHR0cHM6Ly92aWRzcmMuc2JzL2VtYmVkLw==")}${typePath}/${tmdbId}${isTv ? `/${selectedSeason}/${selectedEpisode}` : ""}?autoplay=1&color=e50914&sub=en&controls=0`;
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
        setShowServerPanel(false);
    }, []);

    const handleInitialPlay = () => {
        /*
        if (!hasClickedAd) {
            // Check if it is a mobile device
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            // Adsterra Smart Link Integration (Popunder) - Desktop Only
            if (!isMobile) {
                window.open("https://www.effectivecpmnetwork.com/khge4vq0f?key=0bc9ee47ad5de40ae42fce1eae3506e2", "_blank");
            }
            setHasClickedAd(true);
        }
        */
        setIsPlaying(true);
    };

    // Signal strength bars component
    const SignalBars = ({ level }: { level: number }) => (
        <div className="flex items-end gap-[2px] h-3">
            {[1, 2, 3].map((bar) => (
                <div
                    key={bar}
                    className={`w-[3px] rounded-full transition-all duration-300 ${
                        bar <= level
                            ? level === 3 ? "bg-emerald-400" : level === 2 ? "bg-amber-400" : "bg-red-400"
                            : "bg-white/10"
                    }`}
                    style={{ height: `${bar * 4}px` }}
                />
            ))}
        </div>
    );

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

    const currentServer = SERVERS[selectedServerIndex];

    const playerUI = (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/98 backdrop-blur-3xl" style={{ animation: "playerFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            <style>{`
                @keyframes playerFadeIn {
                    from { opacity: 0; transform: scale(0.97); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.15); }
                    50% { box-shadow: 0 0 40px rgba(220, 38, 38, 0.3); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes serverPanelIn {
                    from { opacity: 0; transform: translateY(10px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .server-card-hover:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px -10px rgba(220, 38, 38, 0.25);
                }
                .shimmer-line {
                    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }
            `}</style>

            <div className="relative w-full h-full md:max-w-[98vw] md:max-h-[96vh] md:rounded-[2rem] border-0 md:border md:border-white/10 bg-neutral-950 shadow-[0_0_150px_rgba(220,38,38,0.25)] flex flex-col overflow-hidden">
                {/* ─── Top Bar ────────────────────────────────────────── */}
                <div className="relative z-[1000] flex flex-wrap items-center justify-between gap-2 sm:gap-4 bg-gradient-to-r from-black/95 via-neutral-950/95 to-black/95 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3.5 backdrop-blur-3xl border-b border-white/5 md:rounded-t-[2.5rem]">
                    {/* Left: Title / Branding + Active Server Info */}
                    <div className="flex flex-col min-w-0 flex-1 order-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-red-600 block">Streaming Mode</span>
                            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[7px] font-black uppercase tracking-wider text-emerald-400">ENCRYPTED</span>
                            </div>
                        </div>
                        <h2 className="text-[11px] sm:text-sm md:text-base font-black text-white text-glow truncate">
                            {title} {isTv && <span className="text-neutral-400 font-bold ml-1 sm:ml-2">S{selectedSeason} E{selectedEpisode}</span>}
                        </h2>
                    </div>

                    {/* Active server badge — compact inline */}
                    <div className="hidden md:flex items-center gap-2 order-2">
                        <button
                            onClick={() => setShowServerPanel(!showServerPanel)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                        >
                            <ShieldCheck size={13} className={encryptionColor[currentServer.encryption]} />
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">{currentServer.name}</span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${encryptionBg[currentServer.encryption]} ${encryptionColor[currentServer.encryption]}`}>
                                {currentServer.encryption}
                            </span>
                            <SignalBars level={currentServer.speed} />
                            <ChevronDown size={10} className={`text-neutral-500 transition-transform duration-300 ${showServerPanel ? "rotate-180" : ""}`} />
                        </button>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => setIsPlaying(false)}
                        className="rounded-full bg-white/10 p-2 sm:p-1.5 md:p-2 text-white transition-all hover:bg-red-600 hover:rotate-90 border border-white/20 backdrop-blur-md group flex-shrink-0 order-3 sm:order-4 touch-manipulation"
                    >
                        <X className="h-5 w-5 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
                    </button>

                    {/* Series Selectors — full width row on mobile, inline on larger */}
                    {isTv && activeSeasons.length > 0 && (
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto order-4 sm:order-3 flex-shrink-0">
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
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 sm:gap-8 bg-neutral-950 z-20">
                            {/* Enhanced loading spinner with server info */}
                            <div className="relative h-28 w-28 sm:h-32 sm:w-32">
                                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                                <div className="absolute inset-0 rounded-full border-t-4 border-red-600 animate-spin" style={{ animationDuration: "1.2s" }} />
                                <div className="absolute inset-3 rounded-full border-b-2 border-red-500/30 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Shield className="h-8 w-8 text-red-500/60 animate-pulse" />
                                </div>
                            </div>
                            <div className="text-center px-4" style={{ animation: "slideUp 0.5s ease" }}>
                                <h3 className="text-base sm:text-lg font-black text-white tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2">Establishing Secure Stream</h3>
                                <p className="text-[10px] sm:text-xs text-neutral-400 font-bold max-w-sm mx-auto leading-relaxed mb-3">
                                    CONNECTING TO SERVER: <span className="text-red-400">{SERVERS[selectedServerIndex]?.name || "UNKNOWN"}</span> ({Math.min(selectedServerIndex + 1, SERVERS.length)} OF {SERVERS.length})
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                        <Lock size={10} className="text-emerald-400" />
                                        <span className="text-[9px] font-bold text-emerald-400">{currentServer.encryption}</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${qualityColor[currentServer.quality]}`}>
                                        <span className="text-[9px] font-bold">{currentServer.quality}</span>
                                    </div>
                                </div>
                                {/* Loading progress bar */}
                                <div className="mt-4 w-48 sm:w-64 mx-auto h-1 rounded-full bg-white/5 overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-500 shimmer-line" style={{ width: "100%" }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {streamFailed && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 sm:gap-6 bg-neutral-950 z-30 px-6">
                            <div className="rounded-full bg-red-600/10 p-4 sm:p-6 border border-red-600/20" style={{ animation: "pulseGlow 2s ease infinite" }}>
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

                    {/* ─── Expandable Server Panel (overlaid on video) ──── */}
                    {showServerPanel && (
                        <div
                            className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/98 to-black/90 backdrop-blur-2xl border-t border-white/5 overflow-y-auto"
                            style={{
                                animation: "serverPanelIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                maxHeight: "70%",
                            }}
                        >
                            <div className="px-3 sm:px-6 pt-4 pb-2 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-10">
                                <div className="flex items-center gap-3">
                                    <Server size={14} className="text-red-500" />
                                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-white">Select Server</span>
                                    <span className="text-[9px] font-bold text-neutral-500">{SERVERS.length} AVAILABLE</span>
                                </div>
                                <button
                                    onClick={() => setShowServerPanel(false)}
                                    className="rounded-lg p-1.5 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all touch-manipulation"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="px-3 sm:px-6 pb-4 pt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                                {SERVERS.map((server, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleServerChange(idx)}
                                        onMouseEnter={() => setHoveredServer(idx)}
                                        onMouseLeave={() => setHoveredServer(null)}
                                        className={`server-card-hover relative rounded-xl p-2.5 sm:p-3 text-left transition-all duration-300 border touch-manipulation ${
                                            selectedServerIndex === idx
                                                ? "bg-red-600/15 border-red-500/40 ring-1 ring-red-500/20"
                                                : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10"
                                        }`}
                                    >
                                        {/* Active indicator */}
                                        {selectedServerIndex === idx && (
                                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        )}

                                        <div className="flex items-center gap-2 mb-2">
                                            <ShieldCheck size={13} className={selectedServerIndex === idx ? "text-red-400" : encryptionColor[server.encryption]} />
                                            <span className="text-[11px] sm:text-xs font-black text-white tracking-wider">{server.name}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${encryptionBg[server.encryption]} ${encryptionColor[server.encryption]}`}>
                                                {server.encryption}
                                            </span>
                                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${qualityColor[server.quality]}`}>
                                                {server.quality}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between">
                                            <SignalBars level={server.speed} />
                                            {selectedServerIndex === idx && (
                                                <span className="text-[7px] font-black uppercase tracking-wider text-red-400">ACTIVE</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Server Help Hint */}
                    {!isLoading && !streamFailed && !showServerPanel && (
                        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 rounded-full bg-black/60 px-4 py-2 sm:px-6 sm:py-2.5 backdrop-blur-md border border-white/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none w-[90%] sm:w-auto justify-center">
                            <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                            <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-wider sm:tracking-widest">Tip: Switch servers if the stream doesn&apos;t start</span>
                        </div>
                    )}
                </div>

                {/* ─── Bottom Server Bar (Quick Switch + Toggle) ─────── */}
                <div className="bg-gradient-to-r from-black/95 via-neutral-950/95 to-black/95 border-t border-white/5 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 md:rounded-b-[2.5rem] select-none">
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Server label + expand on mobile */}
                        <button
                            onClick={() => setShowServerPanel(!showServerPanel)}
                            className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 group cursor-pointer px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-white/5 transition-all touch-manipulation"
                        >
                            <Shield size={14} className="text-red-500 sm:w-4 sm:h-4" />
                            <span className="text-[9px] sm:text-[10px] font-black text-red-400 uppercase tracking-wider whitespace-nowrap hidden sm:inline">
                                SERVERS
                            </span>
                            <ChevronDown size={10} className={`text-neutral-500 transition-transform duration-300 ${showServerPanel ? "rotate-180" : ""}`} />
                        </button>

                        {/* Separator */}
                        <div className="w-px h-5 bg-white/10 flex-shrink-0 hidden sm:block" />

                        {/* Scrollable server pills */}
                        <div className="flex gap-1.5 sm:gap-2 flex-grow overflow-x-auto scrollbar-hide pb-0.5 -mb-0.5 snap-x snap-mandatory">
                            {SERVERS.map((server, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleServerChange(idx)}
                                    className={`group/btn flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase transition-all tracking-wider flex-shrink-0 snap-start touch-manipulation border ${
                                        selectedServerIndex === idx
                                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500/50 shadow-lg shadow-red-900/30"
                                            : "bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white border-white/[0.06] hover:border-white/10"
                                    }`}
                                >
                                    <ShieldCheck size={10} className={selectedServerIndex === idx ? "text-white" : encryptionColor[server.encryption]} />
                                    <span>{server.name}</span>
                                    {/* Show encryption tag only on wider screens */}
                                    <span className={`hidden lg:inline text-[7px] font-bold px-1 py-0 rounded ${
                                        selectedServerIndex === idx
                                            ? "bg-white/20 text-white"
                                            : `${encryptionBg[server.encryption]} ${encryptionColor[server.encryption]}`
                                    }`}>
                                        {server.encryption}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Active server info pill — hidden on very small screens */}
                        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex-shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[8px] font-black text-neutral-300 uppercase tracking-wider">{currentServer.name}</span>
                            <SignalBars level={currentServer.speed} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(playerUI, document.body);
}
