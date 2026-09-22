import { getProductBySlug } from "@/lib/products";
import { ComparisonTable } from "./ComparisonTable";
import { DisclosureNote } from "./DisclosureNote";
import type { ComparisonPageConfig } from "@/data/comparison-pages";

export function ComparisonPage({ config }: { config: ComparisonPageConfig }) {
  const productA = getProductBySlug(config.productSlugA);
  const productB = getProductBySlug(config.productSlugB);
  const products = [productA, productB].filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {config.title}
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-slate-600">{config.intro}</p>

      <div className="mt-10 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <ComparisonTable products={products} />
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Verdict
      </h2>
      <p className="mt-3 max-w-3xl text-slate-700">{config.verdict}</p>

      <div className="mt-12 border-t border-slate-200 pt-6">
        <DisclosureNote />
      </div>
    </main>
  );
}
