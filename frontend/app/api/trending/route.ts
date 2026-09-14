import { getTrendingFromServer } from "@/services/movieService";
import { badRequest, cachedJson, intParam, mediaType } from "@/lib/api-route";

export async function GET(request: Request) {
    const search = new URL(request.url).searchParams;
    const type = mediaType(search.get("type"));
    if (!type) return badRequest("type must be movie or tv");

    const window = search.get("window") || "week";
    if (window !== "day" && window !== "week") return badRequest("window must be day or week");

    const page = intParam(search.get("page") ?? "1", 1, 500);
    if (page === null) return badRequest("page must be 1-500");

    return cachedJson(await getTrendingFromServer(type, window, String(page)), 3600);
}
