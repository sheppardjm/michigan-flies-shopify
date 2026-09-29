import Link from "next/link";
import type { Region } from "@/data";
import { cn } from "@/lib/utils";
import { MICHIGAN_OUTLINE, project } from "./michigan-map";

/**
 * River patch in the Campbell Outfitters manner: solid fill, an ink edge, two
 * solid keylines inset, a small mark at the top, the river name in geometric
 * caps and a short sub-line beneath. One silhouette per region so a shelf
 * reads as five families: U.P. shield, northwest arch, northeast rounded
 * plate, southwest hexagon, southeast oval (the DNR fishing-report regions).
 */
const SHAPES: Record<Region, string> = {
  "upper-peninsula": "M6 4 H154 V52 L80 78 L6 52 Z",
  "northwest-lp": "M6 76 V42 C6 20 34 4 80 4 C126 4 154 20 154 42 V76 Z",
  "northeast-lp": "M18 4  H142 A14 14 0 0 1 156 18 V62 A14 14 0 0 1 142 76 H18 A14 14 0 0 1 4 62 V18 A14 14 0 0 1 18 4 Z",
  "southwest-lp": "M38 4 H122 L156 40 L122 76 H38 L4 40 Z",
  "southeast-lp": "M80 4 C130 4 156 20 156 40 C156 60 130 76 80 76 C30 76 4 60 4 40 C4 20 30 4 80 4 Z",
};

export const REGION_SHORT: Record<Region, string> = {
  "upper-peninsula": "Upper Peninsula",
  "northwest-lp": "Northwest Lower",
  "northeast-lp": "Northeast Lower",
  "southwest-lp": "Southwest Lower",
  "southeast-lp": "Southeast Lower",
};

/** Small marks, one per region, drawn in the badge's own text color. */
function Mark({ region }: { region: Region }) {
  switch (region) {
    case "upper-peninsula": // white pine
      return <path d="M0 -7 L -5 2 L -2 2 L -6 7 L 6 7 L 2 2 L 5 2 Z" fill="currentColor" />;
    case "northwest-lp": // rising trout ring
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <ellipse cx="0" cy="3" rx="7" ry="2.2" />
          <ellipse cx="0" cy="3" rx="3.5" ry="1.1" />
          <path d="M-3 -6 c 2 -3, 5 -3, 7 0" />
        </g>
      );
    case "northeast-lp": // dry fly
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <path d="M-6 2 c -4 0, -5 -4, -2 -6" />
          <path d="M-5 -1 L 6 -1" strokeWidth="2" />
          <path d="M2 -1 l 3 -6 M4 -1 l 5 -4 M2 -1 l 2 6 M4 -1 l 5 4" />
        </g>
      );
    case "southwest-lp": // hook
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
          <path d="M3 -8 V 0 c 0 6, -7 8, -10 3" />
          <path d="M-7 3 l 3 -3" />
          <path d="M1 -8 h 4" />
        </g>
      );
    case "southeast-lp": // sedge
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <path d="M-6 6 l -1 -12 M-2 6 l 0 -13 M2 6 l 1 -12 M6 6 l 2 -10" />
        </g>
      );
  }
}

/**
 * The river's place on a small Michigan plate: both peninsulas in the
 * badge's own text color, the river as a solid dot with a ring. Replaces the
 * region mark when the badge knows its river's coordinates.
 */
function PlaceMark({ lat, lon }: { lat: number; lon: number }) {
  const p = project(lat, lon);
  return (
    <g transform="translate(-14.5 -12.5) scale(0.29 0.27)" fill="currentColor" stroke="currentColor">
      <use href="#mi-outline" />
      <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="11" fill="none" strokeWidth="2.4" opacity="0.7" />
      <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="5.5" stroke="none" />
    </g>
  );
}

/** Render once per page (the shelf does) so every badge's plate reuses one copy of the outline. */
export function MichiganOutlineDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <g id="mi-outline" fillOpacity="0.22" strokeWidth="2.2" strokeLinejoin="round">
          <path d={MICHIGAN_OUTLINE.up} />
          <path d={MICHIGAN_OUTLINE.lp} />
        </g>
      </defs>
    </svg>
  );
}

export function RiverBadge({
  name,
  region,
  href,
  sub,
  className,
  active = false,
  lat,
  lon,
}: {
  name: string;
  region: Region;
  href?: string;
  sub?: string;
  className?: string;
  active?: boolean;
  /** River centroid; when given, the mark is the river's place on a small Michigan plate. */
  lat?: number;
  lon?: number;
}) {
  const shape = SHAPES[region];
  const body = (
    <span className={cn("badge", `badge-${region}`, active && "badge-active", className)}>
      <svg viewBox="0 0 160 80" className="badge-shape" aria-hidden="true" focusable="false">
        <path d={shape} className="badge-fill" />
        <path d={shape} className="badge-keyline badge-keyline-outer" />
        <path d={shape} className="badge-keyline badge-keyline-inner" />
        <g transform="translate(80 20.5) scale(0.9)" className="badge-mark">
          {lat !== undefined && lon !== undefined ? <PlaceMark lat={lat} lon={lon} /> : <Mark region={region} />}
        </g>
      </svg>
      <span className="badge-text">
        <span className="badge-name">{name}</span>
        {sub ? <span className="badge-sub">{sub}</span> : null}
      </span>
    </span>
  );
  if (href) {
    return (
      <Link href={href} className="badge-link" aria-label={`${name} river page`}>
        {body}
      </Link>
    );
  }
  return body;
}
