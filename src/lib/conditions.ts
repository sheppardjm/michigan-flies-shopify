import type { River } from "@/data";
import { buildGddSeries, type GddSeries } from "./gdd";
import { fetchNwsForecastDaily } from "./nws";
import { fetchLatestConditions, type GaugeConditions } from "./usgs";

/**
 * Live conditions for a river: accumulated air GDD at the river centroid
 * (gridMET history plus NWS forecast) and the latest USGS gauge readings.
 * Every source is optional; failures degrade to nulls with an error note so
 * the calendar-based recommendations still render.
 */

export interface RiverConditions {
  riverId: string;
  asOf: string;
  gdd: GddSeries | null;
  gauges: GaugeConditions[];
  /** Best available water temperature: first gauge with temperature, else proxy gauge. */
  waterTempF: number | null;
  waterTempSource: { siteId: string; siteName: string; proxy: boolean } | null;
  errors: string[];
}

export async function getRiverConditions(river: River, asOf: Date = new Date()): Promise<RiverConditions> {
  const errors: string[] = [];
  const siteIds = river.gauges.map((g) => g.siteId);
  if (river.proxyTempSiteId && !siteIds.includes(river.proxyTempSiteId)) siteIds.push(river.proxyTempSiteId);

  const [gddResult, gaugeResult] = await Promise.allSettled([
    (async () => {
      let forecast: Awaited<ReturnType<typeof fetchNwsForecastDaily>> = [];
      try {
        forecast = await fetchNwsForecastDaily(river.centroid.lat, river.centroid.lon);
      } catch (e) {
        errors.push(`NWS forecast unavailable: ${(e as Error).message}`);
      }
      // gridMET publishes through yesterday.
      const yesterday = new Date(asOf.getTime() - 86_400_000);
      return buildGddSeries(river.centroid.lat, river.centroid.lon, yesterday, forecast);
    })(),
    fetchLatestConditions(siteIds),
  ]);

  let gdd: GddSeries | null = null;
  if (gddResult.status === "fulfilled") gdd = gddResult.value;
  else errors.push(`gridMET unavailable: ${(gddResult.reason as Error).message}`);

  let gaugeMap = new Map<string, GaugeConditions>();
  if (gaugeResult.status === "fulfilled") gaugeMap = gaugeResult.value;
  else errors.push(`USGS unavailable: ${(gaugeResult.reason as Error).message}`);

  const gauges = river.gauges.map((g) => gaugeMap.get(g.siteId)).filter((g): g is GaugeConditions => Boolean(g));

  let waterTempF: number | null = null;
  let waterTempSource: RiverConditions["waterTempSource"] = null;
  const own = gauges.find((g) => g.waterTempF !== null);
  if (own) {
    waterTempF = own.waterTempF;
    waterTempSource = { siteId: own.siteId, siteName: own.siteName, proxy: false };
  } else if (river.proxyTempSiteId) {
    const proxy = gaugeMap.get(river.proxyTempSiteId);
    if (proxy?.waterTempF !== null && proxy?.waterTempF !== undefined) {
      waterTempF = proxy.waterTempF;
      waterTempSource = { siteId: proxy.siteId, siteName: proxy.siteName, proxy: true };
    }
  }

  return {
    riverId: river.id,
    asOf: asOf.toISOString(),
    gdd,
    gauges,
    waterTempF,
    waterTempSource,
    errors,
  };
}
