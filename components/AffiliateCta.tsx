import type { Product } from "@/data/products";

export function AffiliateCta({ product, label }: { product: Product; label?: string }) {
  return (
    <a
      href={`/go/${product.slug}`}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
    >
      {label ?? `Visit ${product.name}`}
    </a>
  );
}
