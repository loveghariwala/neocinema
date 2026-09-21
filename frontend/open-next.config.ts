import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Safe no-op queue prevents crashes without needing external queues or storage
const noopQueue = {
  name: "noop-queue",
  send: async () => {},
};

export default defineCloudflareConfig({
  queue: () => noopQueue,
});

