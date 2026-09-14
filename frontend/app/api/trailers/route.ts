import { getKinocheckTrailers } from "@/services/kinocheckService";
import { badRequest, cachedJson, intParam, mediaType } from "@/lib/api-route";

export async function GET(request: Request) {
    const search = new URL(request.url).searchParams;
    const id = intParam(search.get("id"), 1, 99_999_999);
    const type = mediaType(search.get("type"));
    if (id === null || !type) return badRequest("id must be a positive integer and type movie or tv");

    return cachedJson(await getKinocheckTrailers(id, type === "tv"), 86400);
}
