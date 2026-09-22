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
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:max-w-xs"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={freePlanOnly}
            onChange={(e) => setFreePlanOnly(e.target.checked)}
          />
          Free plan only
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(undefined)}
          className={`rounded-full border px-3 py-1 text-sm ${
            category === undefined
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-gray-300 text-gray-600"
          }`}
        >
          All
        </button>
        {categoryFilters.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            className={`rounded-full border px-3 py-1 text-sm ${
              category === c.value
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-gray-300 text-gray-600"
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
        <p className="mt-10 text-center text-sm text-gray-500">
          No tools match those filters.
        </p>
      )}

      <CompareBar selectedSlugs={selectedSlugs} onClear={() => setSelectedSlugs([])} />
    </div>
  );
}
