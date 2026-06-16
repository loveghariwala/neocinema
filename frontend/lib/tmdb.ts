/**
 * NeoCinema TMDB Direct Service (Next.js Fallback Backend)
 * 
 * Mirrors the FastAPI external_api.py logic exactly — same normalization,
 * same response shapes. This service is used as a fallback when the 
 * FastAPI ai-service is unavailable.
 * 
 * Supports: discover, search, genre lists, trending, details, person credits.
 * Includes in-memory TTL caching to avoid redundant network calls.
 */

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY || "0b702f897d43fed03749ab68da8ef51c";

// ─── In-Memory TTL Cache ────────────────────────────────────────────────────
// Simple Map-based cache with per-entry expiration times.
// Max 2000 entries; oldest entries are evicted when the limit is exceeded.

const _cache = new Map<string, { expiresAt: number; value: any }>();
const CACHE_MAX_SIZE = 2000;

// TTL presets (milliseconds)
const TTL_SHORT = 10 * 60 * 1000;    // 10 min — trending, discover, search results
const TTL_MEDIUM = 60 * 60 * 1000;   // 1 hour — details, genres, person
const TTL_LONG = 24 * 60 * 60 * 1000; // 24 hours — genre lists (rarely change)

function cacheKey(endpoint: string, params: Record<string, any> | null): string {
    const raw = endpoint + "|" + JSON.stringify(params || {}, Object.keys(params || {}).sort());
    // Simple hash using string reduce
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
        const char = raw.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return String(hash);
}

function cacheGet(key: string): any | null {
    const entry = _cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        _cache.delete(key);
        return null;
    }
    return entry.value;
}

function cacheSet(key: string, value: any, ttl: number): void {
    if (_cache.size >= CACHE_MAX_SIZE) {
        // Evict the 200 oldest entries in one pass
        const entries = Array.from(_cache.entries())
            .sort((a, b) => a[1].expiresAt - b[1].expiresAt);
        for (let i = 0; i < 200 && i < entries.length; i++) {
            _cache.delete(entries[i][0]);
        }
    }
    _cache.set(key, { expiresAt: Date.now() + ttl, value });
}

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

async function tmdbGet(endpoint: string, params: Record<string, any> = {}, ttl: number = TTL_SHORT): Promise<any> {
    const key = cacheKey(endpoint, params);
    const cached = cacheGet(key);
    if (cached !== null) return cached;

    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.set("api_key", API_KEY);
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
            url.searchParams.set(k, String(v));
        }
    });

    const response = await fetch(url.toString(), {
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    cacheSet(key, data, ttl);
    return data;
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
    }) {
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

        const data = await tmdbGet("/discover/movie", queryParams);
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
    }) {
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

        const data = await tmdbGet("/discover/tv", queryParams);
        const results = (data.results || []).map(normalizeTv);
        return paginatedResponse(data, results);
    },

    // ─── SEARCH ─────────────────────────────────────────────────────────────

    async searchMulti(query: string, page: number = 1) {
        const data = await tmdbGet("/search/multi", { query, page });
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
        const data = await tmdbGet("/search/movie", { query, page });
        const results = (data.results || []).map(normalizeMovie);
        return paginatedResponse(data, results);
    },

    async searchTv(query: string, page: number = 1) {
        const data = await tmdbGet("/search/tv", { query, page });
        const results = (data.results || []).map(normalizeTv);
        return paginatedResponse(data, results);
    },

    // ─── TRENDING ───────────────────────────────────────────────────────────

    async getTrending(mediaType: string = "movie", timeWindow: string = "week", page: number = 1) {
        const data = await tmdbGet(`/trending/${mediaType}/${timeWindow}`, { page });
        const normalizer = mediaType === "movie" ? normalizeMovie : normalizeTv;
        const results = (data.results || []).map(normalizer);
        return paginatedResponse(data, results);
    },

    // ─── GENRE LISTS ────────────────────────────────────────────────────────

    async getMovieGenres() {
        const data = await tmdbGet("/genre/movie/list", {}, TTL_LONG);
        return data.genres || [];
    },

    async getTvGenres() {
        const data = await tmdbGet("/genre/tv/list", {}, TTL_LONG);
        return data.genres || [];
    },

    // ─── DETAILS ────────────────────────────────────────────────────────────

    async getMovieDetail(tmdbId: number) {
        return await tmdbGet(`/movie/${tmdbId}`, { append_to_response: "credits,similar,videos" }, TTL_MEDIUM);
    },

    async getTvDetail(tmdbId: number) {
        return await tmdbGet(`/tv/${tmdbId}`, { append_to_response: "credits,similar,videos" }, TTL_MEDIUM);
    },

    async getTvSeasonDetail(tmdbId: number, seasonNumber: number) {
        return await tmdbGet(`/tv/${tmdbId}/season/${seasonNumber}`, {}, TTL_MEDIUM);
    },

    // ─── PERSON CREDITS ─────────────────────────────────────────────────────

    async getPersonCredits(personId: number) {
        // Fetch both combined credits and person bio details in parallel
        const [data, personDetails] = await Promise.all([
            tmdbGet(`/person/${personId}/combined_credits`, {}, TTL_MEDIUM),
            tmdbGet(`/person/${personId}`, {}, TTL_MEDIUM),
        ]);

        // Normalize and filter (matching FastAPI behavior)
        const castList = data.cast || [];
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

        // Sort by popularity desc
        results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        return {
            person: {
                id: personDetails.id,
                name: personDetails.name,
                biography: personDetails.biography || "",
                profilePath: personDetails.profile_path || "",
                placeOfBirth: personDetails.place_of_birth || "",
                birthday: personDetails.birthday || "",
            },
            results,
        };
    },
};
