import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import queueCache from "@opennextjs/cloudflare/overrides/queue/queue-cache";

// ISR pages and TMDB fetches are stored in R2 (NEXT_INC_CACHE_R2_BUCKET), with the
// Cache API in front of it per data center. Stale entries are regenerated in the
// background by the DOQueueHandler Durable Object (NEXT_CACHE_DO_QUEUE).
// No tag cache: nothing calls revalidateTag/revalidatePath, all revalidation is time-based.
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
  queue: queueCache(doQueue),
  // Serves cached ISR/SSG pages before the Next server boots. Safe here: no PPR, no middleware.
  enableCacheInterception: true,
});
