/** Dev check of multi-species merge: `pnpm exec tsx scripts/try-multi.ts` */
import { recommendMulti } from "../src/lib/recommend";
const r = recommendMulti({ riverId: "two-hearted", date: new Date(Date.UTC(2026, 8, 27)), speciesIds: ["chinook", "coho", "steelhead"], technique: "swing-spey" }, 10);
console.log(r.speciesList.map((s) => s.name).join(" + "), "·", r.river.name);
for (const w of r.warnings) console.log("  !", w);
console.log("  eggs:", r.eggs.map((e) => `${e.egg.name}${e.peak ? "*" : ""}${e.spawnerPresent ? "" : "(absent)"}`).join(", "));
for (const x of r.recommendations) console.log(`  ${String(x.score).padStart(4)}  ${x.fly.name}  [${x.forSpecies.join(",")}]  — ${x.reasons[0] ?? ""}`);
