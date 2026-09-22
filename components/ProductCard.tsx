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
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/tools/${product.slug}`}
          className="text-lg font-semibold text-slate-900 hover:text-blue-600"
        >
          {product.name}
        </Link>
        {compare && (
          <label className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500">
            <input
              type="checkbox"
              aria-label={`Compare ${product.name}`}
              checked={compare.checked}
              onChange={compare.onToggle}
              className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            />
            Compare
          </label>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-500">{product.pricing}</p>
      <p className="mt-3 text-sm text-slate-700">{product.targetUsers}</p>
      <ul className="mt-3 space-y-1 text-sm text-slate-600">
        {product.mainFeatures.slice(0, 3).map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <AffiliateCta product={product} />
      </div>
    </div>
  );
}
