import { getWatchLandingBySlug, WATCH_LANDINGS } from "@/lib/watch-landings";
import { discoverContentFromServer } from "@/services/movieService";
import MovieCard from "@/components/cards/MovieCard";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";

export function generateStaticParams() {
    return WATCH_LANDINGS.map((landing) => ({
        slug: landing.slug,
    }));
}
export const revalidate = 86400;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const landing = getWatchLandingBySlug(slug);
    if (!landing) return { title: "Not Found", robots: { index: false } };

    return {
        title: landing.title,
        description: landing.description,
        keywords: landing.keywords,
        alternates: { canonical: `/watch/${slug}` },
        robots: { index: true, follow: true },
        openGraph: {
            title: landing.title,
            description: landing.description,
            url: `/watch/${slug}`,
            type: "website",
        },
    };
}

export default async function WatchLandingPage({ params }: PageProps) {
    const { slug } = await params;
    const landing = getWatchLandingBySlug(slug);
    if (!landing) notFound();

    // Build clean params (only include defined values)
    const buildParams = (page: string) => {
        const p: Record<string, string> = {
            sort_by: landing.params.sort_by || "popularity.desc",
            page,
        };
        if (landing.params.with_genres) p.with_genres = landing.params.with_genres;
        if (landing.params.language) p.language = landing.params.language;
        if (landing.params.rating_min !== undefined) p.rating_min = String(landing.params.rating_min);
        if (landing.params.year_from !== undefined) p.year_from = String(landing.params.year_from);
        if (landing.params.year_to !== undefined) p.year_to = String(landing.params.year_to);
        return p;
    };

    const [page1, page2] = await Promise.all([
        discoverContentFromServer(landing.type, buildParams("1")),
        discoverContentFromServer(landing.type, buildParams("2")),
    ]);

    const results = [...(page1?.results || []), ...(page2?.results || [])];

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

    // Related landings for internal linking
    const relatedLandings = WATCH_LANDINGS
        .filter(l => l.slug !== slug)
        .slice(0, 6);

    // JSON-LD ItemList schema for rich results
    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": landing.h1,
        "description": landing.description,
        "url": `${baseUrl}/watch/${slug}`,
        "numberOfItems": results.length,
        "itemListElement": results.slice(0, 20).map((item: any, i: number) => ({
            "@type": "ListItem",
            "position": i + 1,
            "url": `${baseUrl}/${landing.type === 'movie' ? 'movies' : 'series'}/${item.tmdbId}`,
            "name": item.title,
        })),
    };

    return (
        <>
            <script
                id="json-ld-itemlist"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, '\\u003c') }}
            />
            <main className="min-h-screen pt-24 pb-20 px-6 md:px-16">
                <div className="max-w-7xl mx-auto space-y-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-red-500 hover:text-white transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    <div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-4">
                            {landing.h1}
                        </h1>
                        <p className="text-neutral-400 max-w-3xl text-sm md:text-base leading-relaxed">
                            {landing.description}
                        </p>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                        {results.map((item: any) => (
                            <MovieCard key={item.tmdbId} movie={item} />
                        ))}
                    </div>

                    {/* Internal Linking: Related Categories */}
                    <div className="border-t border-white/5 pt-12 space-y-6">
                        <h2 className="text-xl font-black tracking-tight text-white">
                            Explore More Categories
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {relatedLandings.map(l => (
                                <Link
                                    key={l.slug}
                                    href={`/watch/${l.slug}`}
                                    className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center hover:border-red-500/30 hover:bg-red-500/5 transition-all group"
                                >
                                    <span className="text-xs font-bold text-neutral-400 group-hover:text-red-500 transition-colors">
                                        {l.h1.replace('Watch ', '').replace(' Online Free', '')}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
