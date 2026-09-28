import { isShopifyConfigured, shopifyFetch } from "./client";
import { PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY } from "./queries";
import type { Product } from "./types";

/** Products list; returns [] when the store is not yet connected so resource pages still render. */
export async function getProducts(first = 24, query?: string): Promise<Product[]> {
  if (!isShopifyConfigured()) return [];
  const data = await shopifyFetch<{ products: { nodes: Product[] } }>(PRODUCTS_QUERY, { first, query });
  return data.products.nodes;
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured()) return null;
  const data = await shopifyFetch<{ product: Product | null }>(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data.product;
}

/** Look up products for a set of fly ids, using the fly id as the Shopify product handle by convention. */
export async function getProductsByHandles(handles: string[]): Promise<Map<string, Product>> {
  const out = new Map<string, Product>();
  if (!isShopifyConfigured() || handles.length === 0) return out;
  const results = await Promise.all(handles.map((h) => getProductByHandle(h).catch(() => null)));
  results.forEach((p, i) => {
    if (p) out.set(handles[i], p);
  });
  return out;
}
