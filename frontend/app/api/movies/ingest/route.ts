import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Movie from "@/models/Movie";
import People from "@/models/People";
import axios from "axios";

const tmdb = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
    },
});

export async function GET() {
    try {
        await dbConnect();
        
        let totalIngested = 0;
        const pagesToFetch = 10; 

        for (let page = 1; page <= pagesToFetch; page++) {
            console.log(`Ingesting page ${page}...`);
            const response = await tmdb.get(`/trending/movie/week?page=${page}`);
            const movies = response.data.results;

            for (const movie of movies) {
                try {
                    // Fetch details one by one to avoid connection reset
                    const details = await tmdb.get(`/movie/${movie.id}`);
                    const credits = await tmdb.get(`/movie/${movie.id}/credits`);
                    const videos = await tmdb.get(`/movie/${movie.id}/videos`);
                    const keywords = await tmdb.get(`/movie/${movie.id}/keywords`);
                    const recommendations = await tmdb.get(`/movie/${movie.id}/recommendations`);

                    const castIds = [];
                    for (const actor of credits.data.cast.slice(0, 10)) {
                        const savedActor = await People.findOneAndUpdate(
                            { tmdbId: actor.id },
                            {
                                tmdbId: actor.id,
                                name: actor.name,
                                profilePath: actor.profile_path,
                                character: actor.character,
                                knownForDepartment: actor.known_for_department,
                            },
                            { upsert: true, new: true }
                        );
                        castIds.push(savedActor._id);
                    }

                    await Movie.findOneAndUpdate(
                        { tmdbId: movie.id },
                        {
                            tmdbId: movie.id,
                            title: details.data.title,
                            overview: details.data.overview,
                            posterPath: details.data.poster_path,
                            backdropPath: details.data.backdrop_path,
                            releaseDate: details.data.release_date,
                            rating: details.data.vote_average,
                            popularity: details.data.popularity,
                            runtime: details.data.runtime,
                            language: details.data.original_language,
                            status: details.data.status,
                            tagline: details.data.tagline,
                            genres: details.data.genres.map((g: any) => g.name),
                            trailers: videos.data.results
                                .filter((v: any) => v.site === "YouTube")
                                .map((v: any) => v.key),
                            cast: castIds,
                            recommendations: recommendations.data.results.map((r: any) => r.id),
                            productionCompanies: details.data.production_companies.map((c: any) => c.name),
                            keywords: keywords.data.keywords.map((k: any) => k.name),
                            isMovie: true
                        },
                        { upsert: true, new: true }
                    );
                    totalIngested++;
                    console.log(`Ingested: ${details.data.title}`);
                } catch (err) {
                    console.error(`Failed to ingest movie ${movie.id}:`, err);
                }
            }

            // Small delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return NextResponse.json({
            success: true,
            message: `Successfully ingested ${totalIngested} movies with full details`,
        });
    } catch (error: any) {
        console.error("Ingestion error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

