import { z } from "zod";

/**
 * Michigan Flies data model.
 *
 * Every table in this file is seeded from the deep-research report in
 * `reports/Michigan river flies and hatch timing.md`. Every record keeps its
 * source URLs and an evidence class so the UI can show whether a claim rests
 * on science or on guide consensus:
 *   S = scientific / agency source (peer-reviewed, DNR, university)
 *   A = angler source (fly shop hatch chart, guide, magazine)
 *   I = inference made while building this dataset
 */

export const Evidence = z.enum(["S", "A", "I"]);
export type Evidence = z.infer<typeof Evidence>;

/** Regions used for hatch-timing offsets relative to the northern Lower Peninsula baseline. */
export const Region = z.enum([
  "southern-lp",
  "mid-lp",
  "northern-lp",
  "tip-of-mitt",
  "upper-peninsula",
]);
export type Region = z.infer<typeof Region>;

export const Basin = z.enum([
  "lake-michigan",
  "lake-huron",
  "lake-superior",
  "lake-erie-st-clair",
]);
export type Basin = z.infer<typeof Basin>;

/** Thermal regime modifies how fast air GDD translates to water temperature. */
export const ThermalClass = z.enum(["groundwater", "tailwater", "runoff", "mixed"]);
export type ThermalClass = z.infer<typeof ThermalClass>;

export const SpeciesId = z.enum([
  "brown-trout",
  "brook-trout",
  "rainbow-trout",
  "steelhead",
  "chinook",
  "coho",
  "pink-salmon",
  "atlantic-salmon",
]);
export type SpeciesId = z.infer<typeof SpeciesId>;

/** How the quiz's "setup" answer maps onto fly selection. */
export const Technique = z.enum([
  "dry-fly",
  "nymph-indicator",
  "euro-nymph",
  "streamer",
  "swing-spey",
  "chuck-and-duck",
  "mousing",
]);
export type Technique = z.infer<typeof Technique>;

export const FlyCategory = z.enum([
  "dry",
  "emerger",
  "nymph",
  "larva",
  "wet",
  "streamer",
  "egg",
  "terrestrial",
  "mouse",
  "worm",
  "attractor",
]);
export type FlyCategory = z.infer<typeof FlyCategory>;

export const InsectOrder = z.enum(["mayfly", "caddis", "stonefly", "midge", "other"]);
export type InsectOrder = z.infer<typeof InsectOrder>;

export const LifeStage = z.enum(["nymph", "larva", "pupa", "emerger", "dun", "adult", "spinner"]);
export type LifeStage = z.infer<typeof LifeStage>;

export const TimeOfDay = z.enum(["morning", "midday", "afternoon", "evening", "dusk", "night", "all-day"]);
export type TimeOfDay = z.infer<typeof TimeOfDay>;

export const WaterClarity = z.enum(["clear", "stained", "any"]);
export type WaterClarity = z.infer<typeof WaterClarity>;

export const Month = z.number().int().min(1).max(12);

/** "MM-DD" calendar date without a year. */
export const MonthDay = z.string().regex(/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/);
export type MonthDay = z.infer<typeof MonthDay>;

/** A seasonal window expressed against the northern Lower Peninsula baseline. */
export const SeasonWindow = z.object({
  start: MonthDay,
  peakStart: MonthDay.optional(),
  peakEnd: MonthDay.optional(),
  end: MonthDay,
});
export type SeasonWindow = z.infer<typeof SeasonWindow>;

export const Source = z.object({
  title: z.string(),
  url: z.string().url(),
  year: z.number().int().optional(),
});
export type Source = z.infer<typeof Source>;

/* ------------------------------------------------------------------ */
/* Hatches                                                             */
/* ------------------------------------------------------------------ */

export const Hatch = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  commonName: z.string(),
  /** Other angler names, e.g. ["Grannom", "Mother's Day Caddis"]. */
  aliases: z.array(z.string()).default([]),
  scientificName: z.string(),
  order: InsectOrder,
  hookSizes: z.array(z.number().int()),
  /** Colors of the natural, e.g. ["olive-brown body", "slate gray wing"]. */
  colors: z.array(z.string()).default([]),
  /** Baseline window for the northern Lower Peninsula (Au Sable / Manistee). */
  window: SeasonWindow,
  timeOfDay: z.array(TimeOfDay),
  /** Which stages anglers actually fish for this insect. */
  keyStages: z.array(LifeStage),
  trigger: z
    .object({
      /** Water temperature range in °F at which emergence begins. */
      waterTempF: z.tuple([z.number(), z.number()]).optional(),
      /** Degree-day model if one exists. */
      degreeDays: z
        .object({
          baseC: z.number(),
          low: z.number(),
          high: z.number(),
          notes: z.string().optional(),
        })
        .optional(),
      /** Whether calendar date is a better predictor than temperature (Michigan caddis). */
      dateDriven: z.boolean().default(false),
      notes: z.string().optional(),
    })
    .default({ dateDriven: false }),
  /** Evidence class for the timing claim. */
  evidence: Evidence,
  /** Regions where this hatch is significant. Empty = statewide. */
  regions: z.array(Region).default([]),
  description: z.string(),
  sources: z.array(Source),
});
export type Hatch = z.infer<typeof Hatch>;

/* ------------------------------------------------------------------ */
/* Species                                                             */
/* ------------------------------------------------------------------ */

export const FeedingModel = z.enum([
  "hatch-matcher",
  "piscivore",
  "egg-nymph-feeder",
  "aggression-striker",
  "in-river-feeder",
]);
export type FeedingModel = z.infer<typeof FeedingModel>;

export const RunType = z.enum(["fall", "winter", "spring", "summer", "resident"]);
export type RunType = z.infer<typeof RunType>;

export const Species = z.object({
  id: SpeciesId,
  name: z.string(),
  scientificName: z.string(),
  /** Dominant feeding behavior in Michigan rivers; drives fly category weighting. */
  feedingModel: FeedingModel,
  /** Secondary model, e.g. large browns are piscivores but small browns match hatches. */
  secondaryFeedingModel: FeedingModel.optional(),
  dietSummary: z.string(),
  /** What the fish eats in-river by season, with evidence. */
  diet: z.array(
    z.object({
      months: z.array(Month),
      items: z.array(z.string()),
      evidence: Evidence,
    }),
  ),
  spawn: z
    .object({
      months: z.array(Month),
      waterTempF: z.tuple([z.number(), z.number()]).optional(),
      eggDiameterMm: z.tuple([z.number(), z.number()]).optional(),
      /** Fresh egg color names used by fly tiers, e.g. ["Oregon Cheese", "Steelhead Orange"]. */
      eggColors: z.array(z.string()).default([]),
      evidence: Evidence,
      notes: z.string().optional(),
    })
    .optional(),
  runs: z.array(
    z.object({
      type: RunType,
      months: z.array(Month),
      peakMonths: z.array(Month).default([]),
      notes: z.string().optional(),
      evidence: Evidence,
    }),
  ),
  regulationsNote: z.string().optional(),
  description: z.string(),
  sources: z.array(Source),
});
export type Species = z.infer<typeof Species>;

/* ------------------------------------------------------------------ */
/* Egg availability (non-target spawners whose eggs feed trout too)    */
/* ------------------------------------------------------------------ */

export const EggSource = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** e.g. "White sucker", "Walleye", "Chinook salmon". */
  name: z.string(),
  /** Target species id if the spawner is one of our eight; otherwise undefined. */
  speciesId: SpeciesId.optional(),
  months: z.array(Month),
  peakMonths: z.array(Month).default([]),
  waterTempF: z.tuple([z.number(), z.number()]).optional(),
  eggDiameterMm: z.tuple([z.number(), z.number()]).optional(),
  freshColors: z.array(z.string()),
  deadColors: z.array(z.string()).default([]),
  /** Hook sizes that match this egg. */
  hookSizes: z.array(z.number().int()),
  /** Which target species key on these eggs. */
  eatenBy: z.array(SpeciesId),
  regions: z.array(Region).default([]),
  evidence: Evidence,
  notes: z.string().optional(),
  sources: z.array(Source),
});
export type EggSource = z.infer<typeof EggSource>;

/* ------------------------------------------------------------------ */
/* Forage (non-insect, non-egg food)                                   */
/* ------------------------------------------------------------------ */

export const Forage = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  kind: z.enum(["baitfish", "crustacean", "annelid", "mammal", "amphibian", "terrestrial-insect", "other"]),
  months: z.array(Month),
  eatenBy: z.array(SpeciesId),
  description: z.string(),
  evidence: Evidence,
  sources: z.array(Source),
});
export type Forage = z.infer<typeof Forage>;

/* ------------------------------------------------------------------ */
/* Fly patterns                                                        */
/* ------------------------------------------------------------------ */

export const Fly = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  category: FlyCategory,
  /** Hatches this pattern imitates (by hatch id). */
  hatchIds: z.array(z.string()).default([]),
  /** Life stages of those hatches it covers. */
  stages: z.array(LifeStage).default([]),
  /** Forage items it imitates (by forage id). */
  forageIds: z.array(z.string()).default([]),
  /** Egg sources it imitates (by egg source id). */
  eggSourceIds: z.array(z.string()).default([]),
  hookSizes: z.array(z.number().int()),
  /** Named color variants to tie/sell, e.g. ["Oregon Cheese", "Chartreuse"]. */
  colors: z.array(z.string()).default([]),
  /** Target species this fly is recommended for. */
  species: z.array(SpeciesId),
  techniques: z.array(Technique),
  /** Months when the fly is in season. Empty = derive from hatch/egg/forage links. */
  months: z.array(Month).default([]),
  waterClarity: WaterClarity.default("any"),
  timeOfDay: z.array(TimeOfDay).default([]),
  regions: z.array(Region).default([]),
  /** Origin, e.g. "Kelly Galloup, Manistee River, mid-1990s". */
  origin: z.string().optional(),
  /** Michigan-specific recommendation strength: 3 = staple every shop lists, 1 = niche. */
  priority: z.number().int().min(1).max(3).default(2),
  evidence: Evidence,
  description: z.string(),
  /** Shopify product handle once the fly is listed for sale. */
  shopifyHandle: z.string().optional(),
  sources: z.array(Source),
});
export type Fly = z.infer<typeof Fly>;

/* ------------------------------------------------------------------ */
/* Rivers                                                              */
/* ------------------------------------------------------------------ */

export const RegulationType = z.enum([
  "flies-only",
  "artificial-lures-only",
  "gear-restricted",
  "general",
]);
export type RegulationType = z.infer<typeof RegulationType>;

export const RiverSection = z.object({
  name: z.string(),
  regulation: RegulationType,
  /** Zero possession (catch-and-release) all year. */
  catchAndRelease: z.boolean().default(false),
  /** Open all year vs. traditional trout season (last Sat in April to Sep 30). */
  openAllYear: z.boolean().default(false),
  notes: z.string().optional(),
  /** Flag when the 2026 digest and another source disagree; must be verified with DNR. */
  needsVerification: z.boolean().default(false),
});
export type RiverSection = z.infer<typeof RiverSection>;

export const UsgsGauge = z.object({
  siteId: z.string().regex(/^\d{8,15}$/),
  name: z.string(),
  hasWaterTemp: z.boolean(),
  hasDischarge: z.boolean(),
});
export type UsgsGauge = z.infer<typeof UsgsGauge>;

export const RiverSpecies = z.object({
  speciesId: SpeciesId,
  /** Months the species is realistically present and targetable. */
  months: z.array(Month),
  peakMonths: z.array(Month).default([]),
  origin: z.enum(["wild", "stocked", "mixed", "unknown"]).default("unknown"),
  /** A = strong (DNR weir/stocking data), B = good (multiple angler sources), C = inferred. */
  confidence: z.enum(["A", "B", "C"]),
  notes: z.string().optional(),
});
export type RiverSpecies = z.infer<typeof RiverSpecies>;

export const River = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  /** Short label for the river system, e.g. "Au Sable" for "Au Sable River (Holy Waters)". */
  system: z.string(),
  region: Region,
  basin: Basin,
  thermalClass: ThermalClass,
  /** Days to shift the northern-LP baseline hatch window; negative = earlier. */
  offsetDays: z.number().int(),
  /** Approximate centroid for GDD grid lookup. */
  centroid: z.object({ lat: z.number(), lon: z.number() }),
  /** Nearest county or town for display. */
  locale: z.string(),
  character: z.string(),
  sections: z.array(RiverSection).default([]),
  gauges: z.array(UsgsGauge).default([]),
  /** USGS site id on a thermally similar river to use when this river has no temperature gauge. */
  proxyTempSiteId: z.string().optional(),
  species: z.array(RiverSpecies),
  /** Hatch ids this river is known for. */
  signatureHatches: z.array(z.string()).default([]),
  /** Per-river override of a hatch window when a source gives one (already adjusted, not baseline). */
  hatchOverrides: z
    .array(
      z.object({
        hatchId: z.string(),
        window: SeasonWindow,
        source: Source,
      }),
    )
    .default([]),
  /** Hatches that do not occur or do not matter on this river. */
  absentHatches: z.array(z.string()).default([]),
  localShops: z.array(z.object({ name: z.string(), url: z.string().url().optional() })).default([]),
  sources: z.array(Source),
});
export type River = z.infer<typeof River>;

/* ------------------------------------------------------------------ */
/* Regional offsets                                                    */
/* ------------------------------------------------------------------ */

export const RegionOffset = z.object({
  region: Region,
  label: z.string(),
  /** Days relative to the northern Lower Peninsula baseline. */
  offsetDays: z.number().int(),
  offsetRangeDays: z.tuple([z.number().int(), z.number().int()]),
  notes: z.string(),
  sources: z.array(Source),
});
export type RegionOffset = z.infer<typeof RegionOffset>;

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

export const HatchList = z.array(Hatch);
export const SpeciesList = z.array(Species);
export const EggSourceList = z.array(EggSource);
export const ForageList = z.array(Forage);
export const FlyList = z.array(Fly);
export const RiverList = z.array(River);
export const RegionOffsetList = z.array(RegionOffset);
