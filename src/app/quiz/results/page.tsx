import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ConditionsPanel } from "@/components/conditions-panel";
import { EvidenceBadge } from "@/components/evidence-badge";
import { FlyCard } from "@/components/fly-card";
import { InsectThumb } from "@/components/insect-photo";
import { StatusBadge } from "@/components/status-badge";
import { getHatchHero } from "@/lib/photos";
import { REGION_LABELS, SpeciesId, TECHNIQUE_LABELS, Technique, riverById, speciesById, type River } from "@/data";
import { getRiverConditions } from "@/lib/conditions";
import { recommendMulti } from "@/lib/recommend";
import { formatDate, formatPeak, formatWindow, parseIsoDate, toUtcDay } from "@/lib/season";
import { getProductsByHandles } from "@/lib/shopify/products";

export const metadata: Metadata = { title: "Your flies" };

function parseParams(sp: Record<string, string | string[] | undefined>) {
  const river = typeof sp.river === "string" ? riverById.get(sp.river) : undefined;
  const speciesIds =
    typeof sp.species === "string"
      ? [...new Set(sp.species.split(",").map((s) => SpeciesId.safeParse(s)).flatMap((r) => (r.success ? [r.data] : [])))]
      : [];
  const setupParse = Technique.safeParse(sp.setup);
  if (!river || !speciesIds.length || !setupParse.success) return null;
  return { river, speciesIds, technique: setupParse.data, date: parseIsoDate(typeof sp.date === "string" ? sp.date : undefined) };
}

export default async function ResultsPage({ searchParams }: PageProps<"/quiz/results">) {
  const sp = await searchParams;
  const parsed = parseParams(sp);
  if (!parsed) notFound();
  const { river, speciesIds, technique, date } = parsed;
  const speciesNames = speciesIds.map((id) => speciesById.get(id)?.name ?? id);

  // Live conditions only help when the trip is within the forecast horizon.
  const daysOut = Math.round((date.getTime() - toUtcDay(new Date()).getTime()) / 86_400_000);
  const useLive = daysOut >= -1 && daysOut <= 7;

  const editHref = `/quiz?${new URLSearchParams({ river: river.id, date: date.toISOString().slice(0, 10), species: speciesIds.join(","), setup: technique })}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Fly finder results</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {joinNames(speciesNames)} · {river.name}
          </h1>
          <p className="text-muted-foreground">
            {formatDate(date)} · {TECHNIQUE_LABELS[technique]} · {REGION_LABELS[river.region]}
            {river.offsetDays !== 0 ? ` · hatch timing ${river.offsetDays > 0 ? "+" : ""}${river.offsetDays} days vs. Au Sable` : ""}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={editHref}>Change answers</Link>
        </Button>
      </div>

      <Suspense fallback={<ResultsSkeleton />}>
        <Results river={river} speciesIds={speciesIds} technique={technique} date={date} useLive={useLive} />
      </Suspense>
    </div>
  );
}

async function Results({
  river,
  speciesIds,
  technique,
  date,
  useLive,
}: {
  river: River;
  speciesIds: SpeciesId[];
  technique: Technique;
  date: Date;
  useLive: boolean;
}) {
  const conditions = useLive ? await getRiverConditions(river) : null;
  const result = recommendMulti({
    riverId: river.id,
    date,
    speciesIds,
    technique,
    conditions: conditions ? { waterTempF: conditions.waterTempF, agdd50: conditions.gdd?.current[50] ?? null } : undefined,
  });
  const products = await getProductsByHandles(result.recommendations.map((r) => r.fly.shopifyHandle ?? r.fly.id)).catch(() => new Map());
  const multi = result.speciesList.length > 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-8">
        {result.warnings.map((w) => (
          <Alert key={w}>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>{w}</AlertDescription>
          </Alert>
        ))}

        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Top flies</h2>
            <p className="text-xs text-muted-foreground">
              Ranked by hatch, egg, and forage timing for this river and your setup{multi ? "; flies that serve more than one species rank higher" : ""}
            </p>
          </div>
          {result.recommendations.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {result.recommendations.map((r) => (
                <FlyCard
                  key={r.fly.id}
                  fly={r.fly}
                  reasons={r.reasons}
                  score={r.score}
                  product={products.get(r.fly.shopifyHandle ?? r.fly.id) ?? null}
                  tags={multi ? r.forSpecies.map((id) => speciesById.get(id)?.name ?? id) : undefined}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">No matches. Try a different setup.</CardContent>
            </Card>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">What is happening on the river</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hatches</CardTitle>
              <CardDescription>Windows shifted for {river.name}; overrides from local charts where we have them.</CardDescription>
            </CardHeader>
            <CardContent>
              {result.hatches.length ? (
                <ul className="divide-y divide-border">
                  {result.hatches.map((h) => (
                    <li key={h.hatch.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        {getHatchHero(h.hatch.id) ? (
                          <InsectThumb photo={getHatchHero(h.hatch.id)!} alt={h.hatch.commonName} className="size-9" sizes="36px" />
                        ) : null}
                        <StatusBadge status={h.status} />
                        <Link href={`/hatches/${h.hatch.id}`} className="font-medium hover:underline">
                          {h.hatch.commonName}
                        </Link>
                        <span className="text-muted-foreground">
                          #{Math.min(...h.hatch.hookSizes)}–{Math.max(...h.hatch.hookSizes)}
                        </span>
                        <EvidenceBadge evidence={h.hatch.evidence} />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatWindow(h.window, h.offsetDays)}
                        {formatPeak(h.window, h.offsetDays) ? ` · peak ${formatPeak(h.window, h.offsetDays)}` : ""}
                        {h.overridden ? " · local chart" : ""}
                      </span>
                      {h.gateNote ? <p className="w-full text-xs text-muted-foreground">{h.gateNote}</p> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No insect hatches in the calendar for this date.</p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Eggs in the drift</CardTitle>
              </CardHeader>
              <CardContent>
                {result.eggs.length ? (
                  <ul className="space-y-2 text-sm">
                    {result.eggs.map((e) => (
                      <li key={e.egg.id} className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{e.egg.name}</span>
                          {e.peak ? <Badge>Peak</Badge> : null}
                          {!e.spawnerPresent ? <Badge variant="outline">Spawner not documented here this month</Badge> : null}
                          <EvidenceBadge evidence={e.egg.evidence} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {e.egg.eggDiameterMm ? `${e.egg.eggDiameterMm[0]}–${e.egg.eggDiameterMm[1]} mm · ` : ""}
                          {e.egg.freshColors.join(", ")}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No spawning fish dropping eggs for these species this month.</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Forage in season</CardTitle>
              </CardHeader>
              <CardContent>
                {result.forage.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {result.forage.map((f) => (
                      <Badge key={f.id} variant="secondary">
                        {f.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nothing notable beyond insects.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <aside className="space-y-4">
        {conditions ? (
          <ConditionsPanel conditions={conditions} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Live conditions</CardTitle>
              <CardDescription>
                Your date is outside the seven-day forecast window, so these results use the calendar and regional offsets only. Check back the week
                of your trip for water temperature and degree-day adjustments.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        {result.perSpecies.map((r) => (
          <Card key={r.species.id}>
            <CardHeader>
              <CardTitle className="text-base">{r.species.name} here</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                {r.speciesPresence.present ? (r.speciesPresence.peak ? "Peak month for this river." : "Present this month.") : "Not typical this month."}
                {r.speciesPresence.confidence ? <span className="ml-1 text-xs text-muted-foreground">Confidence {r.speciesPresence.confidence}</span> : null}
              </p>
              {r.speciesPresence.note ? <p className="text-muted-foreground">{r.speciesPresence.note}</p> : null}
              <Separator />
              <p className="line-clamp-4 text-muted-foreground">{r.species.dietSummary}</p>
              <Link href={`/species/${r.species.id}`} className="text-primary underline-offset-4 hover:underline">
                About {r.species.name.toLowerCase()}
              </Link>
            </CardContent>
          </Card>
        ))}
        {river.sections.length ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gear rules on this water</CardTitle>
              <CardDescription>From the 2026 digest. Verify with the DNR.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {river.sections.map((s) => (
                  <li key={s.name}>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.regulation.replace(/-/g, " ")}
                      {s.catchAndRelease ? " · catch and release" : ""}
                      {s.openAllYear ? " · open all year" : ""}
                      {s.needsVerification ? " · conflicting sources" : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}
        <Button asChild variant="outline" className="w-full">
          <Link href={`/rivers/${river.id}`}>River profile</Link>
        </Button>
      </aside>
    </div>
  );
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
