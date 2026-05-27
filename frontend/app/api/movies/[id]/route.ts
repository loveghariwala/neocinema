import { NextRequest, NextResponse } from "next/server";
import { getAIServiceUrl } from "@/lib/config";

const AI_SERVICE_URL = getAIServiceUrl();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const response = await fetch(`${AI_SERVICE_URL}/api/ai/movie/${id}`, {
            next: { revalidate: 86400 } // Cache movie details for 24 hours
        });
        if (!response.ok) {
            return NextResponse.json({ error: "Movie not found" }, { status: response.status });
        }
        return NextResponse.json(await response.json());
    } catch (error) {
        return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
    }
}
