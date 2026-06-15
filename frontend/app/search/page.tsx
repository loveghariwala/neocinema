import { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";
import { searchContentFromServer, getTrendingFromServer } from "@/services/movieService";

export const metadata: Metadata = {
    title: "Global Search & Discovery",
    description: "Search across millions of movies, TV shows, and cast members. NeoCinema's global search engine helps you find exactly what you want to watch.",
    keywords: ["movie search", "search TV shows", "find actors", "NeoCinema search", "global movie database", "content discovery"],
    alternates: { canonical: '/search' },
    openGraph: {
        title: "Global Search & Discovery | NeoCinema",
        description: "Search across millions of movies, TV shows, and cast members. NeoCinema's global search engine helps you find exactly what you want to watch.",
        url: '/search',
        type: "website",
        images: [{ url: "/neocinema_logo.png", width: 800, height: 600, alt: "Search NeoCinema" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Global Search & Discovery | NeoCinema",
        description: "Search across millions of movies, TV shows, and cast members.",
        images: ["/neocinema_logo.png"],
    }
};

interface SearchPageProps {
    searchParams?: Promise<{
        q?: string;
        type?: string;
        page?: string;
    }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const resolvedSearchParams = (await searchParams) || {};
    const query = resolvedSearchParams.q || "";
    const type = resolvedSearchParams.type || "";
    const page = resolvedSearchParams.page || "1";

    let data: any = { results: [], totalResults: 0, totalPages: 1, currentPage: 1 };
    let trending: any[] = [];

    if (query && query.trim().length >= 2) {
        data = await searchContentFromServer(query, type, page);
    } else {
        const trendingData = await getTrendingFromServer("movie", "week", "1");
        trending = trendingData.results || [];
    }

    return (
        <SearchPageClient
            initialQuery={query}
            initialType={type}
            initialPage={parseInt(page)}
            initialData={data}
            initialTrending={trending}
        />
    );
}