const EMPTY_PAGE = { results: [] as any[], totalResults: 0, totalPages: 1, currentPage: 1 };

async function getJson<T>(path: string, params: Record<string, string | number | undefined>, fallback: T): Promise<T> {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") query.set(key, String(value));
    }
    try {
        const res = await fetch(`${path}?${query.toString()}`);
        if (!res.ok) return fallback;
        return (await res.json()) as T;
    } catch {
        return fallback;
    }
}

export function discoverContent(type: "movie" | "tv", params: Record<string, string>) {
    return getJson("/api/discover", { type, ...params }, EMPTY_PAGE);
}

export function searchContent(q: string, type: string, page: string | number) {
    return getJson("/api/search", { q, type, page }, EMPTY_PAGE);
}

export function getTrending(type: "movie" | "tv", window: "day" | "week", page: string | number) {
    return getJson("/api/trending", { type, window, page }, EMPTY_PAGE);
}

export function getSeasonEpisodes(id: string | number, season: number) {
    return getJson("/api/season", { id, season }, { episodes: [] as any[] });
}

export function getTrailers(id: string | number, isTv: boolean) {
    return getJson("/api/trailers", { id, type: isTv ? "tv" : "movie" }, [] as any[]);
}

export function getWatchSources(id: string | number, isTv: boolean) {
    return getJson("/api/watch-sources", { id, type: isTv ? "tv" : "movie" }, [] as any[]);
}
