/**
 * Pull Creative Commons insect photos from iNaturalist for every hatch.
 *
 *   pnpm exec tsx scripts/fetch-inat-photos.ts [hatchId ...]
 *
 * Only CC0, CC BY and CC BY-SA photos are accepted (the site is commercial, so
 * the NC and ND licenses are excluded). For each hatch we search its mapped
 * taxa in four tiers, Michigan research-grade first, and keep up to
 * PHOTOS_PER_HATCH photos with at most two per observer, adding a nymph or
 * larva photo when the community has annotated one. Output goes to
 * src/data/hatch-photos.json and images are hot-linked from iNaturalist's
 * open-data bucket, which serves only CC-licensed photos.
 *
 * iNaturalist asks API users to stay under one request per second.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { hatches } from "../src/data/hatches";

const API = "https://api.inaturalist.org/v1";
const UA = "michiganflies.com hatch photo fetch (contact via site)";
const MICHIGAN_PLACE_ID = 29;
const LICENSES = ["cc0", "cc-by", "cc-by-sa"] as const;
const PHOTOS_PER_HATCH = 6;
const MAX_PER_OBSERVER = 2;
const OUT = "src/data/hatch-photos.json";

/** Ordered iNaturalist taxon queries per hatch: most specific first, then genus/family fallbacks. */
const TAXA: Record<string, string[]> = {
  hendrickson: ["Ephemerella subvaria", "Ephemerella"],
  "sulphur-invaria": ["Ephemerella invaria", "Ephemerella"],
  "sulphur-dorothea": ["Ephemerella dorothea", "Ephemerella"],
  "blue-winged-olive": ["Baetis tricaudatus", "Baetis"],
  "tiny-blue-winged-olive": ["Acentrella", "Plauditus", "Baetidae"],
  "blue-quill": ["Neoleptophlebia adoptiva", "Paraleptophlebia adoptiva", "Paraleptophlebia"],
  "black-quill": ["Leptophlebia cupida", "Leptophlebia"],
  "quill-gordon": ["Epeorus pleuralis", "Epeorus"],
  "march-brown": ["Maccaffertium vicarium", "Maccaffertium"],
  "great-speckled-olive": ["Drunella cornuta", "Drunella"],
  "light-cahill": ["Stenacron interpunctatum", "Stenacron", "Maccaffertium"],
  "gray-drake": ["Siphlonurus quebecensis", "Siphlonurus"],
  "brown-drake": ["Ephemera simulans", "Ephemera"],
  hex: ["Hexagenia limbata", "Hexagenia"],
  isonychia: ["Isonychia bicolor", "Isonychia"],
  baetisca: ["Baetisca", "Baetisca laurentina"],
  trico: ["Tricorythodes", "Tricorythodes explicatus"],
  "white-fly": ["Ephoron leukon", "Ephoron album", "Ephoron"],
  "mahogany-dun": ["Paraleptophlebia", "Neoleptophlebia"],
  "little-black-caddis": ["Chimarra aterrima", "Chimarra"],
  grannom: ["Brachycentrus americanus", "Brachycentrus numerosus", "Brachycentrus"],
  "tan-caddis": ["Hydropsyche", "Ceratopsyche", "Hydropsychidae"],
  "little-sister-caddis": ["Cheumatopsyche"],
  "green-rock-worm": ["Rhyacophila fuscula", "Rhyacophila"],
  "white-miller": ["Nectopsyche albida", "Nectopsyche"],
  "october-caddis": ["Pycnopsyche lepida", "Pycnopsyche guttifera", "Pycnopsyche"],
  "tiny-black-stonefly": ["Allocapnia granulata", "Allocapnia"],
  "early-black-stonefly": ["Taeniopteryx nivalis", "Taeniopteryx burksi", "Taeniopteryx"],
  "early-brown-stonefly": ["Strophopteryx fasciata", "Strophopteryx"],
  "little-yellow-sally": ["Isoperla bilineata", "Isoperla"],
  "golden-stone": ["Acroneuria lycorias", "Acroneuria abnormis", "Paragnetina media", "Acroneuria"],
  "giant-black-stone": ["Pteronarcys dorsata", "Pteronarcys"],
  midge: ["Chironomidae"],
  "crane-fly": ["Tipula", "Tipulidae"],
};

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

interface InatTaxon {
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

type Photo = {
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
  tier: 1 | 2 | 3 | 4;
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

async function resolveTaxon(query: string): Promise<InatTaxon | null> {
  const r = await get<{ results: InatTaxon[] }>("/taxa", { q: query, per_page: 10 });
  const exact = r.results.find((t) => t.is_active && t.name.toLowerCase() === query.toLowerCase());
  return exact ?? r.results.find((t) => t.is_active) ?? null;
}

const TIERS: { tier: 1 | 2 | 3 | 4; params: Record<string, string | number> }[] = [
  { tier: 1, params: { place_id: MICHIGAN_PLACE_ID, quality_grade: "research" } },
  { tier: 2, params: { place_id: MICHIGAN_PLACE_ID } },
  { tier: 3, params: { quality_grade: "research" } },
  { tier: 4, params: {} },
];

function toPhotos(obs: InatObservation[], tier: 1 | 2 | 3 | 4): Photo[] {
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

async function searchObservations(taxonId: number, tier: (typeof TIERS)[number], extra: Record<string, string | number> = {}): Promise<Photo[]> {
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

function pick(candidates: Photo[], already: Photo[]): Photo[] {
  const chosen = [...already];
  const perObserver = new Map<string, number>();
  const seenPhoto = new Set<number>();
  for (const p of chosen) {
    perObserver.set(p.observer, (perObserver.get(p.observer) ?? 0) + 1);
    seenPhoto.add(p.photoId);
  }
  for (const p of candidates) {
    if (chosen.length >= PHOTOS_PER_HATCH) break;
    if (seenPhoto.has(p.photoId)) continue;
    if ((perObserver.get(p.observer) ?? 0) >= MAX_PER_OBSERVER) continue;
    chosen.push(p);
    perObserver.set(p.observer, (perObserver.get(p.observer) ?? 0) + 1);
    seenPhoto.add(p.photoId);
  }
  return chosen;
}

async function fetchHatch(hatchId: string) {
  const queries = TAXA[hatchId];
  if (!queries) throw new Error(`No taxon mapping for ${hatchId}`);
  let photos: Photo[] = [];
  let primaryTaxon: InatTaxon | null = null;
  for (const q of queries) {
    const taxon = await resolveTaxon(q);
    if (!taxon) {
      console.log(`  ${hatchId}: no taxon for "${q}"`);
      continue;
    }
    primaryTaxon ??= taxon;
    for (const tier of TIERS) {
      if (photos.length >= PHOTOS_PER_HATCH) break;
      photos = pick(await searchObservations(taxon.id, tier), photos);
    }
    // Make sure an immature stage is represented when one is annotated anywhere.
    const hasImmature = photos.some((p) => p.lifeStage === "nymph" || p.lifeStage === "larva" || p.lifeStage === "pupa");
    if (!hasImmature) {
      for (const stage of [5, 6]) {
        const imm = await searchObservations(taxon.id, TIERS[2], { term_id: 1, term_value_id: stage });
        if (imm.length) {
          photos = photos.slice(0, PHOTOS_PER_HATCH - 1);
          photos = pick(imm.slice(0, 1), photos);
          break;
        }
      }
    }
    if (photos.length >= PHOTOS_PER_HATCH) break;
  }
  return {
    hatchId,
    taxonQuery: queries[0],
    taxonId: primaryTaxon?.id ?? null,
    taxonName: primaryTaxon?.name ?? null,
    photos,
  };
}

async function main() {
  const only = new Set(process.argv.slice(2));
  const existing = existsSync(OUT) ? (JSON.parse(readFileSync(OUT, "utf8")) as { hatches: Record<string, unknown> }) : { hatches: {} };
  const out: { fetchedAt: string; hatches: Record<string, unknown> } = { fetchedAt: new Date().toISOString(), hatches: { ...existing.hatches } };
  for (const h of hatches) {
    if (only.size && !only.has(h.id)) continue;
    const result = await fetchHatch(h.id);
    out.hatches[h.id] = result;
    const tiers = result.photos.map((p) => p.tier).join("");
    const stages = result.photos.map((p) => p.lifeStage?.[0] ?? "-").join("");
    console.log(`${h.id.padEnd(24)} ${result.taxonName ?? "?"}: ${result.photos.length} photos  tiers ${tiers}  stages ${stages}`);
    writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
  }
  console.log(`\nWrote ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
