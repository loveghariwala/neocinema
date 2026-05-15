import { NextRequest, NextResponse } from "next/server";

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => params.set(key, value));

    try {
        const response = await fetch(
            `${AI_SERVICE_URL}/api/ai/discover/movies?${params.toString()}`,
            { cache: "no-store" }
        );
        if (!response.ok) {
            return NextResponse.json({ error: "API error" }, { status: response.status });
        }
        return NextResponse.json(await response.json());
    } catch (error) {
        return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
    }
}
