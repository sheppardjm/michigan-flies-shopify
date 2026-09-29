# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: the traveling angler planning a Michigan trip. They live in Chicago, Indiana, Ohio, Wisconsin, or downstate Michigan, fish Michigan rivers a few times a year, pick a river and dates in advance, and want to arrive with the right box. They plan at a desk weeks ahead, then re-check on a phone the week of the trip and in the truck at the access site. They know how to fly fish; what they lack is local timing knowledge for a river they see twice a year.

Secondary (confirmed present, not the design target): Michigan locals who know their water and want current conditions and a trusted local tier; newer anglers using the resource side to learn what a hatch is and why eggs work in fall.

The owner ties every fly sold and also uses the site as a working reference and order queue.

## Product Purpose

Michigan Flies answers one question for one river on one date: what should be on the end of my line, and why. It pairs a hatch and run calendar for Michigan rivers with a fly finder (river, date, target fish, setup) and sells the hand-tied flies the finder recommends. The resource side is a first-class product, not a funnel; the owner wants anglers across the Midwest to use the site to plan trips whether or not they buy.

Success looks like: an angler plans a Two Hearted trip in September, sees Chinook and pink salmon in the river with eggs and leeches recommended, checks live water temperature the week of, and orders the Two Hearted box. Over seasons, the calendar tightens as observations accumulate.

## Positioning

Three candidate claims are live; the first season decides which leads. Future work must keep all three true and visible rather than collapsing to one.

1. The right fly for the river and the week, backed by data: a recommendation engine over hatch windows shifted by region and river, egg availability tied to spawn timing, forage by season and species feeding model, gated by live USGS water temperature and gridMET degree days, with DNR stocking records per river.
2. Hand-tied in Michigan for Michigan rivers: owner-tied, river-specific patterns, sizes, and colors.
3. River boxes: a curated kit per river and season (the Two Hearted box is first), so the customer buys a selection rather than fifty individual decisions.

What a fly shop or big retailer cannot truthfully copy: per-river, per-date recommendations with sources and confidence shown, and the fly list and the store being the same object.

## Operating Context

- Rivers: 44 reaches across the Upper and Lower Peninsulas, grouped into the five Michigan DNR weekly fishing-report regions (Southeast, Southwest, Northeast, Northwest Lower Peninsula; Upper Peninsula), each river with its own hatch-timing offset from the Au Sable baseline (southwest rivers about 10 days early, Upper Peninsula about three weeks late).
- Fish: brown trout, brook trout, resident rainbow, steelhead, Chinook, coho, pink salmon, Atlantic salmon, each with a feeding model (hatch matcher, piscivore, egg and nymph feeder, aggression striker, in-river feeder) that shapes recommendations.
- Setups the quiz recognizes: dry fly, indicator nymphing, Euro nymphing, streamers, swinging (spey or switch), chuck and duck, mousing.
- Live data: gridMET air temperatures accumulated into growing degree days at bases 32, 42, and 50 °F; National Weather Service seven-day forecast; USGS gauges (63 Michigan sites with water temperature; the Pere Marquette, Boardman, and Two Hearted have none and use proxies or the calendar); Michigan DNR Fish Stocking Database snapshotted a few times a year.
- Regulations: gear rules quoted from the 2026 Michigan Fishing Regulations digest; two reaches carry conflicting sources and are flagged; everything must be re-verified against the current DNR guide before publishing as fact.
- Commerce: Shopify headless via Storefront API; checkout hands off to Shopify. A pre-order path (email reserve) covers the period before checkout opens. Product handle equals the fly id.
- Seasonal rhythm: spring steelhead (March to May), Hendrickson through Hex (late April to mid July, later north), summer terrestrials and mousing, fall salmon (late August to November), winter midges and eggs for steelhead.

## Capabilities and Constraints

Confirmed capabilities: fly finder with multi-species selection and a whatever's-biting option; hatch calendar by region or river; river pages with species-by-month, signature hatches, live conditions, DNR stocking history, and gear rules; hatch pages with photos, regional timing, triggers, and matching flies; fly pattern pages with tying sheets and materials lists; species pages; collection pages (river boxes); a store page for every pattern with a reserve form at a provisional price (since September 29, 2026), plus a full catalogue on the shop index; About the Data page.

Constraints future work must preserve:

- Every timing, presence, and pattern claim carries an evidence tag (S scientific or agency, A angler or guide, I inferred) and sources; the tag is user-visible.
- The scientific layer is thin. Only Hexagenia degree-days, Michigan caddis being date-driven, a steelhead movement model, and two DNR brown trout diet studies are peer-reviewed; the rest is guide consensus and must be presented as such.
- No calibrated air degree-day threshold exists for any Michigan hatch. Degree days are shown as context beside water temperature; per-river calibration is a multi-season project.
- Photos of insects come from iNaturalist under CC0, CC BY, or CC BY-SA only, with attribution. Photos of flies are either the owner's own or reference photos labeled as not our tie, credited, and never used as product images; some are Creative Commons, most are used with permission: Quinn's (Fly Deal Flies), and Feenstra Guide Service's pattern photos and sheets (permission given September 29, 2026), plus a set of shop photos the owner obtained permission for.
- Stocking counts are fish planted, not fish surviving; DNR "rainbow trout" plants of Michigan or Skamania strain are steelhead smolts.
- Data lives as typed TypeScript and JSON in the repo; no database in v1.
- Domain: michiganflies.com is canonical; michiganflys.com redirects.

Undecided: real pricing (current prices are placeholders by category); which colors and sizes per pattern make the first tying batch; the reserve email address; whether steelhead should show on the Two Hearted in September; the Vercel plan (Hobby today, must be Pro before selling).

## Brand Commitments

- Name: Michigan Flies. The owner drew the leaping rainbow trout logo themselves and added it on September 28, 2026 (`public/photos/illustration/trout-logo.svg`; `logo.svg` is the full lockup); it is owner-owned original work, needs no third-party license, and is the mark on the sign and footer. No final wordmark lettering yet; the script face is a placeholder. Do not invent a wordmark as a binding asset.
- Voice: field guide. Precise, sourced, slightly formal, like a good hatch guide or DNR report. States uncertainty plainly and cites where a number came from. No hype, no exclamation, no invented enthusiasm.
- Terminology follows Michigan usage: Hex, Hendrickson, Grannom, chuck and duck, Holy Waters, Trophy Water, Tip of the Mitt, the U.P.; river regions are the DNR weekly fishing-report regions (Southeast, Southwest, Northeast, Northwest Lower Peninsula, Upper Peninsula), not invented ones.

## Evidence on Hand

- Deep-research report and six note files: `reports/Michigan river flies and hatch timing.md`, `research_notes/Michigan river flies and hatch timing/`.
- Seed data with sources: `src/data/` (34 hatches, 8 species, 11 egg sources, 29 forage items, 136 flies, 44 rivers, 5 region offsets, one collection).
- Tying sheets with bills of materials: `src/data/tying.ts` (64 patterns as of September 29, 2026: 11 Feenstra Guide Service patterns transcribed from their published sheets, and every fly in the Two Hearted box written up in our own words from two or more cited recipes; `scripts/import-tying-research.py` turns research JSON into records).
- DNR stocking snapshot: `src/data/stocking.json` (events 1979 to September 2026).
- Insect photos: `src/data/hatch-photos.json` (201 iNaturalist photos). Fly photos: `src/data/fly-photos.json` and `public/photos/flies/` (87 patterns covered; 55-pattern Two Hearted batch has 47 with photos).
- Owner's field observation: Chinook landed in the Two Hearted, late September 2026.
- Owner's field photographs: 90 frames from the Two Hearted, May 2022 to May 2026 (steelhead in May, Chinook in late September, camp and river scenes), originals in the untracked `design/photos/two-hearted/`, twelve published as prints under `public/photos/field/` with records in `src/data/field-photos.ts`. Photographs showing co-founders are marked `peopleVisible` and need their say-so before wider use. No macro photographs of our own flies yet.
- Shopify import files: `shopify/products-*.csv`.
- Absent, do not fabricate: customer testimonials, sales history, press, guide endorsements, real prices, calibrated hatch thresholds, and the owner's own product photography.

## Product Principles

1. Answer the trip question first: river, date, fish, setup in, flies and reasons out. Everything else supports that.
2. Show the evidence and its grade. A recommendation resting on guide consensus says so; a claim from a DNR study says so.
3. Timing is thermal, not calendar. Model emergence, spawn, and forage as processes driven by water temperature and degree days, and let live data override the calendar.
4. The resource earns trust before the store asks for money. Never degrade the free tools to push a sale, and never show someone else's fly as our product.
5. Michigan specificity is the moat. Prefer a Two Hearted answer over a Midwest generality, and prefer local names, rivers, and patterns over national defaults.

## Accessibility & Inclusion

Used outdoors on phones in bright light and at access sites with poor signal: the week-of conditions view and the recommendation list must be readable at small sizes and high contrast and must render without live data. No other product-specific requirement has been established.
