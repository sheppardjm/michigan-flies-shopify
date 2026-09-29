/**
 * Pull Creative Commons fish photos from iNaturalist for every species page,
 * split into adults and juveniles (fry, parr, smolts) by the community's
 * "Life Stage" annotation.
 *
 *   pnpm exec tsx scripts/fetch-species-photos.ts [speciesId ...]
 *
 * Each life stage is searched in four tiers, Michigan research-grade first,
 * keeping up to PER_STAGE photos with at most two per observer. Steelhead and
 * rainbow trout share a taxon, so steelhead searches observations whose notes
 * say "steelhead" first and never reuses a rainbow trout photo. Output goes to
 * src/data/species-photos.json. API helpers live in scripts/inat.ts.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { species } from "../src/data/species";
import { LIFE_STAGE, TIERS, pick, resolveTaxon, searchObservations, type Photo } from "./inat";

const PER_STAGE = 3;
const MAX_PER_OBSERVER = 2;
const OUT = "src/data/species-photos.json";

const TAXA: Record<string, { taxon: string; extra?: Record<string, string>; avoid?: string }> = {
  "brown-trout": { taxon: "Salmo trutta" },
  "brook-trout": { taxon: "Salvelinus fontinalis" },
  "rainbow-trout": { taxon: "Oncorhynchus mykiss" },
  steelhead: { taxon: "Oncorhynchus mykiss", extra: { q: "steelhead", search_on: "description" }, avoid: "rainbow-trout" },
  chinook: { taxon: "Oncorhynchus tshawytscha" },
  coho: { taxon: "Oncorhynchus kisutch" },
  "pink-salmon": { taxon: "Oncorhynchus gorbuscha" },
  "atlantic-salmon": { taxon: "Salmo salar" },
};

type Entry = { speciesId: string; taxonName: string; taxonId: number; adults: Photo[]; juveniles: Photo[] };

async function fetchStage(taxonId: number, stage: number, first: Record<string, string> | undefined, skip: Set<number>): Promise<Photo[]> {
  const lifeStage = { term_id: 1, term_value_id: stage };
  let photos: Photo[] = [];
  for (const extra of first ? [first, {}] : [{}]) {
    for (const tier of TIERS) {
      if (photos.length >= PER_STAGE) return photos;
      photos = pick(await searchObservations(taxonId, tier, { ...lifeStage, ...extra }), photos, PER_STAGE, MAX_PER_OBSERVER, skip);
    }
  }
  return photos;
}

async function main() {
  const only = new Set(process.argv.slice(2));
  const existing = existsSync(OUT) ? (JSON.parse(readFileSync(OUT, "utf8")) as { species: Record<string, Entry> }) : { species: {} };
  const out: { fetchedAt: string; species: Record<string, Entry> } = { fetchedAt: new Date().toISOString(), species: { ...existing.species } };
  for (const s of species) {
    if (only.size && !only.has(s.id)) continue;
    const cfg = TAXA[s.id];
    if (!cfg) throw new Error(`No taxon mapping for ${s.id}`);
    const taxon = await resolveTaxon(cfg.taxon);
    if (!taxon) throw new Error(`No iNaturalist taxon for ${cfg.taxon}`);
    const avoided = cfg.avoid ? out.species[cfg.avoid] : undefined;
    const skip = new Set([...(avoided?.adults ?? []), ...(avoided?.juveniles ?? [])].map((p) => p.photoId));
    const adults = await fetchStage(taxon.id, LIFE_STAGE.adult, cfg.extra, skip);
    const juveniles = await fetchStage(taxon.id, LIFE_STAGE.juvenile, cfg.extra, skip);
    out.species[s.id] = { speciesId: s.id, taxonName: taxon.name, taxonId: taxon.id, adults, juveniles };
    console.log(`${s.id.padEnd(16)} ${taxon.name}: adults ${adults.map((p) => p.tier).join("")}  juveniles ${juveniles.map((p) => p.tier).join("")}`);
    writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
  }
  console.log(`\nWrote ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
