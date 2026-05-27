"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Play, Calendar, Loader2, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Episode {
    id: number;
    name: string;
    overview: string;
    episode_number: number;
    air_date: string;
    still_path: string | null;
}

interface Season {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
}

interface SeasonEpisodeBrowserProps {
    seriesId: string;
    seasons: Season[];
}

export default function SeasonEpisodeBrowser({ seriesId, seasons }: SeasonEpisodeBrowserProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Filter out specials (season 0)
    const activeSeasons = seasons.filter(s => s.season_number > 0);
    const [selectedSeason, setSelectedSeason] = useState(
        activeSeasons.length > 0 ? activeSeasons[0].season_number : 1
    );
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const fetchEpisodes = async () => {
            setLoading(true);
            setError(false);
            try {
                const res = await fetch(`/api/series/${seriesId}/season/${selectedSeason}`);
                if (!res.ok) throw new Error("Failed to fetch episodes");
                const data = await res.json();
                setEpisodes(data.episodes || []);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchEpisodes();
    }, [seriesId, selectedSeason]);

    const playEpisode = (episodeNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("play", "true");
        params.set("season", String(selectedSeason));
        params.set("episode", String(episodeNumber));
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="space-y-8 select-none">
            {/* Header / Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600/80">
                        Seasons & Episodes
                    </h3>
                </div>

                {/* Season selection row */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-full pb-2 sm:pb-0">
                    {activeSeasons.map((season) => (
                        <button
                            key={season.id}
                            onClick={() => {
                                setSelectedSeason(season.season_number);
                                setImgErrors({});
                            }}
                            className={`rounded-xl px-4 py-2.5 text-xs font-black transition-all border shrink-0 ${
                                selectedSeason === season.season_number
                                    ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30"
                                    : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            Season {season.season_number}
                        </button>
                    ))}
                </div>
            </div>

            {/* Episodes List / Grid */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex h-48 items-center justify-center"
                    >
                        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                    </motion.div>
                ) : error ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex h-48 flex-col items-center justify-center text-neutral-500"
                    >
                        <p className="text-sm font-bold">Failed to load episodes.</p>
                        <button
                            onClick={() => setSelectedSeason(selectedSeason)}
                            className="mt-2 text-xs font-black uppercase tracking-widest text-red-500 hover:underline"
                        >
                            Retry
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="episodes"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {episodes.map((episode) => {
                            const stillUrl = episode.still_path && !imgErrors[episode.id]
                                ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                                : null;
                            
                            return (
                                <div
                                    key={episode.id}
                                    onClick={() => playEpisode(episode.episode_number)}
                                    className="group relative flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden cursor-pointer hover:border-white/15 hover:bg-white/[0.04] transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.05)]"
                                >
                                    {/* Thumbnail Image */}
                                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900/60 flex items-center justify-center">
                                        {stillUrl ? (
                                            <Image
                                                src={stillUrl}
                                                alt={episode.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                onError={() => {
                                                    setImgErrors(prev => ({ ...prev, [episode.id]: true }));
                                                }}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-2 text-neutral-600">
                                                <Monitor size={24} className="opacity-40" />
                                                <span className="text-[10px] font-black uppercase tracking-wider opacity-60">No Preview</span>
                                            </div>
                                        )}
                                        {/* Play Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                <Play fill="currentColor" size={20} className="ml-0.5" />
                                            </div>
                                        </div>
                                        {/* Episode badge */}
                                        <div className="absolute bottom-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-black text-white backdrop-blur-sm border border-white/10">
                                            EP {episode.episode_number}
                                        </div>
                                    </div>

                                    {/* Text Info */}
                                    <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                                        <div>
                                            <h4 className="font-black text-white text-sm group-hover:text-red-500 transition-colors line-clamp-1">
                                                {episode.name}
                                            </h4>
                                            <p className="text-xs text-neutral-400 font-medium line-clamp-3 leading-relaxed mt-1">
                                                {episode.overview || "No description available for this episode."}
                                            </p>
                                        </div>
                                        {episode.air_date && (
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 pt-2 border-t border-white/5">
                                                <Calendar size={12} className="text-neutral-600" />
                                                <span>{new Date(episode.air_date).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
