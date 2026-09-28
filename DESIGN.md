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
  muted-foreground: "oklch(0.44 0.04 62)"
  live: "oklch(0.87 0.13 88)"
typography:
  display:
    fontFamily: "Mr Dafoe, Mr Dafoe Fallback, Brush Script MT, cursive"
    fontSize: "clamp(3rem, 7.5vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 1
  headline:
    fontFamily: "Zilla Slab, Zilla Slab Fallback, Rockwell, Georgia, serif"
    fontSize: "clamp(1.875rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Zilla Slab, Zilla Slab Fallback, Rockwell, Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.16em"
  body:
    fontFamily: "Jost, Jost Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Jost, Jost Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.14em"
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
  sign: "0.9rem"
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
    typography: "{typography.label}"
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
    rounded: "{rounded.md}"
    padding: "1.5rem"
  badge-river:
    backgroundColor: "{colors.trout-back}"
    textColor: "{colors.trout-belly}"
    typography: "{typography.label}"
    padding: "15cqi 8cqi 5cqi"
  badge-river-southeast-lp:
    backgroundColor: "{colors.trout-belly}"
    textColor: "{colors.trout-fin}"
  badge-river-southwest-lp:
    backgroundColor: "{colors.trout-fin}"
    textColor: "{colors.trout-belly}"
  badge-river-northeast-lp:
    backgroundColor: "{colors.trout-back}"
    textColor: "{colors.trout-belly}"
  badge-river-northwest-lp:
    backgroundColor: "{colors.trout-belly}"
    textColor: "{colors.trout-back}"
  badge-river-upper-peninsula:
    backgroundColor: "{colors.trout-steel}"
    textColor: "{colors.trout-belly}"
---

# Design System: Michigan Flies

## Overview

**Creative North Star: "The Shop Wall"**

The site is the back wall of a Michigan fly shop, and the wall works as an instrument rather than a backdrop. Every surface is a material that would hang there: cream painted shiplap for the page, a dark green chalkboard for anything live, an enamel sign over the counter carrying the owner's leaping rainbow trout, engraved plates in one dirt-brown ink for the river bend, the Michigan map and the pine stand, outfitter patches for the rivers, dirt-brown wood rails for the header and footer, and a pencil-ruled counter pad for the order form. The palette is the rainbow trout laid on those materials: olive back, rose lateral band, cream belly, copper fin, gill red, lake steel, ink black for type and edges.

The register is a field guide, not a souvenir shop. Planks are faint, the grain is light, the engraving sits at low contrast behind the first viewport, and nothing repeats as a pattern. Four depth planes stack in a fixed order (engraved plate, shiplap, board and badges, counter card); the plate and the near plane drift on scroll and the front card holds still. Nothing is left unpainted on any viewport; the wall runs edge to edge under everything, including the rails. Depth is physical: hard Ink borders at 1.5 to 2px, real downward shadows under things that hang, inset shadows on things that recess. Type is a refined slab for the section titles and small woodtype labels, a sign-painter script standing in for a commissioned wordmark, a geometric sans for every badge, label, chip, sign line and paragraph, and a typewriter mono that appears only where a number is live.

Confirmed rejections from the build: no photographic river hero; no white page with badges scattered as decoration; no chalkboard styled as a menu; no repeating pattern on any surface (the screen-printed wallpaper, the woodcut header and the stitched badge edges of the first pass were removed as childish); no kicker or eyebrow above any heading (the small woodtype-caps region labels on the shelf are level-three headings in their own right, not eyebrows over a larger title).

**Key Characteristics:**
- Trout palette on shop materials; the page background is faint painted shiplap, never flat white and never a pattern.
- Four named depth planes with scroll parallax on the rear planes only.
- One reserved live color (chalk-yellow mono) that appears only on the chalkboard's date, offsets and gauge readings.
- A strict four-state chalk vocabulary for hatch timing, used only on the board.
- River badges follow the Campbell Outfitters manner, one silhouette, one fill and one mark per DNR fishing-report region, under a shared Ink edge and two solid keylines.
- Supporting illustration is engraved SVG line art in one ink, authored as slots for commissioned art; the mark itself is the owner's full-color logo file.
- Inner pages inherit these tokens through shadcn primitives and have not been individually restyled yet.

## Colors

The rainbow trout supplies every hue; the shop supplies the surfaces those hues are painted on.

### Primary
- **Olive Back** (`trout-back`): the trout's dorsal olive. Primary action fill (Find my flies), selected fish chips, the script on the sign, the Northeast Lower Peninsula badge fill, the Northwest badge's lettering and edge, the default map dot, and the scrollbar thumb. shadcn `--primary` maps here.
- **Olive Back Deep** (`trout-back-deep`): hover and disabled fill for the primary button; the darker end of the same olive.

### Secondary
- **Rose Band** (`trout-band`): the lateral stripe. The single accent: the peak chalk fill on the board, the current-page nav tab, text selection, the active badge stroke, and the map dot's hover ring.
- **Rose Band Soft** (`trout-band-soft`): shadcn `--accent`; hover and focus fills inside menus and selects.

### Tertiary
- **Copper Fin** (`trout-fin`): every focus ring (3px solid, 2px offset), the caret, shadcn `--ring`, the Southwest Lower Peninsula badge fill, the Southeast badge's lettering and edge, and the Southwest map dot.
- **Gill Red** (`trout-gill`): shadcn `--destructive` and the Southeast map dot.
- **Lake Steel** (`trout-steel`): the Upper Peninsula badge fill and map dot; blue-grey lake steel.

### Neutral
- **Ink** (`ink`): all body text, every hard border, the badge edge, the sign's pinstripe and screw heads.
- **Cream Belly** (`trout-belly`): text on olive and on the rails, the enamel sign face, the Southeast and Northwest badge fills, badge lettering and keylines on dark fills, primary-foreground.
- **Wall** (`wall`): shadcn `--background`; the painted wall behind everything.
- **Plank** (`plank`) and **Plank Shadow** (`plank-shadow`): shiplap plank face and the groove between planks; also shadcn `--secondary`, `--muted`, `--border`, `--input`, the fly-card image well, and the scrollbar track.
- **Card** (`card`): the counter pad, fly cards, the evidence legend, offset tags, popovers. A touch lighter than the wall so paper reads as paper.
- **Muted Foreground** (`muted-foreground`): secondary copy on cream, the region key under the map; about 6:1 on card.
- **Board** (`board`) and **Board Deep** (`board-deep`): chalkboard slate and its recess.
- **Chalk** (`chalk`) and **Chalk Dim** (`chalk-dim`): chalk lettering on the board; dim is the same chalk at 0.8 alpha for approaching and finished states, region labels, rules and legend text.
- **Rail** (`rail`) and **Rail Deep** (`rail-deep`): header and footer wood, board frame, chalk tray, shelf ledges.
- **Dirt** (`dirt`): counter-pad field labels and the engraving ink of every plate (river bend at 42% opacity, Michigan plate at full).

### Named Rules
**The Reserved Live Color Rule.** `live` (chalk-yellow mono) appears only on the chalkboard and only on numbers and dates that came from a live source today: the date line, water temperatures, gauge reading times, region offsets. It is never used as a text color anywhere else, and the board never sets a static word in it.

**The One Accent Rule.** Rose Band is the only warm accent on a screen. It marks peak on the board, the current page on the rail, selection, the active badge and the hovered map dot. It is not used for decoration, backgrounds, or a second call to action.

**The Ink Border Rule.** Anything that hangs on the wall or sits on the counter is outlined in Ink (1.5px on the counter card, 2px on cards, buttons and the sign, 2 SVG units on badges). Ghost or tonal borders belong only to small tags and the shadcn inner-page primitives.

**The One Ink Rule.** Engraved illustration is drawn in a single color, Dirt, at hairline stroke weights with hatched fills; it never takes a second hue, a gradient or a photograph. The only full-color image on the shell is the owner's trout logo.

## Typography

**Display Font:** Mr Dafoe (with Brush Script MT, cursive) as the wordmark placeholder until lettering is commissioned
**Headline Font:** Zilla Slab (with Rockwell, Georgia, serif)
**Body Font:** Jost (with system-ui, sans-serif)
**Live/Mono Font:** Courier Prime (with Courier New, monospace)

**Character:** Sign lettering on a working wall, restrained to a field-guide register. The slab is refined rather than heavy: bold and sentence case for titles, semibold uppercase and tracked for small labels. The script is a hand-painted placeholder that leans back only on the rail. The sans does all the quiet work, including the sign line and every badge; the mono types the numbers the shop chalked up this morning.

### Hierarchy
- **Display** (Mr Dafoe 400, clamp(3rem, 7.5vw, 4.75rem), 1): the sign's "Michigan Flies" in Olive Back, upright, no shadow. The rail wordmark is the same face at 1.9rem, rotated -2deg, with a 1px Rail Deep shadow. The footer and mobile sheet reuse `.script` at 1.875rem.
- **Headline / Woodtype** (Zilla Slab 700, 1.875rem to 2.25rem via `text-3xl sm:text-4xl`, 1.05, -0.01em): section titles on the wall ("Pick your river", "Most asked for") and the counter card's question (1.5rem to 1.875rem). Sentence case, never tracked.
- **Title / Woodtype caps** (Zilla Slab 600, 0.76rem to 0.875rem, 1.1, 0.16em, uppercase): shelf region labels (0.875rem) and footer column labels (0.76rem). The board title is the same face in uppercase at 0.14em, 1.125rem to 1.25rem, chalk-roughened.
- **Body** (Jost 400, 0.875rem, 1.5): all paragraphs; secondary copy uses Muted Foreground and is bounded to `max-w-prose` or `max-w-md`.
- **Label** (Jost 600, 0.72rem to 0.82rem, 0.1em to 0.26em, uppercase): the sign line (0.26em), counter labels (0.16em, Dirt), board region labels (0.14em, Chalk Dim), badge names (0.1em, container-scaled), and the primary button (0.95rem, 0.12em). Rail nav links are Jost 500 at 0.8rem, 0.14em. Chip and tag text is the same sans at 0.7 to 0.8rem, medium, sentence case, not tracked.
- **Live** (Courier Prime 400, 0.74rem to 1rem, tabular numerals): dates, temperatures, offsets, and reading times on the board; the date input on the counter card.

### Named Rules
**The Slab Titles Only Rule.** Zilla Slab appears at two settings, bold sentence-case titles and semibold tracked caps labels; it never sets body copy, badges, buttons or the sign line, all of which belong to Jost.

**The Mono Means Live Rule.** Courier Prime is reserved for numbers and dates that were measured or entered, not for labels, code, or decoration. If it is set in mono, a reader may trust it is a real reading.

**The Badge Type Scales With The Badge Rule.** Badge lettering is sized in container-query units (name `clamp(0.6875rem, 6cqi, 0.78rem)`, script sub-line `clamp(0.85rem, 8cqi, 1.1rem)`, text inset `15cqi 8cqi 5cqi`) so the mark and the lower keyline are cleared at every badge width.

## Layout

The page is a single full-bleed `.wall` with content sections centered in a 72rem container (`max-w-6xl`) with 1rem side padding. Sections are separated by 4rem of wall (`pb-16`), the last by 5rem. The first viewport is sign, then a 12-column split at `lg`: counter card seven columns, hatch board five (`grid-cols-[7fr_5fr]`, 1.5rem gap). Below `lg` the same three elements stack in order; the wall still runs edge to edge and the rails stay full width.

The shelf opens with a two-column head at `sm` (`1fr 380px`): the title and a short paragraph on the left, the Michigan plate on the right (16rem wide on phones, full column above) with a five-swatch region key beneath it in 0.72rem Muted Foreground. Badges lay five across at `lg`, four at `md`, three at `sm`, and below `sm` become a horizontal snap-scroll row of 11.5rem patches that bleeds to the viewport edge (`-mx-4`). Each region sits on its own ledge with 2.5rem between ledges. Fly cards are a two-column grid on phones and four at `lg`. The header rail is 4rem tall and sticky; the footer rail carries the pine stand across the container, then a three-column grid at `md` (220px, 1fr, 1fr) with 2.5rem vertical padding.

Spacing inside components follows the Tailwind 4 scale used in the build: 0.375rem between chips, 0.75rem between badges, 1.25rem between form fields, 1.25rem to 1.75rem card padding (the counter pad adds a 4rem to 5rem left inset), 1.5rem gutters. The counter card's foot carries a compact S/A/I key below the button, separated by a 1px Ink rule at 15% alpha, three columns at `sm`.

Depth planes, in stacking order: `.plane-plate` (z 0, the engraved river bend at 42% opacity in Dirt, at least 1600px wide and centered, drifting -6% over the first 120vh of scroll), the shiplap and grain (`.wall` background with a 164px plank repeat and its `::after` grain at z 3, multiplied, 10% opacity), `.plane-near` (z 2, sign and board, drifting -2.5rem), `.plane-content` (z 2, sections), `.plane-front` (z 4, the counter card, still). Parallax runs only under `animation-timeline: scroll()` support and `prefers-reduced-motion: no-preference`; without either, the planes are static and complete.

## Elevation & Depth

Depth is physical, not tonal. Objects that hang on the wall (sign, board, badges, cards) cast a soft, downward, warm-grey shadow keyed to Ink's hue (`oklch(0.2 0.02 60 / a)`), plus a hairline contact shadow so they read as resting against the shiplap. Objects that recess (the chalkboard slate) take inset shadows. Flat surfaces do not carry ambient shadow; the wall and the engraved plates have none.

### Shadow Vocabulary
- **Hung sign** (`box-shadow: inset 0 0 0 5px var(--trout-belly), inset 0 0 0 6px var(--ink), 0 14px 28px -12px oklch(0.2 0.02 60 / 0.4)`): the enamel sign; the two insets are its 1px Ink pinstripe 5px inside the edge.
- **Counter pad** (`box-shadow: 0 18px 30px -14px oklch(0.2 0.02 60 / 0.5), 0 1px 0 0 oklch(0.2 0.02 60 / 0.25)`): the order card and, in lighter form (`0 12px 22px -14px oklch(0.2 0.02 60 / 0.55)`), fly cards and the evidence legend.
- **Board** (`box-shadow: inset 0 0 0 2px var(--rail-deep), inset 0 0 40px oklch(0 0 0 / 0.35), 0 18px 30px -14px oklch(0.2 0.02 60 / 0.6)`): the chalkboard, recessed inside its 8px Rail frame.
- **Patch** (`filter: drop-shadow(0 3px 0 oklch(0.2 0.02 60 / 0.35)) drop-shadow(0 8px 12px oklch(0.2 0.02 60 / 0.25))`): river badges at rest; on hover the badge lifts 3px, tilts -1deg, and the filter becomes `drop-shadow(0 10px 10px oklch(0.2 0.02 60 / 0.35))`.
- **Button** (`box-shadow: 0 10px 18px -8px oklch(0.2 0.02 60 / 0.55)`): the primary submit; hover deepens to `0 14px 22px -10px / 0.6` with a -1px lift, active drops to `0 6px 12px -8px / 0.5` with a +1px press.
- **Rail** (`box-shadow: 0 6px 14px -8px oklch(0 0 0 / 0.5)`): header trim casting onto the wall; the footer mirrors it upward.
- **Ledge** (`box-shadow: 0 8px 12px -6px oklch(0 0 0 / 0.55)`): the 12px shelf under each badge region, and the chalk tray under the board (`0 6px 10px -4px oklch(0 0 0 / 0.5)`).

### Named Rules
**The Hung Object Rule.** A shadow means the object is physically on the wall: it is offset downward, blurred, warm grey, and paired with a hard Ink border. Hard offset shadows without blur are not used; the badge's 3px contact drop is the patch's own thickness, under a blurred cast.

**The Front Plane Holds Still Rule.** Only the engraved plate and the near plane move on scroll; the counter card and the rails never do.

## Shapes

Corners are soft-but-cut, the radius a fraction of the object's size, never fully pill except on chips. The base radius is 0.5rem (`--radius`); shadcn scales it 0.6x to 2.6x. On the wall: enamel sign 0.9rem, counter card 0.75rem, primary button 0.6rem, fly cards and badge focus 0.5rem, board slate 0.4rem, nav tabs 0.35rem, chalk marks 3px, stamps and small tags 2px, fish chips full pill.

Borders are hard Ink lines: 1.5px on the counter card, 2px on cards, buttons and the sign (3px on the compact sign), 2 SVG units on badges; the board's frame is an 8px Rail border with a 2px Rail Deep inset. Small tags (the offset tags on the shelf, the "reference photo" label on fly cards) use a 1px Ink line at 40 to 50% alpha on a Card fill. Rails carry a 3px Rail Deep edge on the side facing the page.

Silhouettes carry meaning. Each DNR fishing-report region owns one badge outline, drawn in a 160x80 viewBox with two solid keylines inset (outer at 94% scale, 1.6 stroke; inner at 88.5%, 0.8 stroke, 80%) in the badge's text color: Upper Peninsula a pointed shield, Northwest Lower an arch, Northeast Lower a rounded plate (14-unit corners), Southwest Lower a hexagon, Southeast Lower an oval. A small mark sits at the top of every badge, drawn in the text color: white pine (U.P.), rising-trout ring (Northwest), dry fly (Northeast), hook (Southwest), sedge (Southeast). Chalk marks are roughened by an SVG turbulence filter (`#chalk-rough`) so no chalk edge is geometrically clean. Engraved plates are hairline strokes (0.55 to 2.2 units) with fine hatched pattern fills for water and ground. Slight rotations are part of the form language: script -2deg on the rail, badges -1deg on hover, the finished strike -2deg, the stamp -4deg; the sign itself is square.

### Named Rules
**The Badge Shape Per Region Rule.** A river badge's outline, fill, lettering color and mark are decided by its region and nothing else: U.P. shield in Lake Steel, Northwest arch in Cream with Olive lettering and edge, Northeast plate in Olive Back, Southwest hexagon in Copper Fin, Southeast oval in Cream with Copper lettering and edge. All five share the same 2:1 ratio, the ink-colored edge, two solid keylines, a caps name and a script sub-line, so the shelf reads as one set. An active badge thickens its edge to 5 units and turns it Rose Band; it does not change shape or fill.

## Components

### Buttons
- **Shape:** softly cut corners (0.6rem) with a 2px Ink border.
- **Primary (`.counter-submit`):** Olive Back fill, Cream Belly Jost 600 caps at 0.95rem with 0.12em tracking, 3.25rem tall, 1.5rem side padding, the Button shadow. Icon is a 1rem arrow inline after the label.
- **Hover / Active / Focus:** hover deepens to Olive Back Deep and lifts 1px; active presses 1px; focus is the global 3px Copper Fin outline. Transitions run 160ms on `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Disabled:** stays Olive Back Deep on Cream at 85% opacity with `not-allowed`; it keeps its color so the form never reads as greyed out.
- **shadcn variants (inner pages):** `default` is Olive Back on Cream at 2rem tall, 0.5rem radius, hover to 80% alpha; `outline`, `secondary`, `ghost`, `destructive`, and `link` map onto Plank, Muted, and Gill Red through the tokens. These have not been restyled to the wall.

### Chips
- **Fish toggles (`chip-fish`):** full pill, 2.25rem tall, 0.75rem side padding, Card fill, 1px Ink border at 60% alpha, Jost 500 at 0.8rem sentence case. Selected: Olive Back fill, Cream text, full Ink border. Species not documented in the chosen river drop to 45% opacity with a title tooltip.
- **Offset tags and photo labels:** 2px-radius rectangles, 1px Ink at 40 to 50% alpha on Card, Jost 500 at 0.7 to 0.76rem.
- **Evidence badge (S/A/I):** shadcn outline `Badge` in mono at 0.75rem, pill. See the drift note in Do's and Don'ts.

### Cards / Containers
- **Counter card (`.counter-card`):** Card fill with 32px pencil rules (1px, `oklch(0.62 0.05 60 / 0.12)`, offset 14px), 1.5px Ink border, 0.75rem radius, the Counter pad shadow, 1.25rem to 1.75rem padding with a 4rem to 5rem left inset. Field labels are Jost 600 caps in Dirt at 0.72rem, 0.16em. The foot carries the S/A/I key: three evidence badges with a bold two-word name and a short source list in 0.75rem Muted Foreground, then a one-line link to the data page.
- **Plain wall card:** Card fill, 2px Ink border, 0.5rem radius, the lighter counter shadow, 1.5rem to 2rem padding. Used for fly cards (with a 4:3 Plank image well and a "Reference photo, not our tie" tag) and the evidence legend.
- **shadcn `Card`:** 0.75rem radius (`rounded-xl`), Card fill, a 1px Ink ring at 10% alpha, 1rem spacing. Inner pages use this; it has not been restyled to the wall.

### Inputs / Fields
- **Counter fields:** shadcn `Input` and `SelectTrigger` raised to 2.75rem tall with an explicit Card fill; 1px Plank Shadow border, 0.5rem radius, 0.625rem side padding, Jost at 1rem (0.875rem at `md`). The date field sets in Courier Prime. The river select groups its options under the five DNR region labels.
- **Focus:** border shifts to Copper Fin with a 3px Copper Fin ring at 50% alpha (shadcn), under the global 3px Copper Fin outline.
- **Invalid / Disabled:** Gill Red border and 20% ring; disabled at 50% opacity on a half-alpha Plank fill.

### Navigation
- **Rail (`.rail`):** Rail fill with a vertical highlight-to-shade gradient and a 142px board-seam repeat, 3px Rail Deep bottom edge, the Rail shadow, 4rem tall, sticky at z 40. Wordmark left in script at 1.9rem rotated -2deg; links right in Jost 500 caps at 0.8rem with 0.14em tracking, 0.5rem by 0.65rem padding, 0.35rem radius.
- **States:** hover is a 10% white wash (140ms); current page is a Rose Band tab with Ink text; focus is the global Copper Fin outline.
- **Mobile:** below `md` the links collapse into a right-side `Sheet` painted Rail with a script title and the same `.rail-nav` links stacked. The cart icon stays on the rail.
- **Footer:** the same rail, edge on top, opened by the engraved pine stand in Cream at 50% opacity across the container, then the trout logo at 140px, the script name, the woodtype-caps tagline, and two columns of small Cream body copy at 90% opacity.

### Enamel Sign (signature)
Cream Belly enamel face, 2px Ink border, 0.9rem radius, a 1px Ink pinstripe drawn with two inset box-shadows (5px cream, 6px Ink), four 11px Ink screw heads at the corners at 80% opacity, the Hung sign shadow, and a 44rem maximum width. Inside: the owner's leaping trout logo (`public/photos/illustration/trout-logo.svg`, full color, transparent) at 260px max, the script name in Olive Back pulled up 0.3em into the logo, and the sign line in Jost 600 caps at 0.26em tracking. The compact variant (3px border, logo at 140px, no sign line) is available for inner pages.

### Engraved Plates (signature)
Three SVG plates drawn in Dirt with `currentColor` strokes and hatched pattern fills, each a slot sized for commissioned art. `RiverBend` (1600x420, `preserveAspectRatio="xMidYMax slice"`) is the rear plane behind the first viewport: white pine and cedar on a far ridge, a river bend with riffle lines and a rising ring, at 42% opacity. `MichiganMap` (a 0 to 100 box, both peninsulas hatched, 0.55 outline, a faint 0.25 graticule) plots every river as a 1.5-unit linked dot with a 0.3 Ink stroke, colored by region; hover grows the dot to 2.6 with a 0.6 Rose Band ring. `PineStand` (800x130) runs over the footer in Cream at 50%. Plates carry an `aria-label` when they are content (the river bend, the map) and are hidden when decorative (the pine stand).

### Hatch Board (signature)
Board fill under a fine noise SVG and two faint radial highlights, an 8px Rail frame with a 2px Rail Deep inset and a 40px inner vignette, 0.4rem radius, a chalk tray 18px below (Rail Deep, 10px tall, inset 8% each side). Title in Zilla Slab caps at 0.14em, chalk-roughened, with the live date in mono at the right. Rules are dashed chalk (6px on, 3px off, 2px tall, 80%). Region rows are a 6.5rem label column (Jost 600 caps at 0.72rem in Chalk Dim, the DNR region abbreviated, with the offset in `live` beneath) beside a wrapping row of hatch names. Water readings sit in a two-column list (one column below 420px) with river names as board links and readings in `live` at 1rem with the time at 0.74rem. A legend row repeats the four states at 0.76rem.

Rows draw on once as the board enters view: `clip-path` wipes left to right over 620ms on the same spring curve, staggered 70ms per row via `--i`, only inside `.board-reveal[data-reveal="in"]` and only without reduced motion. Rows are visible by default, so timing never hides content.

**The State Vocabulary Rule.** Hatch timing on the board is spoken in exactly four chalk states, each one treatment, all in Jost 500 at 0.95rem on the roughened filter: approaching is Chalk Dim inside a hand-dashed 1.6px box; hatching is Chalk with a 3px chalk underline; peak is Ink on a rough Rose Band fill at 600 weight with 0.45rem side padding; finished is Chalk Dim at 85% struck through by one 2.5px stroke rotated -2deg. No other color, icon, or weight signals state, and the vocabulary is used only on the board.

### River Badge (signature)
An SVG patch, 2:1, in a `badge-link` that is a block with a 0.5rem focus radius, the badge itself a container (`container-type: inline-size`). Fill, edge, lettering color, silhouette and mark per region (see Shapes): the shape path filled with `--badge` and stroked 2 units in the edge color with round joins, the same path repeated twice as solid keylines in the text color, the region mark translated to (80, 18), the Patch shadow. Text is centered: the river name in Jost 600 caps with 0.1em tracking and `text-wrap: balance`, and a script sub-line (region name or a river note) at 95%. Hover and focus lift 3px, tilt -1deg, and deepen the shadow over 180ms. Badges sit on a `.shelf` whose 12px Rail-to-Rail Deep ledge extends 0.5rem past each side.

### Browser Surfaces
Selection is Rose Band with Cream text; focus-visible is a 3px Copper Fin outline offset 2px; the caret is Copper Fin; scrollbars are Olive Back thumbs (12px, 3px Plank inset, 8px radius) on a Plank track. Links underline at 1.5px with a 0.18em offset. Headings balance, paragraphs use `text-wrap: pretty`, tables and `.tabular` use tabular numerals.

### Night variant
A `.dark` scope exists that moves the wall to a deep board green (`oklch(0.27 0.03 140)`), Chalk for foreground, and a pale olive primary. It is defined and token-complete but is not the shipped scene; the site is daylight by default and no toggle is exposed.

## Do's and Don'ts

### Do:
- **Do** paint every viewport with the wall (`.wall` with its faint plank repeat and 10% grain); a new page that shows flat `--background` alone has left the world.
- **Do** outline hung and counter objects in Ink (1.5 to 2px cards and buttons, 2px sign) and give them a downward warm-grey shadow keyed to `oklch(0.2 0.02 60)`.
- **Do** set section titles in Zilla Slab 700 sentence case, and small woodtype labels in Zilla Slab 600 uppercase with 0.16em tracking; set every other word, including the sign line and badges, in Jost.
- **Do** reserve Courier Prime and the `live` color for measured numbers and dates on the board, and keep the four chalk states as the only hatch-timing language.
- **Do** give each DNR region's river badge its own silhouette, fill and mark from the fixed table, all on the shared Ink edge with two solid keylines, and size badge type in container units.
- **Do** draw supporting illustration as engraved line art in Dirt (hairline strokes, hatched fills, one ink) sized as a slot for commissioned art; use the owner's trout logo file for the mark.
- **Do** put focus in Copper Fin (3px outline, 2px offset) and the current nav item in a Rose Band tab.
- **Do** keep parallax on the rear planes only and respect `prefers-reduced-motion`; content must be complete with motion off.

### Don't:
- **Don't** use a photograph as a page hero or a full-bleed background; imagery is reference photos inside cards, insect thumbnails, the engraved plates, and the logo.
- **Don't** lay a repeating pattern on any surface; the shiplap seam and the ruled card are material, a tiled motif is not.
- **Don't** put a kicker or eyebrow line above a heading. The shelf's region labels are level-three headings with their own offset tag; do not add a smaller line over a title anywhere else.
- **Don't** use `live` chalk-yellow, Courier Prime, or any chalk state off the board.
- **Don't** introduce a second accent; Rose Band is the only warm highlight, and Copper Fin belongs to focus, hover, and the Southwest and Southeast badges.
- **Don't** set body copy, buttons or the sign line in Zilla Slab, and don't set the slab lighter than 500 (only 500, 600 and 700 are loaded).
- **Don't** flatten badges into rectangles, recolor them by river, or bring back a dashed stitch edge; shape, fill and mark are decided by region and the edge is solid.
- **Don't** treat the Night variant as a theme option; it is a token mapping held in reserve, not a shipped scene.

Inner pages currently inherit these tokens through the shadcn primitives (`Button`, `Card`, `Input`, `Select`, `Badge`, `Tabs`, and the rest under `src/components/ui/`) and have not been individually restyled to the wall. Their radii, ring borders, and heights are shadcn defaults mapped onto the palette; when an inner page is brought into the world it should adopt the wall, the Ink border rule, and the shadow vocabulary above.

Not canonized, carried by the build: the S/A/I `EvidenceBadge` colors S and A with Tailwind `emerald` and `amber` rather than trout tokens (pre-existing, shared with inner pages); the Northwest map dot and its key swatch use a literal moss green (`oklch(0.56 0.08 118)`) that has no token and does not match the Northwest badge's cream fill, and the Southeast dot uses Gill Red where the Southeast badge uses Copper; the wordmark is a Google Fonts script standing in for a commissioned mark and the plates are placeholders for commissioned art. Future headroom named by the finish review and not yet built: a chalk hand for the board title, thread texture on badges, wood grain on shiplap and rails, enamel wear or sheen on the sign.
