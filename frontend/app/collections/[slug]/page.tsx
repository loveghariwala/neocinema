import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollectionBySlug, COLLECTIONS } from "@/lib/collections";
import { discoverContentFromServer } from "@/services/movieService";
import MovieCard from "@/components/cards/MovieCard";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return COLLECTIONS.map((c) => ({
        slug: c.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const collection = getCollectionBySlug(slug);

    if (!collection) {
        return { title: "Collection Not Found" };
    }

    return {
        title: `${collection.title} | Curated List`,
        description: collection.description,
        keywords: collection.seoKeywords,
        alternates: { canonical: `/collections/${slug}` },
        openGraph: {
            title: collection.title,
            description: collection.description,
            url: `/collections/${slug}`,
            type: "website",
        }
    };
}

export default async function CollectionDetailPage({ params }: Props) {
    const { slug } = await params;
    const collection = getCollectionBySlug(slug);

    if (!collection) {
        notFound();
    }

    // Fetch the movies for this collection based on defined params
    const queryParams: Record<string, string> = { page: "1" };
    if (collection.params.with_genres) queryParams.with_genres = collection.params.with_genres;
    if (collection.params.sort_by) queryParams.sort_by = collection.params.sort_by;
    if (collection.params.rating_min) queryParams.rating_min = collection.params.rating_min.toString();
    if (collection.params.year_from) queryParams.year_from = collection.params.year_from.toString();
    if (collection.params.year_to) queryParams.year_to = collection.params.year_to.toString();
    if (collection.params.with_keywords) queryParams.with_keywords = collection.params.with_keywords;
    if (collection.params.language) queryParams.language = collection.params.language;
    if (collection.params.with_companies) queryParams.with_companies = collection.params.with_companies;

    const data = await discoverContentFromServer(collection.type, queryParams);
    const movies = data?.results || [];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": collection.title,
        "description": collection.description,
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://neocinematv.vercel.app'}/collections/${slug}`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": movies.map((movie: any, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://neocinematv.vercel.app'}/${collection.type === 'movie' ? 'movies' : 'series'}/${movie.id || movie._id || movie.tmdbId}`,
                "name": movie.title || movie.name || "Unknown",
                "image": movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : undefined
            }))
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-16 px-6 md:px-16 lg:px-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 border-b border-white/10 pb-12">
                    <div className="inline-block mb-4 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-500 text-xs font-bold tracking-widest uppercase">
                        Curated Collection
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 pb-2">
                        {collection.title}
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-400 max-w-3xl leading-relaxed">
                        {collection.description}
                    </p>
                </div>

                {movies.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-neutral-500 text-lg">No content found for this collection currently.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-12">
                        {movies.map((movie: any) => (
                            <MovieCard key={movie.id || movie._id || movie.tmdbId} movie={movie} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
