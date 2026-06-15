import { NextRequest, NextResponse } from "next/server";
import { withFallback } from "@/lib/fallback";
import { tmdbService } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = Number(searchParams.get("page")) || 1;
    const type = searchParams.get("type");

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    const params = new URLSearchParams();
    searchParams.forEach((value, key) => params.set(key, value));

    try {
        const { data, source } = await withFallback(
            `/api/ai/search?${params.toString()}`,
            async () => {
                if (type === "movie") {
                    return tmdbService.searchMovies(query, page);
                } else if (type === "tv") {
                    return tmdbService.searchTv(query, page);
                } else {
                    return tmdbService.searchMulti(query, page);
                }
            },
            { cache: "no-store" }
        );

        const res = NextResponse.json(data);
        res.headers.set("X-Data-Source", source);
        return res;
    } catch (error) {
        return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
    }
}
