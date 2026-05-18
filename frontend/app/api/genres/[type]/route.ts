import { NextRequest, NextResponse } from "next/server";
import { getAIServiceUrl } from "@/lib/config";

const AI_SERVICE_URL = getAIServiceUrl();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ type: string }> }
) {
    const { type } = await params;

    try {
        const response = await fetch(
            `${AI_SERVICE_URL}/api/ai/genres/${type}`,
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
