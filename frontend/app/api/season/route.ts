import { NextRequest, NextResponse } from "next/server";
import { tmdbService } from "@/lib/tmdb";



export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get("seriesId");
    const season = searchParams.get("season");

    if (!seriesId || !season) {
        return NextResponse.json({ episodes: [] }, { status: 400 });
    }

    try {
        const data = await tmdbService.getTvSeasonDetail(Number(seriesId), Number(season));
        return NextResponse.json({ episodes: data?.episodes || [] }, {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    } catch {
        return NextResponse.json({ episodes: [] }, { status: 500 });
    }
}
