import { NextRequest, NextResponse } from "next/server";
import { withFallback } from "@/lib/fallback";
import { tmdbService } from "@/lib/tmdb";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const { data, source } = await withFallback(
            `/api/ai/movie/${id}`,
            () => tmdbService.getMovieDetail(Number(id)),
            { next: { revalidate: 86400 } } as any // Cache movie details for 24 hours
        );

        const res = NextResponse.json(data);
        res.headers.set("X-Data-Source", source);
        return res;
    } catch (error) {
        return NextResponse.json({ error: "Movie not found" }, { status: 500 });
    }
}
