export * from "./schema";
export { hatches, hatchById } from "./hatches";
export { species, speciesById } from "./species";
export { eggSources, eggSourceById } from "./egg-sources";
export { forage, forageById } from "./forage";
export { flies, flyById } from "./flies";
export { rivers, riverById } from "./rivers";
export { regionOffsets, regionOffsetByRegion } from "./region-offsets";
export { tyingSheets, tyingByFlyId } from "./tying";

export const REGION_LABELS: Record<import("./schema").Region, string> = {
  "southeast-lp": "Southeast Lower Peninsula",
  "southwest-lp": "Southwest Lower Peninsula",
  "northeast-lp": "Northeast Lower Peninsula",
  "northwest-lp": "Northwest Lower Peninsula",
  "upper-peninsula": "Upper Peninsula",
};

export const TECHNIQUE_LABELS: Record<import("./schema").Technique, string> = {
  "dry-fly": "Dry fly",
  "nymph-indicator": "Indicator nymphing",
  "euro-nymph": "Euro / tight-line nymphing",
  streamer: "Streamers",
  "swing-spey": "Swinging flies (spey / switch)",
  "chuck-and-duck": "Chuck and duck",
  mousing: "Mousing (night)",
};

export const TECHNIQUE_DESCRIPTIONS: Record<import("./schema").Technique, string> = {
  "dry-fly": "Floating line, 3 to 5 weight, fishing the surface during a hatch or spinner fall.",
  "nymph-indicator": "Floating line with a strike indicator, split shot, and one or two subsurface flies.",
  "euro-nymph": "Long leader, sighter, weighted flies fished on a tight line without an indicator.",
  streamer: "Sinking or sink-tip line, 6 to 8 weight, stripping baitfish and sculpin patterns.",
  "swing-spey": "Two-hand or switch rod, Skagit or Scandi head, swinging flies through runs.",
  "chuck-and-duck": "Running line, slinky or pencil lead, and a long leader lobbed upstream and bounced along the bottom.",
  mousing: "Floating line after dark, waking a mouse pattern across pools for big browns.",
};

export const CATEGORY_LABELS: Record<import("./schema").FlyCategory, string> = {
  dry: "Dry fly",
  emerger: "Emerger",
  nymph: "Nymph",
  larva: "Larva / pupa",
  wet: "Wet fly",
  streamer: "Streamer",
  egg: "Egg",
  terrestrial: "Terrestrial",
  mouse: "Mouse",
  worm: "Worm",
  attractor: "Attractor",
};

export const EVIDENCE_LABELS: Record<import("./schema").Evidence, string> = {
  S: "Scientific or agency source",
  A: "Angler or guide source",
  I: "Inferred while building this dataset",
};
