import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/evidence-badge";
import { MonthGrid } from "@/components/month-grid";
import { InsectThumb } from "@/components/insect-photo";
import { InsectOrder, hatches } from "@/data";
import { getHatchHero } from "@/lib/photos";
import { formatWindow, windowMonths } from "@/lib/season";

export const metadata: Metadata = {
  title: "Hatches",
  description: "Michigan mayfly, caddis, stonefly, and midge hatches with emergence windows, triggers, and the flies that match them.",
};

const ORDER_LABELS: Record<InsectOrder, string> = {
  mayfly: "Mayflies",
  caddis: "Caddisflies",
  stonefly: "Stoneflies",
  midge: "Midges",
  other: "Other aquatic insects",
};

export default function HatchesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Hatches</h1>
        <p className="max-w-2xl text-muted-foreground">
          {hatches.length} insects that matter on Michigan rivers. Windows shown are the Au Sable baseline; the calendar and river
          pages shift them for your water.
        </p>
      </div>
      {InsectOrder.options.map((order) => {
        const list = hatches.filter((h) => h.order === order).sort((a, b) => windowMonths(a.window)[0] - windowMonths(b.window)[0]);
        if (!list.length) return null;
        return (
          <section key={order} className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">{ORDER_LABELS[order]}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((h) => {
                const hero = getHatchHero(h.id);
                return (
                <Link key={h.id} href={`/hatches/${h.id}`} className="group card-link-wrap">
                  <Card className="h-full transition-colors group-hover:bg-muted/40">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        {hero ? <InsectThumb photo={hero} alt={h.commonName} className="size-16 shrink-0" sizes="64px" /> : <div className="size-16 shrink-0 rounded-lg bg-muted" aria-hidden />}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base">{h.commonName}</CardTitle>
                            <EvidenceBadge evidence={h.evidence} />
                          </div>
                          <CardDescription className="line-clamp-2 italic">{h.scientificName}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <MonthGrid active={windowMonths(h.window)} compact />
                      <div className="flex flex-wrap gap-1 text-xs">
                        <Badge variant="outline" className="font-mono">
                          {formatWindow(h.window)}
                        </Badge>
                        <Badge variant="outline" className="font-mono">
                          #{Math.min(...h.hookSizes)}–{Math.max(...h.hookSizes)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
