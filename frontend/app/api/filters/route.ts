import { NextRequest, NextResponse } from "next/server";
import { getAIServiceUrl } from "@/lib/config";

const AI_SERVICE_URL = getAIServiceUrl();

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const isMovie = searchParams.get("is_movie") ?? "true";

    try {
        const response = await fetch(
            `${AI_SERVICE_URL}/api/ai/filters?is_movie=${isMovie}`,
            { cache: "no-store" }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch filters" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Filters API error:", error);
        return NextResponse.json(
            { error: "Failed to connect to AI service" },
            { status: 500 }
        );
    }
}
