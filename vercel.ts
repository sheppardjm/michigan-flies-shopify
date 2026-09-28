import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  // Warm the GDD and gauge caches for every river once a day after gridMET publishes.
  crons: [{ path: "/api/cron/warm-conditions", schedule: "0 10 * * *" }],
};
