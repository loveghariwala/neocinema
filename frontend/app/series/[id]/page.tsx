import { getMovieDetails } from "@/services/movieService";
import { Star, Clock, Calendar, Globe } from "lucide-react";
import MovieRow from "@/components/sliders/MovieRow";
import CastRow from "@/components/sliders/CastRow";
import { MotionDiv } from "@/components/layout/Motion";
import Image from "next/image";
import Link from "next/link";
import StreamPlayer from "@/components/player/StreamPlayer";
import ShareButton from "@/components/ui/ShareButton";
import SeasonEpisodeBrowser from "@/components/series/SeasonEpisodeBrowser";
import { Metadata } from "next";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const series = await getMovieDetails(id, "tv");

    if (!series) {
        return {
            title: "Series Not Found — NeoCinema",
            description: "The TV series details page you are trying to reach does not exist or has been removed."
        };
    }

    const releaseYear = series.releaseDate ? new Date(series.releaseDate).getFullYear() : "";
    const titleText = `Watch ${series.title} ${releaseYear ? `(${releaseYear})` : ""} TV Series Online Free — NeoCinema`;
    const descriptionText = `Stream all seasons and episodes of ${series.title} in HD for free. ${
        series.overview ? series.overview.substring(0, 100) + '...' : ''
    } Experience ultra-fast streaming with no ads on NeoCinema.`;

    const castKeywords = (series.cast || []).slice(0, 5).map((c: any) => c.name).filter(Boolean);

    return {
        title: titleText,
        description: descriptionText,
        keywords: [series.title, ...(series.genres || []), ...castKeywords, "AI recommendations", "NeoCinema", "stream TV series", "watch series free"],
        alternates: { canonical: `/series/${id}` },
        robots: { index: true, follow: true },
        openGraph: {
            title: titleText,
            description: descriptionText,
            type: "video.tv_show",
            images: series.backdropPath
                ? [{ url: `https://image.tmdb.org/t/p/w780${series.backdropPath}` }]
                : series.posterPath
                    ? [{ url: `https://image.tmdb.org/t/p/w500${series.posterPath}` }]
                    : [{ url: "/neocinema_logo.png" }],
        },
        twitter: {
            card: "summary_large_image",
            title: titleText,
            description: descriptionText,
            images: series.backdropPath ? [`https://image.tmdb.org/t/p/w780${series.backdropPath}`] : ["/neocinema_logo.png"],
        }
    };
}

export default async function SeriesDetailsPage({
    params,
    searchParams,
}: PageProps) {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;
    const autoPlay = resolvedSearchParams?.play === "true";
    const seasonParam = resolvedSearchParams?.season ? parseInt(resolvedSearchParams.season) : 1;
    const episodeParam = resolvedSearchParams?.episode ? parseInt(resolvedSearchParams.episode) : 1;
    const series = await getMovieDetails(id, "tv");

    if (!series) return <div className="flex h-screen items-center justify-center text-white text-xl font-bold">Series not found</div>;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

    // ─── TVSeries JSON-LD ────────────────────────────────────────────────────
    const seriesJsonLd = {
        "@context": "https://schema.org",
        "@type": "TVSeries",
        "@id": `${baseUrl}/series/${id}#tvseries`,
        "name": series.title,
        "image": series.posterPath ? `https://image.tmdb.org/t/p/w500${series.posterPath}` : `${baseUrl}/neocinema_logo.png`,
        "description": series.overview,
        "startDate": series.releaseDate,
        "url": `${baseUrl}/series/${id}`,
        "genre": series.genres,
        "numberOfSeasons": series.number_of_seasons,
        "numberOfEpisodes": series.number_of_episodes,
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
            "name": "NeoCinema",
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

    return (
        <main className="min-h-screen">
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
            {/* IMMERSIVE HERO */}
            <section className="relative min-h-[90vh] w-full flex items-center py-20 md:py-28 lg:py-32 overflow-hidden bg-black">
                <MotionDiv
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.1 }}
                    transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0"
                >
                    {series.backdropPath ? (
                        <Image 
                            src={`https://image.tmdb.org/t/p/original${series.backdropPath}`} 
                            alt={series.title} 
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
                                <span className="rounded-full bg-blue-600/20 border border-blue-500/20 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-blue-500 backdrop-blur-md shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                                    TV SERIES
                                </span>
                                <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-md">
                                    HDR
                                </span>
                            </div>

                            <h1 className="mb-4 md:mb-6 pb-2 lg:pb-4 text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 leading-[1.1] filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                {series.title}
                            </h1>

                            <div className="mb-6 md:mb-8 flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400">
                                <div className="flex items-center gap-2 text-yellow-500 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-white">{series.rating?.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                                    <Clock size={16} className="text-red-500" />
                                    <span className="text-white">{series.runtime} MIN / EP</span>
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                                    <Calendar size={16} className="text-red-500" />
                                    <span className="text-white">{series.releaseDate ? new Date(series.releaseDate).getFullYear() : "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                                    <Globe size={16} className="text-red-500" />
                                    <span className="text-white">{series.language?.toUpperCase()}</span>
                                </div>
                            </div>

                            <p className="mb-8 md:mb-10 max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-relaxed text-neutral-300 drop-shadow-lg">
                                {series.overview}
                            </p>

                            <div className="flex flex-wrap gap-4 sm:gap-6">
                                <StreamPlayer
                                    tmdbId={series.tmdbId}
                                    imdbId={series.imdbId}
                                    title={series.title}
                                    isTv={true}
                                    seasons={series.seasons}
                                    autoPlay={autoPlay}
                                    initialSeason={seasonParam}
                                    initialEpisode={episodeParam}
                                />

                                <ShareButton title={series.title} />
                            </div>
                        </MotionDiv>
                    </div>
                </div>
            </section>

            {/* CONTENT GRID */}
            <div className="relative z-20 mt-6 sm:mt-12 space-y-16 sm:space-y-24 md:space-y-32 px-6 pb-20 sm:pb-32 md:px-16">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
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
                                    {series.genres?.map((genre: string) => (
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
                    </div>

                    <div className="col-span-2 overflow-hidden">
                        <CastRow cast={series.cast} />
                    </div>
                </div>

                {series.seasons?.length > 0 && (
                    <SeasonEpisodeBrowser
                        seriesId={String(series.tmdbId || series._id)}
                        seasons={series.seasons}
                    />
                )}

                {series.similar?.length > 0 && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-black tracking-tighter text-white">RECOMMENDED SERIES</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-red-600/50 to-transparent" />
                        </div>
                        <MovieRow title="" movies={series.similar} />
                    </div>
                )}
            </div>
        </main>
    );
}
