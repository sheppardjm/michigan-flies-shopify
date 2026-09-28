"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatUsd } from "@/lib/pricing";

/**
 * Pre-launch stand-in for the add-to-cart control: lets the shopper pick the
 * size and color they would order and hands off to email until Shopify is live.
 * Swapped for <AddToCartButton> automatically once a product exists.
 */
export function PreorderPanel({ fly, price }: { fly: { id: string; name: string; hookSizes: number[]; colors: string[] }; price: number }) {
  const [size, setSize] = useState(fly.hookSizes[0] ? `#${fly.hookSizes[0]}` : "");
  const [color, setColor] = useState(fly.colors[0] ?? "Standard");
  const [qty, setQty] = useState("6");
  const subject = encodeURIComponent(`Pre-order: ${fly.name}`);
  const body = encodeURIComponent(`I'd like to pre-order the ${fly.name}.\n\nSize: ${size}\nColor: ${color}\nQuantity: ${qty}\n\nhttps://michiganflies.com/shop/${fly.id}`);

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label htmlFor="size">Size</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger id="size" className="w-full">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {fly.hookSizes.map((s) => (
                <SelectItem key={s} value={`#${s}`}>
                  #{s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="color">Color</Label>
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger id="color" className="w-full">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              {(fly.colors.length ? fly.colors : ["Standard"]).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="qty">Quantity</Label>
          <Select value={qty} onValueChange={setQty}>
            <SelectTrigger id="qty" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["3", "6", "12", "24"].map((q) => (
                <SelectItem key={q} value={q}>
                  {q}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {qty} × {formatUsd(price)} = <span className="font-mono text-foreground">{formatUsd(Number(qty) * price)}</span>
        </p>
        <Button asChild>
          <a href={`mailto:orders@michiganflies.com?subject=${subject}&body=${body}`}>
            <Bell data-icon="inline-start" />
            Reserve this fly
          </a>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Sends us an email with your selection. No payment until checkout opens.</p>
    </div>
  );
}
