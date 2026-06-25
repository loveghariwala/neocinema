import { NextResponse } from "next/server";
import { tmdbService } from "@/lib/tmdb";

export const runtime = 'edge';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string; seasonNumber: string }> }
) {
    try {
        const { id, seasonNumber } = await params;
        const data = await tmdbService.getTvSeasonDetail(Number(id), Number(seasonNumber));
        return NextResponse.json({ success: true, episodes: data.episodes || [] });
    } catch (error) {
        console.error("[API] Failed to fetch episodes:", error);
        return NextResponse.json({ success: false, episodes: [] }, { status: 500 });
    }
}
