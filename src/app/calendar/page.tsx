import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EvidenceBadge } from "@/components/evidence-badge";
import { MonthGrid } from "@/components/month-grid";
import { RowTable } from "@/components/row-table";
import { REGION_LABELS, Region, eggSources, hatches, regionOffsetByRegion, regionOffsets, riverById, rivers } from "@/data";
import { eggSourcesForRiver } from "@/lib/recommend";
import { formatPeak, formatWindow, windowMonths } from "@/lib/season";

export const metadata: Metadata = {
  title: "Hatch calendar",
  description: "Month-by-month hatch and egg calendar for Michigan rivers, shifted by region or for a specific river.",
};

const ORDER: Region[] = ["southeast-lp", "southwest-lp", "northeast-lp", "northwest-lp", "upper-peninsula"];

export default async function CalendarPage({ searchParams }: PageProps<"/calendar">) {
  const sp = await searchParams;
  const riverParam = typeof sp.river === "string" ? riverById.get(sp.river) : undefined;
  const regionParam = Region.safeParse(sp.region);
  const region: Region = riverParam?.region ?? (regionParam.success ? regionParam.data : "northeast-lp");
  const offset = riverParam?.offsetDays ?? regionOffsetByRegion.get(region)?.offsetDays ?? 0;
  const overrides = new Map(riverParam?.hatchOverrides.map((o) => [o.hatchId, o.window]) ?? []);
  const absent = new Set(riverParam?.absentHatches ?? []);

  const rows = hatches
    .filter((h) => !absent.has(h.id) && (!h.regions.length || h.regions.includes(region)))
    .map((h) => {
      const override = overrides.get(h.id);
      const window = override ?? h.window;
      const off = override ? 0 : offset;
      return { hatch: h, window, off, months: windowMonths(window, off), overridden: Boolean(override) };
    })
    .sort((a, b) => firstMonthKey(a.months) - firstMonthKey(b.months));

  const eggRows = riverParam ? eggSourcesForRiver(riverParam) : eggSources.filter((e) => !e.regions.length || e.regions.includes(region));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Hatch calendar</h1>
        <p className="max-w-2xl text-muted-foreground">
          Baseline windows come from Au Sable and Manistee charts. Pick a DNR fishing-report region to shift them, or a river to apply its own offset and any
          local chart overrides. Live water temperature and degree-day adjustments appear on river pages and in the fly finder.
        </p>
        <div className="flex flex-wrap gap-2">
          {ORDER.map((r) => (
            <Button key={r} asChild size="sm" variant={r === region && !riverParam ? "default" : "outline"}>
              <Link href={`/calendar?region=${r}`}>
                {REGION_LABELS[r]}
                <span className="ml-1 font-mono text-[0.7rem] opacity-70">
                  {(regionOffsetByRegion.get(r)?.offsetDays ?? 0) === 0 ? "0" : `${(regionOffsetByRegion.get(r)?.offsetDays ?? 0) > 0 ? "+" : ""}${regionOffsetByRegion.get(r)?.offsetDays}d`}
                </span>
              </Link>
            </Button>
          ))}
        </div>
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground">Or choose a river</summary>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {rivers.map((r) => (
              <Button key={r.id} asChild size="xs" variant={riverParam?.id === r.id ? "default" : "outline"}>
                <Link href={`/calendar?river=${r.id}`}>{r.name}</Link>
              </Button>
            ))}
          </div>
        </details>
        {riverParam ? (
          <p className="text-sm">
            Showing <span className="font-medium">{riverParam.name}</span> ({REGION_LABELS[riverParam.region]}, {offset > 0 ? "+" : ""}
            {offset} days).{" "}
            <Link href={`/rivers/${riverParam.id}`} className="underline underline-offset-4">
              River profile
            </Link>
          </p>
        ) : null}
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Insect hatches</h2>
        <RowTable
          titleLabel="Hatch"
          stripLabel="Months"
          factLabels={["Window", "Peak", "Size", "Trigger"]}
          titleClassName="min-w-44"
          rows={rows.map(({ hatch, window, off, months, overridden }) => ({
            key: hatch.id,
            title: (
              <div className="flex flex-col gap-0.5">
                <Link href={`/hatches/${hatch.id}`} className="font-medium hover:underline">
                  {hatch.commonName}
                </Link>
                <span className="text-xs italic text-muted-foreground">{hatch.scientificName}</span>
              </div>
            ),
            strip: <MonthGrid active={months} peak={window.peakStart && window.peakEnd ? windowMonths({ start: window.peakStart, end: window.peakEnd }, off) : []} compact />,
            facts: [
              {
                label: "Window",
                value: (
                  <>
                    {formatWindow(window, off)}
                    {overridden ? <Badge variant="outline" className="ml-1 text-[0.7rem]">local</Badge> : null}
                  </>
                ),
                cellClassName: "font-mono text-xs whitespace-nowrap",
              },
              { label: "Peak", value: formatPeak(window, off) ?? "—", cellClassName: "font-mono text-xs whitespace-nowrap" },
              { label: "Size", value: `#${Math.min(...hatch.hookSizes)}–${Math.max(...hatch.hookSizes)}`, cellClassName: "font-mono text-xs whitespace-nowrap" },
              {
                label: "Trigger",
                value: (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <EvidenceBadge evidence={hatch.evidence} />
                    {hatch.trigger.waterTempF ? `${hatch.trigger.waterTempF[0]}–${hatch.trigger.waterTempF[1]} °F water` : hatch.trigger.dateDriven ? "calendar date" : "—"}
                  </span>
                ),
                cellClassName: "text-xs",
              },
            ],
          }))}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Eggs in the drift</h2>
        <p className="text-sm text-muted-foreground">Spawn timing is a water-temperature event, not a regional offset, so these rows do not shift.</p>
        <RowTable
          titleLabel="Egg source"
          stripLabel="Months"
          factLabels={["Size", "Fresh colors", "Trigger"]}
          titleClassName="min-w-44"
          rows={eggRows.map((e) => ({
            key: e.id,
            title: <span className="font-medium">{e.name}</span>,
            strip: <MonthGrid active={e.months} peak={e.peakMonths} compact />,
            facts: [
              { label: "Size", value: e.eggDiameterMm ? `${e.eggDiameterMm[0]}–${e.eggDiameterMm[1]} mm` : "—", cellClassName: "font-mono text-xs whitespace-nowrap" },
              { label: "Fresh colors", value: e.freshColors.join(", "), cellClassName: "text-xs" },
              {
                label: "Trigger",
                value: (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <EvidenceBadge evidence={e.evidence} />
                    {e.waterTempF ? `${e.waterTempF[0]}–${e.waterTempF[1]} °F` : "—"}
                  </span>
                ),
                cellClassName: "text-xs",
              },
            ],
          }))}
        />
      </section>

      <section className="space-y-2 text-sm text-muted-foreground">
        <h2 className="text-base font-medium text-foreground">Regional offsets</h2>
        <ul className="grid gap-2 md:grid-cols-5">
          {regionOffsets.map((r) => (
            <li key={r.region} className="rounded-lg border border-border p-3">
              <p className="font-medium text-foreground">{r.label}</p>
              <p className="font-mono text-xs">
                {r.offsetDays > 0 ? "+" : ""}
                {r.offsetDays} days ({r.offsetRangeDays[0]} to {r.offsetRangeDays[1]})
              </p>
              <p className="mt-1 text-xs">{r.notes}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function firstMonthKey(months: number[]): number {
  // Sort winter hatches (starting Nov/Dec) first so the table reads Jan → Dec by first active month.
  if (!months.length) return 99;
  const sorted = [...months].sort((a, b) => a - b);
  if (sorted.includes(1) && sorted.includes(12)) return 0;
  return sorted[0];
}
