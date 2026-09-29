import { NextResponse, type NextRequest } from "next/server";
import { searchEverything } from "@/lib/search";
import type { SearchResponse } from "@/lib/search-types";

/** JSON search across rivers, hatches, flies, fish, boxes, pages and shop products. */
export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").slice(0, 80);
  const body: SearchResponse = { query, results: await searchEverything(query) };
  return NextResponse.json(body, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
  });
}
