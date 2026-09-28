import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { REGION_LABELS, Region, rivers, speciesById } from "@/data";

export const metadata: Metadata = {
  title: "Rivers",
  description: "Michigan trout, steelhead, and salmon rivers with hatch timing, species by month, gauges, and gear rules.",
};

const ORDER: Region[] = ["southeast-lp", "southwest-lp", "northeast-lp", "northwest-lp", "upper-peninsula"];

export default function RiversPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Rivers</h1>
        <p className="max-w-2xl text-muted-foreground">
          {rivers.length} rivers and reaches, grouped by the region that sets their hatch offset. Each profile shows which fish are in the river by
          month, signature hatches, live gauges, and the gear rules from the 2026 digest.
        </p>
      </div>
      {ORDER.map((region) => {
        const list = rivers.filter((r) => r.region === region);
        if (!list.length) return null;
        return (
          <section key={region} id={region} className="scroll-mt-20 space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">{REGION_LABELS[region]}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((r) => (
                <Link key={r.id} href={`/rivers/${r.id}`} className="group">
                  <Card className="h-full transition-colors group-hover:bg-muted/40">
                    <CardHeader>
                      <CardTitle className="text-base">{r.name}</CardTitle>
                      <CardDescription>
                        {r.locale} · {r.thermalClass} · {r.offsetDays === 0 ? "baseline" : `${r.offsetDays > 0 ? "+" : ""}${r.offsetDays} d`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-1">
                      {r.species.map((s) => (
                        <Badge key={s.speciesId} variant="secondary" className="text-[10px]">
                          {speciesById.get(s.speciesId)?.name ?? s.speciesId}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
