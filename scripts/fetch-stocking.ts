/**
 * Snapshot Michigan DNR fish stocking records for every river on the site.
 *
 *   pnpm exec tsx scripts/fetch-stocking.ts
 *
 * Queries the FishStockReport table behind the DNR Fish Stocking Database
 * dashboard (events 1979 to present) by waters_id, then writes a compact
 * per-river summary to src/data/stocking.json: totals by species and year,
 * the most recent plant per species, and the raw events since RECENT_FROM.
 * Re-run each spring and fall after the DNR posts plants; commit the result.
 */
import { writeFileSync } from "node:fs";
import { STOCKING_WATERS } from "../src/data/stocking-waters";

const TABLE =
  "https://utility.arcgis.com/usrsvcs/servers/fc7739be5f5247e7bf7f2c6bc9471140/rest/services/DNR/FishStockingReportGISAGO/MapServer/0/query";
const RECENT_FROM = new Date().getUTCFullYear() - 4; // keep five seasons of raw events
const PAGE = 2000;

interface RawRow {
  County_Name: string;
  Water_Body_Name: string;
  waters_id: number;
  SPEC_COMM_Alt: string;
  str_comm: string | null;
  stocking_date: number;
  Number_Fish_Stocked: number | null;
  Average_Length: number | null;
  Operation: string | null;
  Marking_Group: string | null;
  sitename: string | null;
}

export interface StockingEvent {
  date: string;
  species: string;
  strain: string | null;
  count: number;
  /** DNR Average_Length; the database reports centimeters. */
  avgLengthCm: number | null;
  site: string | null;
  county: string;
  water: string;
  marking: string | null;
  operation: string | null;
}

export interface SpeciesSummary {
  species: string;
  firstYear: number;
  lastYear: number;
  totalAllYears: number;
  eventsAllYears: number;
  /** year → fish stocked */
  byYear: Record<string, number>;
  latest: StockingEvent;
  strains: string[];
}

export interface RiverStocking {
  riverId: string;
  waters: { watersId: number; name: string; counties?: string[] }[];
  species: SpeciesSummary[];
  recentEvents: StockingEvent[];
  totalEvents: number;
}

export interface StockingSnapshot {
  fetchedAt: string;
  source: { name: string; url: string; table: string };
  recentFromYear: number;
  rivers: Record<string, RiverStocking>;
}

async function query(where: string, offset: number): Promise<RawRow[]> {
  const params = new URLSearchParams({
    f: "json",
    where,
    outFields: "County_Name,Water_Body_Name,waters_id,SPEC_COMM_Alt,str_comm,stocking_date,Number_Fish_Stocked,Average_Length,Operation,Marking_Group,sitename",
    orderByFields: "stocking_date ASC,ObjectID ASC",
    resultOffset: String(offset),
    resultRecordCount: String(PAGE),
    returnGeometry: "false",
  });
  const res = await fetch(`${TABLE}?${params}`, { headers: { "User-Agent": "michiganflies.com stocking snapshot" } });
  if (!res.ok) throw new Error(`DNR query failed ${res.status}`);
  const json = (await res.json()) as { features?: { attributes: RawRow }[]; error?: { message: string }; exceededTransferLimit?: boolean };
  if (json.error) throw new Error(`DNR query error: ${json.error.message} (${where})`);
  return (json.features ?? []).map((f) => f.attributes);
}

async function queryAll(where: string): Promise<RawRow[]> {
  const out: RawRow[] = [];
  for (let offset = 0; ; offset += PAGE) {
    const rows = await query(where, offset);
    out.push(...rows);
    if (rows.length < PAGE) break;
  }
  return out;
}

const clean = (s: string | null | undefined) => (s ?? "").trim() || null;

function toEvent(r: RawRow): StockingEvent {
  return {
    date: new Date(r.stocking_date).toISOString().slice(0, 10),
    species: r.SPEC_COMM_Alt.trim(),
    strain: clean(r.str_comm),
    count: r.Number_Fish_Stocked ?? 0,
    avgLengthCm: r.Average_Length ?? null,
    site: clean(r.sitename),
    county: r.County_Name.trim(),
    water: r.Water_Body_Name.trim(),
    marking: clean(r.Marking_Group)?.toLowerCase() === "none" ? null : clean(r.Marking_Group),
    operation: clean(r.Operation),
  };
}

function summarize(riverId: string, waters: (typeof STOCKING_WATERS)[string], events: StockingEvent[]): RiverStocking {
  const bySpecies = new Map<string, StockingEvent[]>();
  for (const e of events) bySpecies.set(e.species, [...(bySpecies.get(e.species) ?? []), e]);
  const species: SpeciesSummary[] = [...bySpecies.entries()]
    .map(([name, list]) => {
      const byYear: Record<string, number> = {};
      for (const e of list) {
        const y = e.date.slice(0, 4);
        byYear[y] = (byYear[y] ?? 0) + e.count;
      }
      const years = list.map((e) => Number(e.date.slice(0, 4)));
      return {
        species: name,
        firstYear: Math.min(...years),
        lastYear: Math.max(...years),
        totalAllYears: list.reduce((s, e) => s + e.count, 0),
        eventsAllYears: list.length,
        byYear,
        latest: list[list.length - 1],
        strains: [...new Set(list.map((e) => e.strain).filter((s): s is string => Boolean(s)))],
      };
    })
    .sort((a, b) => b.lastYear - a.lastYear || b.totalAllYears - a.totalAllYears);
  return {
    riverId,
    waters,
    species,
    recentEvents: events.filter((e) => Number(e.date.slice(0, 4)) >= RECENT_FROM).reverse(),
    totalEvents: events.length,
  };
}

async function main() {
  const snapshot: StockingSnapshot = {
    fetchedAt: new Date().toISOString(),
    source: {
      name: "Michigan DNR Fish Stocking Database",
      url: "https://www.michigandnr.com/fishstock/",
      table: TABLE.replace("/query", ""),
    },
    recentFromYear: RECENT_FROM,
    rivers: {},
  };
  for (const [riverId, waters] of Object.entries(STOCKING_WATERS)) {
    if (!waters.length) {
      snapshot.rivers[riverId] = { riverId, waters: [], species: [], recentEvents: [], totalEvents: 0 };
      continue;
    }
    const clauses = waters.map((w) => {
      const county = w.counties?.length ? ` AND County_Name IN (${w.counties.map((c) => `'${c.replace(/'/g, "''")}'`).join(",")})` : "";
      return `(waters_id = ${w.watersId}${county})`;
    });
    const rows = await queryAll(clauses.join(" OR "));
    const events = rows.map(toEvent).sort((a, b) => a.date.localeCompare(b.date));
    snapshot.rivers[riverId] = summarize(riverId, waters, events);
    const s = snapshot.rivers[riverId];
    console.log(
      `${riverId.padEnd(28)} ${String(s.totalEvents).padStart(5)} events  ${s.species.map((x) => `${x.species} (${x.lastYear})`).join(", ") || "none"}`,
    );
  }
  writeFileSync("src/data/stocking.json", JSON.stringify(snapshot, null, 1) + "\n");
  console.log(`\nWrote src/data/stocking.json at ${snapshot.fetchedAt}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
