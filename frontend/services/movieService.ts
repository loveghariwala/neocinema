"use server";

import { tmdbService } from "@/lib/tmdb";

export async function getTrendingMovies() {
    try {
        const data = await tmdbService.getTrending("movie", "week", 1);
        return data?.results?.slice(0, 20) || [];
    } catch (error) {
        console.error("Failed to fetch trending movies:", error);
        return [];
    }
}

export async function getTrendingSeries() {
    try {
        const data = await tmdbService.getTrending("tv", "week", 1);
        return data?.results?.slice(0, 20) || [];
    } catch (error) {
        console.error("Failed to fetch trending series:", error);
        return [];
    }
}

export async function getTopRatedMovies() {
    try {
        const data = await tmdbService.discoverMovies({ sort_by: "vote_average.desc", rating_min: 7 });
        return data?.results?.slice(0, 20) || [];
    } catch (error) {
        console.error("Failed to fetch top rated movies:", error);
        return [];
    }
}

export async function getTopRatedSeries() {
    try {
        const data = await tmdbService.discoverTv({ sort_by: "vote_average.desc", rating_min: 7 });
        return data?.results?.slice(0, 20) || [];
    } catch (error) {
        console.error("Failed to fetch top rated series:", error);
        return [];
    }
}

async function getCollectionParts(collectionId: number) {
    try {
        const API_KEY = process.env.TMDB_API_KEY;
        const res = await fetch(`https://api.themoviedb.org/3/collection/${collectionId}?api_key=${API_KEY}`, {
            next: { revalidate: 3600 } // Cache collections for 1 hour at the Edge
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.parts || [];
    } catch (error) {
        return [];
    }
}

export async function getMovieDetails(id: string, type: "movie" | "tv" = "movie") {
    try {
        const data = type === "movie"
            ? await tmdbService.getMovieDetail(Number(id))
            : await tmdbService.getTvDetail(Number(id));

        if (!data) return null;

        let similarMovies: any[] = [];
        const seenIds = new Set<number>();

        // 1. Try fetching Sequence/Collection first
        if (type === "movie" && data.belongs_to_collection) {
            const parts = await getCollectionParts(data.belongs_to_collection.id);
            parts.filter((p: any) => p.id !== Number(id)).forEach((s: any) => {
                if (!seenIds.has(s.id)) {
                    seenIds.add(s.id);
                    similarMovies.push({
                        tmdbId: s.id,
                        title: s.title || s.name,
                        posterPath: s.poster_path,
                        rating: s.vote_average,
                        isMovie: true
                    });
                }
            });
        }

        // 2. Fallback to TMDB Genre-based Recommendations / Similar to fill up to 12 cards
        if (data.similar?.results) {
            data.similar.results.forEach((s: any) => {
                if (!seenIds.has(s.id) && similarMovies.length < 12) {
                    seenIds.add(s.id);
                    similarMovies.push({
                        tmdbId: s.id,
                        title: s.title || s.name,
                        posterPath: s.poster_path,
                        rating: s.vote_average,
                        isMovie: type === "movie" || s.media_type === "movie"
                    });
                }
            });
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
            voteCount: data.vote_count,
            language: data.original_language?.toUpperCase() || "EN",
            genres: data.genres?.map((g: any) => g.name) || [],
            productionCompanies: data.production_companies?.map((c: any) => c.name) || [],
            networks: data.networks?.map((n: any) => n.name) || [],
            runtime: data.runtime || (data.episode_run_time && data.episode_run_time[0]) || 0,
            cast: data.credits?.cast?.slice(0, 10).map((c: any) => ({
                _id: String(c.id),
                name: c.name,
                character: c.character,
                profilePath: c.profile_path
            })) || [],
            director: data.credits?.crew?.find((c: any) => c.job === "Director")?.name || null,
            similar: similarMovies,
            isMovie: type === "movie",
            videos: data.videos?.results || [],
            seasons: data.seasons || [],
            number_of_seasons: data.number_of_seasons,
            number_of_episodes: data.number_of_episodes
        };
    } catch (error) {
        console.error("Movie detail fetch failed:", error);
        return null;
    }
}

export async function searchMovies(query: string, sort: string = "popularity") {
    try {
        const data = await tmdbService.searchMovies(query, 1);
        return data;
    } catch (error) {
        console.error("Failed to search movies:", error);
        return { results: [], totalResults: 0 };
    }
}

export async function discoverContentFromServer(type: "movie" | "tv", queryParams: Record<string, string>) {
    try {
        const data = type === "movie"
            ? await tmdbService.discoverMovies({
                page: Number(queryParams.page) || 1,
                sort_by: queryParams.sort_by || "popularity.desc",
                with_genres: queryParams.with_genres,
                year_from: queryParams.year_from ? Number(queryParams.year_from) : undefined,
                year_to: queryParams.year_to ? Number(queryParams.year_to) : undefined,
                rating_min: queryParams.rating_min ? Number(queryParams.rating_min) : undefined,
                rating_max: queryParams.rating_max ? Number(queryParams.rating_max) : undefined,
                language: queryParams.language,
                with_keywords: queryParams.with_keywords,
                with_companies: queryParams.with_companies,
            })
            : await tmdbService.discoverTv({
                page: Number(queryParams.page) || 1,
                sort_by: queryParams.sort_by || "popularity.desc",
                with_genres: queryParams.with_genres,
                year_from: queryParams.year_from ? Number(queryParams.year_from) : undefined,
                year_to: queryParams.year_to ? Number(queryParams.year_to) : undefined,
                rating_min: queryParams.rating_min ? Number(queryParams.rating_min) : undefined,
                rating_max: queryParams.rating_max ? Number(queryParams.rating_max) : undefined,
                language: queryParams.language,
                with_keywords: queryParams.with_keywords,
                with_companies: queryParams.with_companies,
            });
        return data;
    } catch (e) {
        console.error(`discoverContentFromServer error for ${type}:`, e);
    }
    return { results: [], totalResults: 0, totalPages: 1, currentPage: 1 };
}

export async function getGenresFromServer(type: "movie" | "tv") {
    try {
        const genres = type === "movie"
            ? await tmdbService.getMovieGenres()
            : await tmdbService.getTvGenres();
        return { genres };
    } catch (e) {
        console.error(`getGenresFromServer error for ${type}:`, e);
    }
    return { genres: [] };
}

export async function searchContentFromServer(query: string, type?: string, page?: string) {
    try {
        const pageNum = Number(page) || 1;
        let data;
        if (type === "movie") {
            data = await tmdbService.searchMovies(query, pageNum);
        } else if (type === "tv") {
            data = await tmdbService.searchTv(query, pageNum);
        } else {
            data = await tmdbService.searchMulti(query, pageNum);
        }
        return data;
    } catch (e) {
        console.error("searchContentFromServer error:", e);
    }
    return { results: [], totalResults: 0, totalPages: 1, currentPage: 1 };
}

export async function getTrendingFromServer(mediaType: string, timeWindow: string = "week", page: string = "1") {
    try {
        const data = await tmdbService.getTrending(mediaType, timeWindow, Number(page) || 1);
        return data;
    } catch (e) {
        console.error("getTrendingFromServer error:", e);
    }
    return { results: [] };
}

export async function getPersonDetails(id: string) {
    try {
        const data = await tmdbService.getPersonCredits(Number(id));
        return data;
    } catch (e) {
        console.error("getPersonDetails error:", e);
    }
    return null;
}

export async function getTvSeasonDetail(seriesId: string | number, seasonNumber: number) {
    try {
        const data = await tmdbService.getTvSeasonDetail(Number(seriesId), seasonNumber);
        return data;
    } catch (e) {
        console.error("getTvSeasonDetail error:", e);
    }
    return null;
}