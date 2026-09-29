/** Shapes and helpers shared by the search API, the /search page, and the header dialog. Safe to import on the client. */

export type SearchKind = "page" | "river" | "hatch" | "fly" | "species" | "collection" | "product";

export interface SearchResult {
  kind: SearchKind;
  title: string;
  subtitle: string;
  href: string;
  /** Product photo; only shop products carry one. */
  image?: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
}

export const KIND_LABELS: Record<SearchKind, string> = {
  river: "Rivers",
  hatch: "Hatches",
  fly: "Flies",
  species: "Fish",
  product: "Shop",
  collection: "Boxes",
  page: "Pages",
};

/** Groups by kind, keeping rank order: the group holding the best match comes first. */
export function groupResults(results: SearchResult[]): { kind: SearchKind; items: SearchResult[] }[] {
  const groups = new Map<SearchKind, SearchResult[]>();
  for (const r of results) groups.set(r.kind, [...(groups.get(r.kind) ?? []), r]);
  return [...groups].map(([kind, items]) => ({ kind, items }));
}
