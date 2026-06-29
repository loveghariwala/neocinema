

import { Metadata } from "next";
import BrowsePageClient from "@/components/browse/BrowsePageClient";
import { Suspense } from "react";
import { cache } from "react";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";

import { discoverContentFromServer, getGenresFromServer, searchContentFromServer } from "@/services/movieService";

export const revalidate = 300; // ISR: regenerate every 5 minutes instead of every request

// ─── Cached data fetch (shared between generateMetadata + page render) ───────
const getMoviesPageData = cache(async (searchParams: Record<string, string>) => {
    const search = searchParams.search || "";
    const page = searchParams.page || "1";

    let data;
    if (search && search.trim().length >= 2) {
        data = await searchContentFromServer(search, "movie", page);
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

        data = await discoverContentFromServer("movie", queryParams);
    }

    const genresData = await getGenresFromServer("movie");
    return { data, genres: genresData.genres || [] };
});

// ─── CollectionPage + ItemList JSON-LD ───────────────────────────────────────
const generateMoviesJsonLd = (movies: any[]) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${baseUrl}/movies#collection`,
        "name": "Browse Movies — NeoCinema",
        "description": "Explore an extensive library of over 1 million movies from around the globe. Filter by genre, release year, rating, and language.",
        "url": `${baseUrl}/movies`,
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
            "numberOfItems": movies.length,
            "itemListElement": movies.slice(0, 20).map((movie: any, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Movie",
                    "name": movie.title || movie.name,
                    "description": movie.overview,
                    "image": movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : `${baseUrl}/neocinema_logo.png`,
                    "url": `${baseUrl}/movies/${movie.id || movie.tmdbId}`,
                    "dateCreated": movie.release_date,
                    ...(movie.rating && movie.voteCount ? {
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": movie.rating,
                            "bestRating": "10",
                            "ratingCount": movie.voteCount,
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
    const { data } = await getMoviesPageData(resolvedSearchParams as Record<string, string>);

    const page = resolvedSearchParams.page || "1";

    const movieKeywords = (data?.results || [])
        .slice(0, 10)
        .map((m: any) => m.title || m.name)
        .filter(Boolean);

    return {
        title: page === "1" ? "Browse Movies" : `Browse Movies - Page ${page}`,
        description: "Explore an extensive library of over 1 million movies from around the globe. Filter by genre, release year, rating, and language using our advanced discovery engine.",
        keywords: [
            "movies list", "browse movies", "global cinema", "film database",
            "movie search", "filter movies by genre", "free movies online",
            "HD movies", "trending movies", "top rated movies",
            "Jio cinema", "Watch Free Movies Online with Plex", "Watch movies online",
            "Watch Latest Movies Online only on Watcho", "123Movies - Watch Free Online Movies HD - 123'Movies",
            "Movies Anywhere: Home", "FMovies - Watch Free Movies Online - FREE Streaming In HD",
            ...movieKeywords,
        ],
        alternates: { canonical: '/movies' },
        robots: page === "1" ? { index: true, follow: true } : { index: false, follow: true },
        openGraph: {
            title: "Browse Movies | NeoCinema",
            description: "Explore an extensive library of over 1 million movies from around the globe. Filter by genre, release year, rating, and language.",
            url: '/movies',
            type: "website",
            images: [{ url: "/neocinema_logo.png", width: 800, height: 600, alt: "Browse Movies on NeoCinema" }],
        },
        twitter: {
            card: "summary_large_image",
            title: "Browse Movies | NeoCinema",
            description: "Explore an extensive library of over 1 million movies from around the globe.",
            images: ["/neocinema_logo.png"],
        },
    };
}

// ─── Page Content ────────────────────────────────────────────────────────────
async function MoviesPageContent({ searchParams }: PageProps) {
    const resolvedSearchParams = (await searchParams) || {};
    const { data, genres } = await getMoviesPageData(resolvedSearchParams as Record<string, string>);
    const movies = data?.results || [];

    return (
        <>
            <script
                id="movies-collection-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateMoviesJsonLd(movies)).replace(/</g, '\\u003c'),
                }}
            />
            <BrowsePageClient
                type="movie"
                title="Browse Movies"
                subtitle="1M+ movies from every country — filter, sort, discover"
                initialData={data}
                initialGenres={genres}
            />
        </>
    );
}

export default function MoviesPage({ searchParams }: PageProps) {
    return <MoviesPageContent searchParams={searchParams} />;
}
