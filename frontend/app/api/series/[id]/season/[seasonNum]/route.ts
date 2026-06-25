export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { withFallback } from "@/lib/fallback";
import { tmdbService } from "@/lib/tmdb";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; seasonNum: string }> }
) {
    const { id, seasonNum } = await params;

    try {
        const { data, source } = await withFallback(
            `/api/ai/tv/${id}/season/${seasonNum}`,
            () => tmdbService.getTvSeasonDetail(Number(id), Number(seasonNum)),
            { next: { revalidate: 86400 } } as any // Cache season details for 24 hours
        );

        const res = NextResponse.json(data);
        res.headers.set("X-Data-Source", source);
        return res;
    } catch (error) {
        return NextResponse.json({ error: "Season not found" }, { status: 500 });
    }
}
