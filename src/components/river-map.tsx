import maps from "@/data/river-maps.json";
import type { Region } from "@/data";
import { cn } from "@/lib/utils";

/**
 * River plates: each river's main stem drawn large, zoomed to its own extent,
 * over Michigan engraved in the Dirt ink of the home page plate, with a
 * locator inset of the whole state. Geometry is Census and USGS public-domain
 * data built by `scripts/build-river-maps.ts`.
 *
 * The state outline is heavy, so it is defined once per page by
 * <RiverMapDefs /> and every plate references it with <use>.
 */

type RiverShape = { d: string; dot: [number, number]; box: [number, number, number, number] };
const RIVERS = maps.rivers as unknown as Record<string, RiverShape>;
const LAND_ID = "mi-land";

/** Plate aspect (width / height) and the narrowest window, in map units (1 unit ≈ 6.3 km). */
const ASPECT = 16 / 10;
const MIN_WIDTH = 11;

export function RiverMapDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        <path id={LAND_ID} d={maps.outline} vectorEffect="non-scaling-stroke" />
      </defs>
    </svg>
  );
}

function windowFor({ box }: RiverShape): { x: number; y: number; w: number; h: number } {
  const [x0, y0, x1, y1] = box;
  const pad = Math.max(x1 - x0, y1 - y0) * 0.16;
  const w = Math.max(x1 - x0 + 2 * pad, (y1 - y0 + 2 * pad) * ASPECT, MIN_WIDTH);
  const h = w / ASPECT;
  return { x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - h / 2, w, h };
}

const CORNERS = {
  "bottom-right": "right-2 bottom-2",
  "bottom-left": "left-2 bottom-2",
  "top-right": "right-2 top-2",
  "top-left": "left-2 top-2",
} as const;
type Corner = keyof typeof CORNERS;

/** The corner where the locator covers the fewest river points (and not the dot), bottom right on a tie. */
function quietCorner({ d, dot }: RiverShape, view: { x: number; y: number; w: number; h: number }): Corner {
  const nums = (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  const pts: [number, number][] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
  // Locator footprint: 22% of the width, and the state's aspect in height, plus its margin.
  const fw = view.w * 0.27;
  const fh = fw * (maps.height / maps.width) * 1.05;
  let best: Corner = "bottom-right";
  let fewest = Infinity;
  for (const corner of Object.keys(CORNERS) as Corner[]) {
    const x0 = corner.endsWith("right") ? view.x + view.w - fw : view.x;
    const y0 = corner.startsWith("bottom") ? view.y + view.h - fh : view.y;
    const inside = ([x, y]: [number, number]) => x >= x0 && x <= x0 + fw && y >= y0 && y <= y0 + fh;
    const hits = pts.filter(inside).length + (inside(dot) ? 1000 : 0);
    if (hits < fewest) [best, fewest] = [corner, hits];
  }
  return best;
}

export function RiverMap({ riverId, region, className }: { riverId: string; region: Region; className?: string }) {
  const river = RIVERS[riverId];
  if (!river) return null;
  const view = windowFor(river);
  const hatch = `hatch-${riverId}`;
  // Keep hatch spacing and the dot a constant size on screen whatever the zoom.
  const unit = view.w / 100;
  return (
    <div aria-hidden className={cn("relative aspect-[16/10] overflow-hidden", className)}>
      <svg viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} preserveAspectRatio="xMidYMid slice" className="block size-full">
        <defs>
          <pattern id={hatch} width={unit * 1.4} height={unit * 1.4} patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
            <rect width={unit * 1.4} height={unit * 0.28} fill="var(--dirt)" opacity="0.2" />
          </pattern>
        </defs>
        <rect x={view.x} y={view.y} width={view.w} height={view.h} style={{ fill: "color-mix(in oklch, var(--trout-steel) 18%, var(--card))" }} />
        <use href={`#${LAND_ID}`} className="fill-card" />
        <use href={`#${LAND_ID}`} fill={`url(#${hatch})`} />
        <use href={`#${LAND_ID}`} fill="none" stroke="var(--dirt)" strokeWidth={1.25} strokeLinejoin="round" />
        {river.d ? (
          <>
            <path d={river.d} fill="none" className="stroke-card" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <path d={river.d} fill="none" stroke="var(--trout-steel)" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </>
        ) : null}
        {/* A cream halo keeps the dot apart from the line, including the U.P.'s steel dot on a steel river. */}
        <circle cx={river.dot[0]} cy={river.dot[1]} r={unit * 3.6} className="fill-card" />
        <circle cx={river.dot[0]} cy={river.dot[1]} r={unit * 2.7} className={`map-dot map-dot-${region}`} style={{ strokeWidth: 2 }} vectorEffect="non-scaling-stroke" />
      </svg>
      <Locator view={view} dot={river.dot} region={region} corner={quietCorner(river, view)} />
    </div>
  );
}

/** The whole state, small, with the plate's window outlined. */
function Locator({ view, dot, region, corner }: { view: { x: number; y: number; w: number; h: number }; dot: [number, number]; region: Region; corner: Corner }) {
  return (
    <svg
      viewBox={`-3 -3 ${maps.width + 6} ${maps.height + 6}`}
      className={cn("absolute w-[22%] min-w-14 rounded-md border border-ink/40 bg-card p-1", CORNERS[corner], " shadow-[0_4px_8px_-4px_oklch(0.2_0.02_60/0.5)]")}
    >
      <use href={`#${LAND_ID}`} fill="var(--dirt)" opacity="0.35" />
      <rect x={view.x} y={view.y} width={view.w} height={view.h} fill="none" className="stroke-ink" strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
      <circle cx={dot[0]} cy={dot[1]} r={3.2} className={`map-dot map-dot-${region}`} style={{ strokeWidth: 1 }} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
