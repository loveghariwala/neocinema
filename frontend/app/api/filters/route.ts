import { NextRequest, NextResponse } from "next/server";
import { getAIServiceUrl } from "@/lib/config";
import { tmdbService } from "@/lib/tmdb";

const AI_SERVICE_URL = getAIServiceUrl();

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const isMovie = searchParams.get("is_movie") ?? "true";

    // Try FastAPI first (filters uses local MongoDB via FastAPI)
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const response = await fetch(
            `${AI_SERVICE_URL}/api/ai/filters?is_movie=${isMovie}`,
            { cache: "no-store", signal: controller.signal }
        );
        clearTimeout(timeout);

        if (response.ok) {
            const data = await response.json();
            const res = NextResponse.json(data);
            res.headers.set("X-Data-Source", "fastapi");
            // Filter options rarely change — cache for 1 hour
            res.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=7200");
            return res;
        }
    } catch (error) {
        console.warn("[Filters] FastAPI unavailable, falling back to TMDB genres:", error);
    }

    // Fallback: return TMDB genre list as filter options
    try {
        const genres = isMovie === "true"
            ? await tmdbService.getMovieGenres()
            : await tmdbService.getTvGenres();

        const data = {
            genres: genres.map((g: any) => g.name),
            years: { min: 1900, max: new Date().getFullYear() },
            ratings: { min: 0, max: 10 },
        };

        const res = NextResponse.json(data);
        res.headers.set("X-Data-Source", "nextjs");
        // Filter options rarely change — cache for 1 hour
        res.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=7200");
        return res;
    } catch (fallbackError) {
        console.error("Filters fallback error:", fallbackError);
        return NextResponse.json(
            { error: "Both FastAPI and fallback services unavailable" },
            { status: 500 }
        );
    }
}
