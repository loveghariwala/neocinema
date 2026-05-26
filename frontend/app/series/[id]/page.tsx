import { getMovieDetails } from "@/services/movieService";
import { Star, Clock, Calendar, Globe } from "lucide-react";
import MovieRow from "@/components/sliders/MovieRow";
import { MotionDiv } from "@/components/layout/Motion";
import Image from "next/image";
import Link from "next/link";
import StreamPlayer from "@/components/player/StreamPlayer";
import WatchlistButton from "@/components/watchlist/WatchlistButton";
import ShareButton from "@/components/ui/ShareButton";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams?: Promise<{
        play?: string;
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
    const titleText = `${series.title} ${releaseYear ? `(${releaseYear})` : ""} — NeoCinema`;
    const descriptionText = series.overview
        ? `${series.overview.substring(0, 150)}...`
        : `Watch and discover TV Series ${series.title} with AI recommendations on NeoCinema.`;

    return {
        title: titleText,
        description: descriptionText,
        keywords: [series.title, ...(series.genres || []), "AI recommendations", "NeoCinema", "stream TV series"],
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
    const series = await getMovieDetails(id, "tv");

    if (!series) return <div className="flex h-screen items-center justify-center text-white text-xl font-bold">Series not found</div>;

    return (
        <main className="min-h-screen">
            {/* IMMERSIVE HERO */}
            <section className="relative min-h-[90vh] w-full flex items-center py-20 md:py-28 lg:py-32">
                <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    {series.backdropPath ? (
                        <Image src={`https://image.tmdb.org/t/p/w1280${series.backdropPath}`} alt={series.title} fill priority sizes="100vw" className="object-cover" />
                    ) : (
                        <div className="h-full w-full bg-neutral-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </MotionDiv>

                <div className="relative z-10 w-full px-6 md:px-16">
                    <div className="max-w-4xl">
                        <MotionDiv
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="mb-4 flex items-center gap-2">
                                <span className="rounded bg-blue-600 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">TV SERIES</span>
                                <span className="rounded bg-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">HDR</span>
                            </div>

                            <h1 className="mb-4 md:mb-6 text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-glow">
                                {series.title}
                            </h1>

                            <div className="mb-6 md:mb-8 flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400">
                                <div className="flex items-center gap-2 text-yellow-500">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-white">{series.rating?.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-red-600" />
                                    <span>{series.runtime} MIN / EP</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-red-600" />
                                    <span>{series.releaseDate ? new Date(series.releaseDate).getFullYear() : "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe size={16} className="text-red-600" />
                                    <span>{series.language?.toUpperCase()}</span>
                                </div>
                            </div>

                            <p className="mb-6 md:mb-10 max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-relaxed text-neutral-300 line-clamp-4 md:line-clamp-none">
                                {series.overview}
                            </p>

                            <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6">
                                <StreamPlayer
                                    tmdbId={series.tmdbId}
                                    imdbId={series.imdbId}
                                    title={series.title}
                                    isTv={true}
                                    seasons={series.seasons}
                                    autoPlay={autoPlay}
                                />

                                <WatchlistButton movie={series} />
                                <ShareButton title={series.title} />
                            </div>
                        </MotionDiv>
                    </div>
                </div>
            </section>

            {/* CONTENT GRID */}
            <div className="relative z-20 mt-6 sm:mt-12 space-y-16 sm:space-y-24 md:space-y-32 px-6 pb-20 sm:pb-32 md:px-16">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    <div className="col-span-1 space-y-10">
                        <div className="futuristic-card group">
                            <div className="relative z-10">
                                <div className="mb-8 flex items-center justify-between">
                                    <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-red-500">
                                        SERIES GENRES
                                    </h3>
                                    <span className="rounded-full bg-red-600/20 px-2 py-0.5 text-[8px] font-black text-red-500">AI POWERED</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {series.genres?.map((genre: string) => (
                                        <span
                                            key={genre}
                                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-black text-neutral-400 transition-all hover:border-red-600/40 hover:bg-red-600/20 hover:text-white hover:scale-105"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 overflow-hidden">
                        <div className="mb-10 flex items-center gap-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600/80">Starring Cast</h3>
                            <div className="h-px flex-1 bg-gradient-to-r from-red-600/20 to-transparent" />
                        </div>

                        <div className="flex gap-8 overflow-x-auto pb-10 scrollbar-hide snap-x snap-mandatory">
                            {series.cast?.map((actor: any) => (
                                <Link key={actor._id} href={`/person/${actor._id}`} className="min-w-[180px] group cursor-pointer snap-start block">
                                    <MotionDiv
                                        whileHover={{ scale: 1.05, y: -8 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        className="relative aspect-[2/3] mb-4 w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-xl border border-white/5 transition-all group-hover:border-white/20 group-hover:shadow-[0_0_40px_rgba(220,38,38,0.3)]"
                                    >
                                        {actor.profilePath ? (
                                            <Image src={`https://image.tmdb.org/t/p/w185${actor.profilePath}`} alt={actor.name} fill sizes="180px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-[10px] font-black uppercase text-neutral-500">NO PHOTO</div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    </MotionDiv>
                                    <h4 className="text-sm font-black text-white group-hover:text-red-500 transition-colors">{actor.name}</h4>
                                    <p className="text-xs font-medium text-neutral-500 line-clamp-1">{actor.character}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

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
