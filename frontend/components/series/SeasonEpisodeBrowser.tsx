"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Play from "lucide-react/dist/esm/icons/play";
import Calendar from "lucide-react/dist/esm/icons/calendar";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";
import Monitor from "lucide-react/dist/esm/icons/monitor";


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
    initialEpisodes: Episode[];
    initialSeason: number;
}

export default function SeasonEpisodeBrowser({ seriesId, seasons, initialEpisodes, initialSeason }: SeasonEpisodeBrowserProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Filter out specials (season 0)
    const activeSeasons = seasons.filter(s => s.season_number > 0);
    const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

    const playEpisode = (episodeNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("play", "true");
        params.set("season", String(initialSeason));
        params.set("episode", String(episodeNumber));
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const changeSeason = (seasonNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("season", String(seasonNumber));
        params.delete("episode");
        router.push(`?${params.toString()}`, { scroll: false });
        setImgErrors({});
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
                <div className="flex items-center gap-2 overflow-x-auto next-gen-scrollbar max-w-full pb-4 pt-1 snap-x snap-mandatory">
                    {activeSeasons.map((season) => (
                        <button
                            key={season.id}
                            onClick={() => changeSeason(season.season_number)}
                            className={`rounded-xl px-4 py-2.5 text-xs font-black transition-all border shrink-0 snap-start ${initialSeason === season.season_number
                                ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30"
                                : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            Season {season.season_number}
                        </button>
                    ))}
                </div>
            </div>

            {/* Episodes List */}
            <div
                key={`season-${initialSeason}`}
                className="flex flex-col gap-4"
            >
                {initialEpisodes.length === 0 ? (
                    <div className="flex h-48 flex-col items-center justify-center text-neutral-500">
                        <p className="text-sm font-bold">No episodes found for this season.</p>
                    </div>
                ) : (
                    initialEpisodes.map((episode) => {
                            const stillUrl = episode.still_path && !imgErrors[episode.id]
                                ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                                : null;

                            return (
                                <div
                                    key={episode.id}
                                    onClick={() => playEpisode(episode.episode_number)}
                                    className="group relative flex flex-row rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden cursor-pointer hover:border-white/15 hover:bg-white/[0.04] transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.05)] h-28 sm:h-36 md:h-40"
                                >
                                    {/* Thumbnail Image (Left Side) */}
                                    <div className="relative h-full w-32 sm:w-48 md:w-64 flex-shrink-0 bg-neutral-900/60 flex items-center justify-center overflow-hidden border-r border-white/5">
                                        {stillUrl ? (
                                            <Image
                                                src={stillUrl}
                                                alt={episode.name}
                                                fill
                                                sizes="(max-width: 768px) 150px, 300px"
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
                                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                <Play fill="currentColor" size={20} className="ml-0.5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Info (Right Side) */}
                                    <div className="p-3 sm:p-5 flex-grow flex flex-col justify-between overflow-hidden">
                                        <div>
                                            <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                                                <h4 className="font-black text-white text-sm sm:text-base group-hover:text-red-500 transition-colors line-clamp-1">
                                                    {episode.episode_number}. {episode.name}
                                                </h4>
                                                {episode.air_date && (
                                                    <span className="text-[9px] sm:text-[10px] font-bold text-neutral-500 shrink-0 whitespace-nowrap mt-1">
                                                        {new Date(episode.air_date).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[10px] sm:text-xs md:text-sm text-neutral-400 font-medium line-clamp-2 sm:line-clamp-3 leading-relaxed">
                                                {episode.overview || "No description available for this episode."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                )}
            </div>
        </div>
    );
}
