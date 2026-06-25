export const runtime = 'edge';
import { NextResponse } from "next/server";
import { getFallbackStatus } from "@/lib/fallback";
import { getAIServiceUrl } from "@/lib/config";

export async function GET() {
    const fallbackStatus = getFallbackStatus();

    // Quick FastAPI health check
    let fastApiHealthy = false;
    let fastApiLatencyMs = 0;

    try {
        const aiServiceUrl = getAIServiceUrl();
        const start = Date.now();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(`${aiServiceUrl}/`, { signal: controller.signal });
        clearTimeout(timeout);
        fastApiLatencyMs = Date.now() - start;
        fastApiHealthy = response.ok;
    } catch {
        fastApiHealthy = false;
    }

    return NextResponse.json({
        activeBackend: fastApiHealthy ? "fastapi" : "nextjs",
        fastapi: {
            healthy: fastApiHealthy,
            latencyMs: fastApiLatencyMs,
            url: getAIServiceUrl(),
        },
        nextjsFallback: {
            ready: true,
            description: "Direct TMDB proxy with in-memory caching",
        },
        circuitBreaker: fallbackStatus,
    });
}
