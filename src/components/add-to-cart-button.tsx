"use client";

import { useState, useTransition } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addToCart } from "@/lib/shopify/cart-actions";
import { formatMoney, type ProductVariant } from "@/lib/shopify/types";

export function AddToCartButton({ variants }: { variants: ProductVariant[] }) {
  const available = variants.filter((v) => v.availableForSale);
  const [variantId, setVariantId] = useState(available[0]?.id ?? "");
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!available.length) {
    return (
      <Button disabled className="w-full">
        Sold out
      </Button>
    );
  }
  const selected = available.find((v) => v.id === variantId);

  return (
    <div className="space-y-3">
      {available.length > 1 ? (
        <div className="grid gap-1.5">
          <Label htmlFor="variant">Size / color</Label>
          <Select value={variantId} onValueChange={setVariantId}>
            <SelectTrigger id="variant" className="w-full">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              {available.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.title} · {formatMoney(v.price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      <Button
        className="w-full"
        disabled={pending || !variantId}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await addToCart(variantId);
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            } catch (e) {
              setError((e as Error).message);
            }
          });
        }}
      >
        {added ? <Check data-icon="inline-start" /> : <ShoppingBag data-icon="inline-start" />}
        {added ? "Added" : pending ? "Adding…" : `Add to cart${selected ? ` · ${formatMoney(selected.price)}` : ""}`}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
