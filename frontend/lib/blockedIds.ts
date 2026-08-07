/**
 * Centralized DMCA & Content Moderation Blocklist
 * Contains movie/series IDs that have received DMCA takedown notices or copyright complaints.
 */
export const BLOCKED_IDS: string[] = [
  // Cloudflare DMCA Complaint 1b4a230ff64f5802
  "1284465", // The Death Of Robin Hood
  "1212763", // The Death Of Robin Hood (alternate ID)

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
 * Checks if a given movie or series ID is blocked due to DMCA or content moderation.
 */
export function isMovieBlocked(id: string | number): boolean {
  if (!id) return false;
  return BLOCKED_IDS.includes(String(id).trim());
}
