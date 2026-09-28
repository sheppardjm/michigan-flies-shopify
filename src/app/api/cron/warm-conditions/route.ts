import { NextResponse } from "next/server";
import { rivers } from "@/data";
import { getRiverConditions } from "@/lib/conditions";

export const maxDuration = 300;

/**
 * Daily cron (see vercel.ts). Pulls gridMET, NWS, and USGS for every river so
 * the fetch cache is warm before anglers check the site in the morning.
 * Vercel sends `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is set.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const started = Date.now();
  const results: { riverId: string; ok: boolean; agdd50?: number; waterTempF?: number | null; errors?: string[] }[] = [];
  // Modest concurrency to stay polite to gridMET's THREDDS server.
  const queue = [...rivers];
  const workers = Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const river = queue.shift()!;
      try {
        const c = await getRiverConditions(river);
        results.push({ riverId: river.id, ok: c.errors.length === 0, agdd50: c.gdd?.current[50], waterTempF: c.waterTempF, errors: c.errors });
      } catch (e) {
        results.push({ riverId: river.id, ok: false, errors: [(e as Error).message] });
      }
    }
  });
  await Promise.all(workers);
  return NextResponse.json({ warmed: results.length, ms: Date.now() - started, results });
}
