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
            `/api/ai/tv/${id}`,
            () => tmdbService.getTvDetail(Number(id)),
            { next: { revalidate: 86400 } } as any // Cache series details for 24 hours
        );

        const res = NextResponse.json(data);
        res.headers.set("X-Data-Source", source);
        // Cache series details for 1 hour at CDN edge
        res.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=7200");
        return res;
    } catch (error) {
        return NextResponse.json({ error: "Series not found" }, { status: 500 });
    }
}
