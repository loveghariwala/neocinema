export interface WatchProgress {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    type: "movie" | "tv";
    season?: number;
    episode?: number;
    serverIndex: number;
    updatedAt: number;
}

export interface WatchlistItem {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    type: "movie" | "tv";
    vote_average?: number;
    addedAt: number;
}

const HISTORY_KEY = "neocinema_watch_history";
const WATCHLIST_KEY = "neocinema_watchlist";

export function saveWatchProgress(item: Omit<WatchProgress, "updatedAt">) {
    if (typeof window === "undefined") return;
    try {
        const existing = getWatchHistory();
        const filtered = existing.filter((i) => !(i.id === item.id && i.type === item.type));
        const updated: WatchProgress = { ...item, updatedAt: Date.now() };
        filtered.unshift(updated);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, 30)));
    } catch (e) {
        console.error("Failed to save watch progress", e);
    }
}

export function getWatchHistory(): WatchProgress[] {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem(HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

export function toggleWatchlist(item: Omit<WatchlistItem, "addedAt">): boolean {
    if (typeof window === "undefined") return false;
    try {
        const list = getWatchlist();
        const index = list.findIndex((i) => i.id === item.id && i.type === item.type);
        if (index >= 0) {
            list.splice(index, 1);
            localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
            return false; // Removed
        } else {
            list.unshift({ ...item, addedAt: Date.now() });
            localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
            return true; // Added
        }
    } catch (e) {
        return false;
    }
}

export function isInWatchlist(id: number, type: "movie" | "tv"): boolean {
    if (typeof window === "undefined") return false;
    const list = getWatchlist();
    return list.some((i) => i.id === id && i.type === type);
}

export function getWatchlist(): WatchlistItem[] {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem(WATCHLIST_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}
