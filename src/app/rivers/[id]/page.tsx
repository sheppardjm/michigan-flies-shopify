import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConditionsPanel } from "@/components/conditions-panel";
import { MonthGrid } from "@/components/month-grid";
import { SourceList } from "@/components/source-list";
import { StatusBadge } from "@/components/status-badge";
import { REGION_LABELS, hatchById, riverById, rivers, speciesById, type River } from "@/data";
import { getRiverConditions } from "@/lib/conditions";
import { hatchStatusesForRiver } from "@/lib/recommend";
import { formatPeak, formatWindow, monthOf, toIsoDate, toUtcDay } from "@/lib/season";

export function generateStaticParams() {
  return rivers.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/rivers/[id]">): Promise<Metadata> {
  const { id } = await params;
  const river = riverById.get(id);
  if (!river) return {};
  return { title: river.name, description: river.character };
}

export default async function RiverPage({ params }: PageProps<"/rivers/[id]">) {
  const { id } = await params;
  const river = riverById.get(id);
  if (!river) notFound();
  const today = toUtcDay(new Date());
  const month = monthOf(today);
  const statuses = hatchStatusesForRiver(river, today);
  const now = statuses.filter((s) => s.status !== "off");
  const siblings = rivers.filter((r) => r.system === river.system && r.id !== river.id);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-12">
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
            <Link href={`/quiz?river=${river.id}&date=${toIsoDate(today)}`}>Find flies for this river</Link>
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

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">Fish by month</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Species</TableHead>
                    <TableHead className="min-w-64">Months</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {river.species.map((s) => (
                    <TableRow key={s.speciesId}>
                      <TableCell>
                        <Link href={`/species/${s.speciesId}`} className="font-medium hover:underline">
                          {speciesById.get(s.speciesId)?.name ?? s.speciesId}
                        </Link>
                        {s.notes ? <p className="max-w-xs text-xs text-muted-foreground">{s.notes}</p> : null}
                      </TableCell>
                      <TableCell>
                        <MonthGrid active={s.months} peak={s.peakMonths} highlight={month} compact />
                      </TableCell>
                      <TableCell className="text-xs capitalize">{s.origin}</TableCell>
                      <TableCell className="font-mono text-xs">{s.confidence}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">Hatching now</h2>
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
              <p className="text-sm text-muted-foreground">No insect hatches in the calendar today. Eggs, streamers, and midges are the play.</p>
            )}
          </section>

          {river.signatureHatches.length ? (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">Signature hatches</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {river.signatureHatches.map((hid) => {
                  const h = hatchById.get(hid);
                  if (!h) return null;
                  const override = river.hatchOverrides.find((o) => o.hatchId === hid);
                  return (
                    <Card key={hid}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          <Link href={`/hatches/${h.id}`} className="hover:underline">
                            {h.commonName}
                          </Link>
                        </CardTitle>
                        <CardDescription className="font-mono text-xs">
                          {override ? `${formatWindow(override.window)} (local chart)` : formatWindow(h.window, river.offsetDays)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">{h.description}</CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          ) : null}

          {river.sections.length ? (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">Gear rules</h2>
              <p className="text-sm text-muted-foreground">Transcribed from the 2026 Michigan Fishing Regulations digest. Confirm with the DNR before fishing.</p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reach</TableHead>
                      <TableHead>Tackle</TableHead>
                      <TableHead>Season</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {river.sections.map((s) => (
                      <TableRow key={s.name}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-xs">
                          {s.regulation.replace(/-/g, " ")}
                          {s.catchAndRelease ? " · C&R" : ""}
                        </TableCell>
                        <TableCell className="text-xs">{s.openAllYear ? "All year" : "Trout season"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {s.notes}
                          {s.needsVerification ? <Badge variant="destructive" className="ml-1">verify</Badge> : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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

async function LiveConditions({ river }: { river: River }) {
  const conditions = await getRiverConditions(river);
  return <ConditionsPanel conditions={conditions} />;
}
