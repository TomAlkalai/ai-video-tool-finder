"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { categoryFilters } from "@/data/categories";
import { filterProducts } from "@/lib/filterProducts";
import { ProductCard } from "./ProductCard";
import { CompareBar } from "./CompareBar";

export function ToolBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [freePlanOnly, setFreePlanOnly] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  const filtered = useMemo(
    () => filterProducts(products, { query, category, freePlanOnly }),
    [products, query, category, freePlanOnly]
  );

  function toggleSlug(slug: string) {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools by name..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:max-w-xs"
        />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={freePlanOnly}
            onChange={(e) => setFreePlanOnly(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
          />
          Free plan only
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(undefined)}
          className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
            category === undefined
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          }`}
        >
          All
        </button>
        {categoryFilters.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
              category === c.value
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            compare={{
              checked: selectedSlugs.includes(product.slug),
              onToggle: () => toggleSlug(product.slug),
            }}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-slate-500">
          No tools match those filters.
        </p>
      )}

      <CompareBar selectedSlugs={selectedSlugs} onClear={() => setSelectedSlugs([])} />
    </div>
  );
}
