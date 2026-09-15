import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Prerendered pages and their TMDB fetches are served read-only from Workers static assets,
// so no R2/KV/Durable Object is needed. Nothing revalidates at runtime: data is refreshed by
// redeploying (the deploy workflow also runs daily). Pages not prerendered at build time
// are rendered on each request.
// Requires `opennextjs-cloudflare populateCache` after the build to copy the cache into assets.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  // Serves cached SSG pages before the Next server boots. Safe here: no PPR, no middleware.
  enableCacheInterception: true,
});
