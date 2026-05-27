import { NextResponse } from "next/server";
import { getAIServiceUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({
        AI_SERVICE_URL_RAW: process.env.AI_SERVICE_URL || "NOT_SET",
        AI_SERVICE_URL_RESOLVED: getAIServiceUrl(),
        MONGO_URI_SET: !!process.env.MONGO_URI,
        MONGO_URI_LENGTH: process.env.MONGO_URI ? process.env.MONGO_URI.length : 0,
        NODE_ENV: process.env.NODE_ENV,
        TMDB_API_KEY_SET: !!process.env.TMDB_API_KEY,
        TMDB_ACCESS_TOKEN_SET: !!process.env.TMDB_ACCESS_TOKEN
    });
}
