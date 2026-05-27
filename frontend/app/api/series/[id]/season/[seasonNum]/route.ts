import { NextRequest, NextResponse } from "next/server";
import { getAIServiceUrl } from "@/lib/config";

const AI_SERVICE_URL = getAIServiceUrl();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; seasonNum: string }> }
) {
    const { id, seasonNum } = await params;

    try {
        const response = await fetch(`${AI_SERVICE_URL}/api/ai/tv/${id}/season/${seasonNum}`);
        if (!response.ok) {
            return NextResponse.json({ error: "Season not found" }, { status: response.status });
        }
        return NextResponse.json(await response.json());
    } catch (error) {
        return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
    }
}
