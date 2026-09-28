import { NextResponse } from "next/server";
import { riverById } from "@/data";
import { getRiverConditions } from "@/lib/conditions";

/** JSON conditions for a river: GDD series, gauges, water temperature. */
export async function GET(_request: Request, context: RouteContext<"/api/conditions/[riverId]">) {
  const { riverId } = await context.params;
  const river = riverById.get(riverId);
  if (!river) return NextResponse.json({ error: "Unknown river" }, { status: 404 });
  const conditions = await getRiverConditions(river);
  return NextResponse.json(conditions, {
    headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
  });
}
