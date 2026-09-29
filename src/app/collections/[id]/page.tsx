import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlyCard } from "@/components/fly-card";
import { MonthGrid } from "@/components/month-grid";
import { CATEGORY_LABELS, FlyCategory, flyById, riverById, speciesById } from "@/data";
import { collectionById, collections } from "@/data/collections";
import { getProductsByHandles } from "@/lib/shopify/products";
import { toIsoDate, toUtcDay } from "@/lib/season";

export function generateStaticParams() {
  return collections.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[id]">): Promise<Metadata> {
  const { id } = await params;
  const c = collectionById.get(id);
  if (!c) return {};
  return { title: c.title, description: c.description };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[id]">) {
  const { id } = await params;
  const collection = collectionById.get(id);
  if (!collection) notFound();
  const river = collection.riverId ? riverById.get(collection.riverId) : undefined;
  const products = await getProductsByHandles(collection.flies.map((f) => flyById.get(f.flyId)?.shopifyHandle ?? f.flyId)).catch(() => new Map());
  const groups = FlyCategory.options
    .map((cat) => ({ cat, items: collection.flies.filter((f) => flyById.get(f.flyId)?.category === cat) }))
    .filter((g) => g.items.length);
  const today = toUtcDay(new Date());

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-12">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          <Link href="/shop" className="hover:underline">
            Shop
          </Link>{" "}
          / Collection
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{collection.title}</h1>
        <p className="max-w-3xl text-muted-foreground">{collection.description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{collection.flies.length} patterns</Badge>
          {collection.status === "coming-soon" ? <Badge>Tying now, in the shop soon</Badge> : null}
          {river ? (
            <Button asChild size="sm" variant="outline">
              <Link href={`/rivers/${river.id}`}>{river.name} profile</Link>
            </Button>
          ) : null}
          {river ? (
            <Button asChild size="sm" variant="outline">
              <Link href={`/quiz?river=${river.id}&date=${toIsoDate(today)}`}>Fly finder for this river</Link>
            </Button>
          ) : null}
        </div>
      </div>

      {river ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Why these flies</CardTitle>
            <CardDescription>
              Each pattern earned its place by ranking in the top four for at least one month, fish, and setup on the {river.name}. The month strip shows
              when the fly finder calls for it here.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
            {river.species.map((s) => (
              <div key={s.speciesId} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
                <span className="font-medium">{speciesById.get(s.speciesId)?.name}</span>
                <MonthGrid active={s.months} peak={s.peakMonths} compact className="w-40" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {groups.map(({ cat, items }) => (
        <section key={cat} className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">
            {CATEGORY_LABELS[cat]} <span className="ml-1 text-sm font-normal text-muted-foreground">{items.length}</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const fly = flyById.get(item.flyId);
              if (!fly) return null;
              return (
                <div key={fly.id} className="space-y-1.5">
                  <FlyCard fly={fly} product={products.get(fly.shopifyHandle ?? fly.id) ?? null} />
                  <div className="flex items-center gap-2 px-1">
                    <MonthGrid active={item.months} compact className="flex-1" />
                    <span className="text-[0.7rem] text-muted-foreground">{item.forSpecies.map((s) => speciesById.get(s)?.name.split(" ")[0] ?? s).join(" · ")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
