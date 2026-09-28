/**
 * Shopify Storefront API client, following the Vercel Marketplace Shopify
 * integration guide (`vercel integration guide shopify --framework nextjs`).
 * Env vars SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN are
 * provisioned by `vercel integration add shopify` and pulled with `vercel env pull`.
 */

const API_VERSION = "2025-01";

type ShopifyResponse<T> = {
  data: T;
  errors?: { message: string }[];
};

export function isShopifyConfigured(): boolean {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);
}

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: { revalidate?: number; cache?: RequestCache } = {},
): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!domain || !token) {
    throw new Error("Shopify is not configured. Run `vercel integration add shopify` and `vercel env pull`.");
  }
  const endpoint = `https://${domain}/api/${API_VERSION}/graphql.json`;
  const init: RequestInit & { next?: { revalidate: number } } = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  };
  if (options.cache) init.cache = options.cache;
  else init.next = { revalidate: options.revalidate ?? 60 };

  const response = await fetch(endpoint, init);
  const json = (await response.json()) as ShopifyResponse<T>;
  if (!response.ok || json.errors?.length) {
    throw new Error(`Shopify error: ${json.errors?.map((e) => e.message).join("; ") ?? response.statusText}`);
  }
  return json.data;
}
