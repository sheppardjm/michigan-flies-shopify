/** Dev sanity check for the recommendation engine: `pnpm exec tsx scripts/try-recommend.ts` */
import { recommend } from "../src/lib/recommend";
import type { SpeciesId, Technique } from "../src/data";

const cases: { riverId: string; date: Date; speciesId: SpeciesId; technique: Technique }[] = [
  { riverId: "pere-marquette", date: new Date(Date.UTC(2026, 3, 12)), speciesId: "steelhead", technique: "chuck-and-duck" },
  { riverId: "au-sable-holy-waters", date: new Date(Date.UTC(2026, 5, 25)), speciesId: "brown-trout", technique: "dry-fly" },
  { riverId: "two-hearted", date: new Date(Date.UTC(2026, 8, 27)), speciesId: "coho", technique: "swing-spey" },
  { riverId: "manistee-below-tippy", date: new Date(Date.UTC(2026, 9, 5)), speciesId: "chinook", technique: "chuck-and-duck" },
  { riverId: "st-marys-rapids", date: new Date(Date.UTC(2026, 6, 15)), speciesId: "atlantic-salmon", technique: "nymph-indicator" },
  { riverId: "au-sable-south-branch", date: new Date(Date.UTC(2026, 7, 10)), speciesId: "brook-trout", technique: "dry-fly" },
  { riverId: "muskegon-below-croton", date: new Date(Date.UTC(2026, 0, 20)), speciesId: "steelhead", technique: "nymph-indicator" },
  { riverId: "au-sable-holy-waters", date: new Date(Date.UTC(2026, 9, 10)), speciesId: "brown-trout", technique: "nymph-indicator" },
];
for (const c of cases) {
  const r = recommend({ ...c, setup: { techniques: [c.technique], other: false } }, 6);
  console.log(`\n== ${c.speciesId} · ${c.riverId} · ${c.date.toISOString().slice(0, 10)} · ${c.technique}`);
  if (r.warnings.length) console.log("  ! " + r.warnings.join(" | "));
  console.log("  hatches: " + r.hatches.map((h) => `${h.hatch.commonName}(${h.status})`).join(", "));
  console.log("  eggs: " + r.eggs.map((e) => `${e.egg.name}${e.peak ? "*" : ""}${e.spawnerPresent ? "" : "(absent)"}`).join(", "));
  for (const x of r.recommendations) console.log(`  ${String(x.score).padStart(4)}  ${x.fly.name}  — ${x.reasons[0] ?? ""}`);
}
