import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { FlyPlaceholder } from "@/components/fly-placeholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { EvidenceBadge } from "@/components/evidence-badge";
import { FlyPhotoCredit } from "@/components/fly-reference-photo";
import { InsectThumb } from "@/components/insect-photo";
import { MonthGrid } from "@/components/month-grid";
import { PreorderPanel } from "@/components/preorder-panel";
import { CATEGORY_LABELS, TECHNIQUE_LABELS, flyById, hatchById, riverById, speciesById, type Fly } from "@/data";
import { collections } from "@/data/collections";
import { flyPhotoSrc, getFlyReferencePhotos } from "@/lib/fly-photos";
import { getHatchHero } from "@/lib/photos";
import { formatUsd, priceFor } from "@/lib/pricing";
import { isShopifyConfigured } from "@/lib/shopify/client";
import { getProductByHandle } from "@/lib/shopify/products";
import { formatMoney } from "@/lib/shopify/types";
import { windowMonths } from "@/lib/season";

/** Flies that belong to a published collection get a store page even before Shopify is connected. */
function collectionMemberships(flyId: string) {
  return collections.flatMap((c) => c.flies.filter((f) => f.flyId === flyId).map((f) => ({ collection: c, entry: f })));
}

export function generateStaticParams() {
  const ids = new Set(collections.flatMap((c) => c.flies.map((f) => f.flyId)));
  return [...ids].map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle).catch(() => null);
  const fly = flyById.get(handle);
  const title = product?.title ?? fly?.name;
  if (!title) return {};
  return { title: `${title} · Shop`, description: product?.description ?? fly?.description };
}

export default async function ProductPage({ params }: PageProps<"/shop/[handle]">) {
  const { handle } = await params;
  const product = await getProductByHandle(handle).catch(() => null);
  const fly = flyById.get(handle);
  if (!product && !fly) notFound();
  const memberships = fly ? collectionMemberships(fly.id) : [];
  // Before launch, only flies in a collection are sellable pages.
  if (!product && memberships.length === 0) notFound();

  const photos = fly ? getFlyReferencePhotos(fly.id) : [];
  const hero = product?.featuredImage ?? null;
  const reference = !hero && photos.length ? photos[0] : null;
  const naturals = fly ? fly.hatchIds.map((id) => hatchById.get(id)).filter((h): h is NonNullable<typeof h> => Boolean(h)) : [];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-2">
          {hero ? (
            <Image src={hero.url} alt={hero.altText ?? product!.title} width={hero.width} height={hero.height} className="w-full rounded-xl border border-border object-cover" sizes="(min-width: 768px) 50vw, 100vw" priority />
          ) : reference ? (
            <figure className="space-y-1">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                <Image src={flyPhotoSrc(reference, "thumb")} alt={`${fly!.name} reference photo`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority />
                <Badge variant="secondary" className="absolute left-3 top-3">
                  Reference photo, not our tie
                </Badge>
              </div>
              <figcaption>
                <FlyPhotoCredit photo={reference} />
              </figcaption>
            </figure>
          ) : (
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border">
              <FlyPlaceholder category={fly!.category} name={fly!.name} />
            </div>
          )}
          {photos.length > 1 && !hero ? (
            <ul className="grid grid-cols-4 gap-2">
              {photos.slice(1, 5).map((p) => (
                <li key={p.url} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                  <Image src={flyPhotoSrc(p, "thumb")} alt={`${fly!.name} reference photo`} fill sizes="120px" className="object-cover" />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="space-y-5">
          <p className="text-sm text-muted-foreground">
            <Link href="/shop" className="hover:underline">
              Shop
            </Link>
            {memberships[0] ? (
              <>
                {" / "}
                <Link href={`/collections/${memberships[0].collection.id}`} className="hover:underline">
                  {memberships[0].collection.title}
                </Link>
              </>
            ) : null}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">{product?.title ?? fly!.name}</h1>
            {fly ? <EvidenceBadge evidence={fly.evidence} /> : null}
          </div>
          {fly ? (
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary">{CATEGORY_LABELS[fly.category]}</Badge>
              {fly.origin ? <Badge variant="outline">{fly.origin}</Badge> : null}
            </div>
          ) : null}
          <p className="font-mono text-lg">{product ? formatMoney(product.priceRange.minVariantPrice) : `${formatUsd(priceFor(fly!))} each`}</p>
          <p className="whitespace-pre-line text-muted-foreground">{product?.description ?? fly!.description}</p>

          {product ? <AddToCartButton variants={product.variants.nodes} /> : <PreorderPanel fly={serializeFly(fly!)} price={priceFor(fly!)} />}

          {!product && !isShopifyConfigured() ? (
            <p className="text-xs text-muted-foreground">
              Checkout opens when the first batch is tied. Prices shown are provisional. Hand-tied to order in Michigan.
            </p>
          ) : null}

          {fly ? (
            <>
              <Separator />
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Fish it for</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {fly.species.map((s) => (
                      <Link key={s} href={`/species/${s}`}>
                        <Badge variant="outline">{speciesById.get(s)?.name ?? s}</Badge>
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Setups</p>
                  <p className="mt-1">{fly.techniques.map((t) => TECHNIQUE_LABELS[t]).join(" · ")}</p>
                </div>
                {naturals.length ? (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Imitates</p>
                    <ul className="mt-1 space-y-1.5">
                      {naturals.map((h) => {
                        const heroPhoto = getHatchHero(h.id);
                        return (
                          <li key={h.id} className="flex items-center gap-2">
                            {heroPhoto ? <InsectThumb photo={heroPhoto} alt={h.commonName} className="size-8" sizes="32px" /> : null}
                            <Link href={`/hatches/${h.id}`} className="underline-offset-4 hover:underline">
                              {h.commonName}
                            </Link>
                            <span className="text-xs text-muted-foreground">{windowMonths(h.window).length} months</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {memberships.length ? (
        <section className="grid gap-4 md:grid-cols-2">
          {memberships.map(({ collection, entry }) => {
            const river = collection.riverId ? riverById.get(collection.riverId) : undefined;
            return (
              <Card key={collection.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    When to fish it{river ? ` on the ${river.name}` : ""}
                  </CardTitle>
                  <CardDescription>
                    Part of the{" "}
                    <Link href={`/collections/${collection.id}`} className="underline underline-offset-4">
                      {collection.title}
                    </Link>
                    . Months the fly finder calls for this pattern here, for {entry.forSpecies.map((s) => speciesById.get(s)?.name.toLowerCase() ?? s).join(", ")}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthGrid active={entry.months} />
                </CardContent>
              </Card>
            );
          })}
          {fly ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pattern notes</CardTitle>
                <CardDescription>Full hatch, egg, and forage links with sources.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href={`/flies/${fly.id}`}>Open the {fly.name} pattern page</Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

/** Only the fields the client-side pre-order panel needs. */
function serializeFly(fly: Fly) {
  return { id: fly.id, name: fly.name, hookSizes: [...fly.hookSizes].sort((a, b) => a - b), colors: fly.colors };
}
