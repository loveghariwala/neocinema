export interface WatchmodeSource {
    source_id: number;
    name: string;
    type: string; // "sub", "free", "rent", "buy"
    region: string;
    web_url: string;
    format: string;
    price?: number;
}

export async function getWatchmodeSources(tmdbId: number, isTv: boolean = false): Promise<WatchmodeSource[]> {
    const apiKey = process.env.NEXT_PUBLIC_WATCHMODE_API_KEY || "bAsgGkU6wA8njfa2Hr9Z48OKQlnLr6e0NOw5y4Ai";
    if (!apiKey) return [];

    try {
        const titleId = `${isTv ? "tv" : "movie"}-${tmdbId}`;
        const res = await fetch(
            `https://api.watchmode.com/v1/title/${titleId}/sources/?apiKey=${apiKey}`,
            { next: { revalidate: 86400 } }
        );

        if (!res.ok) {
            // Fallback search by TMDB ID format
            const searchRes = await fetch(
                `https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=tmdb_${isTv ? "tv" : "movie"}_id&search_value=${tmdbId}`,
                { next: { revalidate: 86400 } }
            );
            if (!searchRes.ok) return [];
            const searchData = await searchRes.json();
            const foundTitle = searchData?.title_results?.[0];
            if (!foundTitle?.id) return [];

            const sourcesRes = await fetch(
                `https://api.watchmode.com/v1/title/${foundTitle.id}/sources/?apiKey=${apiKey}`,
                { next: { revalidate: 86400 } }
            );
            if (!sourcesRes.ok) return [];
            const sourcesData = await sourcesRes.json();
            return Array.isArray(sourcesData) ? sourcesData : [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("Watchmode API Error:", err);
        return [];
    }
}
