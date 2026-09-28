/**
 * Stopgap reference photos of fly patterns from Wikimedia Commons and Openverse.
 *
 *   pnpm exec tsx scripts/fetch-fly-photos.ts [flyId ...]
 *
 * These are other tiers' flies, so the site shows them under a "reference
 * photo, not our tie" label and never as product images. Only CC0, public
 * domain, CC BY and CC BY-SA are accepted (commercial use, modification for
 * resizing). Results must match every significant word of the pattern name
 * in the file title or tags to avoid false hits. Output: src/data/fly-photos.json.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { flies } from "../src/data/flies";

const OUT = "src/data/fly-photos.json";
const UA = "michiganflies.com reference photo fetch (contact via site)";
const MAX_PER_FLY = 3;

export interface FlyPhoto {
  source: "wikimedia" | "openverse";
  /** Full-size or large image URL. */
  url: string;
  /** Smaller rendition for cards when the source offers one. */
  thumbUrl: string | null;
  width: number | null;
  height: number | null;
  title: string;
  author: string;
  license: string;
  licenseUrl: string | null;
  /** Page to link back to (Commons file page or Flickr photo page). */
  sourceUrl: string;
}

const STOPWORDS = new Set(["and", "the", "fly", "flies", "pattern", "dry", "nymph", "streamer", "egg", "variant", "parachute", "of", "a", "with"]);
const ALLOWED = /^(cc0|public domain|pd|cc by(?:-sa)?(?: \d(?:\.\d)?)?)$/i;

function keywords(name: string): string[] {
  const base = name.replace(/\(.*?\)/g, " ").split(/\s+and\s+|\//)[0];
  return base
    .toLowerCase()
    .replace(/['’]s\b/g, "s")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w && !STOPWORDS.has(w));
}

/** Alternate search phrases for patterns whose common names vary. */
const ALIASES: Record<string, string[]> = {
  "adams-parachute": ["Adams dry fly", "Parachute Adams"],
  "woolly-bugger": ["Woolly Bugger", "Wooly Bugger"],
  "gold-ribbed-hares-ear": ["Hare's Ear nymph", "Gold Ribbed Hares Ear"],
  "pheasant-tail-nymph": ["Pheasant Tail Nymph"],
  "elk-hair-caddis": ["Elk Hair Caddis"],
  "muddler-minnow": ["Muddler Minnow"],
  "zebra-midge": ["Zebra Midge"],
  "san-juan-worm": ["San Juan Worm"],
  intruder: ["Intruder steelhead fly"],
  "clouser-minnow": ["Clouser Minnow", "Clouser Deep Minnow"],
  "royal-wulff": ["Royal Wulff"],
  "griffiths-gnat": ["Griffith's Gnat"],
  "copper-john": ["Copper John nymph"],
  "prince-nymph": ["Prince Nymph"],
  "glo-bug": ["Glo Bug", "Glo-Bug egg fly"],
  "egg-sucking-leech": ["Egg Sucking Leech"],
  stimulator: ["Stimulator dry fly"],
  "chubby-chernobyl": ["Chubby Chernobyl"],
  "rusty-spinner": ["Rusty Spinner fly"],
  "soft-hackle-wet-fly": ["Soft hackle wet fly", "Partridge and Orange"],
  "blue-winged-olive-parachute": ["Blue Winged Olive dry fly", "BWO parachute"],
  "sulphur-comparadun": ["Comparadun", "Sulphur dun fly"],
  "pats-rubber-legs": ["Pat's Rubber Legs", "Rubber legs stonefly nymph"],
  "morrish-mouse": ["Morrish Mouse fly"],
  "zoo-cougar": ["Zoo Cougar streamer"],
  "circus-peanut": ["Circus Peanut streamer"],
  "sex-dungeon": ["Sex Dungeon streamer"],
  "hex-nymph-wiggler": ["Hexagenia nymph fly", "wiggle nymph"],
  "black-stonefly-nymph": ["black stonefly nymph fly"],
  scud: ["scud fly pattern"],
  "hex-spinner": ["Hexagenia spinner fly"],
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let lastRequestAt = 0;
async function get<T>(url: string, attempt = 0): Promise<T> {
  // Stay near one request per second per host; back off hard on 429.
  const wait = 1000 - (Date.now() - lastRequestAt);
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (res.status === 429 && attempt < 4) {
    const retryAfter = Number(res.headers.get("retry-after")) || 8 * (attempt + 1);
    await sleep(retryAfter * 1000);
    return get<T>(url, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return (await res.json()) as T;
}

/** The text must look like a fly-fishing photo, not the animal or a namesake. */
const FLY_SIGNAL = /\b(fly[- ]?fishing|fly[- ]?tying|flyfish|fly[- ]?tied|artificial fl(y|ies)|dry fly|wet fly|streamer|nymph|emerger|fishing fl(y|ies)|trout fl(y|ies)|steelhead fl(y|ies)|salmon fl(y|ies)|tied by|hook size|#\d{1,2} )\b/i;
/** Reject obvious non-fly subjects that share a name with a pattern. */
const NEGATIVE = /\b(cartoon|tv|television|movie|film|album|band|ninja turtle|comic|toy|figurine|sculpture|painting|drawing|logo|map|meme|nutcracker ballet|cricket match|cricket bat|baseball|football|hockey)\b/i;

function matches(text: string, words: string[]): boolean {
  const t = text.toLowerCase().replace(/wooly/g, "woolly").replace(/hare's|hares'|hare’s/g, "hares");
  if (!words.every((w) => t.includes(w.replace(/hare's|hares'/g, "hares")))) return false;
  if (NEGATIVE.test(t)) return false;
  return FLY_SIGNAL.test(t);
}

type CommonsPage = {
  title: string;
  imageinfo?: {
    url: string;
    thumburl?: string;
    width: number;
    height: number;
    descriptionurl: string;
    extmetadata?: Record<string, { value: string }>;
  }[];
};

async function searchCommons(query: string, words: string[]): Promise<FlyPhoto[]> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "20",
    prop: "imageinfo",
    iiprop: "url|size|extmetadata",
    iiurlwidth: "800",
    format: "json",
    origin: "*",
  });
  const data = await get<{ query?: { pages: Record<string, CommonsPage> } }>(`https://commons.wikimedia.org/w/api.php?${params}`);
  const out: FlyPhoto[] = [];
  for (const page of Object.values(data.query?.pages ?? {})) {
    const info = page.imageinfo?.[0];
    if (!info) continue;
    const meta = info.extmetadata ?? {};
    const licenseShort = strip(meta.LicenseShortName?.value ?? "");
    if (!ALLOWED.test(licenseShort)) continue;
    const title = page.title.replace(/^File:/, "").replace(/\.\w+$/, "");
    const categories = strip(meta.Categories?.value ?? "");
    const desc = strip(meta.ImageDescription?.value ?? "");
    if (!matches(`${title} ${categories} ${desc}`, words)) continue;
    if (/\.(pdf|djvu|svg)$/i.test(info.url)) continue;
    out.push({
      source: "wikimedia",
      url: info.url.split("?utm_")[0],
      thumbUrl: info.thumburl ? info.thumburl.split("?utm_")[0] : null,
      width: info.width,
      height: info.height,
      title,
      author: cleanAuthor(strip(meta.Artist?.value ?? meta.Credit?.value ?? "")),
      license: licenseShort,
      licenseUrl: meta.LicenseUrl?.value ?? null,
      sourceUrl: info.descriptionurl,
    });
  }
  return out;
}

type OpenverseResult = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  width: number | null;
  height: number | null;
  creator: string | null;
  license: string;
  license_version: string;
  license_url: string | null;
  foreign_landing_url: string;
  source: string;
  tags?: { name: string }[];
};

async function searchOpenverse(query: string, words: string[]): Promise<FlyPhoto[]> {
  const params = new URLSearchParams({ q: query, license: "cc0,by,by-sa,pdm", page_size: "20" });
  const data = await get<{ results: OpenverseResult[] }>(`https://api.openverse.org/v1/images/?${params}`);
  const out: FlyPhoto[] = [];
  for (const r of data.results) {
    const text = `${r.title} ${(r.tags ?? []).map((t) => t.name).join(" ")}`;
    if (!matches(text, words)) continue;
    // Only trust Flickr-hosted files we can render; skip other providers' odd hosts.
    if (!/^https:\/\/(live\.staticflickr\.com|upload\.wikimedia\.org)\//.test(r.url)) continue;
    if (r.source === "wikimedia") continue; // Commons handled directly with better metadata
    const lic = r.license === "pdm" ? "Public domain" : r.license === "cc0" ? "CC0" : `CC ${r.license.toUpperCase()} ${r.license_version}`;
    out.push({
      source: "openverse",
      url: r.url,
      thumbUrl: r.thumbnail ?? null,
      width: r.width,
      height: r.height,
      title: r.title,
      author: r.creator ?? "Unknown",
      license: lic,
      licenseUrl: r.license_url,
      sourceUrl: r.foreign_landing_url,
    });
  }
  return out;
}

function strip(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const only = new Set(process.argv.slice(2));
  const existing = existsSync(OUT) ? (JSON.parse(readFileSync(OUT, "utf8")) as { flies: Record<string, unknown> }) : { flies: {} };
  const out: { fetchedAt: string; flies: Record<string, { flyId: string; photos: FlyPhoto[] }> } = {
    fetchedAt: new Date().toISOString(),
    // A full run starts clean so stricter matching can drop earlier false hits; a partial run keeps the rest.
    flies: only.size ? { ...(existing.flies as Record<string, { flyId: string; photos: FlyPhoto[] }>) } : {},
  };
  let withPhotos = 0;
  for (const fly of flies) {
    if (only.size && !only.has(fly.id)) continue;
    const words = keywords(fly.name);
    if (!words.length) continue;
    const queries = ALIASES[fly.id] ?? [fly.name.replace(/\(.*?\)/g, "").trim()];
    const seen = new Set<string>();
    let photos: FlyPhoto[] = [];
    for (const q of queries) {
      const qWords = ALIASES[fly.id] ? keywords(q) : words;
      for (const fn of [searchCommons, searchOpenverse]) {
        if (photos.length >= MAX_PER_FLY) break;
        try {
          for (const p of await fn(q, qWords)) {
            if (photos.length >= MAX_PER_FLY) break;
            if (seen.has(p.url)) continue;
            seen.add(p.url);
            photos.push(p);
          }
        } catch (e) {
          console.warn(`  ${fly.id}: ${(e as Error).message}`);
        }
      }
    }
    // Prefer Commons (structured license metadata) and larger images.
    photos = photos.sort((a, b) => Number(b.source === "wikimedia") - Number(a.source === "wikimedia") || (b.width ?? 0) - (a.width ?? 0)).slice(0, MAX_PER_FLY);
    if (photos.length) {
      withPhotos++;
      out.flies[fly.id] = { flyId: fly.id, photos };
      console.log(`${fly.id.padEnd(32)} ${photos.length}  ${photos.map((p) => `${p.source}:${p.license}`).join(", ")}`);
    } else {
      delete out.flies[fly.id];
    }
  }
  writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
  console.log(`\n${withPhotos} flies with reference photos → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

function cleanAuthor(a: string): string {
  if (!a || /no machine-readable author/i.test(a)) return "Unknown";
  return a.replace(/\s*\(talk\)\s*/gi, " ").trim();
}
