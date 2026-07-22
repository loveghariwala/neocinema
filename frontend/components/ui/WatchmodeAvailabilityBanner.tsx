"use client";

import { useEffect, useState } from "react";
import { getWatchmodeSources, WatchmodeSource } from "@/services/watchmodeService";
import { ExternalLink, Tv } from "lucide-react";

interface Props {
    tmdbId: number;
    isTv?: boolean;
}

export default function WatchmodeAvailabilityBanner({ tmdbId, isTv = false }: Props) {
    const [sources, setSources] = useState<WatchmodeSource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getWatchmodeSources(tmdbId, isTv).then((data) => {
            // Deduplicate sources by platform name
            const unique = data.reduce((acc: WatchmodeSource[], curr) => {
                if (!acc.some(s => s.name.toLowerCase() === curr.name.toLowerCase())) {
                    acc.push(curr);
                }
                return acc;
            }, []);
            setSources(unique);
            setLoading(false);
        });
    }, [tmdbId, isTv]);

    if (loading) return null;
    if (!sources.length) return null;

    return (
        <div className="w-full my-6 p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-3 mb-4">
                <Tv size={18} className="text-red-500" />
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-white">
                    STREAMING AVAILABILITY (WATCHMODE OFFICIAL)
                </h3>
            </div>

            <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {sources.slice(0, 8).map((source, idx) => (
                    <a
                        key={idx}
                        href={source.web_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/50 transition-all text-xs font-bold text-neutral-200 hover:text-white group"
                    >
                        <span>{source.name}</span>
                        <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-red-600/20 border border-red-500/30 text-red-400">
                            {source.type === "sub" ? "Sub" : source.type === "free" ? "Free" : "Rent"}
                        </span>
                        <ExternalLink size={12} className="text-neutral-500 group-hover:text-white transition-colors" />
                    </a>
                ))}
            </div>
        </div>
    );
}
