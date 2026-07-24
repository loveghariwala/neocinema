import { getMovieDetails } from "@/services/movieService";
import MovieCard from "@/components/cards/MovieCard";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';


export const revalidate = 86400;

interface PageProps {
    params: Promise<{ id: string }>;
}

import { isMovieBlocked } from "@/lib/blockedIds";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    if (isMovieBlocked(id)) return { title: "Not Found", robots: { index: false } };
    const movie = await getMovieDetails(id, "movie");

    if (!movie) return { title: "Not Found", robots: { index: false } };

    const releaseYear = movie.releaseDate && !isNaN(new Date(movie.releaseDate).getTime())
        ? new Date(movie.releaseDate).getFullYear()
        : null;
    const titleText = `Top 12 Movies Like ${movie.title}${releaseYear ? ` (${releaseYear})` : ""} to Watch Free`;
    const descriptionText = `Loved ${movie.title}? Here are the best similar movies to watch online for free in HD on Neocinema.`;

    return {
        title: titleText,
        description: descriptionText,
        keywords: [`movies like ${movie.title}`, `similar to ${movie.title}`, `what to watch after ${movie.title}`, `watch free`],
        alternates: { canonical: `/movies/${id}/similar` },
        robots: { index: false, follow: true },
    };
}

export default async function SimilarMoviesPage({ params }: PageProps) {
    const { id } = await params;
    if (isMovieBlocked(id)) notFound();
    const movie = await getMovieDetails(id, "movie");

    if (!movie) notFound();

    return (
        <main className="min-h-screen pt-24 pb-20 px-6 md:px-16">
            <div className="max-w-7xl mx-auto space-y-8">
                <Link href={`/movies/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-red-500 hover:text-white transition-colors">
                    <ArrowLeft size={16} /> Back to {movie.title}
                </Link>
                
                <div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4">
                        Movies Like <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">{movie.title}</span>
                    </h1>
                    <p className="text-neutral-400 max-w-3xl">
                        If you enjoyed the cinematic experience of {movie.title}, you'll love these similar films. Stream them all in HD for free on Neocinema.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    {movie.similar?.map((simMovie: any) => (
                        <MovieCard key={simMovie.tmdbId} movie={simMovie} />
                    ))}
                    {movie.similar?.length === 0 && (
                        <p className="text-neutral-500 col-span-full py-10">No similar movies found in our database.</p>
                    )}
                </div>
            </div>
        </main>
    );
}
