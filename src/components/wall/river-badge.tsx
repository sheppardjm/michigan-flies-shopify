import Link from "next/link";
import type { Region } from "@/data";
import { cn } from "@/lib/utils";

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
        <path d={shape} className="badge-keyline badge-keyline-outer" />
        <path d={shape} className="badge-keyline badge-keyline-inner" />
        <g transform="translate(80 18)" className="badge-mark">
          <Mark region={region} />
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
