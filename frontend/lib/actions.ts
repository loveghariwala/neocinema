"use server";

import { tmdbService } from "./tmdb";

export async function fetchSeasonEpisodes(seriesId: string | number, seasonNumber: number) {
    try {
        const data = await tmdbService.getTvSeasonDetail(Number(seriesId), seasonNumber);
        return { success: true, episodes: data.episodes || [] };
    } catch (error) {
        console.error("[Server Action] Failed to fetch episodes:", error);
        return { success: false, episodes: [] };
    }
}
