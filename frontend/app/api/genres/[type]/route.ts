import { NextRequest, NextResponse } from "next/server";
import { withFallback } from "@/lib/fallback";
import { tmdbService } from "@/lib/tmdb";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ type: string }> }
) {
    const { type } = await params;

    try {
        const { data, source } = await withFallback(
            `/api/ai/genres/${type}`,
            async () => {
                const genres = type === "movie"
                    ? await tmdbService.getMovieGenres()
                    : await tmdbService.getTvGenres();
                return { genres };
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
