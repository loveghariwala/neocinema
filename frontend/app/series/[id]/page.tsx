
import { getMovieDetails, getTvSeasonDetail } from "@/services/movieService";
import Star from "lucide-react/dist/esm/icons/star";
import Clock from "lucide-react/dist/esm/icons/clock";
import Calendar from "lucide-react/dist/esm/icons/calendar";
import Globe from "lucide-react/dist/esm/icons/globe";
import Download from "lucide-react/dist/esm/icons/download";

import MovieCard from "@/components/cards/MovieCard";
import CastRow from "@/components/sliders/CastRow";
import { MotionDiv } from "@/components/layout/Motion";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
const StreamPlayer = dynamic(() => import("@/components/player/StreamPlayer"));
import ShareButton from "@/components/ui/ShareButton";
import SeasonEpisodeBrowser from "@/components/series/SeasonEpisodeBrowser";
import { Metadata } from "next";

export const revalidate = 86400; // ISR: cache series detail pages for 24 hours

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
            description: "The TV series details page you are trying to reach does not exist or has been removed.",
            robots: { index: false, follow: false }
        };
    }

    const releaseYear = series.releaseDate ? new Date(series.releaseDate).getFullYear() : "";
    const titleText = `Watch ${series.title} ${releaseYear ? `(${releaseYear})` : ""} All Seasons Online Free HD | Stream Now`;
    const descriptionText = `Stream all ${series.number_of_seasons || ''} seasons of ${series.title} in HD for free.${series.rating ? ` Rated ${series.rating}/10.` : ''} ${series.overview ? series.overview.substring(0, 90) + '...' : ''} No ads, no sign-up.`;

    const castKeywords = (series.cast || []).slice(0, 5).map((c: any) => c.name).filter(Boolean);
    const genreKeywords = (series.genres || []).map((g: string) => `${g.toLowerCase()} series free`);

    const blockedIds = ["1180798", "1064137", "1154268", "260471", "1173900", "490005", "1628522", "852042"];
    const isBlocked = blockedIds.includes(String(id));

    return {
        title: titleText,
        description: descriptionText,
        keywords: [
            series.title,
            `${series.title} all seasons`,
            `watch ${series.title} online free`,
            `${series.title} streaming`,
            `${series.title} english subtitles`,
            `shows like ${series.title}`,
            ...(series.genres || []),
            ...genreKeywords,
            ...castKeywords,
            "watch series online free no sign up",
        ].filter(Boolean),
        alternates: { 
            canonical: `/series/${id}`,
            languages: {
                'en-US': `/series/${id}`,
                'en': `/series/${id}`
            }
        },
        robots: isBlocked ? { index: false, follow: false } : { index: true, follow: true },
        openGraph: {
            title: titleText,
            description: descriptionText,
            url: `/series/${id}`,
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

import { notFound } from "next/navigation";

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
    const seasonData = await getTvSeasonDetail(id, seasonParam);
    const seasonEpisodes = seasonData?.episodes || [];

    if (!series) {
        notFound();
    }

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
        "dateModified": new Date().toISOString(),
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

    // ─── Dynamic FAQ data (unique per series) ────────────────────────────────
    const topCast = (series.cast || []).slice(0, 3).map((c: any) => c.name).filter(Boolean);
    const genreList = (series.genres || []).join(', ');

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `Where can I watch ${series.title} for free?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${series.title} is a ${genreList} series${series.number_of_seasons ? ` with ${series.number_of_seasons} season${series.number_of_seasons > 1 ? 's' : ''}` : ''}${topCast.length ? `, starring ${topCast.join(', ')}` : ''}. You can binge-watch every episode in full HD on NeoCinema without any subscription or registration.`
                }
            },
            {
                "@type": "Question",
                "name": `What is ${series.title} about?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": series.overview || `${series.title} is a ${genreList} TV series. Watch it on NeoCinema to discover the full story.`
                }
            },
            {
                "@type": "Question",
                "name": `How many seasons of ${series.title} are there?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${series.title} currently has ${series.number_of_seasons || 'multiple'} season${(series.number_of_seasons || 0) !== 1 ? 's' : ''}${series.number_of_episodes ? ` and ${series.number_of_episodes} episodes in total` : ''}. All seasons are available to stream for free on NeoCinema.`
                }
            },
            {
                "@type": "Question",
                "name": `Is ${series.title} available on Netflix, Prime Video, or Hulu?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `While ${series.title} may be available on paid streaming services, you can watch all episodes completely free in HD quality on NeoCinema. No subscription needed.`
                }
            }
        ]
    };

    // ─── VideoObject JSON-LD ─────────────────────────────────────────────────
    const videoObjectJsonLd = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": `${series.title} Full Series HD`,
        "description": series.overview || `Watch ${series.title} Full TV Series Online Free in HD`,
        "thumbnailUrl": series.backdropPath ? `https://image.tmdb.org/t/p/w780${series.backdropPath}` : `${baseUrl}/neocinema_logo.png`,
        "uploadDate": series.releaseDate || new Date().toISOString().split('T')[0],
        "contentUrl": `${baseUrl}/series/${id}?play=true`,
        "embedUrl": `${baseUrl}/series/${id}?play=true`,
        "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": { "@type": "WatchAction" },
            "userInteractionCount": (series.voteCount || 10) * 142
        }
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
            <script
                id="json-ld-video"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectJsonLd).replace(/</g, '\\u003c') }}
            />
            <script
                id="json-ld-faq"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
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
                            src={`https://image.tmdb.org/t/p/w1280${series.backdropPath}`} 
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

                                <a
                                    href="https://discussionanymore.com/khge4vq0f?key=0bc9ee47ad5de40ae42fce1eae3506e2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-full bg-blue-600/10 hover:bg-blue-600/20 px-6 py-3 text-sm font-bold text-blue-100 backdrop-blur-md transition-all border border-blue-500/20 hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                                >
                                    <Download size={18} />
                                    Download HD
                                </a>

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
                        initialEpisodes={seasonEpisodes}
                        initialSeason={seasonParam}
                    />
                )}

                {series.similar?.length > 0 && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">RECOMMENDED SERIES</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-red-600/50 via-red-600/10 to-transparent" />
                            <Link href={`/series/${id}/similar`} className="text-[10px] sm:text-xs font-bold text-red-500 hover:text-white uppercase tracking-widest whitespace-nowrap bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">Shows Like {series.title}</Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                            {series.similar.slice(0, 12).map((simSeries: any) => (
                                <MovieCard key={simSeries.tmdbId} movie={simSeries} />
                            ))}
                        </div>
                    </div>
                )}

                {/* SEO FAQ SECTION */}
                <div className="space-y-8 mt-16 sm:mt-24 border-t border-white/5 pt-12">
                    <div className="flex flex-col items-center text-center gap-4 mb-8">
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            FREQUENTLY ASKED QUESTIONS
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        <div className="rounded-2xl border border-white/5 bg-neutral-950/50 p-6 backdrop-blur-xl shadow-xl hover:border-white/10 transition-colors">
                            <h3 className="text-sm font-black text-red-500 mb-2">Where can I watch {series.title} for free?</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">{series.title} is a {series.genres?.slice(0, 2).join('/')} series{series.number_of_seasons ? ` with ${series.number_of_seasons} season${series.number_of_seasons > 1 ? 's' : ''}` : ''}{(series.cast || []).length > 0 ? ` starring ${(series.cast || []).slice(0, 2).map((c: any) => c.name).join(' and ')}` : ''}. Stream it in full HD on NeoCinema — no subscription, no ads.</p>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-neutral-950/50 p-6 backdrop-blur-xl shadow-xl hover:border-white/10 transition-colors">
                            <h3 className="text-sm font-black text-red-500 mb-2">What is {series.title} about?</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">{series.overview?.substring(0, 200) || `${series.title} is a ${series.genres?.join(', ')} TV series. Watch it on NeoCinema to discover the full story.`}</p>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-neutral-950/50 p-6 backdrop-blur-xl shadow-xl hover:border-white/10 transition-colors">
                            <h3 className="text-sm font-black text-red-500 mb-2">How many seasons does {series.title} have?</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">{series.title} currently has {series.number_of_seasons || 'multiple'} season{(series.number_of_seasons || 0) !== 1 ? 's' : ''}{series.number_of_episodes ? ` and ${series.number_of_episodes} episodes` : ''}. All are available for free on NeoCinema.</p>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-neutral-950/50 p-6 backdrop-blur-xl shadow-xl hover:border-white/10 transition-colors">
                            <h3 className="text-sm font-black text-red-500 mb-2">Is {series.title} on Netflix or Prime Video?</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">While {series.title} may be on paid platforms, you can watch all episodes completely free in HD quality on NeoCinema. No subscription needed.</p>
                        </div>
                    </div>
                    {/* External Authority Link */}
                    <p className="text-center text-[10px] text-neutral-600 mt-6">
                        Series data sourced from <a href={`https://www.themoviedb.org/tv/${id}`} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-red-500 underline">TMDB</a>.
                    </p>
                </div>
            </div>
        </main>
    );
}
