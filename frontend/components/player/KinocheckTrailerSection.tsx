"use client";

import { useEffect, useState } from "react";
import { getKinocheckTrailers, KinocheckTrailer } from "@/services/kinocheckService";
import { Film, Play, Volume2, VolumeX, X, Sparkles } from "lucide-react";
import { track } from "@vercel/analytics";

interface Props {
    tmdbId: number;
    title: string;
    isTv?: boolean;
}

export default function KinocheckTrailerSection({ tmdbId, title, isTv = false }: Props) {
    const [trailers, setTrailers] = useState<KinocheckTrailer[]>([]);
    const [selectedTrailer, setSelectedTrailer] = useState<KinocheckTrailer | null>(null);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (tmdbId) {
            getKinocheckTrailers(tmdbId, isTv).then((data) => {
                setTrailers(data || []);
            });
        }
    }, [tmdbId, isTv]);

    const handleSelectTrailer = (trailer: KinocheckTrailer) => {
        setSelectedTrailer(trailer);
        setIsMuted(false);
        setIsVideoLoading(true);

        // Track user interaction with analytics to count as engaged session
        try {
            track("watch_trailer", {
                title: title,
                tmdbId: tmdbId,
                trailerTitle: trailer.title || title,
                youtubeId: trailer.youtube_video_id,
                mediaType: isTv ? "tv" : "movie",
            });

            if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
                (window as any).gtag("event", "watch_trailer", {
                    event_category: "engagement",
                    event_label: title,
                    value: tmdbId,
                });
            }
        } catch (e) {
            // Non-blocking catch for analytics tracking
        }
    };

    if (!trailers || trailers.length === 0) return null;

    const mainTrailer = trailers[trailers.length - 1];
    const otherTrailers = trailers.slice(0, trailers.length - 1).slice(0, 3);
    const activeTrailerToDisplay = selectedTrailer || mainTrailer;

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

            {/* Featured Main Container (Inline Player or Poster Card) */}
            {activeTrailerToDisplay && (
                <div className="relative group w-full rounded-3xl overflow-hidden border border-white/15 bg-neutral-950 shadow-2xl transition-all duration-300">
                    {selectedTrailer ? (
                        /* Inline Video Player Container */
                        <div className="relative w-full aspect-video bg-black overflow-hidden flex flex-col">
                            {/* Inline Control Header Bar */}
                            <div className="flex items-center justify-between px-5 py-3 bg-neutral-900/90 border-b border-white/10 backdrop-blur-md z-10">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                                    <h4 className="text-xs sm:text-sm font-black text-white truncate">
                                        NOW PLAYING: <span className="text-neutral-300 font-bold">{selectedTrailer.title || title}</span>
                                    </h4>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsMuted(!isMuted)}
                                        className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-extrabold text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                                    >
                                        {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-green-400" />}
                                        <span>{isMuted ? "Unmute" : "Sound On"}</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedTrailer(null)}
                                        className="p-1.5 rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors cursor-pointer"
                                        title="Close Trailer"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Video Iframe Viewport */}
                            <div className="relative flex-1 w-full h-full bg-black">
                                {isVideoLoading && (
                                    <div className="absolute inset-0 z-20 bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="relative flex items-center justify-center mb-3">
                                            <div className="absolute h-14 w-14 rounded-full border-4 border-red-600/30 border-t-red-600 animate-spin" />
                                            <Play fill="currentColor" size={18} className="text-red-500 animate-pulse ml-0.5" />
                                        </div>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-white">
                                            LOADING TRAILER...
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
                    ) : (
                        /* Default Thumbnail Play Card */
                        <button
                            onClick={() => handleSelectTrailer(activeTrailerToDisplay)}
                            className="w-full aspect-video relative block text-left overflow-hidden cursor-pointer touch-manipulation group"
                        >
                            <img
                                src={activeTrailerToDisplay.youtube_thumbnail}
                                alt={activeTrailerToDisplay.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${activeTrailerToDisplay.youtube_video_id}/maxresdefault.jpg`;
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
                                    {activeTrailerToDisplay.type || "Official Trailer"}
                                </span>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                                <h4 className="text-base sm:text-xl font-black text-white drop-shadow-md line-clamp-1">
                                    {activeTrailerToDisplay.title || `${title} Official Trailer`}
                                </h4>
                                <p className="text-xs text-neutral-300 font-medium line-clamp-1 mt-1">
                                    Click to watch inline in HD
                                </p>
                            </div>
                        </button>
                    )}
                </div>
            )}

            {/* Additional Trailers Grid */}
            {otherTrailers.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {otherTrailers.map((trailer) => (
                        <button
                            key={trailer.id || trailer.youtube_video_id}
                            onClick={() => handleSelectTrailer(trailer)}
                            className={`group relative rounded-2xl overflow-hidden border bg-neutral-900 aspect-video text-left transition-all hover:scale-[1.03] shadow-lg cursor-pointer touch-manipulation ${
                                selectedTrailer?.youtube_video_id === trailer.youtube_video_id
                                    ? "border-red-500 ring-2 ring-red-500/50"
                                    : "border-white/10 hover:border-red-500/50"
                            }`}
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
        </div>
    );
}

