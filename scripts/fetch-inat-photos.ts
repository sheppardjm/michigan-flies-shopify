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
 * src/data/hatch-photos.json. API helpers live in scripts/inat.ts.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { hatches } from "../src/data/hatches";
import { LIFE_STAGE, TIERS, pick as pickPhotos, resolveTaxon, searchObservations, type InatTaxon, type Photo } from "./inat";

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

const pick = (candidates: Photo[], already: Photo[]) => pickPhotos(candidates, already, PHOTOS_PER_HATCH, MAX_PER_OBSERVER);

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
      for (const stage of [LIFE_STAGE.nymph, LIFE_STAGE.larva]) {
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
