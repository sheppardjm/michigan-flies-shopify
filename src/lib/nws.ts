/**
 * National Weather Service forecast client (api.weather.gov, 2.5 km NDFD).
 * Free; requires a User-Agent that identifies the application.
 *
 * Used to extend the gridMET GDD series six to seven days ahead.
 */

import type { DailyTemp } from "./gdd";

const USER_AGENT = "michiganflies.com (hatch calendar; contact via site)";
const REVALIDATE = 3 * 60 * 60;

type PointsResponse = { properties: { forecast: string; gridId: string; gridX: number; gridY: number } };
type ForecastResponse = {
  properties: {
    periods: Array<{
      startTime: string;
      isDaytime: boolean;
      temperature: number;
      temperatureUnit: "F" | "C";
    }>;
  };
};

async function nwsFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/geo+json" },
    next: { revalidate: REVALIDATE },
  } as RequestInit);
  if (!res.ok) throw new Error(`NWS request failed ${res.status} for ${url}`);
  return (await res.json()) as T;
}

/**
 * Daily max/min forecast for a point. NWS periods alternate day/night, so
 * the daytime high and the following night's low are paired by calendar date.
 * Days without both a high and a low are dropped.
 */
export async function fetchNwsForecastDaily(lat: number, lon: number): Promise<DailyTemp[]> {
  const points = await nwsFetch<PointsResponse>(`https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`);
  const forecast = await nwsFetch<ForecastResponse>(points.properties.forecast);
  const byDate = new Map<string, { tmaxF?: number; tminF?: number }>();
  for (const p of forecast.properties.periods) {
    const date = p.startTime.slice(0, 10);
    const tempF = p.temperatureUnit === "C" ? (p.temperature * 9) / 5 + 32 : p.temperature;
    const row = byDate.get(date) ?? {};
    if (p.isDaytime) row.tmaxF = tempF;
    else row.tminF = tempF;
    byDate.set(date, row);
  }
  return [...byDate.entries()]
    .filter(([, v]) => v.tmaxF !== undefined && v.tminF !== undefined)
    .map(([date, v]) => ({ date, tmaxF: v.tmaxF!, tminF: v.tminF!, forecast: true }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
