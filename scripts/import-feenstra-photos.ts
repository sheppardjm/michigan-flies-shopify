/**
 * Import Kevin Feenstra's own photos of his patterns from feenstraoutdoors.com,
 * used with his permission (September 2026). Photos are downloaded into
 * public/photos/flies/ and recorded in src/data/fly-photos.json with source
 * "permission". Unlike import-fdf-photos.ts, this adds to the existing photos
 * rather than replacing other permission photos.
 *
 *   pnpm exec tsx scripts/import-feenstra-photos.ts
 *
 * Feenstra photos not yet matched to a catalog fly (add the fly first):
 *   Toadbreaker Sculpin  wp-content/uploads/2023/01/toadbreaker-1.jpg
 *   Codebreaker          wp-content/uploads/2020/12/DSC00840.jpg
 *   Cranberry Spey       wp-content/uploads/2021/11/Cranberry-Spey-1.jpg
 *   River Chicken        wp-content/uploads/2015/02/river-chicken-1-of-11.jpg
 *   Reflector            wp-content/uploads/2015/02/reflector-1-of-11.jpg
 *   BTS (Better Than Spawn) wp-content/uploads/2015/02/bts-1-of-11.jpg
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT_JSON = "src/data/fly-photos.json";
const OUT_DIR = "public/photos/flies";
const CREDIT = "Kevin Feenstra";
const UPLOADS = "https://feenstraoutdoors.com/wordpress/wp-content/uploads/";
const PAGES = "https://feenstraoutdoors.com/wordpress/";

/** Our fly id → Feenstra's photo. `lead` puts it ahead of the fly's other photos (his own pattern). */
const MAP: { flyId: string; upload: string; page: string; title: string; lead: boolean }[] = [
  { flyId: "grapefruit-head-leech", upload: "2015/02/grapefruit-1-of-11.jpg", page: "grapefruit-1-of-1-2/", title: "Feenstra Grapefruit Leech", lead: true },
  { flyId: "halloween-leech", upload: "2015/02/halloween-1-of-11.jpg", page: "halloween-1-of-1-2/", title: "Feenstra Halloween Leech", lead: true },
  { flyId: "emulator", upload: "2015/02/emulator-1-of-11.jpg", page: "emulator-1-of-1-2/", title: "Emulator", lead: true },
  { flyId: "aqua-nuisance", upload: "2015/02/aquatic-nuisance-1-of-11.jpg", page: "aquatic-nuisance-1-of-1-2/", title: "Aquatic Nuisance", lead: true },
  { flyId: "hex-nymph", upload: "2015/02/ap-hex-1-of-11.jpg", page: "ap-hex-1-of-1-2/", title: "Kevin Feenstra AP Hex", lead: false },
];

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

async function download(url: string, dest: string): Promise<boolean> {
  if (existsSync(dest)) return true;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36" } });
  if (!res.ok) {
    console.warn(`  ${res.status} ${url}`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) return false;
  writeFileSync(dest, buf);
  return true;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const out = JSON.parse(readFileSync(OUT_JSON, "utf8")) as { fetchedAt: string; flies: Record<string, { flyId: string; photos: FlyPhoto[] }> };
  let count = 0;
  for (const m of MAP) {
    const file = `${m.flyId}--feenstra.jpg`;
    if (!(await download(UPLOADS + m.upload, path.join(OUT_DIR, file)))) continue;
    const photo: FlyPhoto = {
      source: "permission",
      url: `/photos/flies/${file}`,
      thumbUrl: null,
      width: null,
      height: null,
      title: m.title,
      author: CREDIT,
      license: "Used with permission",
      licenseUrl: null,
      sourceUrl: PAGES + m.page,
    };
    const others = (out.flies[m.flyId]?.photos ?? []).filter((p) => p.url !== photo.url);
    const photos = m.lead ? [photo, ...others] : [...others.filter((p) => p.source === "permission"), photo, ...others.filter((p) => p.source !== "permission")];
    out.flies[m.flyId] = { flyId: m.flyId, photos };
    count++;
    console.log(`${m.flyId.padEnd(24)} ${m.title}`);
  }
  out.fetchedAt = new Date().toISOString();
  writeFileSync(OUT_JSON, JSON.stringify(out, null, 2) + "\n");
  console.log(`\n${count} photos imported → ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
