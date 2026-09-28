import type { MonthDay, SeasonWindow } from "@/data/schema";

/**
 * Calendar math for hatch windows.
 *
 * Windows are stored as "MM-DD" against the northern Lower Peninsula
 * baseline and shifted by a river or region offset in days. Windows may
 * wrap the new year (midges: 11-01 to 03-31).
 */

export type WindowStatus = "peak" | "active" | "approaching" | "off";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const MONTH_SHORT = MONTH_NAMES.map((m) => m.slice(0, 3));

const DAY_MS = 86_400_000;

/** A window that covers (nearly) the whole year is treated as always active and unshifted. */
export function isYearRound(window: SeasonWindow): boolean {
  const start = monthDayToDate(window.start, 2025);
  let end = monthDayToDate(window.end, 2025);
  if (end < start) end = new Date(end.getTime() + 365 * DAY_MS);
  return daysBetween(start, end) >= 360;
}

export function parseMonthDay(md: MonthDay): { month: number; day: number } {
  const [m, d] = md.split("-").map(Number);
  return { month: m, day: d };
}

/** UTC date for a MonthDay in a given year, shifted by offsetDays. */
export function monthDayToDate(md: MonthDay, year: number, offsetDays = 0): Date {
  const { month, day } = parseMonthDay(md);
  return new Date(Date.UTC(year, month - 1, day) + offsetDays * DAY_MS);
}

export function toUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((toUtcDay(b).getTime() - toUtcDay(a).getTime()) / DAY_MS);
}

export interface ResolvedWindow {
  start: Date;
  peakStart?: Date;
  peakEnd?: Date;
  end: Date;
}

/**
 * Resolve a window to concrete dates for the year containing `date`, so that
 * `date` falls in the most relevant instance of the window. Handles windows
 * that wrap the new year by trying the previous year as well.
 */
export function resolveWindow(window: SeasonWindow, date: Date, offsetDays = 0): ResolvedWindow {
  const year = date.getUTCFullYear();
  const build = (y: number): ResolvedWindow => {
    const start = monthDayToDate(window.start, y, offsetDays);
    let end = monthDayToDate(window.end, y, offsetDays);
    if (end < start) end = new Date(end.getTime() + 365 * DAY_MS);
    const resolved: ResolvedWindow = { start, end };
    if (window.peakStart) {
      let ps = monthDayToDate(window.peakStart, y, offsetDays);
      if (ps < start) ps = new Date(ps.getTime() + 365 * DAY_MS);
      resolved.peakStart = ps;
    }
    if (window.peakEnd) {
      let pe = monthDayToDate(window.peakEnd, y, offsetDays);
      if (pe < start) pe = new Date(pe.getTime() + 365 * DAY_MS);
      resolved.peakEnd = pe;
    }
    return resolved;
  };
  const thisYear = build(year);
  const lastYear = build(year - 1);
  const d = toUtcDay(date).getTime();
  // Prefer an instance that contains the date; otherwise the upcoming one.
  if (d >= lastYear.start.getTime() && d <= lastYear.end.getTime()) return lastYear;
  if (d >= thisYear.start.getTime() && d <= thisYear.end.getTime()) return thisYear;
  if (d < thisYear.start.getTime()) return thisYear;
  return build(year + 1);
}

export interface WindowEvaluation {
  status: WindowStatus;
  /** Days until start when approaching, negative days since end when off. */
  daysToStart: number;
  daysToEnd: number;
  resolved: ResolvedWindow;
}

export function evaluateWindow(
  window: SeasonWindow,
  date: Date,
  offsetDays = 0,
  approachDays = 14,
): WindowEvaluation {
  const yearRound = isYearRound(window);
  const resolved = resolveWindow(window, date, yearRound ? 0 : offsetDays);
  const d = toUtcDay(date);
  const daysToStart = daysBetween(d, resolved.start);
  const daysToEnd = daysBetween(d, resolved.end);
  let status: WindowStatus = "off";
  if (yearRound) {
    status = "active";
  } else if (daysToStart <= 0 && daysToEnd >= 0) {
    status = "active";
    if (resolved.peakStart && resolved.peakEnd) {
      if (d >= resolved.peakStart && d <= resolved.peakEnd) status = "peak";
    } else if (resolved.peakStart && d >= resolved.peakStart) {
      status = "peak";
    }
  } else if (daysToStart > 0 && daysToStart <= approachDays) {
    status = "approaching";
  }
  return { status, daysToStart, daysToEnd, resolved };
}

export function formatMonthDay(md: MonthDay, offsetDays = 0): string {
  const d = monthDayToDate(md, 2025, offsetDays);
  return `${MONTH_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function formatWindow(window: SeasonWindow, offsetDays = 0): string {
  if (isYearRound(window)) return "All year";
  return `${formatMonthDay(window.start, offsetDays)} – ${formatMonthDay(window.end, offsetDays)}`;
}

export function formatPeak(window: SeasonWindow, offsetDays = 0): string | null {
  if (!window.peakStart || !window.peakEnd) return null;
  return `${formatMonthDay(window.peakStart, offsetDays)} – ${formatMonthDay(window.peakEnd, offsetDays)}`;
}

export function formatDate(date: Date): string {
  return `${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

/** Months (1-12) touched by a window after offset, for month-grid displays. */
export function windowMonths(window: SeasonWindow, offsetDays = 0): number[] {
  if (isYearRound(window)) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const start = monthDayToDate(window.start, 2025, offsetDays);
  let end = monthDayToDate(window.end, 2025, offsetDays);
  if (end < start) end = new Date(end.getTime() + 365 * DAY_MS);
  const months = new Set<number>();
  for (let t = start.getTime(); t <= end.getTime(); t += DAY_MS) {
    months.add(new Date(t).getUTCMonth() + 1);
  }
  return [...months].sort((a, b) => a - b);
}

export function monthOf(date: Date): number {
  return date.getUTCMonth() + 1;
}

/** Parse "YYYY-MM-DD" as a UTC date; falls back to today. */
export function parseIsoDate(value: string | null | undefined): Date {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    if (!Number.isNaN(dt.getTime())) return dt;
  }
  return toUtcDay(new Date());
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
