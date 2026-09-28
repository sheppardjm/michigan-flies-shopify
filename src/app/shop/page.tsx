import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collections } from "@/data/collections";
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
          <Link key={c.id} href={`/collections/${c.id}`} className="group">
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

export default async function ShopPage() {
  if (!isShopifyConfigured()) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Shop</h1>
          <p className="max-w-2xl text-muted-foreground">Flies tied at the bench for Michigan water. Checkout opens soon; the first batch is on the vise now.</p>
        </div>
        <CollectionGrid />
        <Alert>
          <AlertTitle>Checkout is not open yet</AlertTitle>
          <AlertDescription>
            Until then, use the{" "}
            <Link href="/quiz" className="underline underline-offset-4">
              fly finder
            </Link>{" "}
            and pattern pages to plan your box.
          </AlertDescription>
        </Alert>
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
            <Link key={p.id} href={`/shop/${p.handle}`} className="group">
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
