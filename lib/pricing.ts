import type { Product } from "@/data/products";

export function getCheapestSlug(products: Product[]): string | null {
  let cheapest: Product | null = null;
  for (const p of products) {
    if (p.startingPriceUSD === null) continue;
    if (cheapest === null || p.startingPriceUSD < (cheapest.startingPriceUSD as number)) {
      cheapest = p;
    }
  }
  return cheapest?.slug ?? null;
}
