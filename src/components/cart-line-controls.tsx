"use client";

import { useTransition } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeFromCart, updateCartLine } from "@/lib/shopify/cart-actions";

export function CartLineControls({ lineId, quantity }: { lineId: string; quantity: number }) {
  const [pending, startTransition] = useTransition();
  const set = (q: number) =>
    startTransition(async () => {
      if (q <= 0) await removeFromCart(lineId);
      else await updateCartLine(lineId, q);
    });
  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="icon-xs" aria-label="Decrease quantity" disabled={pending} onClick={() => set(quantity - 1)}>
        <Minus />
      </Button>
      <span className="w-6 text-center font-mono text-sm tabular-nums">{quantity}</span>
      <Button variant="outline" size="icon-xs" aria-label="Increase quantity" disabled={pending} onClick={() => set(quantity + 1)}>
        <Plus />
      </Button>
      <Button variant="ghost" size="icon-xs" aria-label="Remove" disabled={pending} onClick={() => set(0)} className="ml-1">
        <Trash2 />
      </Button>
    </div>
  );
}
