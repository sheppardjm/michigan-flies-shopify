import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartLineControls } from "@/components/cart-line-controls";
import { getCart } from "@/lib/shopify/cart-actions";
import { isShopifyConfigured } from "@/lib/shopify/client";
import { formatMoney } from "@/lib/shopify/types";

export const metadata: Metadata = { title: "Cart" };

export default async function CartPage() {
  const cart = isShopifyConfigured() ? await getCart().catch(() => null) : null;
  const lines = cart?.lines.nodes ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Cart</h1>
      {lines.length === 0 ? (
        <Card>
          <CardContent className="space-y-3 py-10 text-center text-muted-foreground">
            <p>Your cart is empty.</p>
            <Button asChild variant="outline">
              <Link href="/quiz">Find flies for your trip</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-4">
            <ul className="divide-y divide-border">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 py-4">
                  {line.merchandise.image ? (
                    <Image
                      src={line.merchandise.image.url}
                      alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                      width={80}
                      height={80}
                      className="size-20 rounded-lg border border-border object-cover"
                    />
                  ) : (
                    <div className="size-20 rounded-lg bg-muted" aria-hidden />
                  )}
                  <div className="flex flex-1 flex-col gap-1">
                    <Link href={`/shop/${line.merchandise.product.handle}`} className="font-medium hover:underline">
                      {line.merchandise.product.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{line.merchandise.title}</p>
                    <CartLineControls lineId={line.id} quantity={line.quantity} />
                  </div>
                  <p className="font-mono text-sm">{formatMoney(line.cost.totalAmount)}</p>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="font-mono text-lg">{formatMoney(cart!.cost.subtotalAmount)}</p>
            </div>
            <Button asChild className="w-full" size="lg">
              <a href={cart!.checkoutUrl}>Checkout</a>
            </Button>
            <p className="text-center text-xs text-muted-foreground">Checkout is handled securely by Shopify.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
