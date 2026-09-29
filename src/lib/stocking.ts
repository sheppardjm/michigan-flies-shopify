import snapshot from "@/data/stocking.json";
import type { SpeciesId } from "@/data";

/**
 * Server-side access to the Michigan DNR stocking snapshot written by
 * `scripts/fetch-stocking.ts`. Import only from server components; the JSON
 * is large and must not reach the client bundle.
 */

export interface StockingEvent {
  date: string;
  species: string;
  strain: string | null;
  count: number;
  /** DNR "Average_Length"; the database reports centimeters. */
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

interface Snapshot {
  fetchedAt: string;
  source: { name: string; url: string; table: string };
  recentFromYear: number;
  rivers: Record<string, RiverStocking>;
}

const data = snapshot as unknown as Snapshot;

export const STOCKING_FETCHED_AT = data.fetchedAt;
export const STOCKING_SOURCE = data.source;
export const STOCKING_RECENT_FROM = data.recentFromYear;

export function getRiverStocking(riverId: string): RiverStocking | null {
  return data.rivers[riverId] ?? null;
}

/** Map DNR species names onto the site's target species where they overlap. */
export const DNR_SPECIES_TO_SITE: Record<string, SpeciesId | undefined> = {
  "Brown trout": "brown-trout",
  "Brook trout": "brook-trout",
  "Rainbow trout": "steelhead", // Great Lakes tributaries: DNR "Rainbow trout" plants are steelhead strains; resident plants are noted by strain
  "Chinook salmon": "chinook",
  "Coho salmon": "coho",
  "Atlantic salmon": "atlantic-salmon",
};

/** Salmonids and other species anglers on this site care about, in display order. */
export const FEATURED_DNR_SPECIES = [
  "Rainbow trout",
  "Brown trout",
  "Brook trout",
  "Chinook salmon",
  "Coho salmon",
  "Atlantic salmon",
  "Lake trout",
  "Splake",
  "Arctic grayling",
  "Lake sturgeon",
  "Walleye",
  "Muskellunge",
  "Tiger muskellunge",
  "Northern pike",
  "Smallmouth bass",
];

/** DNR species planted in a river that the site does not model as target fish, newest plant first. */
export function unmodeledStockedSpecies(stocking: RiverStocking | null): { species: string; firstYear: number; lastYear: number; total: number }[] {
  if (!stocking) return [];
  return stocking.species
    .filter((s) => !(s.species in DNR_SPECIES_TO_SITE))
    .map((s) => ({ species: s.species, firstYear: s.firstYear, lastYear: s.lastYear, total: s.totalAllYears }))
    .sort((a, b) => b.lastYear - a.lastYear || b.total - a.total);
}

/**
 * DNR rainbow trout strains that are anadromous steelhead lines. "Michigan" is
 * the Little Manistee winter-run strain; Skamania is the summer-run strain.
 * Everything else the DNR plants (Harrietta, Shasta, Arlee, Eagle Lake,
 * Wytheville, Harrison Lake) is a domestic resident rainbow.
 */
export const STEELHEAD_STRAINS = ["Michigan", "Skamania", "Chambers Creek", "Little Manistee", "Ganaraska"];

export function isSteelheadStrain(strain: string | null): boolean {
  return strain !== null && STEELHEAD_STRAINS.some((s) => strain.toLowerCase().includes(s.toLowerCase()));
}

/** Display label for a DNR species row, calling out steelhead-strain rainbow plants. */
export function speciesLabel(species: string, strains: string[]): { label: string; note?: string } {
  if (species !== "Rainbow trout") return { label: species };
  const steel = strains.filter(isSteelheadStrain);
  const resident = strains.filter((s) => !isSteelheadStrain(s));
  if (steel.length && !resident.length) return { label: "Rainbow trout", note: "steelhead strain" };
  if (steel.length && resident.length) return { label: "Rainbow trout", note: "steelhead and resident strains" };
  return { label: "Rainbow trout", note: resident.length ? "resident strain" : undefined };
}

export function cmToInches(cm: number): number {
  return Math.round((cm / 2.54) * 10) / 10;
}

/** Years to show as columns: the most recent N years that have any plant across the river. */
export function recentYears(stocking: RiverStocking, n = 6): number[] {
  const years = new Set<number>();
  for (const s of stocking.species) for (const y of Object.keys(s.byYear)) years.add(Number(y));
  return [...years].sort((a, b) => b - a).slice(0, n).sort((a, b) => a - b);
}
