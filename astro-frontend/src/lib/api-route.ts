import "server-only";

export function cachedJson(data: unknown, sMaxAge: number) {
    return Response.json(data, {
        headers: { "Cache-Control": `public, max-age=60, s-maxage=${sMaxAge}, stale-while-revalidate=86400` },
    });
}

export function badRequest(message: string) {
    return Response.json({ error: message }, { status: 400, headers: { "Cache-Control": "no-store" } });
}

export function intParam(value: string | null, min: number, max: number): number | null {
    if (value === null || !/^\d+$/.test(value)) return null;
    const n = Number(value);
    return n >= min && n <= max ? n : null;
}

export function mediaType(value: string | null): "movie" | "tv" | null {
    return value === "movie" || value === "tv" ? value : null;
}
