/** Dev check of the live conditions pipeline: `pnpm exec tsx scripts/try-conditions.mts [riverId]` */
import { riverById } from "../src/data";
import { getRiverConditions } from "../src/lib/conditions";

const id = process.argv[2] ?? "au-sable-holy-waters";
const river = riverById.get(id);
if (!river) throw new Error(`unknown river ${id}`);
const c = await getRiverConditions(river);
console.log(`${river.name} @ ${river.centroid.lat},${river.centroid.lon}`);
console.log("observed through:", c.gdd?.observedThrough, " days:", c.gdd?.days.length, " forecast days:", c.gdd?.days.filter((d) => d.forecast).length);
console.log("AGDD now  32/42/50:", c.gdd?.current);
console.log("AGDD fcst 32/42/50:", c.gdd?.forecastEnd);
console.log("last 3 days:", c.gdd?.days.slice(-3).map((d) => `${d.date} ${d.tminF}-${d.tmaxF}F${d.forecast ? " (fcst)" : ""}`).join(" | "));
console.log("water:", c.waterTempF, "F via", c.waterTempSource);
for (const g of c.gauges) console.log("  gauge", g.siteId, g.siteName, g.waterTempF, "F", g.dischargeCfs, "cfs", g.observedAt);
if (c.errors.length) console.log("errors:", c.errors);
