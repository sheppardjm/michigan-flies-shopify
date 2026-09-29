import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConditionsPanel } from "@/components/conditions-panel";
import { MonthGrid } from "@/components/month-grid";
import { MonthPicker } from "@/components/month-picker";
import { InsectThumb } from "@/components/insect-photo";
import { RowTable } from "@/components/row-table";
import { SourceList } from "@/components/source-list";
import { StatusBadge } from "@/components/status-badge";
import { REGION_LABELS, flies, hatchById, riverById, rivers, speciesById, type EggSource, type River } from "@/data";
import { StockingSection } from "@/components/stocking-section";
import { FieldBanner } from "@/components/field-print";
import { FieldGallery } from "@/components/field-gallery";
import { fieldPhotosFor } from "@/data/field-photos";
import { getRiverConditions } from "@/lib/conditions";
import { getHatchHero } from "@/lib/photos";
import { eggSourcesForRiver, eggStatusesForRiver, hatchStatusesForRiver, type EggStatus, type HatchStatus } from "@/lib/recommend";
import { getRiverStocking, unmodeledStockedSpecies } from "@/lib/stocking";
import { MONTH_NAMES, formatPeak, formatWindow, isYearRound, monthDayToDate, monthOf, toIsoDate, toUtcDay, windowMonths } from "@/lib/season";

export function generateStaticParams() {
  return rivers.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/rivers/[id]">): Promise<Metadata> {
  const { id } = await params;
  const river = riverById.get(id);
  if (!river) return {};
  return { title: river.name, description: river.character };
}

export default async function RiverPage({ params, searchParams }: PageProps<"/rivers/[id]">) {
  const { id } = await params;
  const river = riverById.get(id);
  if (!river) notFound();
  const today = toUtcDay(new Date());
  const currentMonth = monthOf(today);
  const asked = Number((await searchParams).month);
  const month = Number.isInteger(asked) && asked >= 1 && asked <= 12 ? asked : currentMonth;
  const isCurrent = month === currentMonth;
  // A trip date for the quiz: today, or the 15th of the picked month's next occurrence.
  const tripDate = isCurrent ? today : new Date(Date.UTC(today.getUTCFullYear() + (month < currentMonth ? 1 : 0), month - 1, 15));
  const statuses = hatchStatusesForRiver(river, today);
  const now = isCurrent ? statuses.filter((s) => s.status !== "off") : hatchesInMonth(statuses, month);
  const eggRows = eggRowsFor(river, eggStatusesForRiver(river, tripDate), month);
  const siblings = rivers.filter((r) => r.system === river.system && r.id !== river.id);
  const hero = fieldPhotosFor({ riverId: river.id, role: "river-hero" })[0];
  const prints = fieldPhotosFor({ riverId: river.id, role: "river" }).filter((p) => p.id !== hero?.id);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-12">
      {hero ? <FieldBanner photo={hero} /> : null}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          <Link href="/rivers" className="hover:underline">
            Rivers
          </Link>{" "}
          / {REGION_LABELS[river.region]}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{river.name}</h1>
        <p className="max-w-3xl text-muted-foreground">{river.character}</p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{river.locale}</Badge>
          <Badge variant="secondary">{river.thermalClass}</Badge>
          <Badge variant="secondary">{river.basin.replace(/-/g, " ")}</Badge>
          <Badge variant="outline" className="font-mono">
            hatch offset {river.offsetDays > 0 ? "+" : ""}
            {river.offsetDays} d
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button asChild>
            <Link href={`/quiz?river=${river.id}&date=${toIsoDate(tripDate)}`}>{isCurrent ? "Find flies for this river" : `Find flies for ${MONTH_NAMES[month - 1]}`}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/calendar?river=${river.id}`}>Full-year calendar</Link>
          </Button>
          {siblings.map((s) => (
            <Button key={s.id} asChild variant="ghost" size="sm">
              <Link href={`/rivers/${s.id}`}>{s.name}</Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          <MonthPicker basePath={`/rivers/${river.id}`} selected={month} current={currentMonth} />

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">Fish by month</h2>
            <RowTable
              titleLabel="Species"
              stripLabel="Months"
              factLabels={["Origin", "Confidence"]}
              rows={river.species.map((s) => ({
                key: s.speciesId,
                title: (
                  <>
                    <Link href={`/species/${s.speciesId}`} className="font-medium hover:underline">
                      {speciesById.get(s.speciesId)?.name ?? s.speciesId}
                    </Link>
                    {s.notes ? <p className="max-w-xs text-xs text-muted-foreground">{s.notes}</p> : null}
                  </>
                ),
                strip: <MonthGrid active={s.months} peak={s.peakMonths} highlight={month} compact />,
                facts: [
                  { label: "Origin", value: <span className="capitalize">{s.origin}</span>, cellClassName: "text-xs" },
                  { label: "Confidence", value: s.confidence, cellClassName: "font-mono text-xs" },
                ],
              }))}
            />
            {(() => {
              const extra = unmodeledStockedSpecies(getRiverStocking(river.id));
              if (!extra.length) return null;
              const year = new Date().getUTCFullYear();
              return (
                <p className="text-xs text-muted-foreground">
                  The DNR also plants fish here that this site does not model yet:{" "}
                  {extra
                    .map((e) => `${e.species.toLowerCase()} (${e.lastYear >= year - 5 ? `through ${e.lastYear}` : e.firstYear === e.lastYear ? String(e.lastYear) : `${e.firstYear}–${e.lastYear}`})`)
                    .join(", ")}
                  . See the stocking record below.
                </p>
              );
            })()}
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">{isCurrent ? "Hatching now" : `Hatching in ${MONTH_NAMES[month - 1]}`}</h2>
            {now.length ? (
              <ul className="divide-y divide-border rounded-lg border border-border">
                {now.map((h) => (
                  <li key={h.hatch.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={h.status} />
                      <Link href={`/hatches/${h.hatch.id}`} className="font-medium hover:underline">
                        {h.hatch.commonName}
                      </Link>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatWindow(h.window, h.offsetDays)}
                      {formatPeak(h.window, h.offsetDays) ? ` · peak ${formatPeak(h.window, h.offsetDays)}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No insect hatches in the calendar {isCurrent ? "today" : `in ${MONTH_NAMES[month - 1]}`}. Eggs, streamers, and midges are the play.
              </p>
            )}
          </section>

          {eggRows.length ? (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">Eggs in the drift</h2>
              <p className="max-w-3xl text-sm text-muted-foreground">
                {eggLead(eggRows, isCurrent ? "Right now" : `In ${MONTH_NAMES[month - 1]}`)} Spawning follows water temperature rather than the hatch offset, so these
                months do not shift.
                {eggRows.some((r) => r.status && !r.status.spawnerPresent)
                  ? " The spawners have left, but eggs are still washing out of the redds. They go pale as they age, so rows marked Washing out list the pale colors."
                  : ""}
              </p>
              <RowTable
                titleLabel="Egg source"
                stripLabel="Months"
                factLabels={[MONTH_NAMES[month - 1], "Colors to fish", "Hooks"]}
                titleClassName="min-w-44"
                rows={eggRows.map(({ egg, status }) => {
                  const tieOn = flies.filter((f) => f.eggSourceIds.includes(egg.id)).slice(0, 3);
                  return {
                    key: egg.id,
                    title: (
                      <div className={status ? "flex flex-col gap-0.5" : "flex flex-col gap-0.5 opacity-60"}>
                        <span className="font-medium">{egg.name}</span>
                        {tieOn.length ? (
                          <span className="text-xs text-muted-foreground">
                            Tie on{" "}
                            {tieOn.map((f, i) => (
                              <span key={f.id}>
                                {i ? ", " : ""}
                                <Link href={`/flies/${f.id}`} className="hover:underline">
                                  {f.name}
                                </Link>
                              </span>
                            ))}
                          </span>
                        ) : null}
                      </div>
                    ),
                    strip: <MonthGrid active={egg.months} peak={egg.peakMonths} highlight={month} compact />,
                    facts: [
                      { label: MONTH_NAMES[month - 1], value: <EggStatusLabel status={status} />, cellClassName: "text-xs whitespace-nowrap" },
                      {
                        label: "Colors to fish",
                        value: (status && !status.spawnerPresent && egg.deadColors.length ? egg.deadColors : egg.freshColors).join(", "),
                        cellClassName: "text-xs",
                      },
                      { label: "Hooks", value: `#${Math.min(...egg.hookSizes)}–${Math.max(...egg.hookSizes)}`, cellClassName: "font-mono text-xs whitespace-nowrap" },
                    ],
                  };
                })}
              />
            </section>
          ) : null}

          {river.signatureHatches.length ? (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">Signature hatches</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {river.signatureHatches.map((hid) => {
                  const h = hatchById.get(hid);
                  if (!h) return null;
                  const override = river.hatchOverrides.find((o) => o.hatchId === hid);
                  const hero = getHatchHero(h.id);
                  return (
                    <Card key={hid}>
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          {hero ? (
                            <Link href={`/hatches/${h.id}`} tabIndex={-1} aria-hidden className="shrink-0">
                              <InsectThumb photo={hero} alt="" className="size-16" sizes="64px" />
                            </Link>
                          ) : null}
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <CardTitle className="text-base">
                              <Link href={`/hatches/${h.id}`} className="hover:underline">
                                {h.commonName}
                              </Link>
                            </CardTitle>
                            <CardDescription className="font-mono text-xs">
                              {override ? `${formatWindow(override.window)} (local chart)` : formatWindow(h.window, river.offsetDays)}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">{h.description}</CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          ) : null}

          {prints.length ? (
            <section className="space-y-3" aria-labelledby="field-title">
              <h2 id="field-title" className="text-xl font-semibold tracking-tight">
                From our trips
              </h2>
              <p className="text-sm text-muted-foreground">
                Our own photographs on this water, {formatYearSpan(prints.map((p) => p.takenOn))}. Every fish shown took a fly we tied. Photographs: Jamison Sheppard.
              </p>
              <FieldGallery photos={prints} tilts={[-0.8, 0.6, -0.4, 0.9, -0.7, 0.5]} listClassName="grid grid-cols-2 gap-4 sm:grid-cols-3" sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 50vw" />
            </section>
          ) : null}

          <StockingSection stocking={getRiverStocking(river.id)} />

          {river.sections.length ? (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">Gear rules</h2>
              <p className="text-sm text-muted-foreground">Transcribed from the 2026 Michigan Fishing Regulations digest. Confirm with the DNR before fishing.</p>
              <RowTable
                titleLabel="Reach"
                factLabels={["Tackle", "Season", "Notes"]}
                rows={river.sections.map((s) => ({
                  key: s.name,
                  title: <span className="font-medium">{s.name}</span>,
                  facts: [
                    {
                      label: "Tackle",
                      value: (
                        <>
                          {s.regulation.replace(/-/g, " ")}
                          {s.catchAndRelease ? " · C&R" : ""}
                        </>
                      ),
                      cellClassName: "text-xs",
                    },
                    { label: "Season", value: s.openAllYear ? "All year" : "Trout season", cellClassName: "text-xs" },
                    {
                      label: "Notes",
                      value: (
                        <span className="text-muted-foreground">
                          {s.notes}
                          {s.needsVerification ? <Badge variant="destructive" className="ml-1">verify</Badge> : null}
                        </span>
                      ),
                      cellClassName: "text-xs",
                    },
                  ],
                }))}
              />
            </section>
          ) : null}
        </div>

        <aside className="space-y-4">
          <Suspense fallback={<Skeleton className="h-72" />}>
            <LiveConditions river={river} />
          </Suspense>
          {river.localShops.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Local shops and guides</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {river.localShops.map((s) => (
                    <li key={s.name}>
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                          {s.name}
                        </a>
                      ) : (
                        s.name
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
          <SourceList sources={river.sources} />
        </aside>
      </div>
    </div>
  );
}

/** Hatches whose window touches `month`: peaking that month first, then by start date, year-round hatches last. */
function hatchesInMonth(statuses: HatchStatus[], month: number): HatchStatus[] {
  const out: HatchStatus[] = [];
  for (const s of statuses) {
    if (!windowMonths(s.window, s.offsetDays).includes(month)) continue;
    const { peakStart, peakEnd } = s.window;
    const peak = peakStart && peakEnd && windowMonths({ start: peakStart, end: peakEnd }, s.offsetDays).includes(month);
    out.push({ ...s, status: peak ? "peak" : "active" });
  }
  const start = (s: HatchStatus) => (isYearRound(s.window) ? Infinity : monthDayToDate(s.window.start, 2025, s.offsetDays).getTime());
  return out.sort((a, b) => Number(b.status === "peak") - Number(a.status === "peak") || start(a) - start(b));
}

interface EggRow {
  egg: EggSource;
  /** How the egg stands in the month being shown; undefined when it is not drifting. */
  status?: EggStatus;
}

/** Every egg source this river sees, drifting ones first (peak, then fresh), the rest in the order they arrive. */
function eggRowsFor(river: River, statuses: EggStatus[], month: number): EggRow[] {
  const byId = new Map(statuses.map((s) => [s.egg.id, s]));
  const rank = (r: EggRow) => (!r.status ? 3 : r.status.peak ? 0 : r.status.spawnerPresent ? 1 : 2);
  const monthsUntil = (egg: EggSource) => Math.min(...egg.months.map((m) => (m - month + 12) % 12));
  return eggSourcesForRiver(river)
    .map((egg) => ({ egg, status: byId.get(egg.id) }))
    .sort((a, b) => rank(a) - rank(b) || monthsUntil(a.egg) - monthsUntil(b.egg));
}

function eggLead(rows: EggRow[], when: string): string {
  const drifting = rows.filter((r) => r.status);
  if (!drifting.length) {
    const next = rows[0]?.egg;
    return next ? `${when} no eggs are in the drift here. Next up: ${next.name.replace(/^(?!Chinook|Atlantic)\w/, (c) => c.toLowerCase())}.` : "";
  }
  const short = (r: EggRow) => r.egg.name.replace(/ eggs.*$/, "").replace(/^(?!Chinook|Atlantic)\w/, (c) => c.toLowerCase());
  const peaks = drifting.filter((r) => r.status?.peak && r.status.spawnerPresent).map(short);
  return `${when} the drift carries ${joinAnd(drifting.map(short))} eggs${peaks.length ? `, with ${joinAnd(peaks)} at peak` : ""}.`;
}

function joinAnd(items: string[]): string {
  return items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : items[0];
}

function EggStatusLabel({ status }: { status?: EggStatus }) {
  if (!status) return <span className="text-muted-foreground">Not drifting</span>;
  if (status.peak && status.spawnerPresent) return <StatusBadge status="peak" />;
  if (!status.spawnerPresent) return <span className="text-muted-foreground">Washing out</span>;
  return (
    <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
      Drifting
    </Badge>
  );
}

async function LiveConditions({ river }: { river: River }) {
  const conditions = await getRiverConditions(river);
  return <ConditionsPanel conditions={conditions} />;
}

function formatYearSpan(dates: string[]): string {
  const years = [...new Set(dates.map((d) => d.slice(0, 4)))].sort();
  return years.length > 1 ? `${years[0]} to ${years[years.length - 1]}` : years[0];
}
