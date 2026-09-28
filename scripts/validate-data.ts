/**
 * Validates every seed table against the Zod schema and checks cross-references.
 * Run with `pnpm validate-data`.
 */
import { eggSourceById, flies, forageById, hatchById, rivers, speciesById, eggSources, forage, hatches, species } from "../src/data";

const problems: string[] = [];

for (const fly of flies) {
  for (const id of fly.hatchIds) if (!hatchById.has(id)) problems.push(`fly ${fly.id}: unknown hatch ${id}`);
  for (const id of fly.eggSourceIds) if (!eggSourceById.has(id)) problems.push(`fly ${fly.id}: unknown egg source ${id}`);
  for (const id of fly.forageIds) if (!forageById.has(id)) problems.push(`fly ${fly.id}: unknown forage ${id}`);
}
for (const river of rivers) {
  for (const id of river.signatureHatches) if (!hatchById.has(id)) problems.push(`river ${river.id}: unknown signature hatch ${id}`);
  for (const o of river.hatchOverrides) if (!hatchById.has(o.hatchId)) problems.push(`river ${river.id}: unknown override hatch ${o.hatchId}`);
  for (const id of river.absentHatches) if (!hatchById.has(id)) problems.push(`river ${river.id}: unknown absent hatch ${id}`);
  for (const s of river.species) if (!speciesById.has(s.speciesId)) problems.push(`river ${river.id}: unknown species ${s.speciesId}`);
}
const dupes = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);
for (const [name, list] of Object.entries({ flies, rivers, hatches, eggSources, forage, species })) {
  for (const d of dupes(list.map((x) => x.id))) problems.push(`${name}: duplicate id ${d}`);
}

console.log(`hatches ${hatches.length}, species ${species.length}, eggSources ${eggSources.length}, forage ${forage.length}, flies ${flies.length}, rivers ${rivers.length}`);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("Data valid.");
