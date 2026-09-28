/**
 * Screen-printed shop wallpaper: a repeating tile of a dry fly, a bare hook, a
 * small trout, a pine, and river stones in earthen inks. Sits on the rearmost
 * depth plane at low contrast so the wall reads as material, never as a
 * pattern fighting the content. Purely decorative.
 */
export function Wallpaper({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="shop-wallpaper" width="220" height="220" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="var(--wallpaper-ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* Dry fly: hook, body, hackle, tail */}
            <path d="M24 62 c -10 0 -16 -8 -14 -16 c 2 -8 12 -10 18 -4" />
            <path d="M28 42 l 30 0" strokeWidth="3" />
            <path d="M50 42 l 6 -14 M54 42 l 10 -10 M57 42 l 12 -4 M50 42 l 4 14 M54 42 l 10 10" />
            <path d="M28 42 l -12 -6 M28 42 l -12 2" />
            {/* Bare hook */}
            <path d="M150 20 l 0 34 c 0 12 -10 18 -18 14 c -6 -3 -8 -10 -4 -14" />
            <path d="M146 20 l 8 0" />
            <path d="M128 54 l -4 8" />
            {/* Small trout */}
            <path d="M98 150 c 22 -18 62 -20 84 -4 l 20 -12 c -6 12 -6 22 0 32 l -20 -10 c -22 16 -62 14 -84 -6 Z" />
            <path d="M104 148 c 24 -6 52 -6 76 -2" strokeDasharray="1 5" />
            <circle cx="110" cy="146" r="1.6" fill="var(--wallpaper-ink)" stroke="none" />
            <path d="M132 164 l 6 8 M150 166 l 4 8" />
            {/* Pine */}
            <path d="M40 116 l 14 22 l -8 0 l 12 18 l -10 0 l 14 20 l -44 0 l 14 -20 l -10 0 l 12 -18 l -8 0 Z" />
            <path d="M40 176 l 0 10" />
            {/* River stones */}
            <path d="M162 200 c 10 -10 30 -10 38 0 c 4 6 -4 12 -14 12 c -12 0 -30 -2 -24 -12 Z" />
            <path d="M126 206 c 6 -8 20 -8 26 0 c 3 4 -3 8 -10 8 c -8 0 -20 -1 -16 -8 Z" />
            <path d="M188 118 c 8 -8 24 -8 30 0 c 3 4 -3 8 -12 8 c -10 0 -22 -2 -18 -8 Z" />
            {/* Mayfly spinner */}
            <path d="M196 40 l 0 26 M196 46 l -12 -14 M196 46 l 12 -14 M196 40 l -4 -10 M196 40 l 4 -10 M196 66 l -6 12 M196 66 l 6 12" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#shop-wallpaper)" />
    </svg>
  );
}
