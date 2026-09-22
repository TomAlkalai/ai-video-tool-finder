import type { Product } from "@/data/products";

export function AffiliateCta({ product, label }: { product: Product; label?: string }) {
  return (
    <a
      href={`/go/${product.slug}`}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
    >
      {label ?? `Visit ${product.name}`}
    </a>
  );
}
