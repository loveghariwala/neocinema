"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Loader2, Monitor } from 'lucide-react';


import Image from "next/image";
import { getTmdbImageUrl, tmdbService } from "@/lib/tmdb";

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
    const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
    const [loading, setLoading] = useState(initialEpisodes.length === 0);
    const [activeSeason, setActiveSeason] = useState(initialSeason);

    // Fetch episodes client-side
    useEffect(() => {
        const fetchEpisodes = async () => {
            setLoading(true);
            try {
                const data = await tmdbService.getTvSeasonDetail(Number(seriesId), activeSeason);
                setEpisodes(data?.episodes || []);
            } catch {
                setEpisodes([]);
            }
            setLoading(false);
        };
        fetchEpisodes();
    }, [seriesId, activeSeason]);

    const changeSeason = (seasonNumber: number) => {
        setActiveSeason(seasonNumber);
        setImgErrors({});
        const params = new URLSearchParams(searchParams.toString());
        params.set("season", String(seasonNumber));
        params.delete("episode");
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
                <div className="flex items-center gap-2 overflow-x-auto next-gen-scrollbar max-w-full pb-4 pt-1 snap-x snap-mandatory">
                    {activeSeasons.map((season) => (
                        <button
                            key={season.id}
                            onClick={() => changeSeason(season.season_number)}
                            className={`rounded-xl px-4 py-2.5 text-xs font-black transition-all border shrink-0 snap-start ${activeSeason === season.season_number
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
                key={`season-${activeSeason}`}
                className="flex flex-col gap-4"
            >
                {loading ? (
                    <div className="flex h-48 flex-col items-center justify-center text-neutral-500">
                        <Loader2 size={28} className="animate-spin mb-3 text-red-500" />
                        <p className="text-sm font-bold">Loading episodes...</p>
                    </div>
                ) : episodes.length === 0 ? (
                    <div className="flex h-48 flex-col items-center justify-center text-neutral-500">
                        <p className="text-sm font-bold">No episodes found for this season.</p>
                    </div>
                ) : (
                    episodes.map((episode) => {
                        const stillUrl = episode.still_path && !imgErrors[episode.id]
                            ? getTmdbImageUrl(episode.still_path, "w300", episode.name)
                            : null;

                        return (
                            <div
                                key={episode.id}
                                className="group relative flex flex-row rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all h-28 sm:h-36 md:h-40"
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
                                </div>

                                {/* Text Info (Right Side) */}
                                <div className="p-3 sm:p-5 flex-grow flex flex-col justify-between overflow-hidden">
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                                            <h4 className="font-black text-white text-sm sm:text-base line-clamp-1">
                                                {episode.episode_number}. {episode.name}
                                            </h4>
                                            {episode.air_date && !isNaN(new Date(episode.air_date).getTime()) && (
                                                <span className="text-[9px] sm:text-[10px] font-bold text-neutral-500 shrink-0 whitespace-nowrap mt-1">
                                                    {new Date(episode.air_date).toLocaleDateString('en-US', {
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

