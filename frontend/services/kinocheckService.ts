import { cache } from "react";

export interface KinocheckTrailer {
    id: string;
    youtube_video_id: string;
    youtube_thumbnail: string;
    title: string;
    type: string;
    language: string;
}

export const getKinocheckTrailers = cache(async function getKinocheckTrailers(
    tmdbId: number,
    isTv: boolean = false,
    existingVideos?: any[]
): Promise<KinocheckTrailer[]> {
    // 0. Instant extraction from already-fetched TMDB videos (0ms CPU & 0 network calls)
    if (existingVideos && Array.isArray(existingVideos) && existingVideos.length > 0) {
        const youtubeTrailers = existingVideos.filter(
            (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser" || v.key)
        );
        if (youtubeTrailers.length > 0) {
            youtubeTrailers.sort((a: any, b: any) => (b.official ? 1 : 0) - (a.official ? 1 : 0));
            return youtubeTrailers.map((v: any) => ({
                id: String(v.id || v.key),
                youtube_video_id: String(v.key),
                youtube_thumbnail: `https://img.youtube.com/vi/${v.key}/hqdefault.jpg`,
                title: v.name || `${v.type} (${v.official ? "Official" : ""})`,
                type: v.type || "Trailer",
                language: v.iso_639_1 || "en"
            }));
        }
    }

    const apiKey = process.env.NEXT_PUBLIC_KINOCHECK_API_KEY || "chq4sEKOYwf9TAzHJcViWZ8ajU0BpPMvmNdsLOTQw976n63CKGza75rkDt1FoDoZ";
    const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY || "0b702f897d43fed03749ab68da8ef51c";
    const typePath = isTv ? "tv" : "movie";

    // 1. Primary: TMDB Official English Trailers (100% globally unblocked, zero geo-restriction)
    try {
        const tmdbRes = await fetch(
            `https://api.themoviedb.org/3/${typePath}/${tmdbId}/videos?api_key=${tmdbApiKey}&language=en-US`,
            { next: { revalidate: 86400 } }
        );
        if (tmdbRes.ok) {
            const tmdbData = await tmdbRes.json();
            const results = tmdbData?.results || [];
            
            // Prioritize official Trailers & Teasers on YouTube
            const youtubeTrailers = results.filter(
                (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
            );

            if (youtubeTrailers.length > 0) {
                // Sort official trailers first
                youtubeTrailers.sort((a: any, b: any) => (b.official ? 1 : 0) - (a.official ? 1 : 0));
                
                return youtubeTrailers.map((v: any) => ({
                    id: v.id || v.key,
                    youtube_video_id: v.key,
                    youtube_thumbnail: `https://img.youtube.com/vi/${v.key}/hqdefault.jpg`,
                    title: v.name || `${v.type} (${v.official ? "Official" : ""})`,
                    type: v.type || "Trailer",
                    language: v.iso_639_1 || "en"
                }));
            }
        }
    } catch (err) {
        console.warn("TMDB Videos primary fetch warning, trying KinoCheck fallback:", err);
    }

    // 2. Secondary Fallback: KinoCheck API
    try {
        const endpoint = isTv
            ? `https://api.kinocheck.com/shows?tmdb_id=${tmdbId}${apiKey ? `&key=${apiKey}` : ""}`
            : `https://api.kinocheck.com/movies?tmdb_id=${tmdbId}${apiKey ? `&key=${apiKey}` : ""}`;
            
        const res = await fetch(endpoint, { next: { revalidate: 86400 } });
        if (res.ok) {
            const data = await res.json();
            const videos = data?.videos || data?.trailer || data?.trailers || [];
            
            if (Array.isArray(videos) && videos.length > 0) {
                const parsed = videos
                    .map((v: any) => {
                        const yId = v.youtube_video_id || v.youtube_id || v.id || v.youtube_key || v.key;
                        return {
                            id: String(yId),
                            youtube_video_id: String(yId),
                            youtube_thumbnail: `https://img.youtube.com/vi/${yId}/hqdefault.jpg`,
                            title: v.title || "Official Trailer",
                            type: v.type || "Trailer",
                            language: v.language || "en"
                        };
                    })
                    .filter((v: KinocheckTrailer) => 
                        Boolean(v.youtube_video_id) && 
                        v.youtube_video_id !== "undefined" &&
                        !v.title.toLowerCase().includes("deutsch") // Exclude region-locked German dub titles for global users
                    );

                if (parsed.length > 0) return parsed;
            }
        }
    } catch (err) {
        console.error("Kinocheck API Fallback Error:", err);
    }

    return [];
});
