"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { AffiliateCta } from "./AffiliateCta";

export function ProductCard({
  product,
  compare,
}: {
  product: Product;
  compare?: { checked: boolean; onToggle: () => void };
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/tools/${product.slug}`} className="text-lg font-semibold hover:underline">
          {product.name}
        </Link>
        {compare && (
          <label className="flex items-center gap-1.5 text-xs text-gray-500">
            <input
              type="checkbox"
              aria-label={`Compare ${product.name}`}
              checked={compare.checked}
              onChange={compare.onToggle}
            />
            Compare
          </label>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-500">{product.pricing}</p>
      <p className="mt-3 text-sm">{product.targetUsers}</p>
      <ul className="mt-3 list-disc pl-4 text-sm text-gray-600">
        {product.mainFeatures.slice(0, 3).map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <div className="mt-4">
        <AffiliateCta product={product} />
      </div>
    </div>
  );
}
