import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { flyById } from "@/data";
import { getProductByHandle } from "@/lib/shopify/products";
import { formatMoney } from "@/lib/shopify/types";

export async function generateMetadata({ params }: PageProps<"/shop/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle).catch(() => null);
  if (!product) return {};
  return { title: product.title, description: product.description };
}

export default async function ProductPage({ params }: PageProps<"/shop/[handle]">) {
  const { handle } = await params;
  const product = await getProductByHandle(handle).catch(() => null);
  if (!product) notFound();
  const fly = flyById.get(handle);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:py-12 md:grid-cols-2">
      <div>
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            width={product.featuredImage.width}
            height={product.featuredImage.height}
            className="w-full rounded-xl border border-border object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        ) : (
          <div className="aspect-square w-full rounded-xl bg-muted" aria-hidden />
        )}
      </div>
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          <Link href="/shop" className="hover:underline">
            Shop
          </Link>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{product.title}</h1>
        <p className="font-mono text-lg">{formatMoney(product.priceRange.minVariantPrice)}</p>
        <p className="whitespace-pre-line text-muted-foreground">{product.description}</p>
        <AddToCartButton variants={product.variants.nodes} />
        {fly ? (
          <Button asChild variant="outline">
            <Link href={`/flies/${fly.id}`}>When and where to fish the {fly.name}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
