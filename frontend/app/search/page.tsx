import { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";
import { searchContentFromServer, getTrendingFromServer } from "@/services/movieService";

export const metadata: Metadata = {
    title: "Discover — NeoCinema",
    description:
        "Search and discover over 1 million movies and 200K+ series from every country in the world.",
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

    let data = { results: [], totalResults: 0, totalPages: 1, currentPage: 1 };
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