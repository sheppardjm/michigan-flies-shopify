import type { Fly, FlyCategory } from "@/data";

/**
 * Placeholder pricing until real prices are set in Shopify. Shared by the
 * Shopify CSV export and the pre-launch store pages so they agree.
 */
export const PRICE_BY_CATEGORY: Record<FlyCategory, number> = {
  dry: 3.0,
  emerger: 3.0,
  nymph: 2.75,
  larva: 2.75,
  wet: 2.75,
  egg: 2.25,
  worm: 2.25,
  terrestrial: 3.5,
  attractor: 3.5,
  streamer: 6.5,
  mouse: 8.0,
};

/** Articulated or oversized streamers cost more to tie. */
const BIG_STREAMER = /dungeon|circus peanut|drunk|butt monkey|boogie|intruder|articulated|zoo cougar|double deceiver/i;

export function priceFor(fly: Fly): number {
  let p = PRICE_BY_CATEGORY[fly.category];
  if (fly.category === "streamer" && BIG_STREAMER.test(fly.name)) p = 9.5;
  return p;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}
