import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { products } from "@/data/products";
import { getProductBySlug } from "@/lib/products";
import { recommendationPages } from "@/data/recommendation-pages";
import { comparisonPages } from "@/data/comparison-pages";
import { AffiliateCta } from "@/components/AffiliateCta";
import { DisclosureNote } from "@/components/DisclosureNote";
import { CheckIcon, WarningIcon } from "@/components/icons";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} Pricing, Features, and Alternatives | AI Video Tool Finder`,
    description: `${product.name}: ${product.pricing}. ${product.targetUsers}`,
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const guides = [
    ...recommendationPages
      .filter((p) => p.productSlugs.includes(slug))
      .map((p) => ({ href: `/${p.slug}`, label: p.title })),
    ...comparisonPages
      .filter((p) => p.productSlugA === slug || p.productSlugB === slug)
      .map((p) => ({ href: `/${p.slug}`, label: p.title })),
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {product.name}
      </h1>
      <p className="mt-2 text-lg text-slate-600">{product.pricing}</p>
      <p className="mt-1 text-xs text-slate-400">Checked {product.lastVerified}</p>

      <p className="mt-6 text-slate-700">{product.targetUsers}</p>

      <div className="mt-8">
        <AffiliateCta product={product} label={`Visit ${product.name}`} />
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Main features
      </h2>
      <ul className="mt-3 space-y-1.5 text-slate-700">
        {product.mainFeatures.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid gap-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pros</h2>
          <ul className="mt-3 space-y-1.5">
            {product.pros.map((pro) => (
              <li key={pro} className="flex items-start gap-2 text-slate-700">
                <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cons</h2>
          <ul className="mt-3 space-y-1.5">
            {product.cons.map((con) => (
              <li key={con} className="flex items-start gap-2 text-slate-700">
                <WarningIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {guides.length > 0 && (
        <>
          <h2 className="mt-12 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {product.name} in our guides
          </h2>
          <ul className="mt-3 space-y-1">
            {guides.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="font-medium text-blue-600 hover:underline">
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-12 border-t border-slate-200 pt-6">
        <DisclosureNote />
      </div>
    </main>
  );
}
