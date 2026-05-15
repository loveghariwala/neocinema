import { NextRequest, NextResponse } from "next/server";

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    // Forward all query params to the AI service
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
        params.set(key, value);
    });

    try {
        const response = await fetch(
            `${AI_SERVICE_URL}/api/ai/browse?${params.toString()}`,
            { cache: "no-store" }
        );

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json(
                { error: `AI service error: ${error}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Browse API error:", error);
        return NextResponse.json(
            { error: "Failed to connect to AI service" },
            { status: 500 }
        );
    }
}
