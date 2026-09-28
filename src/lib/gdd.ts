/**
 * Growing-degree-day engine.
 *
 * Air temperatures come from gridMET (Climatology Lab, University of Idaho),
 * a 4 km daily grid covering 1979 to yesterday, released CC0. Point series are
 * pulled from the THREDDS NetCDF Subset Service as CSV. The last ~60 days are
 * preliminary and may be revised.
 *
 * GDD uses the simple-average method that MSU Enviroweather and USA-NPN use:
 *   gdd = max(0, (tmax + tmin) / 2 - base)
 * accumulated from January 1. Three bases are kept because early-season
 * hatches (Hendrickson, Grannom, Baetis, stoneflies) emerge before base-50
 * accumulation has begun in northern Michigan.
 */

export const GDD_BASES_F = [32, 42, 50] as const;
export type GddBase = (typeof GDD_BASES_F)[number];

export interface DailyTemp {
  /** YYYY-MM-DD */
  date: string;
  tmaxF: number;
  tminF: number;
  /** false for gridMET history, true for NWS forecast days. */
  forecast: boolean;
}

export interface DailyGdd extends DailyTemp {
  gdd: Record<GddBase, number>;
  agdd: Record<GddBase, number>;
}

export interface GddSeries {
  lat: number;
  lon: number;
  year: number;
  days: DailyGdd[];
  /** Last date with observed (non-forecast) data. */
  observedThrough: string | null;
  /** Current accumulated GDD per base as of the last observed day. */
  current: Record<GddBase, number>;
  /** Accumulated GDD per base at the end of the forecast horizon. */
  forecastEnd: Record<GddBase, number> | null;
}

export function kelvinToF(k: number): number {
  return ((k - 273.15) * 9) / 5 + 32;
}

export function celsiusToF(c: number): number {
  return (c * 9) / 5 + 32;
}

export function fToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

/**
 * gridMET stores temperature as packed shorts (scale 0.1, offset 220 K) and the
 * NCSS CSV export returns the packed value. Unpack when the value is clearly not
 * a Kelvin temperature.
 */
export function unpackGridmetKelvin(value: number): number {
  if (value > 400) return 220 + value * 0.1;
  return value;
}

export function dailyGdd(tmaxF: number, tminF: number, baseF: number, options?: { capF?: number; clampMinToBase?: boolean }): number {
  let tmax = tmaxF;
  let tmin = tminF;
  if (options?.capF !== undefined) tmax = Math.min(tmax, options.capF);
  if (options?.clampMinToBase) tmin = Math.max(tmin, baseF);
  const avg = (tmax + tmin) / 2;
  return Math.max(0, avg - baseF);
}

export function accumulate(temps: DailyTemp[]): DailyGdd[] {
  const running: Record<GddBase, number> = { 32: 0, 42: 0, 50: 0 };
  return temps.map((t) => {
    const gdd = { 32: 0, 42: 0, 50: 0 } as Record<GddBase, number>;
    const agdd = { 32: 0, 42: 0, 50: 0 } as Record<GddBase, number>;
    for (const base of GDD_BASES_F) {
      const g = dailyGdd(t.tmaxF, t.tminF, base);
      running[base] += g;
      gdd[base] = round1(g);
      agdd[base] = round1(running[base]);
    }
    return { ...t, gdd, agdd };
  });
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

const GRIDMET_BASE = "https://thredds.northwestknowledge.net/thredds/ncss/grid";

function gridmetUrl(variable: "tmmx" | "tmmn", lat: number, lon: number, start: string, end: string): string {
  const ncVar = variable === "tmmx" ? "daily_maximum_temperature" : "daily_minimum_temperature";
  const params = new URLSearchParams({
    var: ncVar,
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    time_start: `${start}T00:00:00Z`,
    time_end: `${end}T00:00:00Z`,
    accept: "csv",
  });
  return `${GRIDMET_BASE}/agg_met_${variable}_1979_CurrentYear_CONUS.nc?${params}`;
}

function parseGridmetCsv(csv: string): Map<string, number> {
  const out = new Map<string, number>();
  const lines = csv.trim().split(/\r?\n/);
  for (const line of lines.slice(1)) {
    const cols = line.split(",");
    if (cols.length < 4) continue;
    const date = cols[0].slice(0, 10);
    const raw = Number(cols[3]);
    if (!Number.isFinite(raw)) continue;
    // gridMET fill value is 32767 packed.
    if (raw >= 32767) continue;
    out.set(date, kelvinToF(unpackGridmetKelvin(raw)));
  }
  return out;
}

export interface FetchOptions {
  /** Next.js fetch revalidation in seconds. gridMET updates once a day. */
  revalidateSeconds?: number;
}

/**
 * Fetch daily max/min air temperature for a point from gridMET.
 * Returns days in ascending date order; days missing from either series are dropped.
 */
export async function fetchGridmetDaily(lat: number, lon: number, start: string, end: string, options: FetchOptions = {}): Promise<DailyTemp[]> {
  const init: RequestInit & { next?: { revalidate: number } } = {
    headers: { Accept: "text/csv" },
    next: { revalidate: options.revalidateSeconds ?? 6 * 60 * 60 },
  };
  const [maxRes, minRes] = await Promise.all([
    fetch(gridmetUrl("tmmx", lat, lon, start, end), init),
    fetch(gridmetUrl("tmmn", lat, lon, start, end), init),
  ]);
  if (!maxRes.ok || !minRes.ok) {
    throw new Error(`gridMET request failed: tmmx ${maxRes.status}, tmmn ${minRes.status}`);
  }
  const [maxCsv, minCsv] = await Promise.all([maxRes.text(), minRes.text()]);
  const maxes = parseGridmetCsv(maxCsv);
  const mins = parseGridmetCsv(minCsv);
  const days: DailyTemp[] = [];
  for (const [date, tmaxF] of maxes) {
    const tminF = mins.get(date);
    if (tminF === undefined) continue;
    days.push({ date, tmaxF: round1(tmaxF), tminF: round1(tminF), forecast: false });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  return days;
}

/**
 * Build a full season series: observed gridMET from Jan 1 through yesterday,
 * optionally extended with forecast days supplied by the caller (NWS).
 */
export async function buildGddSeries(
  lat: number,
  lon: number,
  asOf: Date,
  forecastDays: DailyTemp[] = [],
  options: FetchOptions = {},
): Promise<GddSeries> {
  const year = asOf.getUTCFullYear();
  const start = `${year}-01-01`;
  const end = asOf.toISOString().slice(0, 10);
  const observed = await fetchGridmetDaily(lat, lon, start, end, options);
  const lastObserved = observed.at(-1)?.date ?? null;
  const forecast = forecastDays.filter((d) => !lastObserved || d.date > lastObserved).map((d) => ({ ...d, forecast: true }));
  const days = accumulate([...observed, ...forecast]);
  const lastObs = days.filter((d) => !d.forecast).at(-1);
  const last = days.at(-1);
  return {
    lat,
    lon,
    year,
    days,
    observedThrough: lastObserved,
    current: lastObs?.agdd ?? { 32: 0, 42: 0, 50: 0 },
    forecastEnd: forecast.length && last ? last.agdd : null,
  };
}

/** Find the date on which an accumulated threshold was (or is forecast to be) reached. */
export function dateThresholdReached(series: GddSeries, base: GddBase, threshold: number): { date: string; forecast: boolean } | null {
  for (const d of series.days) {
    if (d.agdd[base] >= threshold) return { date: d.date, forecast: d.forecast };
  }
  return null;
}
