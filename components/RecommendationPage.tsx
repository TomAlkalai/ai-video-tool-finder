import { getProductsBySlugs, getProductBySlug } from "@/lib/products";
import { ComparisonTable } from "./ComparisonTable";
import { DisclosureNote } from "./DisclosureNote";
import type { RecommendationPageConfig } from "@/data/recommendation-pages";

export function RecommendationPage({ config }: { config: RecommendationPageConfig }) {
  const products = getProductsBySlugs(config.productSlugs);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {config.title}
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-slate-600">{config.intro}</p>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-wide text-slate-500">
        What matters here
      </h2>
      <ul className="mt-3 space-y-1.5 text-slate-700">
        {config.criteria.map((c) => (
          <li key={c} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            <span>{c}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <ComparisonTable products={products} />
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Verdict
      </h2>
      <div className="mt-3 space-y-3 text-slate-700">
        {config.verdict.map((v) => {
          const product = getProductBySlug(v.productSlug);
          if (!product) return null;
          return (
            <p key={v.productSlug}>
              <strong className="font-semibold text-slate-900">{product.name}:</strong> {v.text}
            </p>
          );
        })}
      </div>

      <div className="mt-12 border-t border-slate-200 pt-6">
        <DisclosureNote />
      </div>
    </main>
  );
}
