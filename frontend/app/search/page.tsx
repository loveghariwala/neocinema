
import { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";
import { searchContentFromServer, getTrendingFromServer } from "@/services/movieService";
import { cache } from "react";

// ─── Cached data fetch (shared between generateMetadata + page render) ───────
const getSearchPageData = cache(async (query: string, type: string, page: string) => {
    let data: any = { results: [], totalResults: 0, totalPages: 1, currentPage: 1 };
    let trending: any[] = [];

    if (query && query.trim().length >= 2) {
        data = await searchContentFromServer(query, type, page);
    } else {
        const trendingData = await getTrendingFromServer("movie", "week", "1");
        trending = trendingData.results || [];
    }

    return { data, trending };
});

// ─── SearchAction JSON-LD ────────────────────────────────────────────────────
const generateSearchJsonLd = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";
    return {
        "@context": "https://schema.org",
        "@type": "SearchResultsPage",
        "@id": `${baseUrl}/search#searchpage`,
        "name": "Search Movies & TV Series — Neocinema",
        "description": "Search across millions of movies, TV shows, and cast members with Neocinema' global search engine.",
        "url": `${baseUrl}/search`,
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${baseUrl}#website`,
            "name": "Neocinema",
            "url": baseUrl,
        },
        "publisher": {
            "@type": "Organization",
            "@id": `${baseUrl}#org`,
            "name": "Neocinema",
            "url": baseUrl,
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`,
            },
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };
};

// ─── Dynamic Metadata ────────────────────────────────────────────────────────
interface SearchPageProps {
    searchParams?: Promise<{
        q?: string;
        type?: string;
        page?: string;
    }>;
}

export async function generateMetadata(): Promise<Metadata> {
    const title = "Global Search & Discovery";
    const description = "Search across millions of movies, TV shows, and cast members. Neocinema' global search engine helps you find exactly what you want to watch.";

    return {
        title,
        description,
        keywords: [
            "movie search", "search TV shows", "find actors",
            "Neocinema search", "global movie database", "content discovery",
            "search movies online", "find series",
        ],
        alternates: { canonical: '/search' },
        robots: { index: false, follow: true },
        openGraph: {
            title: `${title} | Neocinema`,
            description,
            url: '/search',
            type: "website",
            images: [{ url: "/logo.png", width: 800, height: 600, alt: "Search Neocinema" }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | Neocinema`,
            description,
            images: ["/logo.png"],
        },
    };
}

import { Suspense } from "react";
import { Loader2 } from 'lucide-react';

// ─── Page Component ──────────────────────────────────────────────────────────
export default async function SearchPage() {
    const { data, trending } = await getSearchPageData("", "", "1");

    return (
        <>
            <script
                id="search-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateSearchJsonLd()).replace(/</g, '\\u003c'),
                }}
            />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-red-500" /></div>}>
                <SearchPageClient
                    initialQuery={""}
                    initialType={""}
                    initialPage={1}
                    initialData={data}
                    initialTrending={trending}
                />
            </Suspense>
        </>
    );
}
