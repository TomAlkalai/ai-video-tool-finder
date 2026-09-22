"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { AffiliateCta } from "./AffiliateCta";
import { ToolLogo } from "./ToolLogo";

export function ProductCard({
  product,
  compare,
  isCheapest,
}: {
  product: Product;
  compare?: { checked: boolean; onToggle: () => void };
  isCheapest?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/tools/${product.slug}`}
          className="flex min-w-0 items-center gap-2 text-lg font-semibold text-slate-900 hover:text-blue-600"
        >
          <ToolLogo slug={product.slug} name={product.name} size={28} />
          <span className="truncate">{product.name}</span>
        </Link>
        {compare && (
          <label className="flex shrink-0 items-center gap-1.5 py-2 text-xs font-medium text-slate-500">
            <input
              type="checkbox"
              aria-label={`Compare ${product.name}`}
              checked={compare.checked}
              onChange={compare.onToggle}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            />
            Compare
          </label>
        )}
      </div>
      {(isCheapest || product.freePlan) && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {isCheapest && (
            <span className="inline-flex items-center rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-semibold text-green-700">
              Cheapest
            </span>
          )}
          {product.freePlan && (
            <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-semibold text-blue-700">
              Free plan
            </span>
          )}
        </div>
      )}
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
