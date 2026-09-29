/**
 * Build the small Michigan river maps shown on river cards.
 *
 *   pnpm exec tsx scripts/build-river-maps.ts [riverId ...]
 *
 * Naming rivers rebuilds only those and keeps the rest of the existing file.
 *
 * The state outline is the Census Bureau's 1:500,000 cartographic boundary
 * (shoreline-clipped) and the rivers are USGS NHDPlus medium-resolution
 * flowlines from The National Map; both are US government works in the public
 * domain. For each river we find the named flowline nearest its centroid and
 * pull that flowline's whole NHDPlus level path (the main stem from mouth to
 * headwater), which keeps same-named rivers elsewhere in the state out.
 * Everything is projected into one shared viewBox, simplified, and written to
 * src/data/river-maps.json as SVG path data, with a dot where the river's
 * centroid falls on its line and the river's bounding box, which the cards
 * zoom to. Lines are kept fine enough to hold up at that zoom.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { rivers } from "../src/data/rivers";

const OUT = "src/data/river-maps.json";
const STATE_URL = "https://tigerweb.geo.census.gov/arcgis/rest/services/Generalized_ACS2024/State_County/MapServer/7/query";
const NHD_URL = "https://hydro.nationalmap.gov/arcgis/rest/services/nhd/MapServer/4/query";
const UA = "michiganflies.com river map build (contact via site)";

/** GNIS names of the flowlines to draw for each river; several names draw several main stems. */
const NAMES: Record<string, string[]> = {
  "au-sable-holy-waters": ["Au Sable River"],
  "au-sable-north-branch": ["North Branch Au Sable River"],
  "au-sable-south-branch": ["South Branch Au Sable River"],
  "au-sable-below-mio": ["Au Sable River"],
  "au-sable-below-foote-dam": ["Au Sable River"],
  "manistee-upper": ["Manistee River"],
  "manistee-below-tippy": ["Manistee River"],
  "little-manistee": ["Little Manistee River"],
  pine: ["Pine River"],
  boardman: ["Boardman River"],
  jordan: ["Jordan River"],
  pigeon: ["Pigeon River"],
  "sturgeon-lp": ["Sturgeon River"],
  "black-lp": ["Black River"],
  platte: ["Platte River"],
  betsie: ["Betsie River"],
  "pere-marquette": ["Pere Marquette River"],
  "muskegon-below-croton": ["Muskegon River"],
  "big-sable-above-hamlin": ["Big Sable River"],
  "big-sable-below-hamlin": ["Big Sable River"],
  white: ["White River"],
  rogue: ["Rogue River"],
  "grand-sixth-street": ["Grand River"],
  "st-joseph-berrien-springs": ["Saint Joseph River", "St. Joseph River"],
  kalamazoo: ["Kalamazoo River"],
  dowagiac: ["Dowagiac River", "Dowagiac Creek"],
  "huron-se": ["Huron River"],
  clinton: ["Clinton River", "Paint Creek"],
  "two-hearted": ["Two Hearted River"],
  escanaba: ["Escanaba River"],
  ontonagon: ["Ontonagon River", "Middle Branch Ontonagon River", "East Branch Ontonagon River", "West Branch Ontonagon River"],
  "carp-mackinac": ["Carp River"],
  chocolay: ["Chocolay River"],
  "big-huron-up": ["Huron River", "Big Huron River"],
  "yellow-dog": ["Yellow Dog River"],
  "presque-isle": ["Presque Isle River"],
  "sturgeon-up": ["Sturgeon River"],
  tahquamenon: ["Tahquamenon River"],
  anna: ["Anna River"],
  "salmon-trout": ["Salmon Trout River"],
};

/**
 * Rivers whose main stem has no GNIS name in the medium-resolution flowlines:
 * take the largest flowline (by drainage area) at a point on the river instead.
 * `clip` (degrees) keeps only the stem near that point, for the St. Marys,
 * whose level path runs on up through Lake Superior.
 */
const AT: Record<string, { lon: number; lat: number; clip?: number }> = {
  rifle: { lon: -83.87, lat: 44.08 }, // near the mouth; the centroid falls on Whitney Creek
  fox: { lon: -85.95, lat: 46.35 },
  "st-marys-rapids": { lon: -84.35, lat: 46.5, clip: 0.3 },
};

/** No flowline within reach of the centroid at this resolution: draw the dot only. */
const DOT_ONLY = new Set(["blind-sucker"]);

type Pt = [number, number];

async function query(url: string, params: Record<string, string>): Promise<GeoJSON> {
  const res = await fetch(`${url}?${new URLSearchParams({ f: "geojson", outSR: "4326", ...params })}`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return (await res.json()) as GeoJSON;
}
interface GeoJSON {
  features: { properties: Record<string, unknown>; geometry: { type: string; coordinates: unknown } | null }[];
}

function lines(geometry: { type: string; coordinates: unknown } | null): Pt[][] {
  if (!geometry) return [];
  if (geometry.type === "LineString") return [geometry.coordinates as Pt[]];
  if (geometry.type === "MultiLineString") return geometry.coordinates as Pt[][];
  return [];
}

// Equirectangular projection scaled for Michigan's latitude, fitted to the outline later.
const COS = Math.cos((45 * Math.PI) / 180);
const raw = ([lon, lat]: Pt): Pt => [lon * COS, -lat];

function perpDist(p: Pt, a: Pt, b: Pt): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = dx * dx + dy * dy;
  const t = len ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len)) : 0;
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

/** Douglas-Peucker. */
function simplify(pts: Pt[], tol: number): Pt[] {
  if (pts.length < 3) return pts;
  let max = 0;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], pts[0], pts[pts.length - 1]);
    if (d > max) [max, idx] = [d, i];
  }
  if (max <= tol) return [pts[0], pts[pts.length - 1]];
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)];
}

function ringArea(r: Pt[]): number {
  let a = 0;
  for (let i = 0; i < r.length; i++) {
    const [x1, y1] = r[i];
    const [x2, y2] = r[(i + 1) % r.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a / 2);
}

/** Join line segments that share endpoints so the path has few subpaths. */
function chain(segments: Pt[][]): Pt[][] {
  const key = (p: Pt) => `${p[0].toFixed(5)},${p[1].toFixed(5)}`;
  const pool = segments.filter((s) => s.length > 1).map((s) => [...s]);
  const out: Pt[][] = [];
  while (pool.length) {
    let line = pool.pop()!;
    let grew = true;
    while (grew) {
      grew = false;
      for (let i = 0; i < pool.length; i++) {
        const s = pool[i];
        const [head, tail] = [key(line[0]), key(line[line.length - 1])];
        if (key(s[0]) === tail) line = [...line, ...s.slice(1)];
        else if (key(s[s.length - 1]) === head) line = [...s, ...line.slice(1)];
        else if (key(s[s.length - 1]) === tail) line = [...line, ...s.slice(0, -1).reverse()];
        else if (key(s[0]) === head) line = [...s.slice(1).reverse(), ...line];
        else continue;
        pool.splice(i, 1);
        grew = true;
        break;
      }
    }
    out.push(line);
  }
  return out;
}

async function mainStems(name: string, lat: number, lon: number): Promise<{ levelPath: number; lines: Pt[][] } | null> {
  for (const r of [0.08, 0.2, 0.4, 0.7]) {
    const near = await query(NHD_URL, {
      where: `GNIS_NAME='${name.replace(/'/g, "''")}'`,
      geometry: `${lon - r / COS},${lat - r},${lon + r / COS},${lat + r}`,
      geometryType: "esriGeometryEnvelope",
      inSR: "4326",
      outFields: "LevelPathI",
    });
    let best: { d: number; lp: number } | null = null;
    for (const f of near.features) {
      for (const l of lines(f.geometry)) {
        for (const [x, y] of l) {
          const d = Math.hypot((x - lon) * COS, y - lat);
          if (!best || d < best.d) best = { d, lp: Number(f.properties.LevelPathI) };
        }
      }
    }
    if (!best) continue;
    const stem = await query(NHD_URL, { where: `LevelPathI=${best.lp}`, outFields: "LevelPathI" });
    return { levelPath: best.lp, lines: stem.features.flatMap((f) => lines(f.geometry)) };
  }
  return null;
}

async function stemAt({ lon, lat, clip }: { lon: number; lat: number; clip?: number }): Promise<Pt[][]> {
  const r = 0.04;
  const near = await query(NHD_URL, {
    where: "FTYPE IN ('StreamRiver','ArtificialPath')",
    geometry: `${lon - r / COS},${lat - r},${lon + r / COS},${lat + r}`,
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    outFields: "LevelPathI,TotDASqKM",
    returnGeometry: "false",
  });
  const top = near.features.sort((a, b) => Number(b.properties.TotDASqKM) - Number(a.properties.TotDASqKM))[0];
  if (!top) return [];
  const box: Record<string, string> = clip
    ? { geometry: `${lon - clip / COS},${lat - clip},${lon + clip / COS},${lat + clip}`, geometryType: "esriGeometryEnvelope", inSR: "4326" }
    : {};
  const stem = await query(NHD_URL, { where: `LevelPathI=${top.properties.LevelPathI}`, outFields: "LevelPathI", ...box });
  return stem.features.flatMap((f) => lines(f.geometry));
}

async function main() {
  const state = await query(STATE_URL, { where: "STUSAB='MI'", outFields: "NAME" });
  const polys = state.features[0].geometry!.coordinates as Pt[][][];
  // Keep the peninsulas and the larger islands; leave out Isle Royale, which would
  // widen every thumbnail for a place with none of these rivers.
  const rings = polys
    .map((p) => p[0].map(raw))
    .filter((r) => ringArea(r) > 0.004)
    .filter((r) => !(Math.min(...r.map((p) => -p[1])) > 47.7 && Math.max(...r.map((p) => p[0] / COS)) < -88));

  const xs = rings.flat().map((p) => p[0]);
  const ys = rings.flat().map((p) => p[1]);
  const [minX, minY] = [Math.min(...xs), Math.min(...ys)];
  const WIDTH = 100;
  const k = WIDTH / (Math.max(...xs) - minX);
  const HEIGHT = Math.ceil((Math.max(...ys) - minY) * k);
  const fit = (p: Pt): Pt => [(p[0] - minX) * k, (p[1] - minY) * k];
  const fmt = (p: Pt) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
  const round = (n: number) => Number(n.toFixed(2));
  const toPath = (ls: Pt[][], closed: boolean) =>
    ls
      .map((l) => `M${l.map(fmt).join("L")}${closed ? "Z" : ""}`)
      .join("");

  const outline = toPath(rings.map((r) => simplify(r.map(fit), 0.03)), true);

  const out: { source: string; builtAt: string; width: number; height: number; outline: string; rivers: Record<string, { d: string; dot: Pt; box: [number, number, number, number] }> } = {
    source: "US Census Bureau cartographic boundary (1:500k); USGS NHDPlus medium-resolution flowlines. Public domain.",
    builtAt: new Date().toISOString(),
    width: WIDTH,
    height: HEIGHT,
    outline,
    rivers: {},
  };
  const only = new Set(process.argv.slice(2));
  if (only.size && existsSync(OUT)) out.rivers = (JSON.parse(readFileSync(OUT, "utf8")) as typeof out).rivers;

  for (const r of rivers) {
    if (only.size && !only.has(r.id)) continue;
    const c = fit(raw([r.centroid.lon, r.centroid.lat]));
    if (DOT_ONLY.has(r.id)) {
      const dot: Pt = [round(c[0]), round(c[1])];
      out.rivers[r.id] = { d: "", dot, box: [dot[0], dot[1], dot[0], dot[1]] };
      console.log(`${r.id.padEnd(26)} dot only`);
      continue;
    }
    const all: Pt[][] = [];
    const seen = new Set<number>();
    if (AT[r.id]) all.push(...(await stemAt(AT[r.id])));
    else {
      const names = NAMES[r.id];
      if (!names) throw new Error(`No flowline names for ${r.id}`);
      for (const n of names) {
        const stem = await mainStems(n, r.centroid.lat, r.centroid.lon);
        if (!stem || seen.has(stem.levelPath)) continue;
        seen.add(stem.levelPath);
        all.push(...stem.lines);
      }
    }
    if (!all.length) {
      console.log(`${r.id.padEnd(26)} NO FLOWLINES`);
      continue;
    }
    const projected = chain(all).map((l) => simplify(l.map((p) => fit(raw(p))), 0.03));
    let dot: Pt = c;
    let best = Infinity;
    for (const l of projected) for (const p of l) {
      const d = Math.hypot(p[0] - c[0], p[1] - c[1]);
      if (d < best) [best, dot] = [d, p];
    }
    const px = projected.flat().map((p) => p[0]);
    const py = projected.flat().map((p) => p[1]);
    const box: [number, number, number, number] = [round(Math.min(...px)), round(Math.min(...py)), round(Math.max(...px)), round(Math.max(...py))];
    out.rivers[r.id] = { d: toPath(projected, false), dot: [round(dot[0]), round(dot[1])], box };
    console.log(`${r.id.padEnd(26)} ${seen.size || 1} stem(s), ${projected.length} path(s), dot ${best.toFixed(1)} units off centroid`);
  }
  writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
  console.log(`\nWrote ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
