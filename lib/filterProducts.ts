import type { Product } from "@/data/products";

export type ProductFilter = {
  query?: string;
  category?: string;
  freePlanOnly?: boolean;
};

export function filterProducts(products: Product[], filter: ProductFilter): Product[] {
  return products.filter((p) => {
    if (filter.query && !p.name.toLowerCase().includes(filter.query.toLowerCase())) {
      return false;
    }
    if (filter.category && !p.category.includes(filter.category)) {
      return false;
    }
    if (filter.freePlanOnly && !p.freePlan) {
      return false;
    }
    return true;
  });
}
