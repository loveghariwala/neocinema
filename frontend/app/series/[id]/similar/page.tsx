import { getMovieDetails } from "@/services/movieService";
import MovieCard from "@/components/cards/MovieCard";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";

export const runtime = 'edge';
export const revalidate = 86400;

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const series = await getMovieDetails(id, "tv");

    if (!series) return { title: "Not Found", robots: { index: false } };

    const titleText = `Top 12 TV Series Like ${series.title} to Watch Free`;
    const descriptionText = `Loved ${series.title}? Here are the best similar TV shows to binge-watch online for free in HD on NeoCinema.`;

    return {
        title: titleText,
        description: descriptionText,
        keywords: [`series like ${series.title}`, `shows similar to ${series.title}`, `what to watch after ${series.title}`, `watch free`],
        alternates: { canonical: `/series/${id}/similar` },
        robots: { index: true, follow: true },
    };
}

export default async function SimilarSeriesPage({ params }: PageProps) {
    const { id } = await params;
    const series = await getMovieDetails(id, "tv");

    if (!series) notFound();

    return (
        <main className="min-h-screen pt-24 pb-20 px-6 md:px-16">
            <div className="max-w-7xl mx-auto space-y-8">
                <Link href={`/series/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-red-500 hover:text-white transition-colors">
                    <ArrowLeft size={16} /> Back to {series.title}
                </Link>
                
                <div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4">
                        TV Shows Like <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">{series.title}</span>
                    </h1>
                    <p className="text-neutral-400 max-w-3xl">
                        If you enjoyed the epic storytelling of {series.title}, you'll love these similar TV series. Binge-watch them all in HD for free on NeoCinema.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    {series.similar?.map((simSeries: any) => (
                        <MovieCard key={simSeries.tmdbId} movie={simSeries} />
                    ))}
                    {series.similar?.length === 0 && (
                        <p className="text-neutral-500 col-span-full py-10">No similar shows found in our database.</p>
                    )}
                </div>
            </div>
        </main>
    );
}
