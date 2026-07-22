"use client";

import { useEffect, useState } from "react";
import { getKinocheckTrailers, KinocheckTrailer } from "@/services/kinocheckService";
import { Film, Play, X } from "lucide-react";

interface Props {
    tmdbId: number;
    title: string;
    isTv?: boolean;
}

export default function KinocheckTrailerSection({ tmdbId, title, isTv = false }: Props) {
    const [trailers, setTrailers] = useState<KinocheckTrailer[]>([]);
    const [selectedTrailer, setSelectedTrailer] = useState<KinocheckTrailer | null>(null);
    const [isVideoLoading, setIsVideoLoading] = useState(true);

    useEffect(() => {
        if (tmdbId) {
            getKinocheckTrailers(tmdbId, isTv).then((data) => {
                setTrailers(data);
            });
        }
    }, [tmdbId, isTv]);

    if (!trailers || trailers.length === 0) return null;

    return (
        <div className="w-full my-6">
            <div className="flex items-center gap-3 mb-4">
                <Film size={18} className="text-red-500" />
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-white">
                    OFFICIAL TRAILERS (KINOCHECK & HD)
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {trailers.slice(0, 3).map((trailer) => (
                    <button
                        key={trailer.id || trailer.youtube_video_id}
                        onClick={() => {
                            setSelectedTrailer(trailer);
                            setIsVideoLoading(true);
                        }}
                        className="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 aspect-video text-left transition-all hover:scale-[1.02] hover:border-red-500/50 shadow-lg cursor-pointer touch-manipulation"
                    >
                        <img
                            src={trailer.youtube_thumbnail}
                            alt={trailer.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${trailer.youtube_video_id}/mqdefault.jpg`;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="rounded-full bg-red-600/90 p-3 text-white shadow-xl shadow-red-600/50 group-hover:scale-110 transition-transform">
                                <Play fill="currentColor" size={20} />
                            </div>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                            <span className="text-[9px] font-black uppercase tracking-wider text-red-500 bg-black/60 px-2 py-0.5 rounded-full border border-red-500/30 backdrop-blur-md">
                                {trailer.type || "Trailer"}
                            </span>
                            <h4 className="text-xs font-bold text-white truncate mt-1">{trailer.title}</h4>
                        </div>
                    </button>
                ))}
            </div>

            {/* Trailer Modal Overlay */}
            {selectedTrailer && (
                <div
                    onClick={() => setSelectedTrailer(null)}
                    className="fixed inset-0 z-[200000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900">
                            <h3 className="text-sm font-black text-white truncate">{selectedTrailer.title}</h3>
                            <button
                                onClick={() => setSelectedTrailer(null)}
                                className="p-2 rounded-full bg-white/10 text-white hover:bg-red-600 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="relative w-full aspect-video bg-black overflow-hidden">
                            {isVideoLoading && (
                                <div className="absolute inset-0 z-20 bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="relative flex items-center justify-center mb-4">
                                        <div className="absolute h-16 w-16 rounded-full border-4 border-red-600/30 border-t-red-600 animate-spin" />
                                        <Play fill="currentColor" size={20} className="text-red-500 animate-pulse ml-0.5" />
                                    </div>
                                    <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">
                                        LOADING OFFICIAL TRAILER...
                                    </h4>
                                    <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-wider">
                                        Establishing HD Stream
                                    </p>
                                </div>
                            )}

                            <iframe
                                src={`https://www.youtube-nocookie.com/embed/${selectedTrailer.youtube_video_id}?autoplay=1&modestbranding=1&rel=0`}
                                className="w-full h-full border-none"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onLoad={() => setIsVideoLoading(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
