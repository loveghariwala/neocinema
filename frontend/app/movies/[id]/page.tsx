
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
const AdsterraNativeBanner = nextDynamic(() => import("@/components/ads/AdsterraNativeBanner"));
import ShareButton from "@/components/ui/ShareButton";
import { Metadata } from "next";
// import ServerNoteBanner from "@/components/ui/ServerNoteBanner"; // COMMENTED OUT: Not needed without stream player
import { Play } from "lucide-react";

export const revalidate = 5184000; // 2 months (60 days) - maximum Edge CDN caching

export async function generateStaticParams() {
    return [
        { id: "969681" },
        { id: "557" },
        { id: "558" },
        { id: "559" },
        { id: "634649" },
    ];
}

interface PageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams?: Promise<{
        play?: string;
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
    const movie = await getMovieDetails(id, "movie");

    if (!movie) {
        return {
            title: "Movie Not Found — Neocinema",
            description: "The movie details page you are trying to reach does not exist or has been removed.",
            robots: { index: false, follow: false }
        };
    }

    const safeDate = movie.releaseDate && !isNaN(new Date(movie.releaseDate).getTime())
        ? new Date(movie.releaseDate)
        : null;
    const releaseYear = safeDate ? safeDate.getFullYear() : "";

    // Check if the movie is upcoming (release date is in the future)
    const isUpcoming = safeDate ? safeDate.getTime() > Date.now() : false;

    const genreLabel = (movie.genres || []).slice(0, 2).join(' & ') || 'Movie';
    const titleText = isUpcoming
        ? `Cast of ${movie.title}, Release Date & Everything We Know`
        : `${movie.title} ${releaseYear ? `(${releaseYear}) ` : ""}— Cast, Trailers & Where to Watch`;
    const descriptionText = isUpcoming
        ? `Discover the cast of ${movie.title}${releaseYear ? ` (${releaseYear})` : ""}, release date, characters, and plot summary. Read latest updates about ${movie.title} on Neocinema.`
        : `${movie.overview ? movie.overview.substring(0, 140).trim() + '.' : `Discover ${movie.title}, a ${genreLabel.toLowerCase()} film.`} Find where to watch, cast, trailers & reviews on Neocinema.`;

    const castKeywords = (movie.cast || []).slice(0, 5).map((c: any) => c.name).filter(Boolean);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";
    const canonicalUrl = `${baseUrl}/movies/${id}`;
    const isBlocked = isMovieBlocked(id);

    const movieImage = movie.backdropPath
        ? `https://image.tmdb.org/t/p/w780${movie.backdropPath}`
        : movie.posterPath
            ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
            : `${baseUrl}/og_banner.png`;

    return {
        title: titleText,
        description: descriptionText,
        keywords: [
            `cast of ${movie.title}`,
            `where to watch ${movie.title}`,
            movie.title,
            `${movie.title} ${releaseYear}`,
            `${movie.title} cast`,
            `${movie.title} review`,
            `${movie.title} trailer`,
            `movies like ${movie.title}`,
            `${movie.title} streaming online`,
            `watch ${movie.title} trailer hd`,
            `${movie.title} release date and cast`,
            `is ${movie.title} available to watch`,
            ...(movie.genres || []),
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
                    url: movieImage,
                    width: movie.backdropPath ? 780 : 500,
                    height: movie.backdropPath ? 439 : 750,
                    alt: movie.title || titleText,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${titleText} | Neocinema`,
            description: descriptionText,
            images: [movieImage],
        }
    };
}

import { getKinocheckTrailers } from "@/services/kinocheckService";
import { notFound } from "next/navigation";

export default async function MovieDetailsPage({
    params,
}: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (isMovieBlocked(id)) {
        notFound();
    }

    const movieData = await getMovieDetails(id, "movie");

    if (!movieData) {
        notFound();
    }

    const movie: any = movieData;
    const trailers = await getKinocheckTrailers(movie.tmdbId, false, movie.videos);
    const primaryTrailer = trailers[0];

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";
    const safeDate = movie.releaseDate && !isNaN(new Date(movie.releaseDate).getTime())
        ? new Date(movie.releaseDate)
        : null;
    const releaseYear = safeDate ? safeDate.getFullYear() : "";

    // ─── Movie JSON-LD ───────────────────────────────────────────────────────
    const movieJsonLd = {
        "@context": "https://schema.org",
        "@type": "Movie",
        "@id": `${baseUrl}/movies/${id}#movie`,
        "name": movie.title,
        "image": movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : `${baseUrl}/logo.png`,
        "description": movie.overview,
        "dateCreated": movie.releaseDate || undefined,
        "dateModified": new Date().toISOString(),
        "url": `${baseUrl}/movies/${id}`,
        "genre": movie.genres,
        "duration": movie.runtime ? `PT${movie.runtime}M` : undefined,
        ...(primaryTrailer ? {
            "trailer": {
                "@type": "VideoObject",
                "name": `${movie.title} - ${primaryTrailer.title}`,
                "description": `Watch the official HD trailer for ${movie.title} (${releaseYear || ""}) on Neocinema.`,
                "thumbnailUrl": [
                    primaryTrailer.youtube_thumbnail || `https://img.youtube.com/vi/${primaryTrailer.youtube_video_id}/hqdefault.jpg`
                ],
                "uploadDate": movie.releaseDate ? `${movie.releaseDate}T00:00:00Z` : new Date().toISOString(),
                "embedUrl": `https://www.youtube-nocookie.com/embed/${primaryTrailer.youtube_video_id}`
            }
        } : {}),
        ...(movie.director ? {
            "director": {
                "@type": "Person",
                "name": movie.director,
            }
        } : {}),
        ...(movie.rating && movie.voteCount ? {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": movie.rating,
                "bestRating": "10",
                "ratingCount": movie.voteCount,
            },
        } : {}),
        "actor": (movie.cast || []).slice(0, 5).map((c: any) => ({
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
            { "@type": "ListItem", "position": 2, "name": "Movies", "item": `${baseUrl}/movies` },
            { "@type": "ListItem", "position": 3, "name": movie.title, "item": `${baseUrl}/movies/${id}` },
        ],
    };

    // Removed templated FAQ JSON-LD to avoid thin content penalties

    const videoObjectJsonLd = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "@id": `${baseUrl}/movies/${id}#video`,
        "name": `${movie.title} (${releaseYear || ""}) - Official Stream & Trailer`,
        "description": movie.overview
            ? movie.overview.substring(0, 200).trim()
            : `Stream ${movie.title} online on Neocinema.`,
        "thumbnailUrl": [
            movie.backdropPath
                ? `https://image.tmdb.org/t/p/w780${movie.backdropPath}`
                : movie.posterPath
                    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                    : `${baseUrl}/og_banner.png`
        ],
        "uploadDate": safeDate ? safeDate.toISOString() : new Date().toISOString(),
        "contentUrl": `${baseUrl}/movies/${id}`,
        "embedUrl": primaryTrailer
            ? `https://www.youtube-nocookie.com/embed/${primaryTrailer.youtube_video_id}`
            : `${baseUrl}/movies/${id}`,
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
        <>
            <script
                id="json-ld-movie"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(movieJsonLd).replace(/</g, '\\u003c') }}
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


            <main className="min-h-screen bg-black text-white overflow-x-hidden">
                {/* IMMERSIVE 2-COLUMN HERO */}
                <section className="relative min-h-[75vh] sm:min-h-[85vh] w-full flex items-center py-20 md:py-28 lg:py-32 overflow-hidden bg-black">
                    {/* Backdrop Image */}
                    <div className="absolute inset-0 z-0">
                        {movie.backdropPath ? (
                            <Image
                                src={getTmdbImageUrl(movie.backdropPath, "w1280", movie.title)}
                                alt={movie.title}
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
                                <div className="relative w-44 sm:w-56 md:w-full aspect-[2/3] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(220,38,38,0.3)] bg-neutral-900 group">
                                    {movie.posterPath ? (
                                        <Image
                                            src={getTmdbImageUrl(movie.posterPath, "w500", movie.title)}
                                            alt={movie.title}
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

                                    {movie.rating > 0 && (
                                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-xs font-black text-yellow-400 border border-white/10 backdrop-blur-md shadow-lg">
                                            <Star size={12} fill="currentColor" />
                                            {movie.rating.toFixed(1)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Details Column */}
                            <div className="md:col-span-8 lg:col-span-9 space-y-5 text-center md:text-left min-w-0">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                                    <span className="rounded-full bg-red-600/20 border border-red-500/30 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest text-red-500 backdrop-blur-md shadow-sm">
                                        4K ULTRA HD
                                    </span>
                                    <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest text-neutral-300 backdrop-blur-md">
                                        HDR
                                    </span>
                                    {movie.genres?.[0] && (
                                        <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest text-neutral-300 backdrop-blur-md">
                                            {movie.genres[0]}
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight text-white leading-tight sm:leading-none break-words drop-shadow-xl">
                                    {movie.title}
                                </h1>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                                    {movie.rating > 0 && (
                                        <div className="flex items-center gap-1.5 text-yellow-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-white font-black">{movie.rating.toFixed(1)}</span>
                                        </div>
                                    )}
                                    {movie.runtime > 0 && (
                                        <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                                            <Clock size={14} className="text-red-500" />
                                            <span className="text-white font-bold">{movie.runtime} MIN</span>
                                        </div>
                                    )}
                                    {releaseYear && (
                                        <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                                            <Calendar size={14} className="text-red-500" />
                                            <span className="text-white font-bold">{releaseYear}</span>
                                        </div>
                                    )}
                                    {movie.language && (
                                        <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                                            <Globe size={14} className="text-red-500" />
                                            <span className="text-white font-bold uppercase">{movie.language}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="max-w-3xl text-xs sm:text-sm md:text-base font-medium leading-relaxed text-neutral-300 drop-shadow line-clamp-4 sm:line-clamp-none">
                                    {movie.overview}
                                </p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 pt-2">
                                    <a
                                        href="#trailers-section"
                                        className="flex items-center gap-2.5 rounded-2xl bg-red-600 hover:bg-red-500 px-6 py-3.5 text-xs sm:text-sm font-black text-white uppercase tracking-wider transition-all shadow-xl shadow-red-950"
                                    >
                                        <Play fill="currentColor" size={16} />
                                        <span>WATCH TRAILER</span>
                                    </a>

                                    <ShareButton title={movie.title} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CONTENT GRID */}
                <div className="relative z-20 max-w-7xl mx-auto space-y-12 sm:space-y-16 px-4 sm:px-6 lg:px-8 pb-20 sm:pb-32 min-w-0">
                    
                    {/* OFFICIAL TRAILERS & WATCHMODE STREAMING AVAILABILITY */}
                    <div id="trailers-section" className="space-y-6 min-w-0">
                        <KinocheckTrailerSection tmdbId={movie.tmdbId} title={movie.title} />
                        <WatchmodeAvailabilityBanner tmdbId={movie.tmdbId} />
                    </div>

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 min-w-0">
                        {/* LEFT: DETAILS & GENRES */}
                        <div className="col-span-1 space-y-6 min-w-0">
                            <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-xl shadow-2xl space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-red-500">
                                    Genres
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {movie.genres?.map((genre: string) => (
                                        <span
                                            key={genre}
                                            className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-neutral-300 hover:border-red-500 hover:text-white transition-all"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {movie.productionCompanies?.length > 0 && (
                                <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-xl shadow-2xl space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-red-500">
                                        Production
                                    </h3>
                                    <div className="space-y-2.5">
                                        {movie.productionCompanies?.map((company: string) => (
                                            <div key={company} className="flex items-center gap-2.5 text-xs font-bold text-neutral-300">
                                                <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                                                {company}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: CAST */}
                        <div className="col-span-1 lg:col-span-2 min-w-0 overflow-hidden">
                            <CastRow cast={movie.cast} />
                        </div>
                    </div>

                    <AdsterraNativeBanner />

                    {/* AI SIMILAR MOVIES */}
                    {movie.similar?.length > 0 && (
                        <div className="space-y-6 min-w-0">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase">AI RECOMMENDS</h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-red-600/50 via-red-600/10 to-transparent" />
                                <Link href={`/movies/${id}/similar`} className="text-[10px] sm:text-xs font-bold text-red-500 hover:text-white uppercase tracking-widest whitespace-nowrap bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                                    Movies Like {movie.title}
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                                {movie.similar.slice(0, 12).map((simMovie: any) => (
                                    <MovieCard key={simMovie.tmdbId || simMovie.id} movie={simMovie} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
