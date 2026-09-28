---
name: Michigan Flies
description: The back wall of a Michigan fly shop, painted in rainbow trout and working as an instrument.
colors:
  ink: "oklch(0.22 0.012 70)"
  trout-back: "oklch(0.42 0.075 128)"
  trout-back-deep: "oklch(0.33 0.06 130)"
  trout-band: "oklch(0.63 0.13 5)"
  trout-band-soft: "oklch(0.86 0.06 8)"
  trout-belly: "oklch(0.965 0.018 85)"
  trout-fin: "oklch(0.6 0.15 45)"
  trout-gill: "oklch(0.5 0.16 25)"
  trout-steel: "oklch(0.55 0.05 190)"
  mitt-moss: "oklch(0.56 0.08 118)"
  wall: "oklch(0.925 0.025 85)"
  plank: "oklch(0.895 0.03 82)"
  plank-shadow: "oklch(0.8 0.035 78)"
  card: "oklch(0.975 0.014 85)"
  board: "oklch(0.31 0.045 150)"
  board-deep: "oklch(0.25 0.04 150)"
  chalk: "oklch(0.955 0.02 85)"
  chalk-dim: "oklch(0.955 0.02 85 / 0.8)"
  rail: "oklch(0.36 0.05 55)"
  rail-deep: "oklch(0.29 0.045 52)"
  dirt: "oklch(0.47 0.05 60)"
  wallpaper-ink: "oklch(0.47 0.05 60 / 0.34)"
  muted-foreground: "oklch(0.44 0.04 62)"
  live: "oklch(0.985 0.015 90)"
typography:
  display:
    fontFamily: "Yellowtail, Yellowtail Fallback, Brush Script MT, cursive"
    fontSize: "clamp(2.75rem, 7vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 0.95
  headline:
    fontFamily: "Alfa Slab One, Alfa Slab One Fallback, Rockwell, serif"
    fontSize: "clamp(1.875rem, 3vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.01em"
  title:
    fontFamily: "Alfa Slab One, Alfa Slab One Fallback, Rockwell, serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.14em"
  body:
    fontFamily: "Jost, Jost Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Jost, Jost Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.1em"
  live:
    fontFamily: "Courier Prime, Courier Prime Fallback, ui-monospace, Courier New, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1
rounded:
  stamp: "2px"
  chalk: "3px"
  nav: "0.35rem"
  sm: "0.3rem"
  md: "0.4rem"
  lg: "0.5rem"
  submit: "0.6rem"
  card: "0.75rem"
  sign: "1.25rem"
  pill: "9999px"
spacing:
  xs: "0.375rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "1.5rem"
  xl: "2.5rem"
  section: "4rem"
  container: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.trout-back}"
    textColor: "{colors.trout-belly}"
    typography: "{typography.title}"
    rounded: "{rounded.submit}"
    padding: "0 1.5rem"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "{colors.trout-back-deep}"
    textColor: "{colors.trout-belly}"
  button-primary-disabled:
    backgroundColor: "{colors.trout-back-deep}"
    textColor: "{colors.trout-belly}"
  chip-fish:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 0.75rem"
    height: "2.25rem"
  chip-fish-on:
    backgroundColor: "{colors.trout-back}"
    textColor: "{colors.trout-belly}"
  input-counter:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0.25rem 0.625rem"
    height: "2.75rem"
  card-counter:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "1.25rem 1.25rem 1.25rem 4rem"
  card-plain:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  nav-rail:
    backgroundColor: "{colors.rail}"
    textColor: "{colors.trout-belly}"
    height: "4rem"
  nav-rail-link:
    textColor: "{colors.trout-belly}"
    rounded: "{rounded.nav}"
    padding: "0.5rem 0.65rem"
  nav-rail-link-current:
    backgroundColor: "{colors.trout-band}"
    textColor: "{colors.ink}"
  sign-enamel:
    backgroundColor: "{colors.trout-belly}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sign}"
    padding: "1.25rem 2.5rem 1.5rem"
    width: "44rem"
  board-chalk:
    backgroundColor: "{colors.board}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  badge-river:
    backgroundColor: "{colors.trout-back}"
    textColor: "{colors.trout-belly}"
    typography: "{typography.label}"
    padding: "0.4rem 1.1rem"
---

# Design System: Michigan Flies

## Overview

**Creative North Star: "The Shop Wall"**

The site is the back wall of a Michigan fly shop, and the wall works as an instrument rather than a backdrop. Every surface is a material that would hang there: cream painted shiplap for the page, a dark green chalkboard for anything live, an enamel trout sign over the counter, embroidered patches for the rivers, dirt-brown wood rails for the header and footer, and a pencil-ruled counter pad for the order form. The palette is the rainbow trout laid on those materials: olive back, rose lateral band, cream belly, copper fin, gill red, ink black for spots and type.

The world is dense and layered, not airy. Four depth planes stack in a fixed order (wallpaper, shiplap, board and badges, counter card), the rear two drift on scroll and the front card holds still. Nothing is left unpainted on any viewport; the wall runs edge to edge under everything, including the rails. Depth is physical: hard 2 to 4px ink borders, real drop shadows under things that hang, inset shadows on things that recess. Type is sign lettering: woodtype slab for what is painted on the sign and the section titles, a brush script standing in for a commissioned wordmark, a geometric sans for every badge, label, chip, and paragraph, and a typewriter mono that appears only where a number is live.

Confirmed rejections from the build: no photographic river hero; no white page with badges scattered as decoration; no chalkboard styled as a menu; no kicker or eyebrow above any heading (section headings carry their own weight; the small woodtype-caps region labels on the shelf are headings in their own right, not eyebrows over a larger title).

**Key Characteristics:**
- Trout palette on shop materials; the page background is painted shiplap, never flat white.
- Four named depth planes with scroll parallax on the rear planes only.
- One reserved live color (chalk-white mono) that appears only on the chalkboard.
- A strict four-state chalk vocabulary for hatch timing, used only on the board.
- River badges keep one silhouette and one fill per region under a shared stitched edge.
- Inner pages inherit these tokens through shadcn primitives and have not been individually restyled yet.

## Colors

The rainbow trout supplies every hue; the shop supplies the surfaces those hues are painted on.

### Primary
- **Olive Back** (`trout-back`): the trout's dorsal olive. Primary action fill (Find my flies), selected fish chips, the northern Lower Peninsula badge, scrollbar thumb, the script on the sign. shadcn `--primary` maps here.
- **Olive Back Deep** (`trout-back-deep`): hover and disabled fill for the primary button; the darker end of the same olive.

### Secondary
- **Rose Band** (`trout-band`): the lateral stripe. The single accent: the peak chalk fill on the board, the current-page nav tab, text selection, the counter pad's red margin rule (at 55% alpha), the active badge stroke, and the second layer of the sign script's offset text-shadow.
- **Rose Band Soft** (`trout-band-soft`): shadcn `--accent`; hover and focus fills inside menus and selects.

### Tertiary
- **Copper Fin** (`trout-fin`): every focus ring (3px solid, 2px offset), the caret, shadcn `--ring`, and the mid-state badge fill.
- **Gill Red** (`trout-gill`): shadcn `--destructive` and the southern Lower Peninsula badge fill.
- **Steel** (`trout-steel`): the Upper Peninsula badge fill; blue-grey lake steel.
- **Mitt Moss** (`mitt-moss`): the Tip of the Mitt badge fill; a yellower olive than the back.

### Neutral
- **Ink** (`ink`): all body text, every hard border, the trout's spots and outlines, badge strokes.
- **Cream Belly** (`trout-belly`): text on olive and on the rails, the enamel sign face, badge lettering, primary-foreground.
- **Wall** (`wall`): shadcn `--background`; the painted wall behind everything.
- **Plank** (`plank`) and **Plank Shadow** (`plank-shadow`): shiplap plank face and the groove between planks; also shadcn `--secondary`, `--muted`, `--border`, `--input`, and the scrollbar track.
- **Card** (`card`): the counter pad, fly cards, the evidence legend, popovers. A touch lighter than the wall so paper reads as paper.
- **Muted Foreground** (`muted-foreground`): secondary copy on cream; about 6:1 on card.
- **Board** (`board`) and **Board Deep** (`board-deep`): chalkboard slate and its recess.
- **Chalk** (`chalk`) and **Chalk Dim** (`chalk-dim`): chalk lettering on the board; dim is the same chalk at 0.8 alpha for approaching and finished states and region labels.
- **Rail** (`rail`) and **Rail Deep** (`rail-deep`): header and footer wood, board frame, chalk tray, shelf ledges.
- **Dirt** (`dirt`): counter-pad field labels and the wallpaper's screen-print ink (`wallpaper-ink`, 34% alpha).

### Named Rules
**The Reserved Live Color Rule.** `live` (near-white chalk mono) appears only on the chalkboard and only on numbers and dates that came from a live source today: the date line, water temperatures, gauge reading times, region offsets. It is never used as a text color anywhere else, and the board never sets a static word in it. Board link hover may brighten to it because the board is the one place it exists.

**The One Accent Rule.** Rose Band is the only warm accent on a screen. It marks peak on the board, the current page on the rail, selection, and the pad's margin rule. It is not used for decoration, backgrounds, or a second call to action.

**The Ink Border Rule.** Anything that hangs on the wall or sits on the counter is outlined in Ink (2px cards and buttons, 3 to 4px on the sign, 3 SVG units on badges). Ghost or tonal borders belong only to shadcn inner-page primitives.

## Typography

**Display Font:** Yellowtail (with Brush Script MT, cursive) as the wordmark placeholder until a mark is commissioned
**Headline Font:** Alfa Slab One (with Rockwell, serif)
**Body Font:** Jost (with system-ui, sans-serif)
**Live/Mono Font:** Courier Prime (with Courier New, monospace)

**Character:** Sign-painter lettering on a working wall. The slab is woodtype, always regular weight and usually uppercase and tracked; the script is a hand-painted placeholder that leans back 2 to 3 degrees; the sans does all the quiet work; the mono types the numbers the shop chalked up this morning.

### Hierarchy
- **Display** (Yellowtail 400, clamp(2.75rem, 7vw, 4.5rem), 0.95): the sign's "Michigan Flies" in Olive Back, rotated -3deg, with a two-layer offset text-shadow (2px cream, 4px rose). The rail wordmark is the same face at 1.9rem, rotated -2deg, with a 1px rail-deep shadow. The footer and mobile sheet reuse `.script` at 1.875rem.
- **Headline** (Alfa Slab One 400, 1.875rem to 2.25rem via `text-3xl sm:text-4xl`, 1.05, 0.01em): section titles on the wall ("Pick your river", "Most asked for") and the counter card's question (1.5rem to 1.875rem). Sentence case, never tracked.
- **Title / Woodtype caps** (Alfa Slab One 400, 0.72rem to 1rem, 1.1, 0.14em to 0.22em, uppercase): the sign line (0.22em), the board title (0.14em, 1.125rem to 1.25rem, chalk roughened), shelf region labels (0.875rem), counter labels (0.72rem, 0.16em, Dirt), footer column labels (0.76rem).
- **Body** (Jost 400, 0.875rem, 1.5): all paragraphs; secondary copy uses Muted Foreground and is bounded to `max-w-prose` or `max-w-md`.
- **Label** (Jost 500 to 600, 0.72rem to 0.8rem, 0.1em to 0.14em, uppercase): badge names (600, 0.78rem) and subs (500, 0.72rem), rail nav links (500, 0.8rem, 0.14em), board region labels (600, 0.72rem, 0.14em). Chip and tag text is the same sans at 0.76 to 0.8rem, medium, sentence case, not tracked.
- **Live** (Courier Prime 400, 0.74rem to 1rem, tabular numerals): dates, temperatures, offsets, and reading times on the board; the date input on the counter card.

### Named Rules
**The Woodtype Regular Rule.** Alfa Slab One ships in one weight and is never synthesized bold. Hierarchy in the slab comes from size, case, and tracking, not weight.

**The Mono Means Live Rule.** Courier Prime is reserved for numbers and dates that were measured or entered, not for labels, code, or decoration. If it is set in mono, a reader may trust it is a real reading.

## Layout

The page is a single full-bleed `.wall` with content sections centered in a 72rem container (`max-w-6xl`) with 1rem side padding. Sections are separated by 4rem of wall (`pb-16`), the last by 5rem. The first viewport is sign, then a 12-column split at `lg`: counter card seven columns, hatch board five (`grid-cols-[7fr_5fr]`, 1.5rem gap). Below `lg` the same three elements stack in order; the wall still runs edge to edge and the rails stay full width.

The shelf lays badges five across at `lg`, four at `md`, three at `sm`, and below `sm` becomes a horizontal snap-scroll row of 9.5rem patches that bleeds to the viewport edge (`-mx-4`). Each region sits on its own ledge with 2.5rem between ledges. Fly cards are a two-column grid on phones and four at `lg`. The header rail is 4rem tall and sticky; the footer rail is a three-column grid at `md` (220px, 1fr, 1fr) with 2.5rem vertical padding.

Spacing inside components follows the Tailwind 4 scale used in the build: 0.375rem between chips, 0.75rem between badges, 1.25rem between form fields, 1.25rem to 1.75rem card padding (the counter pad adds a 4rem to 5rem left inset to clear its margin rule), 1.5rem gutters.

Depth planes, in stacking order: `.plane-wallpaper` (z 0, 55% opacity, drifts -9% over the first 120vh of scroll), the shiplap and grain (`.wall` background and its `::after` grain at z 3, multiplied, 16% opacity), `.plane-near` (z 2, board and sign, drifts -2.5rem), `.plane-front` (z 4, the counter card, still). Parallax runs only under `animation-timeline: scroll()` support and `prefers-reduced-motion: no-preference`; without either, the planes are static and complete.

## Elevation & Depth

Depth is physical, not tonal. Objects that hang on the wall (sign, board, badges, cards) cast a soft, downward, warm-grey shadow keyed to Ink's hue (`oklch(0.2 0.02 60 / a)`), plus a hairline contact shadow so they read as resting against the shiplap. Objects that recess (the chalkboard slate) take inset shadows. Flat surfaces do not carry ambient shadow; the wall itself has none.

### Shadow Vocabulary
- **Hung sign** (`box-shadow: inset 0 0 0 6px var(--trout-belly), inset 0 0 0 8px var(--trout-back), 0 14px 28px -10px oklch(0.2 0.02 60 / 0.45), 0 2px 0 0 oklch(0.2 0.02 60 / 0.2)`): the enamel sign; the two insets are its painted olive pinstripe.
- **Counter pad** (`box-shadow: 0 18px 30px -14px oklch(0.2 0.02 60 / 0.5), 0 1px 0 0 oklch(0.2 0.02 60 / 0.25)`): the order card and, in lighter form (`0 12px 22px -14px oklch(0.2 0.02 60 / 0.55)`), fly cards and the evidence legend.
- **Board** (`box-shadow: inset 0 0 0 2px var(--rail-deep), inset 0 0 40px oklch(0 0 0 / 0.35), 0 18px 30px -14px oklch(0.2 0.02 60 / 0.6)`): the chalkboard, recessed inside its 10px rail frame.
- **Patch** (`filter: drop-shadow(0 3px 0 oklch(0.2 0.02 60 / 0.35)) drop-shadow(0 8px 12px oklch(0.2 0.02 60 / 0.25))`): river badges at rest; on hover the badge lifts 3px, tilts -1deg, and the filter becomes `drop-shadow(0 10px 10px oklch(0.2 0.02 60 / 0.35))`.
- **Button** (`box-shadow: 0 10px 18px -8px oklch(0.2 0.02 60 / 0.55)`): the primary submit; hover deepens to `0 14px 22px -10px / 0.6` with a -1px lift, active drops to `0 6px 12px -8px / 0.5` with a +1px press.
- **Rail** (`box-shadow: 0 6px 14px -8px oklch(0 0 0 / 0.5)`): header trim casting onto the wall; the footer mirrors it upward.
- **Ledge** (`box-shadow: 0 8px 12px -6px oklch(0 0 0 / 0.55)`): the 12px shelf under each badge region, and the chalk tray under the board.

### Named Rules
**The Hung Object Rule.** A shadow means the object is physically on the wall: it is offset downward, blurred, warm grey, and paired with a hard Ink border. Hard offset shadows without blur are not used; the sign's offset text-shadow is lettering, not elevation.

**The Front Plane Holds Still Rule.** Only the wallpaper and the near plane move on scroll; the counter card and the rails never do.

## Shapes

Corners are soft-but-cut, the radius a fraction of the object's size, never fully pill except on chips. The base radius is 0.5rem (`--radius`); shadcn scales it 0.6x to 2.6x. On the wall: enamel sign 1.25rem (0.9rem compact), counter card 0.75rem, primary button 0.6rem, board slate and fly cards 0.5rem, nav tabs 0.35rem, chalk marks 3px, stamps and small tags 2px, fish chips full pill.

Borders are hard Ink lines at 2px on cards and buttons, 3 to 4px on the sign, 3 SVG units on badges; the board's frame is a 10px Rail border with a 2px Rail Deep inset. Small tags (the offset tags on the shelf, the "reference photo" label on fly cards) use a 1px Ink line at 40 to 50% alpha on a Card fill. Rails carry a 3px Rail Deep edge on the side facing the page.

Silhouettes carry meaning. Each river region owns one badge outline, drawn in a 160x80 viewBox with a dashed stitch inset at 93%: Upper Peninsula a pointed shield, Tip of the Mitt an arch, Northern LP a rounded rectangle (16-unit corners), Mid-state a hexagon, Southern LP an oval. Chalk marks are roughened by an SVG turbulence filter (`#chalk-rough`) so no chalk edge is geometrically clean. Slight rotations are part of the form language: script -3deg on the sign, -2deg on the rail, badges -1deg on hover, the finished strike -2deg, the stamp -4deg.

### Named Rules
**The Badge Shape Per Region Rule.** A river badge's outline and fill are decided by its region and nothing else: U.P. shield in Steel, Tip of the Mitt arch in Mitt Moss, Northern LP rounded rectangle in Olive Back, Mid-state hexagon in Copper Fin, Southern LP oval in Gill Red. All five share the same 2:1 ratio, Ink stroke, cream stitch, and cream label, so the shelf reads as one set. An active badge thickens its stroke to 5 and turns it Rose Band; it does not change shape or fill.

## Components

### Buttons
- **Shape:** softly cut corners (0.6rem) with a 2px Ink border.
- **Primary (`.counter-submit`):** Olive Back fill, Cream Belly woodtype caps at 1.05rem with 0.08em tracking, 3.25rem tall, 1.5rem side padding, the Button shadow. Icon is a 1rem arrow inline after the label.
- **Hover / Active / Focus:** hover deepens to Olive Back Deep and lifts 1px; active presses 1px; focus is the global 3px Copper Fin outline. Transitions run 160ms on `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Disabled:** stays Olive Back Deep on Cream at 85% opacity with `not-allowed`; it keeps its color so the form never reads as greyed out.
- **shadcn variants (inner pages):** `default` is Olive Back on Cream at 2rem tall, 0.5rem radius, hover to 80% alpha; `outline`, `secondary`, `ghost`, `destructive`, and `link` map onto Plank, Muted, and Gill Red through the tokens. These have not been restyled to the wall.

### Chips
- **Fish toggles (`chip-fish`):** full pill, 2.25rem tall, 0.75rem side padding, Card fill, 1px Ink border at 60% alpha, Jost 500 at 0.8rem sentence case. Selected: Olive Back fill, Cream text, full Ink border. Species not documented in the chosen river drop to 45% opacity with a title tooltip.
- **Offset tags and photo labels:** 2px-radius rectangles, 1px Ink at 40 to 50% alpha on Card, Jost 500 at 0.7 to 0.76rem.
- **Evidence badge (S/A/I):** shadcn outline `Badge` in mono at 0.75rem, pill. See the drift note in Do's and Don'ts.

### Cards / Containers
- **Counter card (`.counter-card`):** Card fill with 32px pencil rules (1px, `oklch(0.62 0.05 60 / 0.22)`, offset 14px), a 2px Rose Band margin rule at 55% alpha 3.25rem from the left edge, 2px Ink border, 0.75rem radius, the Counter pad shadow, 1.25rem to 1.75rem padding with a 4rem to 5rem left inset. Field labels are woodtype caps in Dirt at 0.72rem.
- **Plain wall card:** Card fill, 2px Ink border, 0.5rem radius, the lighter counter shadow, 1.5rem to 2rem padding. Used for fly cards (with a 4:3 Plank image well) and the evidence legend.
- **shadcn `Card`:** 0.75rem radius (`rounded-xl`), Card fill, a 1px Ink ring at 10% alpha, 1rem spacing. Inner pages use this; it has not been restyled to the wall.

### Inputs / Fields
- **Counter fields:** shadcn `Input` and `SelectTrigger` raised to 2.75rem tall with an explicit Card fill; 1px Plank Shadow border, 0.5rem radius, 0.625rem side padding, Jost at 1rem (0.875rem at `md`). The date field sets in Courier Prime.
- **Focus:** border shifts to Copper Fin with a 3px Copper Fin ring at 50% alpha (shadcn), under the global 3px Copper Fin outline.
- **Invalid / Disabled:** Gill Red border and 20% ring; disabled at 50% opacity on a half-alpha Plank fill.

### Navigation
- **Rail (`.rail`):** Rail fill with a vertical highlight-to-shade gradient and a 142px board-seam repeat, 3px Rail Deep bottom edge, the Rail shadow, 4rem tall, sticky at z 40. Wordmark left in script at 1.9rem rotated -2deg; links right in Jost 500 caps at 0.8rem with 0.14em tracking, 0.5rem by 0.65rem padding, 0.35rem radius.
- **States:** hover is a 10% white wash (140ms); current page is a Rose Band tab with Ink text; focus is the global Copper Fin outline.
- **Mobile:** below `md` the links collapse into a right-side `Sheet` painted Rail with a script title and the same `.rail-nav` links stacked. The cart icon stays on the rail.
- **Footer:** the same rail, edge on top, with the woodcut, script name, woodtype-caps tagline, and two columns of small Cream body copy at 90% opacity.

### Enamel Sign (signature)
Cream Belly enamel face, 4px Ink border, 1.25rem radius, an olive pinstripe drawn with two inset box-shadows (6px cream, 8px Olive Back), four 14px Ink screw heads at the corners, the Hung sign shadow, and a 44rem maximum width. Inside: the SVG woodcut trout at 400px max, the script name in Olive Back with the two-layer offset shadow, and the woodtype caps line at 0.22em tracking. The compact variant (3px border, 0.9rem radius, no tagline) is available for inner pages.

### Hatch Board (signature)
Board fill under a fine noise SVG and two faint radial highlights, a 10px Rail frame with a 2px Rail Deep inset and a 40px inner vignette, 0.5rem radius, a chalk tray 18px below (Rail Deep, 10px tall, inset 8% each side). Title in woodtype caps at 0.14em, chalk-roughened, with the live date in mono at the right. Rules are dashed chalk (6px on, 3px off, 2px tall, 80%). Region rows are a 6.5rem label column (Jost 600 caps at 0.72rem in Chalk Dim with the offset in mono beneath) beside a wrapping row of hatch names. Water readings sit in a two-column list (one column below 420px) with river names as board links and readings in `live` at 1rem with the time at 0.74rem. A legend row repeats the four states at 0.76rem.

Rows draw on once as the board enters view: `clip-path` wipes left to right over 620ms on the same spring curve, staggered 70ms per row via `--i`, only inside `.board-reveal[data-reveal="in"]` and only without reduced motion. Rows are visible by default, so timing never hides content.

**The State Vocabulary Rule.** Hatch timing on the board is spoken in exactly four chalk states, each one treatment, all in Jost 500 at 0.95rem on the roughened filter: approaching is Chalk Dim inside a hand-dashed 1.6px box; hatching is Chalk with a 3px chalk underline; peak is Ink on a rough Rose Band fill at 600 weight with 0.45rem side padding; finished is Chalk Dim at 85% struck through by one 2.5px stroke rotated -2deg. No other color, icon, or weight signals state, and the vocabulary is used only on the board.

### River Badge (signature)
An SVG patch, 2:1, in a `badge-link` that is a block with a 0.5rem focus radius. Fill and outline per region (see Shapes), Ink stroke at 3 units with round joins, a dashed cream stitch (1.6 stroke, 1.2/1.2 dash, 85%) scaled to 93%, the Patch shadow. Text is centered Jost 600 caps at 0.78rem with 0.1em tracking and a 0.72rem sub line at 85%. Hover and focus lift 3px, tilt -1deg, and deepen the shadow over 180ms. Badges sit on a `.shelf` whose 12px Rail-to-Rail Deep ledge extends 0.5rem past each side.

### Browser Surfaces
Selection is Rose Band with Cream text; focus-visible is a 3px Copper Fin outline offset 2px; the caret is Copper Fin; scrollbars are Olive Back thumbs (12px, 3px Plank inset, 8px radius) on a Plank track. Links underline at 1.5px with a 0.18em offset. Headings balance, paragraphs use `text-wrap: pretty`, tables and `.tabular` use tabular numerals.

### Night variant
A `.dark` scope exists that moves the wall to a deep board green (`oklch(0.27 0.03 140)`), Chalk for foreground, and a pale olive primary. It is defined and token-complete but is not the shipped scene; the site is daylight by default and no toggle is exposed.

## Do's and Don'ts

### Do:
- **Do** paint every viewport with the wall (`.wall` with its plank repeat and grain); a new page that shows flat `--background` alone has left the world.
- **Do** outline hung and counter objects in Ink (2px cards and buttons, 4px sign) and give them a downward warm-grey shadow keyed to `oklch(0.2 0.02 60)`.
- **Do** set section titles in Alfa Slab One at regular weight, sentence case for headlines, uppercase with 0.14em or more tracking for small woodtype labels.
- **Do** reserve Courier Prime and the `live` color for measured numbers and dates on the board, and keep the four chalk states as the only hatch-timing language.
- **Do** give each region's river badge its own silhouette and fill from the fixed table, all on the shared stitched-edge patch.
- **Do** put focus in Copper Fin (3px outline, 2px offset) and the current nav item in a Rose Band tab.
- **Do** keep parallax on the rear planes only and respect `prefers-reduced-motion`; content must be complete with motion off.

### Don't:
- **Don't** use a photograph as a page hero or a full-bleed background; imagery is reference photos inside cards, insect thumbnails, and the SVG woodcut.
- **Don't** put a kicker or eyebrow line above a heading. The shelf's region labels are level-three headings with their own offset tag; do not add a smaller line over a title anywhere else.
- **Don't** use `live` chalk white, Courier Prime, or any chalk state off the board.
- **Don't** introduce a second accent; Rose Band is the only warm highlight, and Copper Fin belongs to focus, hover, and the mid-state badge.
- **Don't** synthesize bold on Alfa Slab One, or set body copy in it.
- **Don't** flatten badges into rectangles or recolor them by river; shape and fill are decided by region.
- **Don't** treat the Night variant as a theme option; it is a token mapping held in reserve, not a shipped scene.

Inner pages currently inherit these tokens through the shadcn primitives (`Button`, `Card`, `Input`, `Select`, `Badge`, `Tabs`, and the rest under `src/components/ui/`) and have not been individually restyled to the wall. Their radii, ring borders, and heights are shadcn defaults mapped onto the palette; when an inner page is brought into the world it should adopt the wall, the Ink border rule, and the shadow vocabulary above.

Not canonized, carried by the build: the S/A/I `EvidenceBadge` colors S and A with Tailwind `emerald` and `amber` rather than trout tokens (pre-existing, shared with inner pages); the `.stamp` class is defined in `globals.css` but not used on the home page; the wordmark is a Google Fonts script standing in for a commissioned mark. Future headroom named by the finish review and not yet built: a chalk hand for the board title, thread fill on badges, wood grain on shiplap and rails, enamel wear or sheen on the sign.
