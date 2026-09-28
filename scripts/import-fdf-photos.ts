/**
 * Import fly photos from flydealflies.com, used with the photographer's
 * permission (Quinn, September 2026). Photos are downloaded into
 * public/photos/flies/ and recorded in src/data/fly-photos.json with
 * source "permission" so the site credits them and prefers them over the
 * Creative Commons reference photos. They remain "reference photos, not our
 * tie" until replaced by our own bench photography.
 *
 *   pnpm exec tsx scripts/import-fdf-photos.ts
 *
 * Requires .playwright-mcp/fdf-products.json (WooCommerce Store API dump).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const PRODUCTS = ".playwright-mcp/fdf-products.json";
const OUT_JSON = "src/data/fly-photos.json";
const OUT_DIR = "public/photos/flies";
const CREDIT = "Quinn for Fly Deal Flies";
const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.flydealflies.com/",
  "Sec-Fetch-Dest": "image",
  "Sec-Fetch-Mode": "no-cors",
  "Sec-Fetch-Site": "same-origin",
};

/** Our fly id → Fly Deal Flies product names (cleaned) that are the same pattern or its standard commercial form. */
const MAP: Record<string, string[]> = {
  "regans-hendrickson-parachute": ["Hendrickson Light", "Light Hendrickson Comparadun"],
  "red-quill": ["Red Quill"],
  "pheasant-tail-nymph": ["Pheasant Tail - Nymph"],
  "sulphur-comparadun": ["Comparadun - Sulphur"],
  "rusty-spinner": ["Rusty Spinner"],
  "bwo-parachute": ["Blue Wing Olive - Parachute"],
  "blue-quill-parachute": ["Blue Quill"],
  "black-quill-parachute": ["Black Quill"],
  "march-brown-parachute": ["March Brown"],
  "light-cahill-parachute": ["Cahill Light - Parachute", "Cahill Light"],
  "adams-parachute": ["Adams"],
  "brown-drake-parachute": ["Eastern Brown Drake"],
  "brown-drake-spinner": ["Dark Brown Spinner"],
  "isonychia-parachute": ["Isonychia - Parachute"],
  "isonychia-nymph": ["Isonychia Nymph"],
  "trico-spinner": ["Trico Dark Spinner", "Trico Female Poly Spinner"],
  "white-wulff": ["Wulff White - Hairwing"],
  "mahogany-dun-parachute": ["Thorax Mahogany Dun"],
  "hares-ear-nymph": ["GR Hares Ear", "Hares Ear - Bead Nymph"],
  "zebra-midge": ["Zebra Midge Black - Bead Nymph", "Zebra Midge Red - Bead Nymph"],
  "griffiths-gnat": ["Griffiths Gnat"],
  "elk-hair-caddis": ["Elkhair Caddis Tan", "Elkhair Caddis Olive"],
  "henryville-special": ["Henryville Special"],
  "little-black-caddis-adult": ["Elkhair Caddis Black"],
  "green-caddis-larva": ["Nymph-Head Caddis Larva-Green", "Caddis Larva"],
  "spotted-sedge-pupa": ["Caddis Pupa Brown - Bead Nymph", "Sparkle Pupa Tan Emerger"],
  "grannom-pupa": ["Emergent Sparkle Pupa Olive - Beadhead", "Sparkle Pupa Green Emerger"],
  "october-caddis-adult": ["October Caddis"],
  "black-stonefly-nymph": ["(K) Stone Black", "Biot Stone Black - Beadhead"],
  "early-brown-stonefly-nymph": ["Brown Stonefly - Bead Nymph"],
  "pats-rubber-legs": ["(K) Stone Rubber Legs Black", "(K) Stone Rubber Legs Brown"],
  "twenty-incher": ["20 Incher - Bead Nymph"],
  "giant-black-stonefly-nymph": ["(K) Stone Black - Beadhead"],
  "yellow-sally-dry": ["Yellow Sally"],
  stimulator: ["Stimulator Olive", "Stimulator Brown"],
  "glo-bug": ["Glo Bug Orange", "Glo Bug Apricot", "Glo Bug Natural"],
  "sucker-spawn": ["Sucker Spawn White", "Sucker Spawn Orange", "Sucker Spawn Chartreuse"],
  "estaz-egg": ["Estaz Bug"],
  "egg-sucking-leech": ["Egg Sucking Leech Black - Steelhead", "Egg Sucking Leech Purple"],
  "steelhead-bugger": ["Steelhead Bugger"],
  "black-string-leech": ["Leech Black", "Marabou Leech Black"],
  "marabou-spey": ["Chinook Spey"],
  "white-zonker": ["Zonker White/Pearl"],
  "woolly-bugger": ["Woolly Bugger Black", "Woolly Bugger Olive"],
  "clouser-minnow": ["Clouser White Chartreuse", "Clouser White"],
  "soft-hackle-wet": ["Orange Soft Hackle", "Hares Ear - Soft Hackle"],
  "green-machine": ["Green Machine"],
  bomber: ["Bomber - Natural", "Bomber - Black"],
  "muddler-minnow": ["Muddler Gold", "Marabou Olive Muddler"],
  "woolly-sculpin": ["Matuka Sculpin Olive", "Clouser Sculpin"],
  "st-marys-smelt-streamer": ["Magog Smelt", "Kennebago Smelt - Marabou"],
  "crayfish-pattern": ["Crayfish Brown", "Crayfish Orange"],
  "parachute-hopper": ["Tentwing Hopper - Parachute", "Daves Hopper"],
  "chernobyl-ant": ["Chernobyl Ant Black/Red"],
  "chubby-chernobyl": ["Chubby Chernobyl - Tan/Black", "Chubby Chernobyl - Olive/Tan"],
  "flying-ant": ["Flying Ant Black", "Flying Ant Red"],
  "xo-beetle": ["Foam Beetle", "Beetle"],
  "japanese-beetle": ["Japanese Beetle"],
  inchworm: ["Inchworm"],
  cicada: ["Cicada"],
  cricket: ["Letort Cricket Black", "Daves Cricket"],
  "morrish-mouse": ["Morrish Mouse"],
  "san-juan-worm": ["San Juan Worm Red", "San Juan Earth Worm"],
  scud: ["Olive Scud - Nymph", "Gray Scud - Nymph", "Pink Scud"],
  sowbug: ["Sowbug"],
};

interface FdfProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  images: { id: number; src: string; thumbnail: string; alt: string; name: string }[];
}

interface FlyPhoto {
  source: "wikimedia" | "openverse" | "permission";
  url: string;
  thumbUrl: string | null;
  width: number | null;
  height: number | null;
  title: string;
  author: string;
  license: string;
  licenseUrl: string | null;
  sourceUrl: string;
}

const clean = (s: string) =>
  s
    .replace(/&#8211;|&ndash;/g, "-")
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

async function download(url: string, dest: string): Promise<boolean> {
  if (existsSync(dest)) return true;
  const res = await fetch(url, { headers: BROWSER_HEADERS });
  if (!res.ok) {
    console.warn(`  ${res.status} ${url}`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) return false;
  writeFileSync(dest, buf);
  await new Promise((r) => setTimeout(r, 700));
  return true;
}

async function main() {
  const products = (JSON.parse(readFileSync(PRODUCTS, "utf8")) as { products: FdfProduct[] }).products;
  const byName = new Map<string, FdfProduct>();
  for (const p of products) {
    const n = clean(p.name);
    if (p.images.length && !byName.has(n)) byName.set(n, p);
  }
  mkdirSync(OUT_DIR, { recursive: true });
  const out = JSON.parse(readFileSync(OUT_JSON, "utf8")) as { fetchedAt: string; flies: Record<string, { flyId: string; photos: FlyPhoto[] }> };
  let flyCount = 0;
  let photoCount = 0;
  const missing: string[] = [];
  for (const [flyId, names] of Object.entries(MAP)) {
    const added: FlyPhoto[] = [];
    for (const name of names) {
      const p = byName.get(name);
      if (!p) {
        missing.push(`${flyId}: "${name}"`);
        continue;
      }
      const img = p.images[0];
      const ext = (img.src.split("?")[0].match(/\.(jpe?g|png|webp)$/i)?.[1] ?? "jpg").toLowerCase();
      const file = `${flyId}--${p.slug}.${ext}`;
      const ok = await download(img.src, path.join(OUT_DIR, file));
      if (!ok) continue;
      added.push({
        source: "permission",
        url: `/photos/flies/${file}`,
        thumbUrl: null,
        width: null,
        height: null,
        title: clean(p.name),
        author: CREDIT,
        license: "Used with permission",
        licenseUrl: null,
        sourceUrl: p.permalink,
      });
    }
    if (!added.length) continue;
    const existing = (out.flies[flyId]?.photos ?? []).filter((x) => x.source !== "permission");
    out.flies[flyId] = { flyId, photos: [...added, ...existing] };
    flyCount++;
    photoCount += added.length;
    console.log(`${flyId.padEnd(30)} ${added.map((a) => a.title).join(" ; ")}`);
  }
  out.fetchedAt = new Date().toISOString();
  writeFileSync(OUT_JSON, JSON.stringify(out, null, 1) + "\n");
  console.log(`\n${flyCount} flies, ${photoCount} photos imported → ${OUT_DIR}`);
  if (missing.length) console.log(`Names not found:\n  ${missing.join("\n  ")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
