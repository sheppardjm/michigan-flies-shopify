import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/evidence-badge";
import { FlyCard } from "@/components/fly-card";
import { MonthGrid } from "@/components/month-grid";
import { RowTable } from "@/components/row-table";
import { SourceList } from "@/components/source-list";
import { InsectGallery } from "@/components/insect-photo";
import { REGION_LABELS, flies, hatchById, hatches, regionOffsets, rivers } from "@/data";
import { getHatchPhotos } from "@/lib/photos";
import { formatPeak, formatWindow, windowMonths } from "@/lib/season";

export function generateStaticParams() {
  return hatches.map((h) => ({ id: h.id }));
}

export async function generateMetadata({ params }: PageProps<"/hatches/[id]">): Promise<Metadata> {
  const { id } = await params;
  const hatch = hatchById.get(id);
  if (!hatch) return {};
  return { title: `${hatch.commonName} (${hatch.scientificName})`, description: hatch.description };
}

export default async function HatchPage({ params }: PageProps<"/hatches/[id]">) {
  const { id } = await params;
  const hatch = hatchById.get(id);
  if (!hatch) notFound();
  const matching = flies.filter((f) => f.hatchIds.includes(hatch.id)).sort((a, b) => b.priority - a.priority);
  const signatureRivers = rivers.filter((r) => r.signatureHatches.includes(hatch.id));
  const overrides = rivers.filter((r) => r.hatchOverrides.some((o) => o.hatchId === hatch.id));
  const photos = getHatchPhotos(hatch.id);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-12">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          <Link href="/hatches" className="hover:underline">
            Hatches
          </Link>{" "}
          / {hatch.order}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">{hatch.commonName}</h1>
          <EvidenceBadge evidence={hatch.evidence} />
        </div>
        <p className="italic text-muted-foreground">{hatch.scientificName}</p>
        {hatch.aliases.length ? <p className="text-sm text-muted-foreground">Also called {hatch.aliases.join(", ")}.</p> : null}
        <p className="max-w-3xl">{hatch.description}</p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="font-mono">
            #{Math.min(...hatch.hookSizes)}–{Math.max(...hatch.hookSizes)}
          </Badge>
          {hatch.timeOfDay.map((t) => (
            <Badge key={t} variant="secondary">
              {t.replace(/-/g, " ")}
            </Badge>
          ))}
          {hatch.keyStages.map((s) => (
            <Badge key={s} variant="outline">
              {s}
            </Badge>
          ))}
          {hatch.colors.map((c) => (
            <Badge key={c} variant="outline">
              {c}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          {photos.length ? (
            <section className="space-y-2">
              <InsectGallery photos={photos} alt={`${hatch.commonName} (${photos[0].taxonName || hatch.scientificName})`} />
            </section>
          ) : null}

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">Timing by region</h2>
            <RowTable
              titleLabel="Region"
              stripLabel="Months"
              factLabels={["Window", "Peak"]}
              rows={[
                ...regionOffsets
                  .filter((r) => !hatch.regions.length || hatch.regions.includes(r.region))
                  .map((r) => ({
                    key: r.region,
                    title: <span className="font-medium">{REGION_LABELS[r.region]}</span>,
                    strip: <MonthGrid active={windowMonths(hatch.window, r.offsetDays)} compact />,
                    facts: [
                      { label: "Window", value: formatWindow(hatch.window, r.offsetDays), cellClassName: "font-mono text-xs whitespace-nowrap" },
                      { label: "Peak", value: formatPeak(hatch.window, r.offsetDays) ?? "—", cellClassName: "font-mono text-xs whitespace-nowrap" },
                    ],
                  })),
                ...overrides.map((r) => {
                  const o = r.hatchOverrides.find((x) => x.hatchId === hatch.id)!;
                  return {
                    key: r.id,
                    title: (
                      <>
                        <Link href={`/rivers/${r.id}`} className="font-medium hover:underline">
                          {r.name}
                        </Link>
                        <span className="ml-1 text-xs text-muted-foreground">local chart</span>
                      </>
                    ),
                    strip: <MonthGrid active={windowMonths(o.window)} compact />,
                    facts: [
                      { label: "Window", value: formatWindow(o.window), cellClassName: "font-mono text-xs whitespace-nowrap" },
                      { label: "Peak", value: formatPeak(o.window) ?? "—", cellClassName: "font-mono text-xs whitespace-nowrap" },
                    ],
                  };
                }),
              ]}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">Flies that match</h2>
            {matching.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {matching.map((f) => (
                  <FlyCard key={f.id} fly={f} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No patterns linked yet.</p>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What triggers it</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {hatch.trigger.waterTempF ? (
                <p>
                  Water temperature{" "}
                  <span className="font-mono">
                    {hatch.trigger.waterTempF[0]}–{hatch.trigger.waterTempF[1]} °F
                  </span>
                </p>
              ) : null}
              {hatch.trigger.degreeDays ? (
                <p>
                  About{" "}
                  <span className="font-mono">
                    {hatch.trigger.degreeDays.low.toLocaleString()}–{hatch.trigger.degreeDays.high.toLocaleString()}
                  </span>{" "}
                  degree days above {hatch.trigger.degreeDays.baseC} °C water
                  {hatch.trigger.degreeDays.notes ? ` (${hatch.trigger.degreeDays.notes})` : ""}
                </p>
              ) : null}
              {hatch.trigger.dateDriven ? <p>Calendar date predicts this hatch better than water temperature in Michigan.</p> : null}
              {hatch.trigger.notes ? <p className="text-muted-foreground">{hatch.trigger.notes}</p> : null}
              {!hatch.trigger.waterTempF && !hatch.trigger.degreeDays && !hatch.trigger.dateDriven && !hatch.trigger.notes ? (
                <p className="text-muted-foreground">No documented trigger beyond the calendar.</p>
              ) : null}
            </CardContent>
          </Card>
          {signatureRivers.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rivers known for it</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {signatureRivers.map((r) => (
                    <li key={r.id}>
                      <Link href={`/rivers/${r.id}`} className="underline-offset-4 hover:underline">
                        {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
          <SourceList sources={hatch.sources} />
        </aside>
      </div>
    </div>
  );
}
