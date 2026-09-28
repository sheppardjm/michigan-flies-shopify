import { cn } from "@/lib/utils";

/**
 * Michigan wilderness plates, engraved in one ink. Authored as SVG so they
 * scale and recolor with the theme; sized as slots for commissioned art.
 *
 * RiverBend: a northern Michigan river through white pine and cedar, a far
 * ridge, riffle lines, one rise. Wide, for the hero backdrop and section heads.
 * PineStand: a short row of white pines for margins and the footer.
 */

function seeded(seed: number) {
  return (i: number) => {
    const v = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
}

/**
 * White pine as a copper-plate engraving: a tapered trunk with a shadow
 * stroke and bark ticks, tiers at uneven spacing, each branch carrying
 * needle tufts drawn as short parallel strokes (denser on the lee side), a
 * hatch band under the lee branches for mass, and a ragged top, no leader.
 */
function Pine({ x, y, h, lean = 0, dense = false }: { x: number; y: number; h: number; lean?: number; dense?: boolean }) {
  const rnd = seeded(x + h);
  const tiers = dense ? 8 : 6;
  const branches: string[] = [];
  const tufts: string[] = [];
  const shade: string[] = [];
  for (let i = 0; i < tiers; i++) {
    const t = (i + 0.5 + (rnd(i) - 0.5) * 0.5) / tiers;
    const ty = y - h + h * (0.16 + t * 0.78);
    const w = h * (0.1 + t * 0.36) * (0.85 + rnd(i + 20) * 0.3);
    const droop = w * 0.22;
    const sides: [number, number][] = [
      [-1, w * (1 + lean * 0.45)],
      [1, w * (1 - lean * 0.45)],
    ];
    for (const [s, len] of sides) {
      branches.push(`M${x} ${ty} c ${s * len * 0.35} ${droop * 0.25}, ${s * len * 0.7} ${droop * 0.7}, ${s * len} ${droop}`);
      if (rnd(i + 40 + s) > 0.35) {
        branches.push(`M${x} ${ty + w * 0.07} c ${s * len * 0.3} ${droop * 0.5}, ${s * len * 0.5} ${droop * 0.9}, ${s * len * 0.72} ${droop * 1.3}`);
      }
      const lee = s * lean <= 0;
      const n = 4 + Math.round(rnd(i + 60 + s) * 2);
      for (let k = 0; k < n; k++) {
        const p = 0.3 + (k / (n - 1)) * 0.7;
        const px = x + s * len * p;
        const py = ty + droop * p * p;
        const tl = w * (0.09 + 0.07 * p);
        const count = lee ? 4 : 3;
        for (let m = 0; m < count; m++) {
          const ang = 0.85 + m * 0.3 + (rnd(i * 7 + k * 3 + m) - 0.5) * 0.3;
          const dx = s * Math.cos(ang) * tl * 0.7;
          const dy = Math.sin(ang) * tl;
          tufts.push(`M${px + (m - (count - 1) / 2) * tl * 0.22} ${py} l ${dx} ${dy}`);
        }
      }
      if (lee) {
        for (let m = 0; m < 5; m++) {
          const p = 0.22 + m * 0.15;
          shade.push(`M${x + s * len * p} ${ty + droop * p * p + w * 0.05} l ${s * w * 0.04} ${w * 0.11}`);
        }
      }
    }
  }
  const top = `M${x} ${y - h} c ${-h * 0.02} ${h * 0.03}, ${-h * 0.05} ${h * 0.05}, ${-h * 0.07} ${h * 0.09} M${x} ${y - h * 0.99} c ${h * 0.02} ${h * 0.03}, ${h * 0.04} ${h * 0.05}, ${h * 0.06} ${h * 0.08} M${x} ${y - h * 0.96} c ${-h * 0.03} ${h * 0.02}, ${-h * 0.06} ${h * 0.04}, ${-h * 0.1} ${h * 0.06}`;
  const bark = `M${x + h * 0.018} ${y - h * 0.02} l ${h * 0.02} ${-h * 0.05} M${x + h * 0.02} ${y - h * 0.1} l ${h * 0.02} ${-h * 0.05} M${x + h * 0.022} ${y - h * 0.18} l ${h * 0.018} ${-h * 0.05} M${x - h * 0.02} ${y - h * 0.06} l ${-h * 0.014} ${-h * 0.04}`;
  return (
    <g fill="none" stroke="currentColor" strokeLinecap="round">
      <path d={`M${x - h * 0.012} ${y} L ${x - h * 0.004 + lean * 2} ${y - h * 0.97}`} strokeWidth="1.5" />
      <path d={`M${x + h * 0.012} ${y} L ${x + h * 0.006 + lean * 2} ${y - h * 0.62}`} strokeWidth="1" opacity="0.7" />
      <path d={bark} strokeWidth="0.6" opacity="0.6" />
      <path d={branches.join(" ")} strokeWidth="0.9" />
      <path d={tufts.join(" ")} strokeWidth="0.7" opacity="0.85" />
      <path d={shade.join(" ")} strokeWidth="0.55" opacity="0.55" />
      <path d={top} strokeWidth="0.8" />
    </g>
  );
}

/** Black spruce: a narrow spire of short drooping branches, each tipped with a few hanging needle strokes. */
function Spruce({ x, y, h }: { x: number; y: number; h: number }) {
  const rnd = seeded(x * 3 + h);
  const branches: string[] = [];
  const tufts: string[] = [];
  for (let i = 1; i <= 9; i++) {
    const t = i / 9;
    const ty = y - h + h * t * 0.96;
    const w = (h * 0.06 + h * 0.16 * t) * (0.85 + rnd(i) * 0.3);
    for (const s of [-1, 1]) {
      branches.push(`M${x} ${ty} c ${s * w * 0.4} ${w * 0.1}, ${s * w * 0.75} ${w * 0.3}, ${s * w} ${w * 0.5}`);
      tufts.push(`M${x + s * w * 0.55} ${ty + w * 0.2} l ${s * w * 0.04} ${w * 0.22} M${x + s * w * 0.8} ${ty + w * 0.34} l ${s * w * 0.05} ${w * 0.24} M${x + s * w} ${ty + w * 0.5} l ${s * w * 0.03} ${w * 0.2}`);
    }
  }
  return (
    <g fill="none" stroke="currentColor" strokeLinecap="round">
      <path d={`M${x} ${y} L ${x} ${y - h}`} strokeWidth="1.1" />
      <path d={branches.join(" ")} strokeWidth="0.8" />
      <path d={tufts.join(" ")} strokeWidth="0.6" opacity="0.8" />
      <path d={`M${x} ${y - h} l ${-h * 0.015} ${h * 0.04} M${x} ${y - h} l ${h * 0.02} ${h * 0.035}`} strokeWidth="0.7" />
    </g>
  );
}

export function RiverBend({ className, title = "A northern Michigan river through pine and cedar" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 1600 420" role="img" aria-label={title} className={cn("block h-auto w-full", className)} preserveAspectRatio="xMidYMax slice">
      <defs>
        <pattern id="wl-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <rect width="6" height="0.8" fill="currentColor" opacity="0.5" />
        </pattern>
        <pattern id="wl-hatch-fine" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <rect width="4" height="0.6" fill="currentColor" opacity="0.3" />
        </pattern>
      </defs>

      {/* Far ridge: one contour, hatched below */}
      <path d="M0 214 C 120 196, 220 188, 330 198 C 430 206, 520 176, 640 182 C 760 188, 840 166, 960 172 C 1100 178, 1200 160, 1320 168 C 1420 174, 1520 190, 1600 186" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <path d="M0 214 C 120 196, 220 188, 330 198 C 430 206, 520 176, 640 182 C 760 188, 840 166, 960 172 C 1100 178, 1200 160, 1320 168 C 1420 174, 1520 190, 1600 186 L 1600 250 L 0 250 Z" fill="url(#wl-hatch-fine)" />

      {/* Far spruce line along the ridge */}
      <g opacity="0.55">
        {Array.from({ length: 46 }).map((_, i) => {
          const x = 20 + i * 35 + ((i * 37) % 11);
          const ridgeY = 200 + Math.sin(i * 0.7) * 10 - (i > 20 && i < 30 ? 14 : 0);
          return <Spruce key={i} x={x} y={ridgeY + 8} h={28 + ((i * 13) % 18)} />;
        })}
      </g>

      {/* Middle treeline: white pines, larger, uneven */}
      <g opacity="0.8">
        <Pine x={140} y={262} h={120} lean={0.3} dense />
        <Pine x={230} y={268} h={96} lean={0.1} />
        <Pine x={300} y={258} h={132} lean={0.4} dense />
        <Pine x={1240} y={262} h={112} lean={-0.3} dense />
        <Pine x={1330} y={270} h={92} lean={-0.1} />
        <Pine x={1420} y={256} h={138} lean={-0.35} dense />
        <Pine x={1520} y={266} h={104} lean={-0.2} />
        <Spruce x={380} y={266} h={70} />
        <Spruce x={410} y={270} h={54} />
        <Spruce x={1180} y={268} h={64} />
        <Spruce x={1150} y={272} h={48} />
      </g>

      {/* Banks: sedge and gravel */}
      <path d="M0 270 C 140 262, 300 272, 470 282 C 560 288, 620 300, 680 312 L 0 312 Z" fill="url(#wl-hatch)" />
      <path d="M1600 266 C 1460 260, 1300 268, 1130 280 C 1040 286, 980 298, 920 310 L 1600 310 Z" fill="url(#wl-hatch)" />
      <path d="M0 270 C 140 262, 300 272, 470 282 C 560 288, 620 300, 680 312" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M1600 266 C 1460 260, 1300 268, 1130 280 C 1040 286, 980 298, 920 310" fill="none" stroke="currentColor" strokeWidth="1.1" />
      {/* Sedge tufts */}
      <g fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.7">
        <path d="M520 284 l -3 -14 M526 284 l 1 -16 M532 284 l 5 -13 M590 296 l -3 -12 M596 296 l 1 -14 M602 296 l 4 -11 M1020 292 l -3 -12 M1026 292 l 0 -14 M1032 292 l 4 -12 M1090 284 l -3 -14 M1096 284 l 1 -16 M1102 284 l 5 -13" />
      </g>

      {/* Leaning cedar over the water, left */}
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M60 300 C 120 250, 210 236, 320 246" strokeWidth="2.2" />
        <path d="M150 262 C 170 248, 190 244, 214 246 M200 250 C 226 236, 258 236, 290 246 M240 248 C 262 232, 296 228, 330 240" strokeWidth="1" />
        <path d="M190 262 c 10 -6 22 -8 34 -6 c -12 4 -20 10 -26 18 M250 256 c 12 -6 26 -6 38 -2 c -14 4 -24 10 -30 18 M300 250 c 12 -6 26 -6 38 -2 c -14 4 -24 10 -30 18" strokeWidth="0.9" opacity="0.8" />
      </g>

      {/* Water: riffle lines, a seam, one rise */}
      <g fill="none" stroke="currentColor" strokeLinecap="round" opacity="0.7">
        {Array.from({ length: 14 }).map((_, i) => {
          const y = 318 + i * 7;
          const x0 = 400 + i * 22 + (i % 2) * 40;
          const len = 500 - i * 18;
          return <path key={i} d={`M${x0} ${y} c ${len * 0.25} -2, ${len * 0.5} 2, ${len} 0`} strokeWidth={i % 3 === 0 ? 1 : 0.7} />;
        })}
        <path d="M700 330 c 40 -4, 80 4, 120 0 c 40 -4, 80 4, 120 0" strokeWidth="1.1" />
        <ellipse cx="880" cy="352" rx="26" ry="5" strokeWidth="0.9" />
        <ellipse cx="880" cy="352" rx="14" ry="2.6" strokeWidth="0.8" />
        <ellipse cx="880" cy="352" rx="42" ry="8" strokeWidth="0.6" opacity="0.5" />
      </g>
      {/* Boulders */}
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M600 372 c 10 -12, 34 -12, 46 -2 c 4 6, -4 12, -16 12 c -14 0, -34 -2, -30 -10 Z" />
        <path d="M640 384 c 8 -8, 24 -8, 30 0 c 2 4, -4 8, -12 8 c -10 0, -22 -2, -18 -8 Z" />
        <path d="M1160 366 c 10 -12, 34 -12, 46 -2 c 4 6, -4 12, -16 12 c -14 0, -34 -2, -30 -10 Z" />
      </g>
      <path d="M600 372 c 10 -12, 34 -12, 46 -2 c 4 6, -4 12, -16 12 c -14 0, -34 -2, -30 -10 Z M1160 366 c 10 -12, 34 -12, 46 -2 c 4 6, -4 12, -16 12 c -14 0, -34 -2, -30 -10 Z" fill="url(#wl-hatch-fine)" />
    </svg>
  );
}

/** A stand of white pine and spruce on hatched ground, low and wide, for the footer rail. */
export function PineStand({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 130" aria-hidden="true" focusable="false" className={cn("block h-auto w-full", className)}>
      <defs>
        <pattern id="ps-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <rect width="5" height="0.7" fill="currentColor" opacity="0.4" />
        </pattern>
      </defs>
      <path d="M0 118 C 120 112, 260 116, 400 114 C 540 112, 680 116, 800 112 L 800 130 L 0 130 Z" fill="url(#ps-hatch)" />
      <g opacity="0.7">
        <Spruce x={40} y={117} h={44} />
        <Spruce x={228} y={118} h={38} />
        <Spruce x={458} y={116} h={50} />
        <Spruce x={640} y={117} h={40} />
        <Spruce x={775} y={115} h={46} />
      </g>
      <Pine x={96} y={117} h={92} lean={0.3} dense />
      <Pine x={172} y={118} h={66} lean={0.15} />
      <Pine x={300} y={116} h={104} lean={0.35} dense />
      <Pine x={382} y={118} h={72} lean={0.1} />
      <Pine x={540} y={115} h={98} lean={-0.3} dense />
      <Pine x={606} y={118} h={62} lean={-0.15} />
      <Pine x={708} y={116} h={88} lean={-0.35} dense />
      <path d="M0 118 C 120 112, 260 116, 400 114 C 540 112, 680 116, 800 112" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}
