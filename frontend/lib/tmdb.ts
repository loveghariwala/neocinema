/**
 * Neocinema TMDB Direct Service (Next.js Fallback Backend)
 * 
 * Mirrors the FastAPI external_api.py logic exactly — same normalization,
 * same response shapes. This service is used as a fallback when the 
 * FastAPI ai-service is unavailable.
 * 
 * Supports: discover, search, genre lists, trending, details, person credits.
 * Responses are cached by the Next data cache using the TTL presets below.
 */

import "server-only";

const BASE_URL = "https://api.themoviedb.org/3";

// ─── Cache TTLs (seconds) ───────────────────────────────────────────────────
// Passed to fetch's next.revalidate, so responses live in the Next data cache (R2 on
// Cloudflare). A page revalidates at the lowest TTL among its fetches, so these must
// not be lower than the page's own revalidate export.

export const TTL = {
    search: 600,       // 10 min — free-text search, only used by /api/search
    list: 3600,        // 1 h — trending, discover (home, hubs, collections)
    detail: 86400,     // 24 h — movie/tv/person/season details, sitemap lists
    genres: 604800,    // 7 d — genre lists
} as const;

// ─── Genre ID Maps (matching FastAPI exactly) ──────────────────────────────

const MOVIE_GENRES: Record<number, string> = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

const TV_GENRES: Record<number, string> = {
    10759: "Action & Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    10762: "Kids", 9648: "Mystery", 10763: "News", 10764: "Reality",
    10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk",
    10768: "War & Politics", 37: "Western",
};

// ─── HTTP Helper ───────────────────────────────────────────────────────────

async function tmdbGet(endpoint: string, params: Record<string, any>, ttl: number, retries = 2): Promise<any> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) throw new Error("TMDB_API_KEY is not set");
    url.searchParams.set("api_key", apiKey);
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
            url.searchParams.set(k, String(v));
        }
    });

    const isDetailEndpoint = /^\/(movie|tv|person)\/\d+/.test(endpoint) && !endpoint.includes("/combined_credits");

    // Only a TMDB 404 means "missing". Timeouts, 429s and 5xx are thrown after the
    // last retry so pages render error.tsx (500, never cached) instead of notFound()
    // or an empty list that ISR would store.
    for (let i = 0; ; i++) {
        const isLastAttempt = i >= retries - 1;
        let response: Response;
        try {
            response = await fetch(url.toString(), {
                headers: { "Content-Type": "application/json" },
                signal: AbortSignal.timeout(5000), // 5s timeout for fast failover on edge workers
                next: { revalidate: ttl },
            });
        } catch (error: any) {
            if (isLastAttempt) throw new Error(`TMDB request failed for ${endpoint}: ${error.message}`);
            console.warn(`[TMDB] Fetch failed for ${endpoint}. Retrying... (${i + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, (i + 1) * 250));
            continue;
        }

        if (response.ok) return response.json();

        if (response.status === 404) {
            return isDetailEndpoint ? null : { results: [], total_results: 0, total_pages: 1, page: 1, genres: [] };
        }

        const retryable = response.status === 429 || response.status >= 500;
        if (!retryable || isLastAttempt) {
            throw new Error(`TMDB API error for ${endpoint}: ${response.status} ${response.statusText}`);
        }
        const retryAfterHeader = parseInt(response.headers.get("retry-after") || "", 10);
        const retryAfter = Math.min(Number.isFinite(retryAfterHeader) ? retryAfterHeader * 1000 : (i + 1) * 400, 2000);
        console.warn(`[TMDB] ${response.status} on ${endpoint}. Retrying in ${retryAfter}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter));
    }
}

// ─── Normalizers (matching FastAPI exactly) ─────────────────────────────────

function normalizeMovie(item: any): any {
    let genreMap = MOVIE_GENRES;
    const mediaType = item.media_type || "movie";
    if (mediaType === "tv") {
        genreMap = TV_GENRES;
    }

    const genreIds: number[] = item.genre_ids || [];
    const genres = genreIds.map(gid => genreMap[gid] || `Unknown(${gid})`);

    return {
        tmdbId: item.id,
        title: item.title || item.name || "Unknown",
        overview: item.overview || "",
        posterPath: item.poster_path || "",
        backdropPath: item.backdrop_path || "",
        releaseDate: item.release_date || item.first_air_date || "",
        rating: Math.round((item.vote_average || 0) * 10) / 10,
        voteCount: item.vote_count || 0,
        popularity: item.popularity || 0,
        language: item.original_language || "en",
        genres,
        genreIds,
        isMovie: mediaType !== "tv" && !("first_air_date" in item),
        mediaType: item.media_type ? mediaType : (item.title ? "movie" : "tv"),
        originCountry: item.origin_country || [],
    };
}

function normalizeTv(item: any): any {
    const genreIds: number[] = item.genre_ids || [];
    const genres = genreIds.map(gid => TV_GENRES[gid] || `Unknown(${gid})`);

    return {
        tmdbId: item.id,
        title: item.name || item.original_name || "Unknown",
        overview: item.overview || "",
        posterPath: item.poster_path || "",
        backdropPath: item.backdrop_path || "",
        releaseDate: item.first_air_date || "",
        rating: Math.round((item.vote_average || 0) * 10) / 10,
        voteCount: item.vote_count || 0,
        popularity: item.popularity || 0,
        language: item.original_language || "en",
        genres,
        genreIds,
        isMovie: false,
        mediaType: "tv",
        originCountry: item.origin_country || [],
    };
}

// ─── Paginated Response Helper ──────────────────────────────────────────────

function paginatedResponse(data: any, results: any[]) {
    return {
        results,
        totalResults: data.total_results || 0,
        totalPages: Math.min(data.total_pages || 1, 500), // TMDB caps at 500
        currentPage: data.page || 1,
    };
}

// ─── Public API (mirrors FastAPI routes 1:1) ────────────────────────────────

export const tmdbService = {
    // ─── DISCOVER ───────────────────────────────────────────────────────────

    async discoverMovies(params: {
        page?: number;
        sort_by?: string;
        with_genres?: string;
        year_from?: number;
        year_to?: number;
        rating_min?: number;
        rating_max?: number;
        language?: string;
        with_keywords?: string;
        with_companies?: string;
    }, ttl: number = TTL.list) {
        const queryParams: Record<string, any> = {
            page: params.page || 1,
            sort_by: params.sort_by || "popularity.desc",
        };

        if (params.with_genres) queryParams.with_genres = params.with_genres;
        if (params.year_from) queryParams["primary_release_date.gte"] = `${params.year_from}-01-01`;
        if (params.year_to) queryParams["primary_release_date.lte"] = `${params.year_to}-12-31`;
        if (params.rating_min !== undefined && params.rating_min !== null) queryParams["vote_average.gte"] = params.rating_min;
        if (params.rating_max !== undefined && params.rating_max !== null) queryParams["vote_average.lte"] = params.rating_max;
        if (params.language) queryParams.with_original_language = params.language;
        if (params.with_keywords) queryParams.with_keywords = params.with_keywords;
        if (params.with_companies) queryParams.with_companies = params.with_companies;

        const data = await tmdbGet("/discover/movie", queryParams, ttl);
        const results = (data.results || []).map(normalizeMovie);
        return paginatedResponse(data, results);
    },

    async discoverTv(params: {
        page?: number;
        sort_by?: string;
        with_genres?: string;
        year_from?: number;
        year_to?: number;
        rating_min?: number;
        rating_max?: number;
        language?: string;
        with_keywords?: string;
        with_companies?: string;
    }, ttl: number = TTL.list) {
        const queryParams: Record<string, any> = {
            page: params.page || 1,
            sort_by: params.sort_by || "popularity.desc",
        };

        if (params.with_genres) queryParams.with_genres = params.with_genres;
        if (params.year_from) queryParams["first_air_date.gte"] = `${params.year_from}-01-01`;
        if (params.year_to) queryParams["first_air_date.lte"] = `${params.year_to}-12-31`;
        if (params.rating_min !== undefined && params.rating_min !== null) queryParams["vote_average.gte"] = params.rating_min;
        if (params.rating_max !== undefined && params.rating_max !== null) queryParams["vote_average.lte"] = params.rating_max;
        if (params.language) queryParams.with_original_language = params.language;
        if (params.with_keywords) queryParams.with_keywords = params.with_keywords;
        if (params.with_companies) queryParams.with_companies = params.with_companies;

        const data = await tmdbGet("/discover/tv", queryParams, ttl);
        const results = (data.results || []).map(normalizeTv);
        return paginatedResponse(data, results);
    },

    // ─── SEARCH ─────────────────────────────────────────────────────────────

    async searchMulti(query: string, page: number = 1) {
        const data = await tmdbGet("/search/multi", { query, page }, TTL.search);
        const results: any[] = [];
        for (const item of data.results || []) {
            const mediaType = item.media_type || "movie";
            if (mediaType === "movie") {
                results.push(normalizeMovie(item));
            } else if (mediaType === "tv") {
                results.push(normalizeTv(item));
            }
            // Skip 'person' results (matching FastAPI behavior)
        }
        return paginatedResponse(data, results);
    },

    async searchMovies(query: string, page: number = 1) {
        const data = await tmdbGet("/search/movie", { query, page }, TTL.search);
        const results = (data.results || []).map(normalizeMovie);
        return paginatedResponse(data, results);
    },

    async searchTv(query: string, page: number = 1) {
        const data = await tmdbGet("/search/tv", { query, page }, TTL.search);
        const results = (data.results || []).map(normalizeTv);
        return paginatedResponse(data, results);
    },

    // ─── TRENDING ───────────────────────────────────────────────────────────

    async getTrending(mediaType: string = "movie", timeWindow: string = "week", page: number = 1, ttl: number = TTL.list) {
        const data = await tmdbGet(`/trending/${mediaType}/${timeWindow}`, { page }, ttl);
        const normalizer = mediaType === "movie" ? normalizeMovie : normalizeTv;
        const results = (data.results || []).map(normalizer);
        return paginatedResponse(data, results);
    },

    // ─── GENRE LISTS ────────────────────────────────────────────────────────

    async getMovieGenres() {
        const data = await tmdbGet("/genre/movie/list", {}, TTL.genres);
        return data.genres || [];
    },

    async getTvGenres() {
        const data = await tmdbGet("/genre/tv/list", {}, TTL.genres);
        return data.genres || [];
    },

    // ─── DETAILS ────────────────────────────────────────────────────────────

    async getMovieDetail(tmdbId: number) {
        return await tmdbGet(`/movie/${tmdbId}`, { append_to_response: "credits,similar,videos" }, TTL.detail);
    },

    async getTvDetail(tmdbId: number) {
        // external_ids gives the IMDb id, which movies return at the top level but TV doesn't
        return await tmdbGet(`/tv/${tmdbId}`, { append_to_response: "credits,similar,videos,external_ids" }, TTL.detail);
    },

    async getTvSeasonDetail(tmdbId: number, seasonNumber: number) {
        return await tmdbGet(`/tv/${tmdbId}/season/${seasonNumber}`, {}, TTL.detail);
    },

    // ─── PERSON CREDITS ─────────────────────────────────────────────────────

    async getPersonCredits(personId: number) {
        // Fetch both combined credits and person bio details in parallel
        const [data, personDetails] = await Promise.all([
            tmdbGet(`/person/${personId}/combined_credits`, {}, TTL.detail),
            tmdbGet(`/person/${personId}`, {}, TTL.detail),
        ]);

        if (!personDetails || !personDetails.id) return null;

        // Sort by popularity first before normalizing to save CPU
        const rawCast = Array.isArray(data?.cast) ? data.cast : [];
        rawCast.sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0));
        const castList = rawCast.slice(0, 40);

        const results: any[] = [];
        const seenIds = new Set<number>();

        for (const item of castList) {
            const mediaType = item.media_type;
            if (mediaType === "movie") {
                const norm = normalizeMovie(item);
                if (!seenIds.has(norm.tmdbId)) {
                    results.push(norm);
                    seenIds.add(norm.tmdbId);
                }
            } else if (mediaType === "tv") {
                const norm = normalizeTv(item);
                if (!seenIds.has(norm.tmdbId)) {
                    results.push(norm);
                    seenIds.add(norm.tmdbId);
                }
            }
        }

        return {
            person: {
                id: personDetails.id,
                name: personDetails.name,
                biography: personDetails.biography || "",
                profilePath: personDetails.profile_path || "",
                placeOfBirth: personDetails.place_of_birth || "",
                birthday: personDetails.birthday || "",
                deathday: personDetails.deathday || "",
                knownForDepartment: personDetails.known_for_department || "",
                imdbId: personDetails.imdb_id || "",
            },
            results,
        };
    },

    // ─── PEOPLE ─────────────────────────────────────────────────────────────

    async getPopularPeople(page: number = 1, ttl: number = TTL.detail) {
        const data = await tmdbGet("/person/popular", { page: String(page) }, ttl);
        return Array.isArray(data?.results) ? data.results as { id: number; adult?: boolean }[] : [];
    },
};

