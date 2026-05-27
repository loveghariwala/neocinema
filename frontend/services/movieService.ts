import dbConnect from "@/lib/mongodb";
import Movie from "@/models/Movie";
import People from "@/models/People";
import { getAIServiceUrl } from "@/lib/config";

export async function getTrendingMovies() {
    await dbConnect();
    const movies = await Movie.find({ isMovie: true })
        .sort({ popularity: -1 })
        .limit(20)
        .lean();
    return JSON.parse(JSON.stringify(movies));
}

export async function getTrendingSeries() {
    await dbConnect();
    const series = await Movie.find({ isMovie: false })
        .sort({ popularity: -1 })
        .limit(20)
        .lean();
    return JSON.parse(JSON.stringify(series));
}

export async function getTopRatedMovies() {
    await dbConnect();
    const movies = await Movie.find({ isMovie: true })
        .sort({ rating: -1 })
        .limit(20)
        .lean();
    return JSON.parse(JSON.stringify(movies));
}

export async function getMovieDetails(id: string, type: "movie" | "tv" = "movie") {
    // If it's a numeric ID (TMDB ID), fetch from external API via AI service
    if (/^\d+$/.test(id)) {
        try {
            const aiServiceUrl = getAIServiceUrl();
            const endpoint = type === "movie" ? `/api/ai/movie/${id}` : `/api/ai/tv/${id}`;
            const response = await fetch(`${aiServiceUrl}${endpoint}`, { cache: "no-store" });
            
            if (response.ok) {
                const data = await response.json();
                
                // Fetch AI recommendations from FastAPI using tmdbId/numeric ID
                let similarMovies: any[] = [];
                try {
                    const aiRes = await fetch(`${aiServiceUrl}/api/ai/recommend/${id}?limit=10`);
                    if (aiRes.ok) {
                        const aiData = await aiRes.json();
                        const recIds = aiData.recommendations?.map((r: any) => r.id) || [];
                        if (recIds.length > 0) {
                            await dbConnect();
                            const fetchedMovies = await Movie.find({ _id: { $in: recIds } }).lean();
                            similarMovies = fetchedMovies.sort(
                                (a: any, b: any) => recIds.indexOf(String(a._id)) - recIds.indexOf(String(b._id))
                            );
                        }
                    }
                } catch (recError) {
                    console.warn("AI Recommendations failed for TMDB ID:", recError);
                }

                // If AI recommendation is empty, fallback to TMDB similar
                if (similarMovies.length === 0) {
                    similarMovies = data.similar?.results?.slice(0, 10).map((s: any) => ({
                        tmdbId: s.id,
                        title: s.title || s.name,
                        posterPath: s.poster_path,
                        rating: s.vote_average,
                        isMovie: type === "movie"
                    })) || [];
                }
                
                // Normalize TMDB detail format to our internal format for the UI
                return {
                    _id: String(data.id),
                    tmdbId: data.id,
                    imdbId: data.imdb_id || data.external_ids?.imdb_id,
                    title: data.title || data.name,
                    overview: data.overview,
                    posterPath: data.poster_path,
                    backdropPath: data.backdrop_path,
                    releaseDate: data.release_date || data.first_air_date,
                    rating: data.vote_average,
                    language: data.original_language?.toUpperCase() || "EN",
                    genres: data.genres?.map((g: any) => g.name) || [],
                    runtime: data.runtime || (data.episode_run_time && data.episode_run_time[0]) || 0,
                    cast: data.credits?.cast?.slice(0, 10).map((c: any) => ({
                        _id: String(c.id),
                        name: c.name,
                        character: c.character,
                        profilePath: c.profile_path
                    })) || [],
                    similar: JSON.parse(JSON.stringify(similarMovies)),
                    isMovie: type === "movie",
                    videos: data.videos?.results || [],
                    seasons: data.seasons || [],
                    number_of_seasons: data.number_of_seasons,
                    number_of_episodes: data.number_of_episodes
                };
            }
            return null; 
        } catch (error) {
            console.error("AI Service detail fetch failed:", error);
            return null;
        }
    }

    // Fallback to MongoDB for ObjectIDs
    try {
        await dbConnect();
        const movie = await Movie.findById(id).populate("cast").lean();
        
        if (!movie) return null;

        let similarMovies: any[] = [];

        // Phase 2 Recommendation: AI Service (FastAPI)
        try {
            const aiServiceUrl = getAIServiceUrl();
            const aiResponse = await fetch(`${aiServiceUrl}/api/ai/recommend/${id}?limit=10`);
            if (aiResponse.ok) {
                const aiData = await aiResponse.json();
                const recIds = aiData.recommendations.map((r: any) => r.id);
                const fetchedMovies = await Movie.find({ _id: { $in: recIds } }).lean();
                // Preserve the exact similarity score sorting order returned by the AI recommendations engine
                similarMovies = fetchedMovies.sort(
                    (a: any, b: any) => recIds.indexOf(String(a._id)) - recIds.indexOf(String(b._id))
                );
            } else {
                throw new Error("AI service error");
            }
        } catch (error) {
            console.warn("AI recommendations failed, falling back to genre similarity:", error);
            similarMovies = await Movie.find({
                genres: { $in: (movie as any).genres },
                _id: { $ne: (movie as any)._id },
            })
                .sort({ popularity: -1 })
                .limit(10)
                .lean();
        }

        const movieData = {
            ...movie,
            similar: similarMovies,
        };

        return JSON.parse(JSON.stringify(movieData));
    } catch (error) {
        console.error("MongoDB detail fetch failed:", error);
        return null;
    }
}


export async function searchMovies(query: string, sort: string = "popularity") {
    await dbConnect();
    const filter: any = {};
    if (query) {
        filter.title = { $regex: query, $options: "i" };
    }

    let sortOption: any = { popularity: -1 };
    if (sort === "rating") sortOption = { rating: -1 };
    if (sort === "latest") sortOption = { releaseDate: -1 };

    const movies = await Movie.find(filter)
        .sort(sortOption)
        .limit(20)
        .lean();
        
    const total = await Movie.countDocuments(filter);

    return {
        results: JSON.parse(JSON.stringify(movies)),
        totalResults: total,
    };
}

export async function discoverContentFromServer(type: "movie" | "tv", queryParams: Record<string, string>) {
    try {
        const aiServiceUrl = getAIServiceUrl();
        const endpoint = type === "movie" ? "/api/ai/discover/movies" : "/api/ai/discover/series";
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, val]) => {
            if (val !== undefined && val !== null) {
                params.set(key, val);
            }
        });
        const res = await fetch(`${aiServiceUrl}${endpoint}?${params.toString()}`, { cache: "no-store" });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.error(`discoverContentFromServer error for ${type}:`, e);
    }
    return { results: [], totalResults: 0, totalPages: 1, currentPage: 1 };
}

export async function getGenresFromServer(type: "movie" | "tv") {
    try {
        const aiServiceUrl = getAIServiceUrl();
        const endpoint = type === "movie" ? "/api/ai/genres/movie" : "/api/ai/genres/tv";
        const res = await fetch(`${aiServiceUrl}${endpoint}`, { cache: "no-store" });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.error(`getGenresFromServer error for ${type}:`, e);
    }
    return { genres: [] };
}

export async function searchContentFromServer(query: string, type?: string, page?: string) {
    try {
        const aiServiceUrl = getAIServiceUrl();
        const params = new URLSearchParams({ query });
        if (type) params.set("type", type);
        if (page) params.set("page", page);
        const res = await fetch(`${aiServiceUrl}/api/ai/search?${params.toString()}`, { cache: "no-store" });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.error("searchContentFromServer error:", e);
    }
    return { results: [], totalResults: 0, totalPages: 1, currentPage: 1 };
}

export async function getTrendingFromServer(mediaType: string, timeWindow: string = "week", page: string = "1") {
    try {
        const aiServiceUrl = getAIServiceUrl();
        const res = await fetch(`${aiServiceUrl}/api/ai/trending/${mediaType}?time_window=${timeWindow}&page=${page}`, { cache: "no-store" });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.error("getTrendingFromServer error:", e);
    }
    return { results: [] };
}

export async function getPersonDetails(id: string) {
    try {
        const aiServiceUrl = getAIServiceUrl();
        const res = await fetch(`${aiServiceUrl}/api/ai/person/${id}`, { cache: "no-store" });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.error("getPersonDetails error:", e);
    }
    return null;
}