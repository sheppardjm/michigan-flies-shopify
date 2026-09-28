/**
 * USGS Water Data clients.
 *
 * - Instantaneous values (latest water temperature and discharge) from the
 *   legacy NWIS IV service, which still returns the most recent reading in one call.
 * - Daily statistics from the new OGC API (api.waterdata.usgs.gov/ogcapi/v1),
 *   used for water degree-days and trend lines.
 *
 * Parameter codes: 00010 water temperature (°C), 00060 discharge (cfs).
 * All USGS real-time data are provisional and subject to revision.
 */

import { celsiusToF } from "./gdd";

export interface GaugeConditions {
  siteId: string;
  siteName: string;
  waterTempF: number | null;
  waterTempC: number | null;
  dischargeCfs: number | null;
  observedAt: string | null;
  url: string;
}

export interface DailyWaterTemp {
  date: string;
  meanC: number | null;
  maxC: number | null;
  minC: number | null;
}

const REVALIDATE_IV = 30 * 60; // 30 minutes
const REVALIDATE_DAILY = 6 * 60 * 60;

type IvResponse = {
  value: {
    timeSeries: Array<{
      sourceInfo: { siteName: string; siteCode: Array<{ value: string }> };
      variable: { variableCode: Array<{ value: string }> };
      values: Array<{ value: Array<{ value: string; dateTime: string }> }>;
    }>;
  };
};

export function gaugeUrl(siteId: string): string {
  return `https://waterdata.usgs.gov/monitoring-location/USGS-${siteId}/`;
}

export async function fetchLatestConditions(siteIds: string[]): Promise<Map<string, GaugeConditions>> {
  const out = new Map<string, GaugeConditions>();
  if (siteIds.length === 0) return out;
  const params = new URLSearchParams({
    format: "json",
    sites: siteIds.join(","),
    parameterCd: "00010,00060",
    siteStatus: "all",
  });
  const res = await fetch(`https://waterservices.usgs.gov/nwis/iv/?${params}`, {
    next: { revalidate: REVALIDATE_IV },
  } as RequestInit);
  if (!res.ok) throw new Error(`USGS IV request failed: ${res.status}`);
  const json = (await res.json()) as IvResponse;
  for (const ts of json.value.timeSeries) {
    const siteId = ts.sourceInfo.siteCode[0]?.value;
    if (!siteId) continue;
    const code = ts.variable.variableCode[0]?.value;
    const latest = ts.values[0]?.value?.at(-1);
    const entry: GaugeConditions = out.get(siteId) ?? {
      siteId,
      siteName: ts.sourceInfo.siteName,
      waterTempF: null,
      waterTempC: null,
      dischargeCfs: null,
      observedAt: null,
      url: gaugeUrl(siteId),
    };
    if (latest) {
      const v = Number(latest.value);
      // USGS uses -999999 for missing.
      if (Number.isFinite(v) && v > -999) {
        if (code === "00010") {
          entry.waterTempC = Math.round(v * 10) / 10;
          entry.waterTempF = Math.round(celsiusToF(v) * 10) / 10;
        } else if (code === "00060") {
          entry.dischargeCfs = Math.round(v);
        }
        if (!entry.observedAt || latest.dateTime > entry.observedAt) entry.observedAt = latest.dateTime;
      }
    }
    out.set(siteId, entry);
  }
  return out;
}

type OgcDaily = {
  features: Array<{
    properties: {
      time: string;
      value: string | null;
      statistic_id: string;
      parameter_code: string;
    };
  }>;
};

export async function fetchDailyWaterTemps(siteId: string, start: string, end: string): Promise<DailyWaterTemp[]> {
  const params = new URLSearchParams({
    f: "json",
    monitoring_location_id: `USGS-${siteId}`,
    parameter_code: "00010",
    time: `${start}/${end}`,
    limit: "2000",
  });
  const res = await fetch(`https://api.waterdata.usgs.gov/ogcapi/v1/collections/daily/items?${params}`, {
    next: { revalidate: REVALIDATE_DAILY },
  } as RequestInit);
  if (!res.ok) throw new Error(`USGS daily request failed: ${res.status}`);
  const json = (await res.json()) as OgcDaily;
  const byDate = new Map<string, DailyWaterTemp>();
  for (const f of json.features) {
    const p = f.properties;
    const v = p.value === null ? null : Number(p.value);
    const row = byDate.get(p.time) ?? { date: p.time, meanC: null, maxC: null, minC: null };
    if (v !== null && Number.isFinite(v)) {
      if (p.statistic_id === "00003") row.meanC = v;
      else if (p.statistic_id === "00001") row.maxC = v;
      else if (p.statistic_id === "00002") row.minC = v;
    }
    byDate.set(p.time, row);
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Water degree-days above a Celsius base (Hexagenia literature uses 10 °C),
 * accumulated from the first record. Uses mean if present, else (max+min)/2.
 */
export function waterDegreeDays(days: DailyWaterTemp[], baseC = 10): { date: string; dd: number; add: number }[] {
  let running = 0;
  const out: { date: string; dd: number; add: number }[] = [];
  for (const d of days) {
    const t = d.meanC ?? (d.maxC !== null && d.minC !== null ? (d.maxC + d.minC) / 2 : null);
    if (t === null) continue;
    const dd = Math.max(0, t - baseC);
    running += dd;
    out.push({ date: d.date, dd: Math.round(dd * 10) / 10, add: Math.round(running * 10) / 10 });
  }
  return out;
}
