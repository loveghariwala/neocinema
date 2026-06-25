export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { withFallback } from "@/lib/fallback";
import { tmdbService } from "@/lib/tmdb";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ mediaType: string }> }
) {
    const { mediaType } = await params;
    const { searchParams } = new URL(request.url);
    const urlParams = new URLSearchParams();
    searchParams.forEach((value, key) => urlParams.set(key, value));

    if (!["movie", "tv", "all"].includes(mediaType)) {
        return NextResponse.json({ error: "mediaType must be 'movie', 'tv', or 'all'" }, { status: 400 });
    }

    try {
        const timeWindow = searchParams.get("time_window") || "week";
        const page = Number(searchParams.get("page")) || 1;

        const { data, source } = await withFallback(
            `/api/ai/trending/${mediaType}?${urlParams.toString()}`,
            () => tmdbService.getTrending(mediaType, timeWindow, page),
            { cache: "no-store" }
        );

        const res = NextResponse.json(data);
        res.headers.set("X-Data-Source", source);
        // Cache trending data for 5 min at CDN edge, serve stale for 10 min while revalidating
        res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
        return res;
    } catch (error) {
        return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
    }
}
