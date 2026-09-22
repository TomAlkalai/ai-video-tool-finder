import type { Product } from "@/data/products";

export function resolveOutboundUrl(product: Product): string {
  return product.affiliateStatus === "active" ? product.affiliateUrl : product.officialUrl;
}
