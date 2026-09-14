import { searchContentFromServer } from "@/services/movieService";
import { badRequest, cachedJson, intParam } from "@/lib/api-route";

export async function GET(request: Request) {
    const search = new URL(request.url).searchParams;
    const q = (search.get("q") || "").trim();
    if (q.length < 2 || q.length > 100) return badRequest("q must be 2-100 characters");

    const type = search.get("type") || "";
    if (type !== "" && type !== "movie" && type !== "tv") return badRequest("type must be movie, tv or empty");

    const page = intParam(search.get("page") ?? "1", 1, 500);
    if (page === null) return badRequest("page must be 1-500");

    return cachedJson(await searchContentFromServer(q.toLowerCase(), type, String(page)), 600);
}
