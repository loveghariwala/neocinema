import { NextRequest, NextResponse } from "next/server";
import { getAIServiceUrl } from "@/lib/config";
import { tmdbService } from "@/lib/tmdb";

const AI_SERVICE_URL = getAIServiceUrl();

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    // Forward all query params to the AI service
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
        params.set(key, value);
    });

    // Try FastAPI first (browse uses local MongoDB via FastAPI)
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const response = await fetch(
            `${AI_SERVICE_URL}/api/ai/browse?${params.toString()}`,
            { cache: "no-store", signal: controller.signal }
        );
        clearTimeout(timeout);

        if (response.ok) {
            const data = await response.json();
            const res = NextResponse.json(data);
            res.headers.set("X-Data-Source", "fastapi");
            return res;
        }
    } catch (error) {
        console.warn("[Browse] FastAPI unavailable, falling back to TMDB discover:", error);
    }

    // Fallback: use TMDB discover as a substitute for local browse
    try {
        const isMovie = searchParams.get("is_movie") !== "false";
        const page = Number(searchParams.get("page")) || 1;
        const sortBy = searchParams.get("sort_by") || "popularity";
        const sortOrder = searchParams.get("sort_order") || "desc";

        const tmdbSortBy = `${sortBy === "rating" ? "vote_average" : sortBy}.${sortOrder}`;

        const discoverParams = {
            page,
            sort_by: tmdbSortBy,
            with_genres: searchParams.get("genres") || undefined,
            year_from: searchParams.get("year_from") ? Number(searchParams.get("year_from")) : undefined,
            year_to: searchParams.get("year_to") ? Number(searchParams.get("year_to")) : undefined,
            rating_min: searchParams.get("rating_min") ? Number(searchParams.get("rating_min")) : undefined,
            rating_max: searchParams.get("rating_max") ? Number(searchParams.get("rating_max")) : undefined,
        };

        const data = isMovie
            ? await tmdbService.discoverMovies(discoverParams)
            : await tmdbService.discoverTv(discoverParams);

        const res = NextResponse.json(data);
        res.headers.set("X-Data-Source", "nextjs");
        return res;
    } catch (fallbackError) {
        console.error("Browse fallback error:", fallbackError);
        return NextResponse.json(
            { error: "Both FastAPI and fallback services unavailable" },
            { status: 500 }
        );
    }
}
