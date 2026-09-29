# Plan: product breakdown and component store pages

Status: planning only, September 29, 2026. Nothing here is built. Branch when work starts: `feature/product-breakdown`.

## The idea

Scott could not find Otter's Soft Milking Eggs in 8mm and could not tie them himself, because that egg is a manufactured component sold pre-tied. That is the general case for a hand-tied fly: it is an assembly of components, some of which the customer can only get by buying them, and the customer has no idea where any of it came from.

The feature: every Michigan Flies product gets a breakdown, the way a good gear site breaks a jacket down into shell, insulation and hardware. Each component that is itself a thing you would buy, such as an 8mm soft egg, a specific bead, a hook, gets its own store page with provenance (who makes it, where it is made, why this one), and can be bought on its own or in the quantity the pattern uses. The fly page becomes the place you learn how the fly is made and where its parts come from; the component page is the place you buy the part.

This fits the positioning claim that the fly list and the store are the same object, and adds a fourth truthful claim a retailer cannot copy: you can see exactly what is in the fly and buy the bits.

## What this is not

- Not a general fly-tying materials shop. Only components that appear in a Michigan Flies pattern get pages, and only components worth buying on their own get a buy button.
- Not a tutorial site. Tying steps may come later; the breakdown is a bill of materials with provenance, not a how-to.
- Not a replacement for the fly product. The fly stays the primary product; the breakdown deepens it.

## Research round (before any code)

A second deep-research pass, scoped to production rather than fishing:

1. **Component taxonomy for the 130 patterns.** For every fly in `src/data/flies.ts`, the canonical recipe: hook (maker, model, size range), thread, bead or cone, body, ribbing, hackle, wing, tail, legs, eyes, flash, weight, cement or resin. Sources: the pattern's originator where known (Borchers, Roberts, Feenstra, McCoy, Supinski, Galloup, Otter's), commercial recipe sheets (Umpqua, Montana Fly, Rainy's, Solitude), and the shop-chart sources already cited. Evidence tags apply: S for the originator's own recipe, A for a commercial or shop recipe, I for our substitution.
2. **Component makers and provenance.** For each component: who manufactures it, where (country and, where known, factory or town), whether it is a branded manufactured part (Otter's eggs, Tiemco and Daiichi hooks, Hareline and Wapsi materials, Semperfli threads, Whiting hackle) or a generic commodity (chenille, Estaz, yarn), and whether the maker sells direct, through distributors, or is sold out or discontinued. Note materials with a story worth telling: Whiting's Colorado hackle program, Michigan-made or Great Lakes-region suppliers, natural materials with sourcing rules (jungle cock, CDC, deer hair).
3. **Substitutability.** Which components are essential to the pattern's identity (the 8mm soft egg, a specific hook bend) and which are freely substitutable (thread color, generic dubbing). This decides which components earn their own page.
4. **Supply and pricing.** Wholesale accounts and minimums for the branded parts (Hareline, Wapsi, Umpqua feather merchants, Otter's direct), lead times, and whether the owner can legally resell a component under its brand name (most allow it; check Otter's and Whiting's dealer terms).
5. **Compliance.** Country-of-origin labeling for resold goods, hook and lead-weight rules (Michigan has no lead ban for flies, but say so with a source), and any restricted natural materials.
6. **Competitive check.** Who shows a bill of materials on a fly product today (very few; Fulling Mill and Umpqua list a few materials, none show provenance) and who sells the 8mm eggs Scott could not find, at what price and availability.

Deliverables: a report under `reports/`, notes under `research_notes/`, and a first `src/data/components.ts` seed for the Two Hearted batch (55 flies) with full recipes and provenance, evidence-tagged.

## Data model

New entities in `src/data/`, Zod-validated like the rest:

- **Component** (`components.ts`): `id`, `name`, `kind` (hook, bead, egg, thread, body, hackle, wing, tail, flash, weight, eyes, adhesive, other), `maker` (id), `makerSku`, `sizeOrColor` variants, `originCountry`, `originNote`, `essential` flag per use is on the recipe line not here, `sellable` (boolean: gets a buy button), `description`, `sources` with evidence tags, `shopifyHandle` when sellable, `photoIds`.
- **Maker** (`makers.ts`): `id`, `name`, `location` (city, state or country), `type` (manufacturer, distributor, cottage), `url`, `story` (short, sourced), `dealerTermsNote`.
- **Recipe line** on each Fly (`flies.ts` gains `recipe: RecipeLine[]`): `componentId`, `role` (hook, thread, tail, body, ...), `quantity` and `unit` (1 hook, 1 bead, 2 eggs, 4 in of chenille), `variant` (size 14, apricot), `essential` (boolean: swapping changes the fly), `substitutes: componentId[]`, `note`.
- Fly pages compute cost of goods from recipe lines and component unit costs (owner-only field, never rendered) so pricing stops being a placeholder by category.

## Pages and UX

- **Fly product page**: a new "What's in it" section: the recipe as an ordered list from hook outward, each line naming the component, variant, quantity, and a provenance chip (maker and origin). Essential lines are marked. Each sellable component links to its page; non-sellable ones link to the maker.
- **Component page** (`/components/[id]`, or `/materials/[id]` after the research decides the word): photo, what it is, who makes it and where, why this one for these patterns, the flies on the site that use it (with the role they play), sizes and colors, and a buy panel when sellable, with quantity presets matching the patterns ("enough for a dozen Glo Bugs").
- **Maker page** (`/makers/[id]`): the story, location, and every component and fly on the site that traces back to them. This is where provenance becomes a browseable map: Michigan and Great Lakes makers first.
- **Box pages**: the Two Hearted box gets a rolled-up materials list with provenance, and a "tie it yourself" option that puts the components in the cart instead of the flies (later phase).
- **Home**: nothing new in the first viewport. One line on the fly cards ("8 components, 3 makers") can wait until the data exists.

## Commerce model

- Sellable components become Shopify products with variants for size and color, handle `component-<id>`. The existing export script grows a `--components` mode.
- The fly product keeps its handle. A Shopify metafield `recipe` (JSON) mirrors the site's recipe so Shopify-side apps can read it, but the site remains the source of truth.
- "Buy the parts" for a whole fly or box is a cart action that adds each sellable component at the recipe quantity, rounded up to the pack size. No bundle app in v1.
- Inventory: components are physical stock the owner holds; track quantities in Shopify, and show "in stock" only from Shopify's number, never from the data file.

## Phases

1. **Research** (the round above). Output: report, notes, `components.ts` and `makers.ts` seeded for the Two Hearted batch, recipe lines on those 55 flies. Two to three sessions.
2. **Read-only breakdown.** Schema, validation, fly-page "What's in it", component and maker pages, no commerce. Ship behind the data: pages exist only for seeded components.
3. **Sell the essentials.** Shopify products for the sellable components (eggs, beads, hooks first), buy panel on component pages, export script mode. Requires the LLC, the Shopify terms, and the Vercel Pro plan, which are prerequisites for selling anything.
4. **Buy the parts.** Cart action for a fly or a box, pack-size rounding, cost-of-goods pricing for the flies.
5. **Extend to all 130 patterns** as recipes are researched, and open a field-note form for co-founders to record substitutions that worked.

## Open questions for the owner

- Name of the entity type in the URL and copy: components, materials, or parts. Fly tiers say "materials"; buyers may say "parts".
- Whether to resell under makers' brand names or white-label. Provenance only works with the real names, so the dealer terms research decides this.
- Whether John's eggs are a component (sold as tied eggs) or a fly. Probably both: a tied 8mm egg is a fly on the site and a component of an egg-sucking leech.
- Whether the owner wants cost of goods in the repo at all, even unrendered. If not, it lives in Shopify only.

## Dependencies already known

- LLC and Shopify terms before phase 3.
- Photos: component photos will be the owner's own (a light box and a phone is enough for parts); no reference photos for components.
- The stocking and species data are unaffected.
