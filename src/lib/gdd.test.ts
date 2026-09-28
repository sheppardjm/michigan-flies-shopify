import { describe, expect, it } from "vitest";
import { accumulate, dailyGdd, dateThresholdReached, kelvinToF, unpackGridmetKelvin, type GddSeries } from "./gdd";

describe("gdd math", () => {
  it("unpacks gridMET packed shorts (scale 0.1, offset 220 K)", () => {
    expect(unpackGridmetKelvin(721)).toBeCloseTo(292.1, 5);
    expect(unpackGridmetKelvin(292.1)).toBeCloseTo(292.1, 5);
    expect(kelvinToF(unpackGridmetKelvin(721))).toBeCloseTo(66.1, 1);
  });

  it("computes simple-average GDD with a zero floor", () => {
    expect(dailyGdd(70, 50, 50)).toBe(10);
    expect(dailyGdd(45, 30, 50)).toBe(0);
    expect(dailyGdd(95, 70, 50, { capF: 86 })).toBe(28);
  });

  it("accumulates per base", () => {
    const days = accumulate([
      { date: "2026-05-01", tmaxF: 60, tminF: 40, forecast: false },
      { date: "2026-05-02", tmaxF: 70, tminF: 50, forecast: false },
    ]);
    expect(days[0].gdd[32]).toBe(18);
    expect(days[0].gdd[50]).toBe(0);
    expect(days[1].agdd[32]).toBe(46);
    expect(days[1].agdd[42]).toBe(26);
    expect(days[1].agdd[50]).toBe(10);
  });

  it("finds the threshold date including forecast days", () => {
    const days = accumulate([
      { date: "2026-05-01", tmaxF: 70, tminF: 50, forecast: false },
      { date: "2026-05-02", tmaxF: 70, tminF: 50, forecast: true },
    ]);
    const series: GddSeries = {
      lat: 0,
      lon: 0,
      year: 2026,
      days,
      observedThrough: "2026-05-01",
      current: days[0].agdd,
      forecastEnd: days[1].agdd,
    };
    expect(dateThresholdReached(series, 50, 15)).toEqual({ date: "2026-05-02", forecast: true });
    expect(dateThresholdReached(series, 50, 100)).toBeNull();
  });
});
