import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthGrid } from "@/components/month-grid";
import { species } from "@/data";

export const metadata: Metadata = {
  title: "Fish",
  description: "How brown trout, brook trout, steelhead, and the salmon feed in Michigan rivers, and when they run and spawn.",
};

export default function SpeciesIndexPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Fish</h1>
        <p className="max-w-2xl text-muted-foreground">
          Eight species, four feeding models. Whether a fish is matching a hatch, hunting sculpins, keying on eggs, or striking out of aggression
          decides the fly box more than the calendar does.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {species.map((s) => (
          <Link key={s.id} href={`/species/${s.id}`} className="group">
            <Card className="h-full transition-colors group-hover:bg-muted/40">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{s.name}</CardTitle>
                  <Badge variant="secondary">{s.feedingModel.replace(/-/g, " ")}</Badge>
                </div>
                <CardDescription className="italic">{s.scientificName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{s.dietSummary}</p>
                {s.spawn ? (
                  <div className="space-y-1">
                    <p className="text-xs">Spawn</p>
                    <MonthGrid active={s.spawn.months} compact />
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
