import { getTvSeasonDetail } from "@/services/movieService";
import { badRequest, cachedJson, intParam } from "@/lib/api-route";

export async function GET(request: Request) {
    const search = new URL(request.url).searchParams;
    const id = intParam(search.get("id"), 1, 99_999_999);
    const season = intParam(search.get("season"), 0, 500);
    if (id === null || season === null) return badRequest("id and season must be positive integers");

    const data = await getTvSeasonDetail(id, season);
    return cachedJson({ episodes: data?.episodes ?? [] }, 86400);
}
