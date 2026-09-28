import Link from "next/link";
import { REGION_LABELS, Region, hatches, regionOffsetByRegion } from "@/data";
import { evaluateWindow, formatDate, type WindowStatus } from "@/lib/season";
import { fetchLatestConditions } from "@/lib/usgs";

/**
 * The hatch board pinned beside the register: what is hatching now by region
 * in the four-state chalk vocabulary (approaching, hatching, peak, finished),
 * and today's live water temperatures chalked beneath. Server component;
 * gauge reads are cached for 30 minutes.
 */

const REGIONS: Region[] = ["southern-lp", "mid-lp", "northern-lp", "tip-of-mitt", "upper-peninsula"];

/** A few gauged rivers a planner recognizes, north to south; labels sized to the board. */
const BOARD_GAUGES: { siteId: string; label: string; riverId: string }[] = [
  { siteId: "04059000", label: "Escanaba", riverId: "escanaba" },
  { siteId: "04136500", label: "Au Sable, Mio", riverId: "au-sable-below-mio" },
  { siteId: "04124000", label: "Manistee", riverId: "manistee-upper" },
  { siteId: "04126195", label: "L. Manistee", riverId: "little-manistee" },
  { siteId: "04121970", label: "Muskegon", riverId: "muskegon-below-croton" },
  { siteId: "04101500", label: "St. Joseph", riverId: "st-joseph-berrien-springs" },
];

const STATE_ORDER: WindowStatus[] = ["peak", "active", "approaching", "off"];
const STATE_CLASS: Record<WindowStatus, string> = {
  peak: "chalk chalk-peak",
  active: "chalk chalk-hatching",
  approaching: "chalk chalk-approaching",
  off: "chalk chalk-finished",
};
const STATE_WORD: Record<WindowStatus, string> = {
  peak: "peak",
  active: "hatching",
  approaching: "approaching",
  off: "finished",
};
/** A hatch that ended within this many days is still chalked up, struck through. */
const FINISHED_GRACE_DAYS = 14;
const PER_REGION = 4;

export async function HatchBoard({ today }: { today: Date }) {
  const rows = REGIONS.map((region) => {
    const offset = regionOffsetByRegion.get(region)?.offsetDays ?? 0;
    const evaluated = hatches
      .filter((h) => !h.regions.length || h.regions.includes(region))
      .map((h) => {
        const e = evaluateWindow(h.window, today, offset);
        return { hatch: h, status: e.status, daysToEnd: e.daysToEnd };
      });
    const live = evaluated.filter((x) => x.status !== "off").sort((a, b) => STATE_ORDER.indexOf(a.status) - STATE_ORDER.indexOf(b.status)).slice(0, PER_REGION);
    // The most recently finished hatch, struck through, so the board shows what just ended.
    const finished = evaluated
      .filter((x) => x.status === "off" && x.daysToEnd < 0 && x.daysToEnd >= -FINISHED_GRACE_DAYS)
      .sort((a, b) => b.daysToEnd - a.daysToEnd)
      .slice(0, 1);
    return { region, offset, items: [...live, ...finished] };
  });

  let gauges: Awaited<ReturnType<typeof fetchLatestConditions>> | null = null;
  try {
    gauges = await fetchLatestConditions(BOARD_GAUGES.map((g) => g.siteId));
  } catch {
    gauges = null;
  }

  return (
    <section className="board p-5 sm:p-6" aria-labelledby="board-title">
      {/* Chalk edge filter shared by every mark on the board. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <filter id="chalk-rough" x="-10%" y="-40%" width="120%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 1.6" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="board-title" className="board-title text-lg sm:text-xl">
          Hatching now
        </h2>
        <time dateTime={today.toISOString().slice(0, 10)} className="live text-sm">
          {formatDate(today)}
        </time>
      </div>
      <hr className="board-rule my-3" />

      <ul className="space-y-3">
        {rows.map(({ region, offset, items }, i) => (
          <li key={region} className="board-row grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3" style={{ "--i": i } as React.CSSProperties}>
            <div className="pt-0.5">
              <span className="board-region block leading-tight">{REGION_LABELS[region].replace(" Peninsula", " Pen.").replace("Lower Pen.", "LP")}</span>
              <span className="live block text-[0.74rem] opacity-80">{offset === 0 ? "baseline" : `${offset > 0 ? "+" : ""}${offset} d`}</span>
            </div>
            {items.length ? (
              <ul className="flex flex-wrap gap-x-3 gap-y-2">
                {items.map(({ hatch, status }) => (
                  <li key={hatch.id}>
                    <Link href={`/hatches/${hatch.id}`} className="board-link">
                      <span className={STATE_CLASS[status]}>{hatch.commonName}</span>
                      <span className="sr-only"> ({STATE_WORD[status]})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="chalk text-sm text-[color:var(--chalk-dim)]">Quiet. Eggs, streamers, midges.</p>
            )}
          </li>
        ))}
      </ul>

      <hr className="board-rule my-3" />
      <div className="flex items-baseline justify-between">
        <p className="board-region">Water today</p>
        <p className="board-region normal-case tracking-normal">USGS, provisional</p>
      </div>
      <ul className="mt-2 grid grid-cols-1 gap-x-5 gap-y-1.5 min-[420px]:grid-cols-2">
        {BOARD_GAUGES.map((g, i) => {
          const c = gauges?.get(g.siteId);
          const tempF = c?.waterTempF ?? null;
          const at = c?.observedAt ? new Date(c.observedAt) : null;
          return (
            <li key={g.siteId} className="board-row flex items-baseline justify-between gap-2 text-sm" style={{ "--i": i + 5 } as React.CSSProperties}>
              <Link href={`/rivers/${g.riverId}`} className="board-link whitespace-nowrap text-[0.9rem]">
                {g.label}
              </Link>
              <span className="live whitespace-nowrap text-base leading-none">
                {tempF !== null ? `${tempF.toFixed(0)}°` : "—"}
                {at ? (
                  <span className="ml-1 text-[0.74rem] opacity-75">{at.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Detroit" }).replace(" ", "")}</span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>

      <hr className="board-rule my-3" />
      <dl className="flex flex-wrap gap-x-4 gap-y-2 text-[0.76rem]">
        <div className="flex items-center gap-1.5">
          <dt className="chalk chalk-peak text-[0.76rem]">peak</dt>
          <dd className="text-[color:var(--chalk-dim)]">best days</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="chalk chalk-hatching text-[0.76rem]">hatching</dt>
          <dd className="text-[color:var(--chalk-dim)]">in the window</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="chalk chalk-approaching text-[0.76rem]">approaching</dt>
          <dd className="text-[color:var(--chalk-dim)]">within two weeks</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="chalk chalk-finished text-[0.76rem]">finished</dt>
          <dd className="text-[color:var(--chalk-dim)]">ended this fortnight</dd>
        </div>
      </dl>
    </section>
  );
}
