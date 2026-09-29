import Link from "next/link";
import type { Region } from "@/data";
import { cn } from "@/lib/utils";

/**
 * Michigan as an engraved plate with every river reach on the site plotted at
 * its real centroid. Coordinates are a plain equirectangular fit of the state
 * (the state's bounding box) into a 0–100 box, which
 * is faithful enough at this size to place the U.P. and the mitten correctly.
 */

const LON = [-90.5, -82.4] as const;
const LAT = [41.6, 47.5] as const;

export function project(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon - LON[0]) / (LON[1] - LON[0])) * 100;
  const y = ((LAT[1] - lat) / (LAT[1] - LAT[0])) * 100;
  return { x, y };
}

/* Simplified from the public-domain US state boundaries (PublicaMundi us-states.json), Douglas-Peucker at 0.03 degrees. */
const LP: [number, number][] = [
  [-83.454, 41.732], [-84.807, 41.694], [-84.807, 41.76], [-86.823, 41.76], [-86.62, 41.891], [-86.357, 42.253], [-86.264, 42.444], [-86.209, 42.718], [-86.231, 43.014], [-86.527, 43.594], [-86.434, 43.814], [-86.499, 44.076], [-86.269, 44.345], [-86.22, 44.569], [-86.253, 44.69], [-86.089, 44.739], [-86.067, 44.903], [-85.809, 44.947], [-85.612, 45.128], [-85.629, 44.767], [-85.525, 44.75], [-85.393, 44.931], [-85.388, 45.238], [-85.305, 45.314], [-85.032, 45.364], [-85.119, 45.577], [-84.938, 45.758], [-84.714, 45.769], [-84.462, 45.654], [-84.216, 45.637], [-84.095, 45.495], [-83.909, 45.484], [-83.597, 45.353], [-83.487, 45.358], [-83.317, 45.144], [-83.454, 45.029], [-83.323, 44.882], [-83.273, 44.712], [-83.334, 44.339], [-83.536, 44.246], [-83.586, 44.055], [-83.827, 43.989], [-83.958, 43.759], [-83.909, 43.671], [-83.668, 43.589], [-83.482, 43.715], [-83.263, 43.972], [-82.917, 44.071], [-82.748, 43.994], [-82.644, 43.852], [-82.523, 43.228], [-82.414, 42.976], [-82.518, 42.614], [-82.682, 42.559], [-82.687, 42.691], [-82.797, 42.652], [-82.923, 42.351], [-83.126, 42.236], [-83.186, 42.006], [-83.438, 41.814],
];
const UP: [number, number][] = [
  [-87.589, 45.095], [-87.743, 45.199], [-87.65, 45.342], [-87.885, 45.364], [-87.792, 45.5], [-87.781, 45.676], [-87.989, 45.796], [-88.104, 45.922], [-88.531, 46.021], [-88.663, 45.988], [-89.09, 46.136], [-90.12, 46.338], [-90.229, 46.508], [-90.415, 46.568], [-90.027, 46.673], [-89.851, 46.793], [-89.413, 46.842], [-89.128, 46.99], [-88.997, 46.996], [-88.416, 47.374], [-88.181, 47.456], [-87.956, 47.385], [-88.444, 46.974], [-88.438, 46.788], [-88.247, 46.93], [-87.902, 46.908], [-87.633, 46.809], [-87.392, 46.536], [-87.261, 46.486], [-87.009, 46.53], [-86.949, 46.47], [-86.697, 46.437], [-86.16, 46.667], [-85.508, 46.678], [-85.064, 46.76], [-85.026, 46.481], [-84.829, 46.443], [-84.632, 46.486], [-84.55, 46.421], [-84.418, 46.503], [-84.128, 46.53], [-84.122, 46.18], [-83.991, 46.032], [-83.794, 45.993], [-83.772, 46.092], [-83.58, 46.092], [-83.476, 45.988], [-83.564, 45.911], [-84.111, 45.977], [-84.374, 45.933], [-84.659, 46.054], [-84.741, 45.944], [-84.703, 45.851], [-84.829, 45.873], [-85.015, 46.01], [-85.503, 46.097], [-85.661, 45.966], [-85.924, 45.933], [-86.209, 45.961], [-86.324, 45.906], [-86.352, 45.796], [-86.664, 45.703], [-86.647, 45.835], [-86.784, 45.862], [-86.839, 45.725], [-87.069, 45.72], [-87.173, 45.659], [-87.326, 45.424], [-87.611, 45.123],
];

function toPath(points: [number, number][]): string {
  return points.map(([lon, lat], i) => { const p = project(lat, lon); return `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`; }).join(" ") + " Z";
}

/** The two outlines as path data in the 0–100 projection, for small marks elsewhere (the river badges). */
export const MICHIGAN_OUTLINE = { lp: toPath(LP), up: toPath(UP) };

export interface MapRiver {
  id: string;
  name: string;
  lat: number;
  lon: number;
  region: Region;
}

export function MichiganMap({ rivers, className, title = "Michigan, with every river on this site marked" }: { rivers: MapRiver[]; className?: string; title?: string }) {
  return (
    <svg viewBox="-2 -2 104 104" role="img" aria-label={title} className={cn("block h-auto w-full", className)}>
      <defs>
        <pattern id="mi-hatch" width="1.6" height="1.6" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
          <rect width="1.6" height="0.2" fill="currentColor" opacity="0.18" />
        </pattern>
      </defs>
      {/* Lakes: a few engraved water lines around the state */}
      <g fill="none" stroke="currentColor" strokeWidth="0.25" opacity="0.35">
        <path d="M2 30 c 6 -1, 12 1, 18 0 M4 36 c 6 -1, 12 1, 18 0 M6 42 c 6 -1, 12 1, 18 0 M8 50 c 6 -1, 12 1, 18 0" />
        <path d="M78 74 c 6 -1, 12 1, 18 0 M80 80 c 6 -1, 12 1, 18 0 M82 86 c 6 -1, 12 1, 18 0" />
        <path d="M40 6 c 6 -1, 12 1, 18 0 M44 10 c 6 -1, 12 1, 18 0" />
      </g>
      <path d={toPath(UP)} fill="url(#mi-hatch)" stroke="currentColor" strokeWidth="0.55" strokeLinejoin="round" />
      <path d={toPath(LP)} fill="url(#mi-hatch)" stroke="currentColor" strokeWidth="0.55" strokeLinejoin="round" />
      {/* Rivers */}
      {rivers.map((r) => {
        const p = project(r.lat, r.lon);
        return (
          <Link key={r.id} href={`/rivers/${r.id}`} aria-label={r.name}>
            <title>{r.name}</title>
            <circle cx={p.x} cy={p.y} r="1.5" className={`map-dot map-dot-${r.region}`} />
          </Link>
        );
      })}
    </svg>
  );
}
