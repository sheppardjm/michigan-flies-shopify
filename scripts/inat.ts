/**
 * Shared iNaturalist API helpers for the photo fetch scripts.
 *
 * Only CC0, CC BY and CC BY-SA photos are accepted (the site is commercial, so
 * the NC and ND licenses are excluded). Images are hot-linked from
 * iNaturalist's open-data bucket, which serves only CC-licensed photos.
 *
 * iNaturalist asks API users to stay under one request per second.
 */

const API = "https://api.inaturalist.org/v1";
const UA = "michiganflies.com photo fetch (contact via site)";
export const MICHIGAN_PLACE_ID = 29;
export const LICENSES = ["cc0", "cc-by", "cc-by-sa"] as const;

/** iNaturalist "Life Stage" annotation (controlled attribute 1) values. */
export const LIFE_STAGE = { adult: 2, nymph: 5, larva: 6, juvenile: 8 } as const;
const LIFE_STAGE_VALUES: Record<number, string> = {
  2: "adult",
  3: "teneral",
  4: "pupa",
  5: "nymph",
  6: "larva",
  7: "egg",
  8: "juvenile",
  16: "subimago",
};

export interface InatTaxon {
  id: number;
  name: string;
  rank: string;
  is_active: boolean;
  observations_count: number;
}
interface InatObservation {
  id: number;
  observed_on: string | null;
  place_guess: string | null;
  quality_grade: string;
  user: { login: string; name: string | null };
  taxon?: { name: string };
  annotations?: { controlled_attribute_id: number; controlled_value_id: number }[];
  photos: { id: number; license_code: string | null; attribution: string; url: string; original_dimensions?: { width: number; height: number } }[];
}

export type Tier = 1 | 2 | 3 | 4;

export type Photo = {
  photoId: number;
  observationId: number;
  observationUrl: string;
  baseUrl: string;
  ext: string;
  license: (typeof LICENSES)[number];
  attribution: string;
  observer: string;
  observedOn: string | null;
  place: string | null;
  taxonName: string;
  lifeStage: string | null;
  tier: Tier;
  width: number | null;
  height: number | null;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let lastRequest = 0;
async function get<T>(path: string, params: Record<string, string | number | readonly string[]>): Promise<T> {
  const wait = 1100 - (Date.now() - lastRequest);
  if (wait > 0) await sleep(wait);
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) usp.set(k, v.join(","));
    else usp.set(k, String(v));
  }
  lastRequest = Date.now();
  const res = await fetch(`${API}${path}?${usp}`, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (res.status === 429) {
    await sleep(10_000);
    return get(path, params);
  }
  if (!res.ok) throw new Error(`iNaturalist ${res.status} for ${path}`);
  return (await res.json()) as T;
}

export async function resolveTaxon(query: string): Promise<InatTaxon | null> {
  const r = await get<{ results: InatTaxon[] }>("/taxa", { q: query, per_page: 10 });
  const exact = r.results.find((t) => t.is_active && t.name.toLowerCase() === query.toLowerCase());
  return exact ?? r.results.find((t) => t.is_active) ?? null;
}

/** Search tiers, Michigan research-grade first. */
export const TIERS: { tier: Tier; params: Record<string, string | number> }[] = [
  { tier: 1, params: { place_id: MICHIGAN_PLACE_ID, quality_grade: "research" } },
  { tier: 2, params: { place_id: MICHIGAN_PLACE_ID } },
  { tier: 3, params: { quality_grade: "research" } },
  { tier: 4, params: {} },
];

function toPhotos(obs: InatObservation[], tier: Tier): Photo[] {
  const out: Photo[] = [];
  for (const o of obs) {
    const p = o.photos.find((x) => x.license_code && (LICENSES as readonly string[]).includes(x.license_code));
    if (!p) continue;
    const m = p.url.match(/^(https:\/\/[^?]*\/photos\/\d+\/)square\.(\w+)/);
    if (!m) continue;
    const stageId = o.annotations?.find((a) => a.controlled_attribute_id === 1)?.controlled_value_id;
    out.push({
      photoId: p.id,
      observationId: o.id,
      observationUrl: `https://www.inaturalist.org/observations/${o.id}`,
      baseUrl: m[1],
      ext: m[2],
      license: p.license_code as Photo["license"],
      attribution: p.attribution,
      observer: o.user.name?.trim() || o.user.login,
      observedOn: o.observed_on,
      place: o.place_guess,
      taxonName: o.taxon?.name ?? "",
      lifeStage: stageId ? (LIFE_STAGE_VALUES[stageId] ?? null) : null,
      tier,
      width: p.original_dimensions?.width ?? null,
      height: p.original_dimensions?.height ?? null,
    });
  }
  return out;
}

export async function searchObservations(taxonId: number, tier: (typeof TIERS)[number], extra: Record<string, string | number> = {}): Promise<Photo[]> {
  const r = await get<{ results: InatObservation[] }>("/observations", {
    taxon_id: taxonId,
    photo_license: LICENSES,
    photos: "true",
    order_by: "votes",
    per_page: 30,
    ...tier.params,
    ...extra,
  });
  return toPhotos(r.results, tier.tier);
}

/**
 * Append candidates to `already` until `limit` photos, allowing at most
 * `maxPerObserver` per observer and skipping photo ids in `skip`.
 */
export function pick(candidates: Photo[], already: Photo[], limit: number, maxPerObserver: number, skip: Set<number> = new Set()): Photo[] {
  const chosen = [...already];
  const perObserver = new Map<string, number>();
  const seenPhoto = new Set<number>(skip);
  for (const p of chosen) {
    perObserver.set(p.observer, (perObserver.get(p.observer) ?? 0) + 1);
    seenPhoto.add(p.photoId);
  }
  for (const p of candidates) {
    if (chosen.length >= limit) break;
    if (seenPhoto.has(p.photoId)) continue;
    if ((perObserver.get(p.observer) ?? 0) >= maxPerObserver) continue;
    chosen.push(p);
    perObserver.set(p.observer, (perObserver.get(p.observer) ?? 0) + 1);
    seenPhoto.add(p.photoId);
  }
  return chosen;
}
