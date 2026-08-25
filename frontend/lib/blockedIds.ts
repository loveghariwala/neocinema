/**
 * Centralized DMCA & Content Moderation Blocklist
 * Contains movie/series IDs that have received DMCA takedown notices or copyright complaints.
 */
export const BLOCKED_IDS: string[] = [
  // Previously blocked IDs
  "1180798",
  "1064137",
  "1154268",
  "260471",
  "1173900",
  "490005",
  "1628522",
  "852042",

  // Custom request exclusion
  "304311",
];
/**
 * Custom No-Index List
 * Movie/Series IDs excluded from sitemaps and set to noindex for search engines,
 * while remaining 100% playable and accessible on the website for regular users.
 */
export const NOINDEX_IDS: string[] = [
  "1084244",
  "40411",
  "1450527",
];

export function isMovieNoIndex(id: string | number): boolean {
  if (!id) return false;
  return NOINDEX_IDS.includes(String(id).trim());
}

/**
 * Checks if a given movie or series ID is blocked due to DMCA or content moderation.
 */
export function isMovieBlocked(id: string | number): boolean {
  if (!id) return false;
  return BLOCKED_IDS.includes(String(id).trim());
}
