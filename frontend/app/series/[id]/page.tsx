
import { getMovieDetails } from "@/services/movieService";
import { Calendar, Clock, Download, Globe, Star } from 'lucide-react';

import MovieCard from "@/components/cards/MovieCard";
import CastRow from "@/components/sliders/CastRow";
import { MotionDiv } from "@/components/layout/Motion";
import Image from "next/image";
import { getTmdbImageUrl } from "@/lib/tmdb";
import Link from "next/link";
import nextDynamic from "next/dynamic";
// const StreamPlayer = nextDynamic(() => import("@/components/player/StreamPlayer")); // COMMENTED OUT: Removed pirate stream embeds for legal compliance
const WatchmodeAvailabilityBanner = nextDynamic(() => import("@/components/ui/WatchmodeAvailabilityBanner"));
const KinocheckTrailerSection = nextDynamic(() => import("@/components/player/KinocheckTrailerSection"));
import ShareButton from "@/components/ui/ShareButton";
import SeasonEpisodeBrowser from "@/components/series/SeasonEpisodeBrowser";
import { Metadata } from "next";
// import ServerNoteBanner from "@/components/ui/ServerNoteBanner"; // COMMENTED OUT: Not needed without stream player
import { Play } from "lucide-react";

export const revalidate = 5184000; // 2 months (60 days) - maximum Edge CDN caching

export async function generateStaticParams() {
    return [
        { id: "1396" },
        { id: "1399" },
        { id: "66732" },
    ];
}

interface PageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams?: Promise<{
        play?: string;
        season?: string;
        episode?: string;
    }>;
}

import { isMovieBlocked, isMovieNoIndex } from "@/lib/blockedIds";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;

    if (isMovieBlocked(id)) {
        return {
            title: "Content Removed — NeoCinema",
            description: "This content is unavailable.",
            robots: { index: false, follow: false }
        };
    }

    const series = await getMovieDetails(id, "tv");

    if (!series) {
        return {
            title: "Series Not Found — Neocinema",
            description: "The TV series details page you are trying to reach does not exist or has been removed.",
            robots: { index: false, follow: false }
        };
    }

    const safeDate = series.releaseDate && !isNaN(new Date(series.releaseDate).getTime())
        ? new Date(series.releaseDate)
        : null;
    const releaseYear = safeDate ? safeDate.getFullYear() : "";
    const isUpcoming = safeDate ? safeDate.getTime() > Date.now() : false;

    const genreLabel = (series.genres || []).slice(0, 2).join(' & ') || 'TV Series';

    const titleText = isUpcoming
        ? `Cast of ${series.title}, Release Date & Everything We Know`
        : `${series.title} ${releaseYear ? `(${releaseYear}) ` : ""}— Cast, Trailers & Where to Watch`;

    const descriptionText = isUpcoming
        ? `Discover the cast of ${series.title}${releaseYear ? ` (${releaseYear})` : ""}, release date, characters, and seasons. View full details on Neocinema.`
        : `${series.overview ? series.overview.substring(0, 140).trim() + '.' : `Discover ${series.title}, a ${genreLabel.toLowerCase()} series.`}${series.number_of_seasons ? ` ${series.number_of_seasons} season${series.number_of_seasons > 1 ? 's' : ''}.` : ''}${series.rating ? ` ★ ${series.rating.toFixed(1)}/10.` : ''} Find where to watch, cast & reviews on Neocinema.`;

    const castKeywords = (series.cast || []).slice(0, 5).map((c: any) => c.name).filter(Boolean);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";
    const canonicalUrl = `${baseUrl}/series/${id}`;
    const isBlocked = isMovieBlocked(id);
    const seriesImage = series.backdropPath
        ? `https://image.tmdb.org/t/p/w780${series.backdropPath}`
        : series.posterPath
            ? `https://image.tmdb.org/t/p/w500${series.posterPath}`
            : `${baseUrl}/og_banner.png`;

    return {
        title: titleText,
        description: descriptionText,
        keywords: [
            `cast of ${series.title}`,
            `where to watch ${series.title}`,
            series.title,
            `${series.title} ${releaseYear}`,
            `${series.title} cast`,
            `${series.title} review`,
            `${series.title} trailer`,
            `shows like ${series.title}`,
            `${series.title} streaming online`,
            `watch ${series.title} episodes`,
            `${series.title} cast and characters`,
            `where to stream ${series.title}`,
            ...(series.genres || []),
            ...castKeywords,
        ].filter(Boolean),
        alternates: {
            canonical: canonicalUrl,
        },
        robots: isBlocked || isMovieNoIndex(id)
            ? { index: false, follow: false }
            : { index: true, follow: true },
        openGraph: {
            title: `${titleText} | Neocinema`,
            description: descriptionText,
            url: canonicalUrl,
            siteName: "Neocinema",
            locale: "en_US",
            type: "website",
            images: [
                {
                    url: seriesImage,
                    width: series.backdropPath ? 780 : 500,
                    height: series.backdropPath ? 439 : 750,
                    alt: series.title || titleText,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${titleText} | Neocinema`,
            description: descriptionText,
            images: [seriesImage],
        }
    };
}

import { getKinocheckTrailers } from "@/services/kinocheckService";
import { notFound } from "next/navigation";

export default async function SeriesDetailsPage({
    params,
}: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (isMovieBlocked(id)) {
        notFound();
    }

    const seasonParam = 1;
    const seriesData = await getMovieDetails(id, "tv");

    if (!seriesData) {
        notFound();
    }

    const series: any = seriesData;
    const trailers = await getKinocheckTrailers(series.tmdbId, true, series.videos);
    const primaryTrailer = trailers[0];

    const safeDate = series.releaseDate && !isNaN(new Date(series.releaseDate).getTime())
        ? new Date(series.releaseDate)
        : null;
    const releaseYear = safeDate ? safeDate.getFullYear() : "";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

    const seriesJsonLd = {
        "@context": "https://schema.org",
        "@type": "TVSeries",
        "@id": `${baseUrl}/series/${id}#tvseries`,
        "name": series.title,
        "image": series.posterPath ? `https://image.tmdb.org/t/p/w500${series.posterPath}` : `${baseUrl}/logo.png`,
        "description": series.overview,
        "startDate": series.releaseDate,
        "dateModified": new Date().toISOString(),
        "url": `${baseUrl}/series/${id}`,
        "genre": series.genres,
        "numberOfSeasons": series.number_of_seasons,
        "numberOfEpisodes": series.number_of_episodes,
        ...(primaryTrailer ? {
            "trailer": {
                "@type": "VideoObject",
                "name": `${series.title} - ${primaryTrailer.title}`,
                "description": `Watch the official HD trailer for ${series.title} (${releaseYear || ""}) on Neocinema.`,
                "thumbnailUrl": [
                    primaryTrailer.youtube_thumbnail || `https://img.youtube.com/vi/${primaryTrailer.youtube_video_id}/hqdefault.jpg`
                ],
                "uploadDate": series.releaseDate ? `${series.releaseDate}T00:00:00Z` : new Date().toISOString(),
                "embedUrl": `https://www.youtube-nocookie.com/embed/${primaryTrailer.youtube_video_id}`
            }
        } : {}),
        ...(series.rating && series.voteCount ? {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": series.rating,
                "bestRating": "10",
                "ratingCount": series.voteCount,
            },
        } : {}),
        "actor": (series.cast || []).slice(0, 5).map((c: any) => ({
            "@type": "Person",
            "name": c.name,
            "url": `${baseUrl}/person/${c._id}`,
        })),
        "publisher": {
            "@type": "Organization",
            "@id": `${baseUrl}#org`,
            "name": "Neocinema",
        },
    };

    // ─── Breadcrumb JSON-LD ──────────────────────────────────────────────────
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Series", "item": `${baseUrl}/series` },
            { "@type": "ListItem", "position": 3, "name": series.title, "item": `${baseUrl}/series/${id}` },
        ],
    };

    // Removed templated FAQ JSON-LD to avoid thin content penalties

    // ─── VideoObject JSON-LD ─────────────────────────────────────────────────
    const videoObjectJsonLd = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "@id": `${baseUrl}/series/${id}#video`,
        "name": `${series.title} (${releaseYear || ""}) - Official Stream & Trailer`,
        "description": series.overview
            ? series.overview.substring(0, 200).trim()
            : `Stream ${series.title} online on Neocinema.`,
        "thumbnailUrl": [
            series.backdropPath
                ? `https://image.tmdb.org/t/p/w780${series.backdropPath}`
                : series.posterPath
                    ? `https://image.tmdb.org/t/p/w500${series.posterPath}`
                    : `${baseUrl}/og_banner.png`
        ],
        "uploadDate": safeDate ? safeDate.toISOString() : new Date().toISOString(),
        "contentUrl": `${baseUrl}/series/${id}`,
        "embedUrl": primaryTrailer
            ? `https://www.youtube-nocookie.com/embed/${primaryTrailer.youtube_video_id}`
            : `${baseUrl}/series/${id}`,
        "publisher": {
            "@type": "Organization",
            "@id": `${baseUrl}#org`,
            "name": "Neocinema",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`
            }
        }
    };

    return (
        <main className="min-h-screen bg-black text-white overflow-x-hidden">
            {/* <ServerNoteBanner /> */}
            <script
                id="json-ld-series"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(seriesJsonLd).replace(/</g, '\\u003c') }}
            />
            <script
                id="json-ld-breadcrumb"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
            />
            <script
                id="json-ld-video"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectJsonLd).replace(/</g, '\\u003c') }}
            />

            {/* IMMERSIVE 2-COLUMN HERO */}
            <section className="relative min-h-[75vh] sm:min-h-[85vh] w-full flex items-center py-20 md:py-28 lg:py-32 overflow-hidden bg-black">
                {/* Backdrop Image */}
                <div className="absolute inset-0 z-0">
                    {series.backdropPath ? (
                        <Image
                            src={getTmdbImageUrl(series.backdropPath, "w1280", series.title)}
                            alt={series.title}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover opacity-65"
                        />
                    ) : (
                        <div className="h-full w-full bg-neutral-900" />
                    )}
                </div>

                {/* Soft Vignette Overlay for Crisp Visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10 z-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent z-1" />

                {/* Hero Content Container */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        
                        {/* Poster Column */}
                        <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-start">
                            <div className="relative w-44 sm:w-56 md:w-full aspect-[2/3] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.3)] bg-neutral-900 group">
                                {series.posterPath ? (
                                    <Image
                                        src={getTmdbImageUrl(series.posterPath, "w500", series.title)}
                                        alt={series.title}
                                        fill
                                        priority
                                        sizes="(max-width: 768px) 220px, 300px"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-neutral-800 flex items-center justify-center text-neutral-500 text-xs font-bold">
                                        No Poster
                                    </div>
                                )}

                                {series.rating > 0 && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-xs font-black text-yellow-400 border border-white/10 backdrop-blur-md shadow-lg">
                                        <Star size={12} fill="currentColor" />
                                        {series.rating.toFixed(1)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details Column */}
                        <div className="md:col-span-8 lg:col-span-9 space-y-5 text-center md:text-left min-w-0">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                                <span className="rounded-full bg-blue-600/20 border border-blue-500/30 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest text-blue-400 backdrop-blur-md shadow-sm">
                                    TV SERIES
                                </span>
                                <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest text-neutral-300 backdrop-blur-md">
                                    HDR
                                </span>
                                {series.genres?.[0] && (
                                    <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest text-neutral-300 backdrop-blur-md">
                                        {series.genres[0]}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight text-white leading-tight sm:leading-none break-words drop-shadow-xl">
                                {series.title}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                                {series.rating > 0 && (
                                    <div className="flex items-center gap-1.5 text-yellow-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                                        <Star size={14} fill="currentColor" />
                                        <span className="text-white font-black">{series.rating.toFixed(1)}</span>
                                    </div>
                                )}
                                {series.runtime > 0 && (
                                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                                        <Clock size={14} className="text-red-500" />
                                        <span className="text-white font-bold">{series.runtime} MIN / EP</span>
                                    </div>
                                )}
                                {releaseYear && (
                                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                                        <Calendar size={14} className="text-red-500" />
                                        <span className="text-white font-bold">{releaseYear}</span>
                                    </div>
                                )}
                                {series.language && (
                                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                                        <Globe size={14} className="text-red-500" />
                                        <span className="text-white font-bold uppercase">{series.language}</span>
                                    </div>
                                )}
                            </div>

                            <p className="max-w-3xl text-xs sm:text-sm md:text-base font-medium leading-relaxed text-neutral-300 drop-shadow line-clamp-4 sm:line-clamp-none">
                                {series.overview}
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 pt-2">
                                <a
                                    href="#trailers-section"
                                    className="flex items-center gap-2.5 rounded-2xl bg-red-600 hover:bg-red-500 px-6 py-3.5 text-xs sm:text-sm font-black text-white uppercase tracking-wider transition-all shadow-xl shadow-red-950"
                                >
                                    <Play fill="currentColor" size={16} />
                                    <span>WATCH TRAILER</span>
                                </a>

                                <ShareButton title={series.title} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT GRID */}
            <div className="relative z-20 max-w-7xl mx-auto space-y-12 sm:space-y-16 px-4 sm:px-6 lg:px-8 pb-20 sm:pb-32 min-w-0">
                {/* OFFICIAL TRAILERS & WATCHMODE STREAMING AVAILABILITY */}
                <div id="trailers-section" className="space-y-6 min-w-0">
                    <KinocheckTrailerSection tmdbId={series.tmdbId} title={series.title} isTv={true} />
                    <WatchmodeAvailabilityBanner tmdbId={series.tmdbId} isTv={true} />
                </div>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 min-w-0">
                    <div className="col-span-1 space-y-6 min-w-0">
                        <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-xl shadow-2xl space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-red-500">
                                Genres
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {series.genres?.map((genre: string) => (
                                    <span
                                        key={genre}
                                        className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-neutral-300 hover:border-red-500 hover:text-white transition-all"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 lg:col-span-2 min-w-0 overflow-hidden">
                        <CastRow cast={series.cast} />
                    </div>
                </div>

                {series.seasons?.length > 0 && (
                    <SeasonEpisodeBrowser
                        seriesId={String(series.tmdbId || series._id)}
                        seasons={series.seasons}
                        initialEpisodes={[]}
                        initialSeason={seasonParam}
                    />
                )}

                {series.similar?.length > 0 && (
                    <div className="space-y-6 min-w-0">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase">RECOMMENDED SERIES</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-red-600/50 via-red-600/10 to-transparent" />
                            <Link href={`/series/${id}/similar`} className="text-[10px] sm:text-xs font-bold text-red-500 hover:text-white uppercase tracking-widest whitespace-nowrap bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                                Shows Like {series.title}
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                            {series.similar.slice(0, 12).map((simSeries: any) => (
                                <MovieCard key={simSeries.tmdbId || simSeries.id} movie={simSeries} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
