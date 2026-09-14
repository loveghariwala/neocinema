import { getWatchmodeSources } from "@/services/watchmodeService";
import { badRequest, cachedJson, intParam, mediaType } from "@/lib/api-route";

export async function GET(request: Request) {
    const search = new URL(request.url).searchParams;
    const id = intParam(search.get("id"), 1, 99_999_999);
    const type = mediaType(search.get("type"));
    if (id === null || !type) return badRequest("id must be a positive integer and type movie or tv");

    const sources = await getWatchmodeSources(id, type === "tv");
    return cachedJson(sources, sources.length > 0 ? 604800 : 600);
}
