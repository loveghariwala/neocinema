import { discoverContentFromServer } from "@/services/movieService";
import { badRequest, cachedJson, intParam, mediaType } from "@/lib/api-route";

const PATTERNS: Record<string, RegExp> = {
    sort_by: /^[a-z_]+\.(asc|desc)$/,
    with_genres: /^\d+(,\d+)*$/,
    with_keywords: /^\d+([,|]\d+)*$/,
    with_companies: /^\d+([,|]\d+)*$/,
    language: /^[a-z]{2}$/,
    year_from: /^\d{4}$/,
    year_to: /^\d{4}$/,
    rating_min: /^\d{1,2}(\.\d)?$/,
    rating_max: /^\d{1,2}(\.\d)?$/,
};

export async function GET(request: Request) {
    const search = new URL(request.url).searchParams;
    const type = mediaType(search.get("type"));
    if (!type) return badRequest("type must be movie or tv");

    const page = intParam(search.get("page") ?? "1", 1, 500);
    if (page === null) return badRequest("page must be 1-500");

    const params: Record<string, string> = { page: String(page) };
    for (const [key, pattern] of Object.entries(PATTERNS)) {
        const value = search.get(key);
        if (!value) continue;
        if (!pattern.test(value)) return badRequest(`invalid ${key}`);
        params[key] = value;
    }

    return cachedJson(await discoverContentFromServer(type, params), 600);
}
