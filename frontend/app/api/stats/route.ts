import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Movie from "@/models/Movie";

export async function GET() {
    try {
        await dbConnect();
        const total = await Movie.countDocuments();
        const latest = await Movie.find().sort({ createdAt: -1 }).limit(5).select("title createdAt");
        
        return NextResponse.json({
            totalMovies: total,
            latestIngested: latest,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
