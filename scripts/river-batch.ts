/**
 * Compute the fly batch a river needs across the year. For every month, each
 * species present that month, and each technique, keep the top N flies whose
 * score clears MIN_SCORE, then rank by how many (month, species, setup) slots
 * each fly covers. Prints a ranked list and, with --json, the fly ids.
 *
 *   pnpm exec tsx scripts/river-batch.ts two-hearted [--top 4] [--min 45] [--json]
 */
import { Technique, riverById, speciesById } from "../src/data";
import { recommend } from "../src/lib/recommend";

const args = process.argv.slice(2);
const riverId = args.find((a) => !a.startsWith("--")) ?? "two-hearted";
const opt = (name: string, def: number) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const topN = opt("top", 4);
const MIN_SCORE = opt("min", 45);
const asJson = args.includes("--json");
const river = riverById.get(riverId);
if (!river) throw new Error(`unknown river ${riverId}`);

type Row = { id: string; name: string; category: string; slots: number; months: Set<number>; species: Set<string>; speciesIds: Set<string>; techniques: Set<string>; best: number };
const tally = new Map<string, Row>();
for (let month = 1; month <= 12; month++) {
  const date = new Date(Date.UTC(2026, month - 1, 15));
  for (const entry of river.species) {
    if (!entry.months.includes(month)) continue;
    for (const technique of Technique.options) {
      const r = recommend({ riverId, date, speciesId: entry.speciesId, setup: { techniques: [technique], other: false } }, 12);
      const strong = r.recommendations.filter((x) => x.score >= MIN_SCORE).slice(0, topN);
      for (const rec of strong) {
        const t = tally.get(rec.fly.id) ?? { id: rec.fly.id, name: rec.fly.name, category: rec.fly.category, slots: 0, months: new Set(), species: new Set(), speciesIds: new Set(), techniques: new Set(), best: 0 };
        t.slots++;
        t.months.add(month);
        t.species.add(speciesById.get(entry.speciesId)?.name ?? entry.speciesId);
        t.speciesIds.add(entry.speciesId);
        t.techniques.add(technique);
        t.best = Math.max(t.best, rec.score);
        tally.set(rec.fly.id, t);
      }
    }
  }
}
const rows = [...tally.values()].sort((a, b) => b.slots - a.slots || b.best - a.best);
if (asJson) {
  console.log(JSON.stringify(rows.map((r) => ({ flyId: r.id, months: [...r.months].sort((a, b) => a - b), forSpecies: [...r.speciesIds] }))));
} else {
  console.log(`${river.name}: ${rows.length} flies (top ${topN} per slot, score ≥ ${MIN_SCORE})\n`);
  for (const t of rows) {
    console.log(`${String(t.slots).padStart(3)}  ${t.id.padEnd(30)} ${t.category.padEnd(11)} m ${[...t.months].sort((a, b) => a - b).join(",").padEnd(26)} ${[...t.species].map((s) => s.split(" ")[0]).join("/")}`);
  }
}
