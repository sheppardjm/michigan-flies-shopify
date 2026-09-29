import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/evidence-badge";
import { FishPhotos } from "@/components/fish-photos";
import { FlyCard } from "@/components/fly-card";
import { MonthGrid } from "@/components/month-grid";
import { RowTable } from "@/components/row-table";
import { SourceList } from "@/components/source-list";
import { SpeciesId, eggSources, flies, rivers, species, speciesById } from "@/data";
import { getSpeciesPhotos } from "@/lib/photos";
import { monthName } from "@/lib/recommend";

export function generateStaticParams() {
  return species.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/species/[id]">): Promise<Metadata> {
  const { id } = await params;
  const s = speciesById.get(id as SpeciesId);
  if (!s) return {};
  return { title: s.name, description: s.description };
}

export default async function SpeciesPage({ params }: PageProps<"/species/[id]">) {
  const { id } = await params;
  const parsed = SpeciesId.safeParse(id);
  const s = parsed.success ? speciesById.get(parsed.data) : undefined;
  if (!s) notFound();
  const topFlies = flies.filter((f) => f.species.includes(s.id)).sort((a, b) => b.priority - a.priority).slice(0, 8);
  const where = rivers.filter((r) => r.species.some((x) => x.speciesId === s.id));
  const eggsEaten = eggSources.filter((e) => e.eatenBy.includes(s.id));
  const photos = getSpeciesPhotos(s.id);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-12">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          <Link href="/species" className="hover:underline">
            Fish
          </Link>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{s.name}</h1>
        <p className="italic text-muted-foreground">{s.scientificName}</p>
        <p className="max-w-3xl">{s.description}</p>
        <div className="flex flex-wrap gap-1.5">
          <Badge>{s.feedingModel.replace(/-/g, " ")}</Badge>
          {s.secondaryFeedingModel ? <Badge variant="secondary">{s.secondaryFeedingModel.replace(/-/g, " ")}</Badge> : null}
        </div>
        <Button asChild>
          <Link href={`/quiz?species=${s.id}`}>Find flies for {s.name.toLowerCase()}</Link>
        </Button>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          <section>
            <FishPhotos name={s.name} adults={photos.adults} juveniles={photos.juveniles} />
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">What they eat in the river</h2>
            <p className="text-sm text-muted-foreground">{s.dietSummary}</p>
            <RowTable
              titleLabel="Food"
              stripLabel="Months"
              factLabels={["Evidence"]}
              rows={s.diet.map((d, i) => ({
                key: String(i),
                title: <span className="text-sm">{d.items.join(", ")}</span>,
                strip: <MonthGrid active={d.months} compact />,
                facts: [{ label: "Evidence", value: <EvidenceBadge evidence={d.evidence} /> }],
              }))}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">Runs and spawn</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {s.runs.map((r, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-sm capitalize">{r.type} run</CardTitle>
                    <CardDescription>{r.notes}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <MonthGrid active={r.months} peak={r.peakMonths} compact />
                    <EvidenceBadge evidence={r.evidence} />
                  </CardContent>
                </Card>
              ))}
              {s.spawn ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Spawning</CardTitle>
                    <CardDescription>
                      {s.spawn.months.map(monthName).join(", ")}
                      {s.spawn.waterTempF ? ` · ${s.spawn.waterTempF[0]}–${s.spawn.waterTempF[1]} °F` : ""}
                      {s.spawn.eggDiameterMm ? ` · eggs ${s.spawn.eggDiameterMm[0]}–${s.spawn.eggDiameterMm[1]} mm` : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <MonthGrid active={s.spawn.months} compact />
                    {s.spawn.eggColors.length ? <p className="text-xs text-muted-foreground">Egg colors: {s.spawn.eggColors.join(", ")}</p> : null}
                    {s.spawn.notes ? <p className="text-xs text-muted-foreground">{s.spawn.notes}</p> : null}
                    <EvidenceBadge evidence={s.spawn.evidence} />
                  </CardContent>
                </Card>
              ) : null}
            </div>
            {s.regulationsNote ? <p className="text-sm text-muted-foreground">{s.regulationsNote}</p> : null}
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">Staple flies</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {topFlies.map((f) => (
                <FlyCard key={f.id} fly={f} />
              ))}
            </div>
            <Button asChild variant="outline">
              <Link href={`/flies?species=${s.id}`}>All {s.name.toLowerCase()} flies</Link>
            </Button>
          </section>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Where to find them</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="columns-2 space-y-1 text-sm">
                {where.map((r) => (
                  <li key={r.id}>
                    <Link href={`/rivers/${r.id}`} className="underline-offset-4 hover:underline">
                      {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {eggsEaten.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Eggs they key on</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {eggsEaten.map((e) => (
                    <li key={e.id}>
                      <p className="font-medium">{e.name}</p>
                      <MonthGrid active={e.months} peak={e.peakMonths} compact />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
          <SourceList sources={s.sources} />
        </aside>
      </div>
    </div>
  );
}
