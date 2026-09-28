import { cn } from "@/lib/utils";

/**
 * Woodcut rainbow trout, authored as SVG. Flat fills in the trout palette with
 * carved hatching so it reads as a printed enamel sign, not clip art. Colors
 * come from CSS tokens so the mark follows the theme.
 */
export function TroutWoodcut({ className, title = "Rainbow trout" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 640 260" role="img" aria-label={title} className={cn("block h-auto w-full", className)}>
      <defs>
        <pattern id="wc-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
          <rect width="6" height="6" fill="transparent" />
          <rect width="6" height="1.4" fill="var(--ink)" opacity="0.28" />
        </pattern>
        <pattern id="wc-hatch-fine" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
          <rect width="4" height="0.9" fill="var(--ink)" opacity="0.18" />
        </pattern>
        <clipPath id="wc-body">
          <path d="M28 130 C 90 70, 190 44, 330 46 C 430 47, 500 70, 548 100 L 606 60 C 596 92, 592 122, 596 146 C 592 170, 596 200, 606 224 L 548 172 C 500 200, 430 224, 330 224 C 190 226, 90 190, 28 130 Z" />
        </clipPath>
      </defs>

      {/* Body silhouette */}
      <path
        d="M28 130 C 90 70, 190 44, 330 46 C 430 47, 500 70, 548 100 L 606 60 C 596 92, 592 122, 596 146 C 592 170, 596 200, 606 224 L 548 172 C 500 200, 430 224, 330 224 C 190 226, 90 190, 28 130 Z"
        fill="var(--trout-belly)"
        stroke="var(--ink)"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      <g clipPath="url(#wc-body)">
        {/* Olive back */}
        <path d="M0 40 L 640 40 L 640 112 C 500 96, 380 92, 250 104 C 160 112, 90 122, 20 138 Z" fill="var(--trout-back)" />
        {/* Rose lateral band */}
        <path d="M40 122 C 160 104, 300 100, 560 118 L 560 150 C 300 140, 160 142, 46 152 Z" fill="var(--trout-band)" opacity="0.92" />
        {/* Carved hatching over back and belly */}
        <rect x="0" y="40" width="640" height="80" fill="url(#wc-hatch)" />
        <rect x="0" y="160" width="640" height="80" fill="url(#wc-hatch-fine)" />
        {/* Spots */}
        {[
          [120, 78],
          [160, 66],
          [205, 72],
          [245, 62],
          [290, 70],
          [335, 60],
          [380, 68],
          [425, 62],
          [470, 74],
          [510, 84],
          [140, 96],
          [190, 92],
          [240, 88],
          [300, 90],
          [360, 86],
          [410, 90],
          [455, 96],
          [498, 104],
          [530, 112],
          [560, 128],
          [575, 150],
          [560, 178],
          [520, 190],
          [470, 198],
          [410, 204],
          [350, 206],
          [290, 202],
          [230, 196],
          [175, 186],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 4.2 : 3.2} fill="var(--ink)" />
        ))}
        {/* Gill plate */}
        <path d="M112 86 C 96 112, 96 148, 114 176" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <path d="M118 96 C 104 118, 104 146, 120 168" fill="none" stroke="var(--trout-gill)" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
      </g>

      {/* Fins, copper */}
      <path d="M300 48 C 330 18, 380 14, 420 24 C 396 36, 372 46, 352 54 Z" fill="var(--trout-fin)" stroke="var(--ink)" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M210 214 C 224 240, 252 250, 286 244 C 268 232, 254 224, 244 214 Z" fill="var(--trout-fin)" stroke="var(--ink)" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M392 216 C 404 238, 430 246, 458 240 C 442 230, 430 222, 420 214 Z" fill="var(--trout-fin)" stroke="var(--ink)" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M150 178 C 160 202, 186 212, 212 206 C 196 196, 182 188, 172 178 Z" fill="var(--trout-fin)" stroke="var(--ink)" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M480 66 C 494 52, 512 50, 526 56 C 514 64, 504 72, 498 82 Z" fill="var(--trout-fin)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
      {/* Fin rays */}
      <g stroke="var(--ink)" strokeWidth="1.6" opacity="0.6" fill="none">
        <path d="M330 40 L 322 52 M350 30 L 342 48 M372 24 L 362 44 M394 22 L 382 42" />
        <path d="M236 224 L 244 238 M254 222 L 266 240 M272 226 L 284 242" />
        <path d="M418 224 L 426 238 M436 222 L 448 238" />
      </g>
      {/* Tail rays */}
      <g stroke="var(--ink)" strokeWidth="2" opacity="0.55" fill="none">
        <path d="M556 104 L 596 74 M560 120 L 598 100 M562 140 L 600 140 M560 160 L 598 176 M556 178 L 596 208" />
      </g>

      {/* Eye and mouth */}
      <circle cx="74" cy="118" r="9" fill="var(--trout-belly)" stroke="var(--ink)" strokeWidth="3" />
      <circle cx="76" cy="118" r="4.2" fill="var(--ink)" />
      <path d="M30 132 C 48 140, 66 146, 88 148" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** The enamel sign over the counter: trout woodcut, script wordmark, woodtype line. */
export function TroutSign({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("wall-sign", compact && "wall-sign-compact", className)}>
      <div className="wall-sign-inner">
        <TroutWoodcut className={compact ? "mx-auto max-w-[220px]" : "mx-auto max-w-[400px]"} />
        <p className="wall-sign-script">Michigan Flies</p>
        {!compact ? <p className="wall-sign-line">Hand-tied for Michigan rivers</p> : null}
      </div>
      <Screw className="wall-sign-screw wall-sign-screw-tl" />
      <Screw className="wall-sign-screw wall-sign-screw-tr" />
      <Screw className="wall-sign-screw wall-sign-screw-bl" />
      <Screw className="wall-sign-screw wall-sign-screw-br" />
    </div>
  );
}

/** A drawn slotted screw head in the same ink as the woodcut. */
function Screw({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" className={className} aria-hidden="true" focusable="false">
      <circle cx="7" cy="7" r="6" fill="var(--trout-belly)" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.6 9.4 L 10.4 4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
