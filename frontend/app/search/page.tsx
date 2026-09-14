
import { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";
import { getTrendingFromServer } from "@/services/movieService";

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

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
    const title = "Global Search & Discovery";
    const description = "Search across millions of movies, TV shows, and cast members. Neocinema' global search engine helps you find exactly what you want to watch.";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

    return {
        title,
        description,
        keywords: [
            "movie search", "search TV shows", "find actors",
            "Neocinema search", "global movie database", "content discovery",
        ],
        alternates: { canonical: `${baseUrl}/search` },
        robots: { index: false, follow: true },
        openGraph: {
            title: `${title} | Neocinema`,
            description,
            url: `${baseUrl}/search`,
            type: "website",
            images: [{ url: "/og_banner.png", width: 1200, height: 630, alt: "Search Neocinema" }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | Neocinema`,
            description,
            images: ["/og_banner.png"],
        },
    };
}

import { Suspense } from "react";
import { Loader2 } from 'lucide-react';

// ─── Page Component ──────────────────────────────────────────────────────────
// Static shell: SearchPageClient reads ?q=, ?type= and ?page= with useSearchParams
// (hence the Suspense boundary) and loads results from /api/search.
export default async function SearchPage() {
    const trendingData = await getTrendingFromServer("movie", "week", "1");
    const trending = trendingData.results || [];

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
                <SearchPageClient initialTrending={trending} />
            </Suspense>
        </>
    );
}
