export function getTmdbImageUrl(path: string | null | undefined, size: string = "w500", fallbackTitle: string = "Movie"): string {
    if (!path) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackTitle)}&background=1a1a1a&color=dc2626&size=300&bold=true`;
    }
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `https://image.tmdb.org/t/p/${size}${cleanPath}`;
}
