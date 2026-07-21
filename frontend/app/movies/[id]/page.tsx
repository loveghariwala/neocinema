
import { getMovieDetails } from "@/services/movieService";
import { Calendar, Clock, Download, Globe, Star } from 'lucide-react';

import MovieCard from "@/components/cards/MovieCard";
import CastRow from "@/components/sliders/CastRow";
import { MotionDiv } from "@/components/layout/Motion";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
const StreamPlayer = dynamic(() => import("@/components/player/StreamPlayer"));
import ShareButton from "@/components/ui/ShareButton";
import { Metadata } from "next";
import ServerNoteBanner from "@/components/ui/ServerNoteBanner";

export const revalidate = 86400; // ISR: cache movie detail pages for 24 hours

interface PageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams?: Promise<{
        play?: string;
    }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;
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
        : `Watch ${movie.title} ${releaseYear ? `(${releaseYear}) ` : ""}Online Free`;
    const descriptionText = isUpcoming
        ? `Discover the cast of ${movie.title}${releaseYear ? ` (${releaseYear})` : ""}, release date, characters, and plot summary. Read latest updates about ${movie.title} on Neocinema.`
        : `Stream ${movie.title} full movie no registration. ${movie.overview ? movie.overview.substring(0, 100).trim() + '...' : `Play ${movie.title} free streaming english.`} Watch online via our free web app.`;

    const castKeywords = (movie.cast || []).slice(0, 5).map((c: any) => c.name).filter(Boolean);
    const genreKeywords = (movie.genres || []).map((g: string) => `${g.toLowerCase()} movies free`);

    const blockedIds: string[] = [];
    const isBlocked = blockedIds.includes(String(id));

    return {
        title: titleText,
        description: descriptionText,
        keywords: [
            `cast of ${movie.title}`,
            `where to watch ${movie.title} online free hd`,
            `stream ${movie.title} full movie no registration`,
            `play ${movie.title} free streaming english`,
            `${movie.title} free watch online neocinema`,
            movie.title,
            `${movie.title} ${releaseYear}`,
            `${movie.title} cast`,
            `movies like ${movie.title}`,
            ...(movie.genres || []),
            ...genreKeywords,
            ...castKeywords,
        ].filter(Boolean),
        alternates: { 
            canonical: `/movies/${id}`,
        },
        robots: isBlocked || resolvedSearchParams?.play === 'true'
            ? { index: false, follow: false }
            : { index: true, follow: true },
        openGraph: {
            title: `${titleText} | Neocinema`,
            description: descriptionText,
            url: `/movies/${id}`,
            type: "video.movie",
            images: movie.backdropPath
                ? [{ url: `https://image.tmdb.org/t/p/w780${movie.backdropPath}` }]
                : movie.posterPath
                    ? [{ url: `https://image.tmdb.org/t/p/w500${movie.posterPath}` }]
                    : [{ url: "/logo.png" }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${titleText} | Neocinema`,
            description: descriptionText,
            images: movie.backdropPath ? [`https://image.tmdb.org/t/p/w780${movie.backdropPath}`] : ["/logo.png"],
        }
    };
}

import { notFound } from "next/navigation";

export default async function MovieDetailsPage({
    params,
    searchParams,
}: PageProps) {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;
    const autoPlay = resolvedSearchParams?.play === "true";
    const movie = await getMovieDetails(id, "movie");

    if (!movie) {
        notFound();
    }

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

    // VideoObject disabled to prevent structured data spam warnings
    /*
    const videoObjectJsonLd = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": `${movie.title} Full Movie HD`,
        "description": `Where to watch ${movie.title} online free HD. Stream ${movie.title} full movie no registration. ${movie.overview || ''}`,
        "thumbnailUrl": movie.backdropPath ? `https://image.tmdb.org/t/p/w780${movie.backdropPath}` : `${baseUrl}/logo.png`,
        "uploadDate": safeDate ? safeDate.toISOString() : new Date().toISOString(),
        "contentUrl": `${baseUrl}/movies/${id}?play=true`,
        "embedUrl": `${baseUrl}/movies/${id}?play=true`,
        "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": { "@type": "WatchAction" },
            "userInteractionCount": (movie.voteCount || 10) * 142
        }
    };
    */

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


            <main className="min-h-screen">
                <ServerNoteBanner />
                {/* IMMERSIVE HERO */}
                <section className="relative min-h-[90vh] w-full flex items-center py-20 md:py-28 lg:py-32 overflow-hidden bg-black">
                    <MotionDiv
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.1 }}
                        transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                        className="absolute inset-0"
                    >
                        {movie.backdropPath ? (
                            <Image
                                src={`https://image.tmdb.org/t/p/w1280${movie.backdropPath}`}
                                alt={movie.title}
                                fill
                                priority
                                sizes="100vw"
                                className="object-cover opacity-80"
                            />
                        ) : (
                            <div className="h-full w-full bg-neutral-900" />
                        )}
                    </MotionDiv>

                    {/* Next-Gen Vignette Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)] opacity-40" />

                    <div className="relative z-10 w-full px-6 md:px-16">
                        <div className="max-w-4xl">
                            <MotionDiv
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="rounded-full bg-red-600/20 border border-red-500/20 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-red-500 backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                                        4K ULTRA HD
                                    </span>
                                    <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-md">
                                        HDR
                                    </span>
                                </div>

                                <h1 className="mb-4 md:mb-6 pb-2 lg:pb-4 text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 leading-[1.1] filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                    {movie.title}
                                </h1>

                                <div className="mb-6 md:mb-8 flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400">
                                    <div className="flex items-center gap-2 text-yellow-500 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                                        <Star size={16} fill="currentColor" />
                                        <span className="text-white">{movie.rating?.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                                        <Clock size={16} className="text-red-500" />
                                        <span className="text-white">{movie.runtime} MIN</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                                        <Calendar size={16} className="text-red-500" />
                                        <span className="text-white">{releaseYear || "TBA"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                                        <Globe size={16} className="text-red-500" />
                                        <span className="text-white">{movie.language}</span>
                                    </div>
                                </div>

                                <p className="mb-8 md:mb-10 max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-relaxed text-neutral-300 drop-shadow-lg">
                                    {movie.overview}
                                </p>

                                <div className="flex flex-wrap gap-4 sm:gap-6">
                                    <StreamPlayer
                                        tmdbId={movie.tmdbId}
                                        imdbId={movie.imdbId}
                                        title={movie.title}
                                        autoPlay={autoPlay}
                                    />

                                    {/* 
                                    <a
                                        href="https://discussionanymore.com/khge4vq0f?key=0bc9ee47ad5de40ae42fce1eae3506e2"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition-all border border-white/5 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                    >
                                        <Download size={18} />
                                        Download 4K
                                    </a>
                                    */}

                                    <ShareButton title={movie.title} />
                                </div>
                            </MotionDiv>
                        </div>
                    </div>
                </section>

                {/* CONTENT GRID */}
                <div className="relative z-20 mt-6 sm:mt-12 space-y-16 sm:space-y-24 md:space-y-32 px-6 pb-20 sm:pb-32 md:px-16">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        {/* LEFT: DETAILS & GENRES */}
                        <div className="col-span-1 space-y-8">
                            <div className="rounded-3xl border border-white/5 bg-neutral-950/50 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                <div className="relative z-10">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                                            Genres
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {movie.genres?.map((genre: string) => (
                                            <span
                                                key={genre}
                                                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-black text-neutral-300 transition-all hover:border-red-500 hover:bg-red-500/20 hover:text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-white/5 bg-neutral-950/50 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                <div className="relative z-10">
                                    <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.4em] text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                                        Production
                                    </h3>
                                    <div className="space-y-4">
                                        {movie.productionCompanies?.map((company: string) => (
                                            <div key={company} className="flex items-center gap-3 text-sm font-bold text-neutral-400 group-hover:text-white transition-colors">
                                                <div className="h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                                                {company}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: CAST */}
                        <div className="col-span-2 overflow-hidden">
                            <CastRow cast={movie.cast} />
                        </div>
                    </div>


                    {/* AI SIMILAR MOVIES */}
                    {movie.similar?.length > 0 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">AI RECOMMENDS</h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-red-600/50 via-red-600/10 to-transparent" />
                                <Link href={`/movies/${id}/similar`} className="text-[10px] sm:text-xs font-bold text-red-500 hover:text-white uppercase tracking-widest whitespace-nowrap bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">Movies Like {movie.title}</Link>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                                {movie.similar.slice(0, 12).map((simMovie: any) => (
                                    <MovieCard key={simMovie.tmdbId} movie={simMovie} />
                                ))}
                            </div>
                        </div>
                    )}


                </div>
            </main>
        </>
    );
}
