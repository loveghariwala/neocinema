import { NextRequest, NextResponse } from "next/server";
import { withFallback } from "@/lib/fallback";
import { tmdbService } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => params.set(key, value));

    try {
        const { data, source } = await withFallback(
            `/api/ai/discover/movies?${params.toString()}`,
            () => tmdbService.discoverMovies({
                page: Number(searchParams.get("page")) || 1,
                sort_by: searchParams.get("sort_by") || "popularity.desc",
                with_genres: searchParams.get("with_genres") || undefined,
                year_from: searchParams.get("year_from") ? Number(searchParams.get("year_from")) : undefined,
                year_to: searchParams.get("year_to") ? Number(searchParams.get("year_to")) : undefined,
                rating_min: searchParams.get("rating_min") ? Number(searchParams.get("rating_min")) : undefined,
                rating_max: searchParams.get("rating_max") ? Number(searchParams.get("rating_max")) : undefined,
                language: searchParams.get("language") || undefined,
            }),
            { cache: "no-store" }
        );

        const res = NextResponse.json(data);
        res.headers.set("X-Data-Source", source);
        // Cache discover results for 5 min at CDN edge
        res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
        return res;
    } catch (error) {
        return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
    }
}
