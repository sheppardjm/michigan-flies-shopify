import type { FlyCategory } from "@/data";
import { cn } from "@/lib/utils";

/**
 * Stands in for a pattern photograph we do not have yet: an engraved hook
 * with a mark for the fly's category, on plank, in the site's dirt ink.
 * Honest about what it is, and better than an empty box or someone else's
 * photograph. Replaced the moment a bench photo lands.
 */
export function FlyPlaceholder({ category, name, className, compact = false }: { category: FlyCategory; name: string; className?: string; compact?: boolean }) {
  return (
    <div className={cn("fly-placeholder", compact && "fly-placeholder-compact", className)} role="img" aria-label={`${name}: no photograph yet`}>
      <svg viewBox="0 0 120 90" className="fly-placeholder-art" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="fp-hatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
            <rect width="3" height="0.5" fill="currentColor" opacity="0.35" />
          </pattern>
        </defs>
        <CategoryMark category={category} />
      </svg>
      {!compact ? <p className="fly-placeholder-label">Bench photo coming</p> : null}
    </div>
  );
}

/** One engraved mark per category, all built on the same hook. */
function CategoryMark({ category }: { category: FlyCategory }) {
  const hook = (
    <path d="M78 22 v 30 c 0 14 -12 22 -24 20 c -9 -1.5 -14 -8 -13 -15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  );
  const eye = <circle cx="78" cy="19" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />;
  const barb = <path d="M41 57 l 5 -6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />;
  const stroke = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (category) {
    case "dry":
    case "emerger":
      return (
        <g>
          {eye}
          {hook}
          {barb}
          {/* tail, body, hackle, upright wing */}
          <path d="M78 34 l 14 8 M78 34 l 15 3 M78 34 l 12 12" {...stroke} strokeWidth="0.9" />
          <path d="M60 30 L 78 34" {...stroke} strokeWidth="5" opacity="0.85" />
          <path d="M62 30 l -3 -11 M65 30 l 0 -12 M68 31 l 3 -12 M59 31 l -6 -9 M71 32 l 6 -10 M62 31 l -8 3 M70 32 l 8 4" {...stroke} strokeWidth="0.9" />
          <path d="M64 30 c -2 -9 2 -14 5 -15 c 3 1 6 6 4 15" {...stroke} strokeWidth="1.2" fill="url(#fp-hatch)" />
        </g>
      );
    case "nymph":
    case "larva":
      return (
        <g>
          {eye}
          {hook}
          {barb}
          <circle cx="76" cy="24" r="4.5" fill="url(#fp-hatch)" stroke="currentColor" strokeWidth="1.2" />
          <path d="M78 34 c -6 4 -11 8 -13 14 c -1 4 1 8 4 9" {...stroke} strokeWidth="5" />
          <path d="M66 43 l -6 -1 M64 47 l -6 0 M63 51 l -5 2 M72 38 l 5 -6 M75 40 l 6 -4" {...stroke} strokeWidth="0.9" />
          <path d="M74 37 l 6 -9 M77 38 l 7 -7" {...stroke} strokeWidth="0.8" opacity="0.7" />
        </g>
      );
    case "streamer":
    case "attractor":
      return (
        <g>
          {eye}
          {hook}
          {barb}
          <path d="M78 30 c -14 -6 -30 -4 -44 6 c 10 4 22 6 34 2 Z" fill="url(#fp-hatch)" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M34 36 l -14 -8 M34 36 l -16 -2 M34 36 l -13 6" {...stroke} strokeWidth="1" />
          <circle cx="70" cy="30" r="2" fill="currentColor" />
          <path d="M64 25 c 3 -3 8 -4 12 -3" {...stroke} strokeWidth="0.9" />
        </g>
      );
    case "wet":
      return (
        <g>
          {eye}
          {hook}
          {barb}
          <path d="M60 33 L 78 34" {...stroke} strokeWidth="4.5" />
          <path d="M78 34 l -8 -12 M78 34 l -4 -14 M78 34 l 1 -14 M78 34 l 5 -12 M78 34 l 9 -8" {...stroke} strokeWidth="0.9" />
          <path d="M60 33 l -10 6 M60 33 l -9 -3" {...stroke} strokeWidth="0.9" />
        </g>
      );
    case "egg":
      return (
        <g>
          {eye}
          {hook}
          {barb}
          <circle cx="68" cy="36" r="13" fill="url(#fp-hatch)" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="63" cy="31" r="3" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
        </g>
      );
    case "mouse":
      return (
        <g>
          {eye}
          {hook}
          {barb}
          <path d="M78 32 c -8 -14 -32 -14 -40 -2 c -4 6 0 12 8 12 l 32 -2 Z" fill="url(#fp-hatch)" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="50" cy="26" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M40 40 c -10 4 -16 12 -14 20" {...stroke} strokeWidth="1.1" />
        </g>
      );
    case "terrestrial":
      return (
        <g>
          {eye}
          {hook}
          {barb}
          <circle cx="60" cy="33" r="6" fill="url(#fp-hatch)" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="73" cy="32" r="5" fill="url(#fp-hatch)" stroke="currentColor" strokeWidth="1.2" />
          <path d="M66 33 h 2 M58 28 l -5 -6 M60 39 l -4 6 M74 37 l 4 6 M62 28 l -1 -7" {...stroke} strokeWidth="0.9" />
        </g>
      );
    case "worm":
      return (
        <g>
          {eye}
          {hook}
          {barb}
          <path d="M92 26 c -8 -4 -14 2 -16 8 c -2 6 -8 8 -14 6 c -6 -2 -12 2 -14 8" {...stroke} strokeWidth="4" />
        </g>
      );
  }
}
