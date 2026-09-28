import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EvidenceBadge } from "@/components/evidence-badge";
import { MonthGrid } from "@/components/month-grid";
import { REGION_LABELS, Region, eggSources, hatches, regionOffsetByRegion, regionOffsets, riverById, rivers } from "@/data";
import { formatPeak, formatWindow, windowMonths } from "@/lib/season";

export const metadata: Metadata = {
  title: "Hatch calendar",
  description: "Month-by-month hatch and egg calendar for Michigan rivers, shifted by region or for a specific river.",
};

const ORDER: Region[] = ["southern-lp", "mid-lp", "northern-lp", "tip-of-mitt", "upper-peninsula"];

export default async function CalendarPage({ searchParams }: PageProps<"/calendar">) {
  const sp = await searchParams;
  const riverParam = typeof sp.river === "string" ? riverById.get(sp.river) : undefined;
  const regionParam = Region.safeParse(sp.region);
  const region: Region = riverParam?.region ?? (regionParam.success ? regionParam.data : "northern-lp");
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

  const eggRows = eggSources.filter((e) => !e.regions.length || e.regions.includes(region));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Hatch calendar</h1>
        <p className="max-w-2xl text-muted-foreground">
          Baseline windows come from northern Lower Peninsula charts. Pick a region to shift them, or a river to apply its own offset and any
          local chart overrides. Live water temperature and degree-day adjustments appear on river pages and in the fly finder.
        </p>
        <div className="flex flex-wrap gap-2">
          {ORDER.map((r) => (
            <Button key={r} asChild size="sm" variant={r === region && !riverParam ? "default" : "outline"}>
              <Link href={`/calendar?region=${r}`}>
                {REGION_LABELS[r]}
                <span className="ml-1 font-mono text-[10px] opacity-70">
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
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-44">Hatch</TableHead>
                <TableHead className="min-w-64">Months</TableHead>
                <TableHead>Window</TableHead>
                <TableHead>Peak</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Trigger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ hatch, window, off, months, overridden }) => (
                <TableRow key={hatch.id}>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <Link href={`/hatches/${hatch.id}`} className="font-medium hover:underline">
                        {hatch.commonName}
                      </Link>
                      <span className="text-xs italic text-muted-foreground">{hatch.scientificName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <MonthGrid active={months} peak={window.peakStart && window.peakEnd ? windowMonths({ start: window.peakStart, end: window.peakEnd }, off) : []} compact />
                  </TableCell>
                  <TableCell className="font-mono text-xs whitespace-nowrap">
                    {formatWindow(window, off)}
                    {overridden ? <Badge variant="outline" className="ml-1 text-[10px]">local</Badge> : null}
                  </TableCell>
                  <TableCell className="font-mono text-xs whitespace-nowrap">{formatPeak(window, off) ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs whitespace-nowrap">
                    #{Math.min(...hatch.hookSizes)}–{Math.max(...hatch.hookSizes)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <EvidenceBadge evidence={hatch.evidence} />
                      {hatch.trigger.waterTempF ? `${hatch.trigger.waterTempF[0]}–${hatch.trigger.waterTempF[1]} °F water` : hatch.trigger.dateDriven ? "calendar date" : "—"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Eggs in the drift</h2>
        <p className="text-sm text-muted-foreground">Spawn timing is a water-temperature event, not a regional offset, so these rows do not shift.</p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-44">Egg source</TableHead>
                <TableHead className="min-w-64">Months</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Fresh colors</TableHead>
                <TableHead>Trigger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eggRows.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell>
                    <MonthGrid active={e.months} peak={e.peakMonths} compact />
                  </TableCell>
                  <TableCell className="font-mono text-xs whitespace-nowrap">{e.eggDiameterMm ? `${e.eggDiameterMm[0]}–${e.eggDiameterMm[1]} mm` : "—"}</TableCell>
                  <TableCell className="text-xs">{e.freshColors.join(", ")}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <EvidenceBadge evidence={e.evidence} />
                      {e.waterTempF ? `${e.waterTempF[0]}–${e.waterTempF[1]} °F` : "—"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
