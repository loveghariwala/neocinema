"use client";

import { useEffect, useState } from "react";
import { X, Film, Star, ExternalLink, Play } from 'lucide-react';
import Link from "next/link";
import { getKinocheckTrailers, KinocheckTrailer } from "@/services/kinocheckService";
import { track } from "@vercel/analytics";

interface QuickTrailerModalProps {
    movie: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function QuickTrailerModal({ movie, isOpen, onClose }: QuickTrailerModalProps) {
    const [trailers, setTrailers] = useState<KinocheckTrailer[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTrailer, setActiveTrailer] = useState<KinocheckTrailer | null>(null);

    const tmdbId = movie?._id || movie?.tmdbId || movie?.id;
    const isTv = movie?.isMovie === false || movie?.media_type === "tv" || Boolean(movie?.name);
    const title = movie?.title || movie?.name || "Trailer";

    useEffect(() => {
        if (!isOpen || !tmdbId) return;

        let isMounted = true;
        setLoading(true);
        setTrailers([]);
        setActiveTrailer(null);

        // Track user interaction with analytics to count as engaged session
        try {
            track("watch_quick_trailer", {
                title,
                tmdbId,
                mediaType: isTv ? "tv" : "movie",
            });
        } catch (e) {}

        async function fetchTrailers() {
            try {
                const res = await getKinocheckTrailers(Number(tmdbId), isTv);
                if (isMounted) {
                    setTrailers(res || []);
                    if (res && res.length > 0) {
                        setActiveTrailer(res[0]);
                    }
                }
            } catch (err) {
                console.error("Trailer fetch error:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchTrailers();

        return () => {
            isMounted = false;
        };
    }, [isOpen, tmdbId, isTv]);

    if (!isOpen || !movie) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-[0_0_90px_rgba(220,38,38,0.3)] backdrop-blur-2xl space-y-4 p-4 sm:p-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-500">
                            <Film size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight line-clamp-1">
                                {title} <span className="text-red-500">— Official Trailer</span>
                            </h2>
                            <p className="text-xs text-neutral-400 font-medium">
                                Preview official HD video content
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2.5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        aria-label="Close trailer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Video Player Box */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full w-full space-y-3">
                            <div className="h-12 w-12 rounded-full border-4 border-red-600/20 border-t-red-500 animate-spin" />
                            <p className="text-xs font-black uppercase tracking-widest text-neutral-400">
                                Loading Trailer...
                            </p>
                        </div>
                    ) : activeTrailer ? (
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${activeTrailer.youtube_video_id}?autoplay=1&rel=0&modestbranding=1`}
                            title={`${title} Trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="h-full w-full border-0"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full w-full text-center p-6 space-y-3">
                            <Film size={40} className="text-neutral-600" />
                            <p className="text-sm font-bold text-neutral-400">
                                No trailer video available for this title right now.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Info & Multi-Trailer Selector */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    {/* Trailer selector tabs if multiple */}
                    {trailers.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                            {trailers.map((tr, index) => (
                                <button
                                    key={tr.id || index}
                                    onClick={() => setActiveTrailer(tr)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                        activeTrailer?.youtube_video_id === tr.youtube_video_id
                                            ? "bg-red-600 border-red-500 text-white shadow-md"
                                            : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                                    }`}
                                >
                                    {tr.type || `Trailer ${index + 1}`}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <Link
                            href={`/${isTv ? "series" : "movies"}/${tmdbId}`}
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-red-950 flex items-center gap-2"
                        >
                            <ExternalLink size={14} />
                            Full Movie Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
