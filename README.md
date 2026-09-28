# Michigan Flies

Hatch calendar, fly finder, and storefront for hand-tied flies built for Michigan rivers. Canonical domain: `michiganflies.com` (`michiganflys.com` redirects to it).

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript, deployed on Vercel
- shadcn/ui (radix-nova style) + Tailwind v4
- Shopify Storefront API (headless) via the Vercel Marketplace Shopify integration; checkout hands off to Shopify
- Data as Zod-validated TypeScript in `src/data/` (no database in v1)
- Live conditions: gridMET (air temperature grid, CC0), NWS forecast, USGS water gauges

## Layout

| Path | What it is |
|---|---|
| `src/data/schema.ts` | Zod schema for hatches, species, egg sources, forage, flies, rivers, region offsets |
| `src/data/*.ts` | Seed data (34 hatches, 8 species, 11 egg sources, 29 forage items, 130 flies, 41 river reaches) |
| `src/lib/season.ts` | Window math: baseline "MM-DD" windows shifted by river/region offsets, wrap-around aware |
| `src/lib/gdd.ts` | gridMET point fetch + GDD accumulation at bases 32/42/50 °F |
| `src/lib/nws.ts` | api.weather.gov 7-day tmax/tmin to extend the GDD series |
| `src/lib/usgs.ts` | USGS instantaneous + daily water temperature and discharge |
| `src/lib/conditions.ts` | Per-river aggregate of the three sources, with proxy gauges |
| `src/lib/recommend.ts` | Quiz engine: river + date + species + setup → ranked flies with reasons |
| `src/lib/shopify/` | Storefront client, queries, cart server actions, product helpers |
| `src/app/quiz` | Four-step wizard and results page |
| `src/app/calendar`, `rivers`, `hatches`, `flies`, `species` | Resource pages |
| `src/app/shop`, `cart` | Storefront |
| `src/app/api/cron/warm-conditions` | Daily cache warm (see `vercel.ts`) |
| `reports/`, `research_notes/` | The deep-research report and notes the data was seeded from |

## Commands

```bash
pnpm dev             # local dev server
pnpm build           # production build (also generates route types)
pnpm typecheck       # tsc --noEmit
pnpm test            # vitest (season + gdd math)
pnpm validate-data   # Zod parse + cross-reference check on all seed tables
pnpm exec tsx scripts/try-recommend.ts          # print recommendations for sample scenarios
pnpm exec tsx scripts/try-conditions.mts <river> # hit gridMET/NWS/USGS for one river
```

## Environment

Provisioned by the Shopify integration (`vercel integration add shopify`, then `vercel env pull --yes`):

- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

Optional:

- `CRON_SECRET` — when set, the warm-conditions cron route requires `Authorization: Bearer <secret>` (Vercel sends it automatically).

Until the store is connected, shop pages render a "not connected" notice and resource pages work normally.

## Deploy checklist

1. `vercel link --yes --project michigan-flies --scope <team>`
2. `vercel integration add shopify --yes --no-claim` and finish the Shopify handshake in the browser if prompted
3. `vercel env pull --yes`
4. Add `michiganflies.com` and `michiganflys.com` to the project; the redirect lives in `next.config.ts`
5. `vercel deploy --prod`

## How timing works

Windows are stored against the northern Lower Peninsula baseline (Au Sable / Manistee) and shifted per river: mid-state about −10 days, southern LP −14, Tip of the Mitt +10, Upper Peninsula +21. Rivers with their own published charts carry `hatchOverrides`. Within seven days of a trip the results page pulls live water temperature and accumulated GDD and gates hatches whose water-temperature threshold has not been met. Egg availability follows spawn timing (a water-temperature event that does not shift by region), and forage follows the month and the target species' feeding model. Every record carries an evidence tag (S scientific, A angler, I inferred) that surfaces in the UI.

## Shopify convention

A product's handle should equal the fly `id` in `src/data/flies.ts` (or set `shopifyHandle` on the fly). Fly cards and the results page look products up by that handle to show price and add-to-cart.
