import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/evidence-badge";
import { MonthGrid } from "@/components/month-grid";
import { SourceList } from "@/components/source-list";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { hookSizeLabel } from "@/components/fly-card";
import { InsectThumb, PhotoCredit } from "@/components/insect-photo";
import { FlyReferenceCard } from "@/components/fly-reference-photo";
import { getFlyReferencePhotos } from "@/lib/fly-photos";
import { getHatchHero } from "@/lib/photos";
import { CATEGORY_LABELS, TECHNIQUE_LABELS, eggSourceById, flies, flyById, forageById, hatchById, speciesById } from "@/data";
import { getProductByHandle } from "@/lib/shopify/products";
import { formatMoney } from "@/lib/shopify/types";
import { windowMonths } from "@/lib/season";

export function generateStaticParams() {
  return flies.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: PageProps<"/flies/[id]">): Promise<Metadata> {
  const { id } = await params;
  const fly = flyById.get(id);
  if (!fly) return {};
  return { title: fly.name, description: fly.description };
}

export default async function FlyPage({ params }: PageProps<"/flies/[id]">) {
  const { id } = await params;
  const fly = flyById.get(id);
  if (!fly) notFound();
  const product = await getProductByHandle(fly.shopifyHandle ?? fly.id).catch(() => null);
  const linkedHatches = fly.hatchIds.map((h) => hatchById.get(h)).filter(Boolean);
  const linkedEggs = fly.eggSourceIds.map((e) => eggSourceById.get(e)).filter(Boolean);
  const linkedForage = fly.forageIds.map((f) => forageById.get(f)).filter(Boolean);
  const derivedMonths = new Set<number>(fly.months);
  for (const h of linkedHatches) for (const m of windowMonths(h!.window)) derivedMonths.add(m);
  for (const e of linkedEggs) for (const m of e!.months) derivedMonths.add(m);
  for (const f of linkedForage) for (const m of f!.months) derivedMonths.add(m);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-12">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          <Link href="/flies" className="hover:underline">
            Flies
          </Link>{" "}
          / {CATEGORY_LABELS[fly.category]}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">{fly.name}</h1>
          <EvidenceBadge evidence={fly.evidence} />
        </div>
        {fly.origin ? <p className="text-sm text-muted-foreground">{fly.origin}</p> : null}
        <p className="max-w-3xl">{fly.description}</p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="font-mono">
            {hookSizeLabel(fly.hookSizes)}
          </Badge>
          {fly.colors.map((c) => (
            <Badge key={c} variant="secondary">
              {c}
            </Badge>
          ))}
          {fly.waterClarity !== "any" ? <Badge variant="outline">{fly.waterClarity} water</Badge> : null}
          {fly.timeOfDay.map((t) => (
            <Badge key={t} variant="outline">
              {t.replace(/-/g, " ")}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {!product?.featuredImage ? <FlyReferenceCard photos={getFlyReferencePhotos(fly.id)} flyName={fly.name} /> : null}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Season</CardTitle>
              <CardDescription>Months this pattern is in play across Michigan, derived from what it imitates.</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthGrid active={[...derivedMonths]} />
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Imitates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {linkedHatches.length ? (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">The naturals</p>
                    <ul className="mt-2 space-y-2">
                      {linkedHatches.map((h) => {
                        const hero = getHatchHero(h!.id);
                        return (
                          <li key={h!.id} className="flex items-center gap-3">
                            {hero ? (
                              <Link href={`/hatches/${h!.id}`} className="shrink-0">
                                <InsectThumb photo={hero} alt={h!.commonName} className="size-14" sizes="56px" />
                              </Link>
                            ) : null}
                            <div className="min-w-0">
                              <Link href={`/hatches/${h!.id}`} className="font-medium underline-offset-4 hover:underline">
                                {h!.commonName}
                              </Link>
                              {fly.stages.length ? <span className="ml-1 text-xs text-muted-foreground">({fly.stages.join(", ")})</span> : null}
                              {hero ? <PhotoCredit photo={hero} className="line-clamp-1" /> : null}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
                {linkedEggs.length ? (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Eggs</p>
                    <ul className="mt-1 space-y-0.5">
                      {linkedEggs.map((e) => (
                        <li key={e!.id}>
                          {e!.name}
                          {e!.eggDiameterMm ? <span className="ml-1 font-mono text-xs text-muted-foreground">{e!.eggDiameterMm[0]}–{e!.eggDiameterMm[1]} mm</span> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {linkedForage.length ? (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Forage</p>
                    <ul className="mt-1 space-y-0.5">
                      {linkedForage.map((f) => (
                        <li key={f!.id}>{f!.name}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {!linkedHatches.length && !linkedEggs.length && !linkedForage.length ? <p className="text-muted-foreground">General attractor.</p> : null}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fish it for</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-1">
                  {fly.species.map((s) => (
                    <Link key={s} href={`/species/${s}`}>
                      <Badge variant="secondary">{speciesById.get(s)?.name ?? s}</Badge>
                    </Link>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Setups</p>
                  <ul className="mt-1 space-y-0.5">
                    {fly.techniques.map((t) => (
                      <li key={t}>{TECHNIQUE_LABELS[t]}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          <SourceList sources={fly.sources} />
        </div>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{product ? product.title : "Shop"}</CardTitle>
              <CardDescription>{product ? `From ${formatMoney(product.priceRange.minVariantPrice)}` : "Not listed in the shop yet."}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {product?.featuredImage ? (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  width={product.featuredImage.width}
                  height={product.featuredImage.height}
                  className="w-full rounded-lg border border-border object-cover"
                  sizes="(min-width: 1024px) 340px, 100vw"
                />
              ) : null}
              {product ? (
                <AddToCartButton variants={product.variants.nodes} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  We tie to order. Ask about this pattern when the shop opens, or browse what is <Link href="/shop" className="underline underline-offset-4">available now</Link>.
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
