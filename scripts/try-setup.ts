import { recommend, parseSetup, describeSetup } from "../src/lib/recommend";
import { TECHNIQUE_LABELS } from "../src/data";
const date = new Date(Date.UTC(2026, 5, 25));
for (const raw of ["dry-fly", "other", "dry-fly,other", "dry-fly,streamer", "mousing", "bogus"]) {
  const setup = parseSetup(raw);
  if (!setup) { console.log(raw, "-> null"); continue; }
  const r = recommend({ riverId: "au-sable-holy-waters", date, speciesId: "brown-trout", setup }, 5);
  console.log(`${raw} -> "${describeSetup(setup, TECHNIQUE_LABELS)}":`, r.recommendations.map((x) => `${x.fly.name}(${x.score})`).join(", "));
}
