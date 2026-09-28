import {
  eggSources,
  flies,
  forage,
  hatches,
  riverById,
  speciesById,
  type EggSource,
  type Fly,
  type Forage,
  type Hatch,
  type River,
  type SeasonWindow,
  type Species,
  type SpeciesId,
  type Technique,
  type WaterClarity,
} from "@/data";
import { evaluateWindow, monthOf, type WindowEvaluation, type WindowStatus } from "./season";

/**
 * Recommendation engine.
 *
 * Inputs mirror the quiz: where (river), when (date), target species, and
 * setup (technique). Optional live conditions from the GDD pipeline and USGS
 * gauges refine the calendar-based answer.
 *
 * The model is three thermal processes, following the research report:
 *   1. Insect emergence: a calendar window shifted by the river's offset, gated
 *      by water temperature when a gauge is available.
 *   2. Egg availability: which spawners are dropping eggs this month on this river.
 *   3. Forage: seasonal baitfish, crustaceans, terrestrials, and mice weighted
 *      by the target species' feeding model.
 */

export interface Conditions {
  waterTempF?: number | null;
  clarity?: WaterClarity;
  /** Accumulated GDD base 50 °F at the river's grid cell. */
  agdd50?: number | null;
}

export interface QuizInput {
  riverId: string;
  date: Date;
  speciesId: SpeciesId;
  technique: Technique;
  conditions?: Conditions;
}

export interface HatchStatus {
  hatch: Hatch;
  evaluation: WindowEvaluation;
  /** Effective status after any water-temperature gating. */
  status: WindowStatus;
  /** Window used (river override or offset baseline). */
  window: SeasonWindow;
  offsetDays: number;
  overridden: boolean;
  gateNote?: string;
}

export interface EggStatus {
  egg: EggSource;
  peak: boolean;
  /** Whether the spawner is documented on this river this month. */
  spawnerPresent: boolean;
}

export interface Recommendation {
  fly: Fly;
  score: number;
  reasons: string[];
}

export interface QuizResult {
  river: River;
  species: Species;
  technique: Technique;
  date: Date;
  speciesPresence: { present: boolean; peak: boolean; note?: string; confidence?: "A" | "B" | "C" };
  hatches: HatchStatus[];
  eggs: EggStatus[];
  forage: Forage[];
  recommendations: Recommendation[];
  warnings: string[];
}

/** Techniques whose fly boxes overlap enough to share recommendations. */
const TECHNIQUE_COMPAT: Record<Technique, Technique[]> = {
  "dry-fly": ["dry-fly"],
  "nymph-indicator": ["nymph-indicator", "euro-nymph", "chuck-and-duck"],
  "euro-nymph": ["euro-nymph", "nymph-indicator"],
  streamer: ["streamer", "swing-spey"],
  "swing-spey": ["swing-spey", "streamer"],
  "chuck-and-duck": ["chuck-and-duck", "nymph-indicator"],
  mousing: ["mousing"],
};

const STATUS_POINTS: Record<WindowStatus, number> = {
  peak: 40,
  active: 26,
  approaching: 8,
  off: 0,
};

export function hatchStatusesForRiver(river: River, date: Date, conditions?: Conditions): HatchStatus[] {
  const overrides = new Map(river.hatchOverrides.map((o) => [o.hatchId, o.window]));
  const absent = new Set(river.absentHatches);
  const out: HatchStatus[] = [];
  for (const hatch of hatches) {
    if (absent.has(hatch.id)) continue;
    if (hatch.regions.length && !hatch.regions.includes(river.region)) continue;
    const override = overrides.get(hatch.id);
    const window = override ?? hatch.window;
    const offsetDays = override ? 0 : river.offsetDays;
    const evaluation = evaluateWindow(window, date, offsetDays);
    let status = evaluation.status;
    let gateNote: string | undefined;
    const waterF = conditions?.waterTempF ?? null;
    const gate = hatch.trigger.waterTempF;
    if (waterF !== null && gate && !hatch.trigger.dateDriven) {
      const [lo, hi] = gate;
      if (status !== "off" && waterF < lo - 3) {
        status = status === "peak" || status === "active" ? "approaching" : status;
        gateNote = `Water is ${waterF.toFixed(0)} °F, below the ${lo} °F emergence threshold; expect this hatch to lag the calendar.`;
      } else if (status !== "off" && waterF > hi + 8) {
        gateNote = `Water is ${waterF.toFixed(0)} °F, well above the ${lo}–${hi} °F range; the hatch may be finishing early.`;
      }
    }
    out.push({ hatch, evaluation, status, window, offsetDays, overridden: Boolean(override), gateNote });
  }
  const order: WindowStatus[] = ["peak", "active", "approaching", "off"];
  out.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status) || a.evaluation.daysToStart - b.evaluation.daysToStart);
  return out;
}

export function eggStatusesForRiver(river: River, date: Date, speciesId?: SpeciesId): EggStatus[] {
  const month = monthOf(date);
  const out: EggStatus[] = [];
  for (const egg of eggSources) {
    if (!egg.months.includes(month)) continue;
    if (egg.regions.length && !egg.regions.includes(river.region)) continue;
    if (speciesId && !egg.eatenBy.includes(speciesId)) continue;
    let spawnerPresent = true;
    if (egg.speciesId) {
      const entry = river.species.find((s) => s.speciesId === egg.speciesId);
      spawnerPresent = Boolean(entry && entry.months.includes(month));
      if (!entry) continue; // that spawner does not run this river at all
    }
    out.push({ egg, peak: egg.peakMonths.includes(month), spawnerPresent });
  }
  out.sort((a, b) => Number(b.peak) - Number(a.peak) || Number(b.spawnerPresent) - Number(a.spawnerPresent));
  return out;
}

export function forageForMonth(date: Date, speciesId?: SpeciesId): Forage[] {
  const month = monthOf(date);
  return forage.filter((f) => f.months.includes(month) && (!speciesId || f.eatenBy.includes(speciesId)));
}

function feedingWeight(species: Species, fly: Fly): { factor: number; reason?: string } {
  const models = [species.feedingModel, species.secondaryFeedingModel].filter(Boolean);
  const primary = species.feedingModel;
  const isDryish = fly.category === "dry" || fly.category === "emerger" || fly.category === "terrestrial";
  const isSub = fly.category === "nymph" || fly.category === "larva" || fly.category === "wet";
  switch (primary) {
    case "piscivore":
      if (fly.category === "streamer" || fly.category === "mouse") return { factor: 1.35, reason: `${species.name} over 12 inches are mostly fish eaters` };
      if (isDryish && models.includes("hatch-matcher")) return { factor: 1.0 };
      return { factor: 0.9 };
    case "hatch-matcher":
      if (isDryish || isSub) return { factor: 1.25, reason: `${species.name} feed heavily on insects` };
      if (fly.category === "streamer") return { factor: 0.85 };
      return { factor: 1.0 };
    case "egg-nymph-feeder":
      if (fly.category === "egg") return { factor: 1.4, reason: `${species.name} key on drifting eggs` };
      if (isSub || fly.category === "worm") return { factor: 1.2, reason: `${species.name} eat nymphs and larvae between egg drops` };
      if (fly.category === "streamer" && models.includes("piscivore")) return { factor: 1.05 };
      if (isDryish) return { factor: 0.4 };
      return { factor: 1.0 };
    case "aggression-striker":
      if (fly.category === "attractor" || fly.category === "streamer" || fly.category === "egg" || fly.category === "wet")
        return { factor: 1.3, reason: `${species.name} stop feeding in the river and strike out of aggression` };
      if (isDryish) return { factor: 0.3 };
      return { factor: 0.9 };
    case "in-river-feeder":
      return { factor: 1.1 };
  }
}

export function recommend(input: QuizInput, limit = 12): QuizResult {
  const river = riverById.get(input.riverId);
  if (!river) throw new Error(`Unknown river ${input.riverId}`);
  const species = speciesById.get(input.speciesId);
  if (!species) throw new Error(`Unknown species ${input.speciesId}`);
  const month = monthOf(input.date);
  const warnings: string[] = [];

  const presenceEntry = river.species.find((s) => s.speciesId === input.speciesId);
  const speciesPresence = {
    present: Boolean(presenceEntry && presenceEntry.months.includes(month)),
    peak: Boolean(presenceEntry && presenceEntry.peakMonths.includes(month)),
    note: presenceEntry?.notes,
    confidence: presenceEntry?.confidence,
  };
  if (!presenceEntry) {
    warnings.push(`${species.name} are not documented in the ${river.name}. Recommendations below assume general Michigan behavior.`);
  } else if (!speciesPresence.present) {
    warnings.push(`${species.name} are not usually in the ${river.name} in ${monthName(month)}; typical months are ${presenceEntry.months.map(monthName).join(", ")}.`);
  }

  const hatchStatuses = hatchStatusesForRiver(river, input.date, input.conditions);
  const hatchById = new Map(hatchStatuses.map((h) => [h.hatch.id, h]));
  const eggStatuses = eggStatusesForRiver(river, input.date, input.speciesId);
  const eggById = new Map(eggStatuses.map((e) => [e.egg.id, e]));
  const forageNow = forageForMonth(input.date, input.speciesId);
  const forageIds = new Set(forageNow.map((f) => f.id));
  const compat = TECHNIQUE_COMPAT[input.technique];

  const recommendations: Recommendation[] = [];
  for (const fly of flies) {
    if (!fly.species.includes(input.speciesId)) continue;
    if (!fly.techniques.some((t) => compat.includes(t))) continue;
    const reasons: string[] = [];
    let score = fly.priority * 6;
    const exactTechnique = fly.techniques.includes(input.technique);
    if (exactTechnique) score += 6;
    else score -= 4;

    // 1. Hatch links
    let bestHatch: HatchStatus | undefined;
    for (const id of fly.hatchIds) {
      const hs = hatchById.get(id);
      if (!hs) continue;
      if (!bestHatch || STATUS_POINTS[hs.status] > STATUS_POINTS[bestHatch.status]) bestHatch = hs;
    }
    if (fly.hatchIds.length) {
      if (bestHatch && bestHatch.status !== "off") {
        score += STATUS_POINTS[bestHatch.status];
        reasons.push(
          bestHatch.status === "peak"
            ? `${bestHatch.hatch.commonName} is at peak on this river now`
            : bestHatch.status === "active"
              ? `${bestHatch.hatch.commonName} is hatching on this river`
              : `${bestHatch.hatch.commonName} should start within two weeks`,
        );
        if (bestHatch.gateNote) reasons.push(bestHatch.gateNote);
      } else {
        score -= 20;
      }
    }

    // 2. Egg links
    let bestEgg: EggStatus | undefined;
    for (const id of fly.eggSourceIds) {
      const es = eggById.get(id);
      if (!es) continue;
      if (!bestEgg || (es.peak && !bestEgg.peak) || (es.spawnerPresent && !bestEgg.spawnerPresent)) bestEgg = es;
    }
    if (fly.eggSourceIds.length) {
      if (bestEgg) {
        score += bestEgg.peak ? 42 : 30;
        if (!bestEgg.spawnerPresent) score -= 12;
        reasons.push(
          !bestEgg.spawnerPresent
            ? `Leftover ${bestEgg.egg.name.toLowerCase()} can still be in the drift in ${monthName(month)}, though the spawners have moved on`
            : bestEgg.peak
              ? `${bestEgg.egg.name} are at peak drift in ${monthName(month)}`
              : `${bestEgg.egg.name} are in the drift in ${monthName(month)}`,
        );
      } else {
        score -= 25;
      }
    }

    // 3. Forage links
    const forageHits = fly.forageIds.filter((id) => forageIds.has(id));
    if (fly.forageIds.length) {
      if (forageHits.length) {
        score += 18 + Math.min(forageHits.length, 3) * 3;
        const names = forageHits.slice(0, 2).map((id) => forageNow.find((f) => f.id === id)?.name ?? id);
        reasons.push(`Imitates ${names.join(" and ")}, in season now`);
      } else {
        score -= 15;
      }
    }

    // 4. Explicit months
    if (fly.months.length) {
      if (fly.months.includes(month)) {
        score += 14;
        if (!fly.hatchIds.length && !fly.eggSourceIds.length && !fly.forageIds.length) reasons.push(`In season in ${monthName(month)}`);
      } else {
        score -= 30;
      }
    } else if (!fly.hatchIds.length && !fly.eggSourceIds.length && !fly.forageIds.length) {
      // Untethered fly: modest all-season credit.
      score += 6;
    }

    // 5. Feeding model
    const fw = feedingWeight(species, fly);
    score *= fw.factor;
    if (fw.reason && fw.factor > 1.15) reasons.push(fw.reason);

    // 6. Clarity
    const clarity = input.conditions?.clarity;
    if (clarity && fly.waterClarity !== "any") {
      if (fly.waterClarity === clarity) {
        score += 10;
        reasons.push(clarity === "stained" ? "Sized and colored for stained water" : "A clear-water pattern");
      } else {
        score -= 15;
      }
    }

    // 7. Region
    if (fly.regions.length && !fly.regions.includes(river.region)) score -= 25;

    // 8. Time of day: mousing needs night flies; otherwise ignore.
    if (input.technique === "mousing" && fly.category !== "mouse") score -= 20;

    if (score <= 0) continue;
    recommendations.push({ fly, score: Math.round(score), reasons });
  }

  recommendations.sort((a, b) => b.score - a.score || a.fly.name.localeCompare(b.fly.name));

  if (recommendations.length === 0) {
    warnings.push(`No patterns matched ${species.name} with a ${input.technique.replace(/-/g, " ")} setup on this date. Try a different setup.`);
  }

  return {
    river,
    species,
    technique: input.technique,
    date: input.date,
    speciesPresence,
    hatches: hatchStatuses.filter((h) => h.status !== "off"),
    eggs: eggStatuses,
    forage: forageNow,
    recommendations: recommendations.slice(0, limit),
    warnings,
  };
}

export interface MultiRecommendation extends Recommendation {
  /** Species this fly scored for, best first. */
  forSpecies: SpeciesId[];
}

export interface MultiQuizResult {
  river: River;
  speciesList: Species[];
  technique: Technique;
  date: Date;
  perSpecies: QuizResult[];
  hatches: HatchStatus[];
  eggs: EggStatus[];
  forage: Forage[];
  recommendations: MultiRecommendation[];
  warnings: string[];
}

/**
 * Run the engine for several target species and merge. A fly's merged score is
 * its best single-species score plus a small bonus for every additional species
 * it also serves, so versatile patterns rise when an angler is fishing for more
 * than one fish.
 */
export function recommendMulti(input: Omit<QuizInput, "speciesId"> & { speciesIds: SpeciesId[] }, limit = 12): MultiQuizResult {
  const ids = [...new Set(input.speciesIds)];
  if (!ids.length) throw new Error("At least one species is required");
  const perSpecies = ids.map((speciesId) => recommend({ ...input, speciesId }, 200));
  const merged = new Map<string, MultiRecommendation>();
  for (const result of perSpecies) {
    for (const rec of result.recommendations) {
      const existing = merged.get(rec.fly.id);
      const reasons = ids.length > 1 ? rec.reasons.map((r) => `${result.species.name}: ${r}`) : rec.reasons;
      if (!existing) {
        merged.set(rec.fly.id, { ...rec, reasons, forSpecies: [result.species.id] });
      } else {
        existing.forSpecies.push(result.species.id);
        const best = Math.max(existing.score, rec.score);
        existing.score = best + 8;
        if (rec.score > existing.score - 8) {
          existing.forSpecies.sort((a, b) => (a === result.species.id ? -1 : b === result.species.id ? 1 : 0));
        }
        for (const r of reasons) if (existing.reasons.length < 4 && !existing.reasons.includes(r)) existing.reasons.push(r);
      }
    }
  }
  const recommendations = [...merged.values()].sort((a, b) => b.score - a.score || a.fly.name.localeCompare(b.fly.name)).slice(0, limit);
  const eggs = new Map<string, EggStatus>();
  const forageMap = new Map<string, Forage>();
  const warnings = new Set<string>();
  for (const r of perSpecies) {
    for (const e of r.eggs) if (!eggs.has(e.egg.id)) eggs.set(e.egg.id, e);
    for (const f of r.forage) forageMap.set(f.id, f);
    for (const w of r.warnings) warnings.add(w);
  }
  return {
    river: perSpecies[0].river,
    speciesList: perSpecies.map((r) => r.species),
    technique: input.technique,
    date: input.date,
    perSpecies,
    hatches: perSpecies[0].hatches,
    eggs: [...eggs.values()].sort((a, b) => Number(b.peak) - Number(a.peak) || Number(b.spawnerPresent) - Number(a.spawnerPresent)),
    forage: [...forageMap.values()],
    recommendations,
    warnings: [...warnings],
  };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export function monthName(m: number): string {
  return MONTHS[m - 1] ?? String(m);
}
