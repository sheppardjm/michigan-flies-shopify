import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collections } from "@/data/collections";
import { CATEGORY_LABELS, FlyCategory, flies } from "@/data";
import { FlyCard } from "@/components/fly-card";
import { getProductsByHandles } from "@/lib/shopify/products";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isShopifyConfigured } from "@/lib/shopify/client";
import { getProducts } from "@/lib/shopify/products";
import { formatMoney } from "@/lib/shopify/types";

export const metadata: Metadata = {
  title: "Shop",
  description: "Hand-tied flies for Michigan rivers.",
};

function CollectionGrid() {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">Boxes by river</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <Link key={c.id} href={`/collections/${c.id}`} className="group card-link-wrap">
            <Card className="h-full transition-colors group-hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="text-base">{c.title}</CardTitle>
                <CardDescription className="line-clamp-3">{c.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">{c.flies.length} patterns</Badge>
                {c.status === "coming-soon" ? <Badge>Coming soon</Badge> : null}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

const CATALOGUE_ORDER: FlyCategory[] = ["dry", "emerger", "nymph", "larva", "wet", "egg", "worm", "streamer", "attractor", "terrestrial", "mouse"];

/** Every pattern, grouped by category, each with its reserve link (or a live product when Shopify has one). */
async function Catalogue() {
  const products = await getProductsByHandles(flies.map((f) => f.shopifyHandle ?? f.id)).catch(() => new Map());
  return (
    <section className="space-y-8" aria-labelledby="catalogue-title">
      <div className="space-y-1">
        <h2 id="catalogue-title" className="text-xl font-semibold tracking-tight">
          Every pattern, by the piece
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {flies.length} patterns, each tied to order. Prices are provisional until checkout opens; reserving costs nothing and we confirm by email.
        </p>
      </div>
      {CATALOGUE_ORDER.map((cat) => {
        const list = flies.filter((f) => f.category === cat).sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
        if (!list.length) return null;
        return (
          <div key={cat} id={cat} className="scroll-mt-20 space-y-3">
            <h3 className="text-base font-semibold">
              {CATEGORY_LABELS[cat]} <span className="font-normal text-muted-foreground">({list.length})</span>
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((f) => (
                <FlyCard key={f.id} fly={f} product={products.get(f.shopifyHandle ?? f.id) ?? null} primary="shop" />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default async function ShopPage() {
  if (!isShopifyConfigured()) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Shop</h1>
          <p className="max-w-2xl text-muted-foreground">Flies tied at the bench for Michigan water. Every pattern on the site can be reserved now; checkout opens with the first batch.</p>
        </div>
        <CollectionGrid />
        <Alert>
          <AlertTitle>Reserve now, pay when checkout opens</AlertTitle>
          <AlertDescription>
            Each store page takes a size, colour and quantity and sends us a note. Nothing is charged until we confirm. Use the{" "}
            <Link href="/quiz" className="underline underline-offset-4">
              fly finder
            </Link>{" "}
            to build a box for a river and date first.
          </AlertDescription>
        </Alert>
        <Catalogue />
      </div>
    );
  }
  const products = await getProducts(48);
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Shop</h1>
        <p className="max-w-2xl text-muted-foreground">Flies tied at the bench for Michigan water. Sizes and colors follow the patterns in the fly finder.</p>
      </div>
      <CollectionGrid />
      {products.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Link key={p.id} href={`/shop/${p.handle}`} className="group card-link-wrap">
              <Card className="h-full overflow-hidden transition-colors group-hover:bg-muted/40">
                {p.featuredImage ? (
                  <Image
                    src={p.featuredImage.url}
                    alt={p.featuredImage.altText ?? p.title}
                    width={p.featuredImage.width}
                    height={p.featuredImage.height}
                    className="aspect-square w-full object-cover"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <div className="aspect-square w-full bg-muted" aria-hidden />
                )}
                <CardHeader>
                  <CardTitle className="text-base">{p.title}</CardTitle>
                  <CardDescription>{formatMoney(p.priceRange.minVariantPrice)}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">{p.availableForSale ? "In stock" : "Sold out"}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="space-y-3 py-10 text-center text-muted-foreground">
            <p>No products listed yet.</p>
            <Button asChild variant="outline">
              <Link href="/flies">Browse the patterns</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
