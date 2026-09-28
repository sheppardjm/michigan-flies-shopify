import Link from "next/link";
import type { Region } from "@/data";
import { cn } from "@/lib/utils";

/**
 * Embroidered river patch. One shape per region so each region keeps its own
 * voice on the shelf: U.P. shield, Tip of the Mitt arch, northern LP rounded
 * rectangle, mid-state hexagon, southern LP oval. The badge is an SVG with a
 * stitched edge; the river name sets in the geometric sans.
 */
const SHAPES: Record<Region, string> = {
  "upper-peninsula": "M8 4 H152 V54 L80 78 L8 54 Z",
  "tip-of-mitt": "M8 76 V40 C8 18 34 4 80 4 C126 4 152 18 152 40 V76 Z",
  "northern-lp": "M20 4 H140 A16 16 0 0 1 156 20 V60 A16 16 0 0 1 140 76 H20 A16 16 0 0 1 4 60 V20 A16 16 0 0 1 20 4 Z",
  "mid-lp": "M40 4 H120 L156 40 L120 76 H40 L4 40 Z",
  "southern-lp": "M80 4 C130 4 156 20 156 40 C156 60 130 76 80 76 C30 76 4 60 4 40 C4 20 30 4 80 4 Z",
};

export const REGION_SHORT: Record<Region, string> = {
  "upper-peninsula": "U.P.",
  "tip-of-mitt": "Tip of the Mitt",
  "northern-lp": "Northern LP",
  "mid-lp": "Mid-state",
  "southern-lp": "Southern LP",
};

export function RiverBadge({
  name,
  region,
  href,
  sub,
  className,
  active = false,
}: {
  name: string;
  region: Region;
  href?: string;
  sub?: string;
  className?: string;
  active?: boolean;
}) {
  const shape = SHAPES[region];
  const body = (
    <span className={cn("badge", `badge-${region}`, active && "badge-active", className)}>
      <svg viewBox="0 0 160 80" className="badge-shape" aria-hidden="true" focusable="false">
        <path d={shape} className="badge-fill" />
        <path d={shape} className="badge-stitch" pathLength="100" />
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
