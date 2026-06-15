import { Metadata } from "next";
import BrowsePageClient from "@/components/browse/BrowsePageClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { discoverContentFromServer, getGenresFromServer, searchContentFromServer } from "@/services/movieService";

export const metadata: Metadata = {
    title: "Browse Movies",
    description: "Explore an extensive library of over 1 million movies from around the globe. Filter by genre, release year, rating, and language using our advanced discovery engine.",
    keywords: ["movies list", "browse movies", "global cinema", "film database", "movie search", "filter movies by genre"],
    alternates: { canonical: '/movies' },
    openGraph: {
        title: "Browse Movies | NeoCinema",
        description: "Explore an extensive library of over 1 million movies from around the globe. Filter by genre, release year, rating, and language using our advanced discovery engine.",
        url: '/movies',
        type: "website",
        images: [{ url: "/neocinema_logo.png", width: 800, height: 600, alt: "Browse Movies on NeoCinema" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Browse Movies | NeoCinema",
        description: "Explore an extensive library of over 1 million movies from around the globe.",
        images: ["/neocinema_logo.png"],
    }
};

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

async function MoviesPageContent({ searchParams }: PageProps) {
    const resolvedSearchParams = (await searchParams) || {};
    const search = resolvedSearchParams.search || "";
    const page = resolvedSearchParams.page || "1";
    const type = "movie";

    let data;
    if (search && search.trim().length >= 2) {
        data = await searchContentFromServer(search, type, page);
    } else {
        const queryParams: Record<string, string> = {
            page,
            sort_by: resolvedSearchParams.sort || "popularity.desc",
        };
        if (resolvedSearchParams.genre) queryParams.with_genres = resolvedSearchParams.genre;
        if (resolvedSearchParams.yearFrom) queryParams.year_from = resolvedSearchParams.yearFrom;
        if (resolvedSearchParams.yearTo) queryParams.year_to = resolvedSearchParams.yearTo;
        if (resolvedSearchParams.ratingMin) queryParams.rating_min = resolvedSearchParams.ratingMin;
        if (resolvedSearchParams.ratingMax) queryParams.rating_max = resolvedSearchParams.ratingMax;
        if (resolvedSearchParams.language) queryParams.language = resolvedSearchParams.language;

        data = await discoverContentFromServer(type, queryParams);
    }

    const genresData = await getGenresFromServer(type);

    return (
        <BrowsePageClient
            type={type}
            title="Browse Movies"
            subtitle="1M+ movies from every country — filter, sort, discover"
            initialData={data}
            initialGenres={genresData.genres || []}
        />
    );
}

export default function MoviesPage({ searchParams }: PageProps) {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-red-600" />
            </div>
        }>
            <MoviesPageContent searchParams={searchParams} />
        </Suspense>
    );
}
