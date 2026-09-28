import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { REGION_LABELS, Region, hatches, regionOffsetByRegion, rivers, species } from "@/data";
import { evaluateWindow, formatDate, formatWindow, toUtcDay } from "@/lib/season";

export default function HomePage() {
  const today = toUtcDay(new Date());
  const regions: Region[] = ["southern-lp", "mid-lp", "northern-lp", "tip-of-mitt", "upper-peninsula"];
  const nowByRegion = regions.map((region) => {
    const offset = regionOffsetByRegion.get(region)?.offsetDays ?? 0;
    const active = hatches
      .filter((h) => !h.regions.length || h.regions.includes(region))
      .map((h) => ({ hatch: h, evaluation: evaluateWindow(h.window, today, offset), offset }))
      .filter((x) => x.evaluation.status !== "off")
      .sort((a, b) => (a.evaluation.status === "peak" ? -1 : 1) - (b.evaluation.status === "peak" ? -1 : 1))
      .slice(0, 4);
    return { region, offset, active };
  });

  return (
    <div>
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:py-24">
          <div className="space-y-6">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Michigan rivers · hand-tied flies</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">The right fly for the river, the week, and the fish.</h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Hatch windows, egg drops, and forage for {rivers.length} Michigan rivers, shifted for your region and tuned with live water
              temperature and growing degree days. Then buy the flies, tied here for these waters.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/quiz">
                  Find my flies
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/calendar">Hatch calendar</Link>
              </Button>
            </div>
          </div>
          <Card className="self-start">
            <CardHeader>
              <CardTitle className="text-base">Why sucker spawn is a spring fly</CardTitle>
              <CardDescription>The logic behind the calendar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                White suckers run when the water hits about 43 °F and spawn in a peak around the second week of May. Their pale yellow, 3 mm
                eggs drift for a few weeks and then they are gone. Fishing a yellow egg in October imitates nothing.
              </p>
              <p>
                Every fly here is tied to a hatch, an egg source, or a forage item with its own season and trigger, so the recommendation
                changes as the river does.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Hatching now</h2>
          <p className="text-sm text-muted-foreground">{formatDate(today)}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {nowByRegion.map(({ region, offset, active }) => (
            <Card key={region}>
              <CardHeader>
                <CardTitle className="text-sm">{REGION_LABELS[region]}</CardTitle>
                <CardDescription className="font-mono text-xs">
                  {offset === 0 ? "baseline" : `${offset > 0 ? "+" : ""}${offset} days`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {active.length ? (
                  <ul className="space-y-2 text-sm">
                    {active.map(({ hatch, evaluation, offset: o }) => (
                      <li key={hatch.id} className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={evaluation.status} className="text-[10px]" />
                          <Link href={`/hatches/${hatch.id}`} className="font-medium hover:underline">
                            {hatch.commonName}
                          </Link>
                        </div>
                        <p className="font-mono text-[11px] text-muted-foreground">{formatWindow(hatch.window, o)}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Quiet. Eggs, streamers, and midges carry the day.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-16">
        <h2 className="text-2xl font-semibold tracking-tight">Fish we tie for</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {species.map((s) => (
            <Link key={s.id} href={`/species/${s.id}`} className="group">
              <Card className="h-full transition-colors group-hover:bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-base">{s.name}</CardTitle>
                  <CardDescription className="italic">{s.scientificName}</CardDescription>
                </CardHeader>
                <CardContent className="line-clamp-5 text-sm text-muted-foreground">{s.dietSummary}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
