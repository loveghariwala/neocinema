export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

export const TMDB_IMG = "https://image.tmdb.org/t/p";

// Google shows ~155 characters of a meta description; cut at a word boundary
// instead of mid-word so snippets don't end in a broken fragment.
export function truncate(text: string, max = 155): string {
    const clean = (text || "").replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    const cut = clean.slice(0, max - 1);
    const lastSpace = cut.lastIndexOf(" ");
    return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.—-]+$/, "")}…`;
}

// Serialize JSON-LD safely for a <script> tag, dropping undefined/null/empty values.
export function jsonLd(data: unknown): string {
    return JSON.stringify(data, (_key, value) =>
        value === null || value === "" || (Array.isArray(value) && value.length === 0) ? undefined : value
    ).replace(/</g, "\\u003c");
}
