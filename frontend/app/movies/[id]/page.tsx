import { getMovieDetails } from "@/services/movieService";
import { Star, Clock, Calendar, Globe, Share2 } from "lucide-react";
import MovieRow from "@/components/sliders/MovieRow";
import { MotionDiv } from "@/components/layout/Motion";
import StreamPlayer from "@/components/player/StreamPlayer";
import WatchlistButton from "@/components/watchlist/WatchlistButton";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function MovieDetailsPage({
    params,
}: PageProps) {
    const { id } = await params;
    const movie = await getMovieDetails(id, "movie");

    if (!movie) return <div className="flex h-screen items-center justify-center text-white text-xl font-bold">Movie not found</div>;

    return (
        <main className="min-h-screen">
            {/* IMMERSIVE HERO */}
            <section className="relative h-[90vh] w-full overflow-hidden">
                <MotionDiv 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    {movie.backdropPath ? (
                        <img
                            src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
                            alt={movie.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full bg-neutral-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </MotionDiv>

                <div className="relative z-10 flex h-full items-center px-6 md:px-16">
                    <div className="max-w-4xl">
                        <MotionDiv
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="mb-4 flex items-center gap-2">
                                <span className="rounded bg-red-600 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">4K ULTRA HD</span>
                                <span className="rounded bg-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">HDR</span>
                            </div>

                            <h1 className="mb-6 text-6xl font-black tracking-tighter text-glow md:text-8xl lg:text-9xl">
                                {movie.title}
                            </h1>
                            
                            <div className="mb-8 flex flex-wrap items-center gap-8 text-sm font-bold uppercase tracking-widest text-neutral-400">
                                <div className="flex items-center gap-2 text-yellow-500">
                                    <Star size={18} fill="currentColor" />
                                    <span className="text-white">{movie.rating?.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={18} className="text-red-600" />
                                    <span>{movie.runtime} MIN</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-red-600" />
                                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe size={18} className="text-red-600" />
                                    <span>{movie.language}</span>
                                </div>
                            </div>

                            <p className="mb-10 max-w-2xl text-xl font-medium leading-relaxed text-neutral-300">
                                {movie.overview}
                            </p>

                            <div className="flex flex-wrap gap-6">
                                <StreamPlayer 
                                    tmdbId={movie.tmdbId} 
                                    imdbId={movie.imdbId} 
                                    title={movie.title} 
                                />

                                <WatchlistButton movie={movie} />
                                
                                <button className="flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-5 font-black text-white backdrop-blur-xl transition-all hover:bg-white/10">
                                    <Share2 size={20} />
                                    SHARE
                                </button>
                            </div>
                        </MotionDiv>
                    </div>
                </div>
            </section>

            {/* CONTENT GRID */}
            <div className="relative z-20 mt-12 space-y-32 px-6 pb-32 md:px-16">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* LEFT: DETAILS & GENRES */}
                    <div className="col-span-1 space-y-10">
                        <div className="futuristic-card group">
                            <div className="relative z-10">
                                <div className="mb-8 flex items-center justify-between">
                                    <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-red-500">
                                        AI GENRES
                                    </h3>
                                    <span className="rounded-full bg-red-600/20 px-2 py-0.5 text-[8px] font-black text-red-500">AI POWERED</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {movie.genres?.map((genre: string) => (
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

                        <div className="futuristic-card">
                            <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.4em] text-red-600/80">Production</h3>
                            <div className="space-y-4">
                                {movie.productionCompanies?.map((company: string) => (
                                    <div key={company} className="flex items-center gap-3 text-sm font-bold text-neutral-500">
                                        <div className="h-1 w-1 rounded-full bg-red-600" />
                                        {company}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: CAST */}
                    <div className="col-span-2 overflow-hidden">
                        <div className="mb-10 flex items-center gap-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600/80">Starring Cast</h3>
                            <div className="h-px flex-1 bg-gradient-to-r from-red-600/20 to-transparent" />
                        </div>
                        
                        <div className="flex gap-8 overflow-x-auto pb-10 scrollbar-hide snap-x snap-mandatory">
                            {movie.cast?.map((actor: any) => (
                                <div key={actor._id} className="min-w-[180px] group cursor-pointer snap-start">
                                    <MotionDiv 
                                        whileHover={{ scale: 1.05, y: -8 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        className="relative aspect-[2/3] mb-4 w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-xl border border-white/5 transition-all group-hover:border-white/20 group-hover:shadow-[0_0_40px_rgba(220,38,38,0.3)]"
                                    >
                                        {actor.profilePath ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w300${actor.profilePath}`}
                                                alt={actor.name}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-[10px] font-black uppercase text-neutral-500">NO PHOTO</div>
                                        )}
                                        {/* Bottom Gradient Overlay for Cast */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    </MotionDiv>
                                    <h4 className="text-sm font-black text-white group-hover:text-red-500 transition-colors">{actor.name}</h4>
                                    <p className="text-xs font-medium text-neutral-500 line-clamp-1">{actor.character}</p>
                                </div>

                            ))}
                        </div>
                    </div>

                </div>


                {/* AI SIMILAR MOVIES */}
                {movie.similar?.length > 0 && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-black tracking-tighter text-white">AI RECOMMENDS</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-red-600/50 to-transparent" />
                        </div>
                        <MovieRow title="" movies={movie.similar} />
                    </div>
                )}
            </div>
        </main>
    );
}