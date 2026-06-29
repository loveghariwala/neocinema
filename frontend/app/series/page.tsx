

import { Metadata } from "next";
import BrowsePageClient from "@/components/browse/BrowsePageClient";
import { Suspense } from "react";
import { cache } from "react";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";

import { discoverContentFromServer, getGenresFromServer, searchContentFromServer } from "@/services/movieService";

export const revalidate = 300; // ISR: regenerate every 5 minutes instead of every request

// ─── Cached data fetch (shared between generateMetadata + page render) ───────
const getSeriesPageData = cache(async (searchParams: Record<string, string>) => {
    const search = searchParams.search || "";
    const page = searchParams.page || "1";

    let data;
    if (search && search.trim().length >= 2) {
        data = await searchContentFromServer(search, "tv", page);
    } else {
        const queryParams: Record<string, string> = {
            page,
            sort_by: searchParams.sort || "popularity.desc",
        };
        if (searchParams.genre) queryParams.with_genres = searchParams.genre;
        if (searchParams.yearFrom) queryParams.year_from = searchParams.yearFrom;
        if (searchParams.yearTo) queryParams.year_to = searchParams.yearTo;
        if (searchParams.ratingMin) queryParams.rating_min = searchParams.ratingMin;
        if (searchParams.ratingMax) queryParams.rating_max = searchParams.ratingMax;
        if (searchParams.language) queryParams.language = searchParams.language;

        data = await discoverContentFromServer("tv", queryParams);
    }

    const genresData = await getGenresFromServer("tv");
    return { data, genres: genresData.genres || [] };
});

// ─── CollectionPage + ItemList JSON-LD ───────────────────────────────────────
const generateSeriesJsonLd = (seriesList: any[]) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${baseUrl}/series#collection`,
        "name": "Browse TV Series — NeoCinema",
        "description": "Discover over 200,000 television series, documentaries, and anime from around the world.",
        "url": `${baseUrl}/series`,
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${baseUrl}#website`,
            "name": "NeoCinema",
            "url": baseUrl,
        },
        "publisher": {
            "@type": "Organization",
            "@id": `${baseUrl}#org`,
            "name": "NeoCinema",
            "url": baseUrl,
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/neocinema_logo.png`,
            },
        },
        "mainEntity": {
            "@type": "ItemList",
            "itemListOrder": "https://schema.org/ItemListUnordered",
            "numberOfItems": seriesList.length,
            "itemListElement": seriesList.slice(0, 20).map((series: any, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "TVSeries",
                    "name": series.title || series.name,
                    "description": series.overview,
                    "image": series.poster_path
                        ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
                        : `${baseUrl}/neocinema_logo.png`,
                    "url": `${baseUrl}/series/${series.id || series.tmdbId}`,
                    "startDate": series.first_air_date,
                    ...(series.rating && series.voteCount ? {
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": series.rating,
                            "bestRating": "10",
                            "ratingCount": series.voteCount,
                        },
                    } : {}),
                },
            })),
        },
    };
};

// ─── Dynamic Metadata ────────────────────────────────────────────────────────
interface PageProps {
    searchParams?: Promise<{
        genre?: string;
        yearFrom?: string;
        yearTo?: string;
        ratingMin?: string;
        ratingMax?: string;
        sort?: string;
        search?: string;
        page?: string;
        language?: string;
    }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const resolvedSearchParams = (await searchParams) || {};
    const { data } = await getSeriesPageData(resolvedSearchParams as Record<string, string>);

    const page = resolvedSearchParams.page || "1";

    const seriesKeywords = (data?.results || [])
        .slice(0, 10)
        .map((s: any) => s.title || s.name)
        .filter(Boolean);

    return {
        title: page === "1" ? "Browse TV Series" : `Browse TV Series - Page ${page}`,
        description: "Discover over 200,000 television series, documentaries, and anime from around the world. Find your next binge-watch with our AI-powered recommendation filters.",
        keywords: [
            "TV series", "television shows", "browse series", "binge-watch",
            "documentaries", "anime series", "top rated tv shows",
            "free series online", "streaming series", "trending series",
            ...seriesKeywords,
        ],
        alternates: { canonical: '/series' },
        robots: page === "1" ? { index: true, follow: true } : { index: false, follow: true },
        openGraph: {
            title: "Browse TV Series | NeoCinema",
            description: "Discover over 200,000 television series, documentaries, and anime from around the world.",
            url: '/series',
            type: "website",
            images: [{ url: "/neocinema_logo.png", width: 800, height: 600, alt: "Browse TV Series on NeoCinema" }],
        },
        twitter: {
            card: "summary_large_image",
            title: "Browse TV Series | NeoCinema",
            description: "Discover over 200,000 television series, documentaries, and anime from around the world.",
            images: ["/neocinema_logo.png"],
        },
    };
}

// ─── Page Content ────────────────────────────────────────────────────────────
async function SeriesPageContent({ searchParams }: PageProps) {
    const resolvedSearchParams = (await searchParams) || {};
    const { data, genres } = await getSeriesPageData(resolvedSearchParams as Record<string, string>);
    const seriesList = data?.results || [];

    return (
        <>
            <script
                id="series-collection-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateSeriesJsonLd(seriesList)).replace(/</g, '\\u003c'),
                }}
            />
            <BrowsePageClient
                type="tv"
                title="Browse Series"
                subtitle="200K+ series from every country — filter, sort, discover"
                initialData={data}
                initialGenres={genres}
            />
        </>
    );
}

export default function SeriesPage({ searchParams }: PageProps) {
    return <SeriesPageContent searchParams={searchParams} />;
}
