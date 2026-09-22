import { getProductsBySlugs, getProductBySlug } from "@/lib/products";
import { ComparisonTable } from "./ComparisonTable";
import { DisclosureNote } from "./DisclosureNote";
import type { RecommendationPageConfig } from "@/data/recommendation-pages";

export function RecommendationPage({ config }: { config: RecommendationPageConfig }) {
  const products = getProductsBySlugs(config.productSlugs);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">{config.title}</h1>
      <p className="mt-4 max-w-3xl text-gray-600">{config.intro}</p>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-gray-400">
        What matters here
      </h2>
      <ul className="mt-3 list-disc pl-5 text-gray-700">
        {config.criteria.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <div className="mt-10 overflow-x-auto">
        <ComparisonTable products={products} />
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Verdict
      </h2>
      <div className="mt-3 space-y-3">
        {config.verdict.map((v) => {
          const product = getProductBySlug(v.productSlug);
          if (!product) return null;
          return (
            <p key={v.productSlug}>
              <strong>{product.name}:</strong> {v.text}
            </p>
          );
        })}
      </div>

      <div className="mt-10">
        <DisclosureNote />
      </div>
    </main>
  );
}
