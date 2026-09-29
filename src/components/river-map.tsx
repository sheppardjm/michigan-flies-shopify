import maps from "@/data/river-maps.json";
import { cn } from "@/lib/utils";

/**
 * Michigan with one river's main stem drawn in and a dot at the reach, built
 * from Census and USGS public-domain geometry by `scripts/build-river-maps.ts`.
 * Strokes do not scale, so the river stays legible at thumbnail size.
 */
export function RiverMap({ riverId, className, title }: { riverId: string; className?: string; title?: string }) {
  const river = (maps.rivers as Record<string, { d: string; dot: number[] }>)[riverId];
  if (!river) return null;
  return (
    <svg viewBox={`0 0 ${maps.width} ${maps.height}`} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} className={cn("block", className)}>
      {title ? <title>{title}</title> : null}
      <path d={maps.outline} className="fill-muted stroke-border" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {river.d ? (
        <path d={river.d} fill="none" stroke="var(--trout-steel)" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      ) : null}
      <circle cx={river.dot[0]} cy={river.dot[1]} r={2.4} fill="var(--trout-gill)" className="stroke-card" strokeWidth={1} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
