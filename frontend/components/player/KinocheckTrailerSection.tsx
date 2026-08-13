"use client";

import { useEffect, useState } from "react";
import { getKinocheckTrailers, KinocheckTrailer } from "@/services/kinocheckService";
import { Film, Play, Volume2, VolumeX, X, Sparkles } from "lucide-react";

interface Props {
    tmdbId: number;
    title: string;
    isTv?: boolean;
}

export default function KinocheckTrailerSection({ tmdbId, title, isTv = false }: Props) {
    const [trailers, setTrailers] = useState<KinocheckTrailer[]>([]);
    const [selectedTrailer, setSelectedTrailer] = useState<KinocheckTrailer | null>(null);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [isAutoPreviewed, setIsAutoPreviewed] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        if (tmdbId) {
            getKinocheckTrailers(tmdbId, isTv).then((data) => {
                setTrailers(data);
                
                // Auto-preview first trailer 2 seconds after page load
                if (data && data.length > 0) {
                    const timer = setTimeout(() => {
                        setSelectedTrailer(data[0]);
                        setIsAutoPreviewed(true);
                        setIsMuted(true); // Autoplay muted for browser compliance
                        setIsVideoLoading(true);
                    }, 2000);
                    return () => clearTimeout(timer);
                }
            });
        }
    }, [tmdbId, isTv]);

    if (!trailers || trailers.length === 0) return null;

    const mainTrailer = trailers[0];
    const otherTrailers = trailers.slice(1, 4);

    return (
        <div className="w-full my-8 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-500">
                        <Film size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-black uppercase tracking-[0.2em] text-white">
                                OFFICIAL TRAILERS & PREVIEWS
                            </h3>
                            <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/30">
                                <Sparkles size={10} /> 4K Ultra HD
                            </span>
                        </div>
                        <p className="text-[11px] font-medium text-neutral-400">Official trailers & exclusive teasers</p>
                    </div>
                </div>
            </div>

            {/* Featured Main Trailer (Big Card) */}
            {mainTrailer && (
                <div className="relative group w-full rounded-3xl overflow-hidden border border-white/15 bg-neutral-900/90 shadow-2xl transition-all duration-300 hover:border-red-500/60">
                    <button
                        onClick={() => {
                            setSelectedTrailer(mainTrailer);
                            setIsMuted(false);
                            setIsVideoLoading(true);
                        }}
                        className="w-full aspect-video sm:aspect-[21/9] relative block text-left overflow-hidden cursor-pointer touch-manipulation group"
                    >
                        <img
                            src={mainTrailer.youtube_thumbnail}
                            alt={mainTrailer.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${mainTrailer.youtube_video_id}/maxresdefault.jpg`;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                        {/* Animated Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute h-20 w-20 rounded-full bg-red-600/30 animate-ping" />
                                <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-600/60 group-hover:scale-110 transition-transform">
                                    <Play fill="currentColor" size={28} className="ml-1" />
                                </div>
                            </div>
                        </div>

                        {/* Banner Labels */}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-white bg-red-600 px-3 py-1 rounded-full shadow-lg">
                                FEATURED TRAILER
                            </span>
                            <span className="text-[10px] font-bold text-neutral-200 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                {mainTrailer.type || "Official Trailer"}
                            </span>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                            <h4 className="text-base sm:text-xl font-black text-white drop-shadow-md line-clamp-1">
                                {mainTrailer.title || `${title} Official Trailer`}
                            </h4>
                            <p className="text-xs text-neutral-300 font-medium line-clamp-1 mt-1">
                                Click to watch in full 4K with audio
                            </p>
                        </div>
                    </button>
                </div>
            )}

            {/* Additional Trailers Grid */}
            {otherTrailers.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {otherTrailers.map((trailer) => (
                        <button
                            key={trailer.id || trailer.youtube_video_id}
                            onClick={() => {
                                setSelectedTrailer(trailer);
                                setIsMuted(false);
                                setIsVideoLoading(true);
                            }}
                            className="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 aspect-video text-left transition-all hover:scale-[1.03] hover:border-red-500/50 shadow-lg cursor-pointer touch-manipulation"
                        >
                            <img
                                src={trailer.youtube_thumbnail}
                                alt={trailer.title}
                                className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${trailer.youtube_video_id}/mqdefault.jpg`;
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="rounded-full bg-red-600/90 p-3 text-white shadow-xl shadow-red-600/50 group-hover:scale-110 transition-transform">
                                    <Play fill="currentColor" size={18} className="ml-0.5" />
                                </div>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                                <span className="text-[9px] font-black uppercase tracking-wider text-red-400 bg-black/70 px-2 py-0.5 rounded-full border border-red-500/30 backdrop-blur-md">
                                    {trailer.type || "Teaser"}
                                </span>
                                <h4 className="text-xs font-bold text-white truncate mt-1">{trailer.title}</h4>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Trailer Modal Overlay with Autoplay & Mute Control */}
            {selectedTrailer && (
                <div
                    onClick={() => setSelectedTrailer(null)}
                    className="fixed inset-0 z-[200000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl bg-neutral-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900">
                            <div className="flex items-center gap-3">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                                <h3 className="text-sm font-black text-white truncate max-w-md">{selectedTrailer.title}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-bold text-white hover:bg-white/20 transition-colors flex items-center gap-1.5"
                                >
                                    {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-green-400" />}
                                    {isMuted ? "Unmute Sound" : "Muted"}
                                </button>
                                <button
                                    onClick={() => setSelectedTrailer(null)}
                                    className="p-2 rounded-full bg-white/10 text-white hover:bg-red-600 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
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
                                </div>
                            )}

                            <iframe
                                key={`${selectedTrailer.youtube_video_id}-${isMuted}`}
                                src={`https://www.youtube-nocookie.com/embed/${selectedTrailer.youtube_video_id}?autoplay=1&mute=${isMuted ? 1 : 0}&modestbranding=1&rel=0`}
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

