import { describe, expect, it } from "vitest";
import { evaluateWindow, formatWindow, monthDayToDate, resolveWindow, windowMonths } from "./season";

const hex = { start: "06-10", peakStart: "06-21", peakEnd: "07-07", end: "07-10" } as const;
const midge = { start: "11-01", end: "03-31" } as const;

describe("season windows", () => {
  it("shifts a MonthDay by offset days", () => {
    const d = monthDayToDate("06-10", 2026, 21);
    expect(d.toISOString().slice(0, 10)).toBe("2026-07-01");
  });

  it("reports peak inside the peak range", () => {
    const e = evaluateWindow(hex, new Date(Date.UTC(2026, 5, 25)));
    expect(e.status).toBe("peak");
  });

  it("reports active before the peak", () => {
    const e = evaluateWindow(hex, new Date(Date.UTC(2026, 5, 12)));
    expect(e.status).toBe("active");
  });

  it("reports approaching within two weeks of start", () => {
    const e = evaluateWindow(hex, new Date(Date.UTC(2026, 4, 30)));
    expect(e.status).toBe("approaching");
    expect(e.daysToStart).toBe(11);
  });

  it("applies the U.P. offset so the Au Sable peak date is still 'approaching' up north", () => {
    const e = evaluateWindow(hex, new Date(Date.UTC(2026, 5, 25)), 21);
    expect(e.status).toBe("approaching");
    expect(e.daysToStart).toBe(6);
    const later = evaluateWindow(hex, new Date(Date.UTC(2026, 6, 15)), 21);
    expect(later.status).toBe("peak");
  });

  it("handles windows that wrap the new year", () => {
    expect(evaluateWindow(midge, new Date(Date.UTC(2026, 0, 15))).status).toBe("active");
    expect(evaluateWindow(midge, new Date(Date.UTC(2026, 11, 15))).status).toBe("active");
    expect(evaluateWindow(midge, new Date(Date.UTC(2026, 6, 15))).status).toBe("off");
    const r = resolveWindow(midge, new Date(Date.UTC(2026, 0, 15)));
    expect(r.start.getUTCFullYear()).toBe(2025);
  });

  it("treats a full-year window as always active and unshifted", () => {
    const allYear = { start: "01-01", end: "12-31" } as const;
    expect(formatWindow(allYear, -8)).toBe("All year");
    expect(evaluateWindow(allYear, new Date(Date.UTC(2026, 11, 28)), -8).status).toBe("active");
    expect(windowMonths(allYear, 21)).toHaveLength(12);
  });

  it("lists months touched by a shifted window", () => {
    expect(windowMonths(hex)).toEqual([6, 7]);
    expect(windowMonths(hex, 21)).toEqual([7]);
  });

  it("formats windows with offsets", () => {
    expect(formatWindow(hex, -12)).toBe("May 29 – Jun 28");
  });
});
