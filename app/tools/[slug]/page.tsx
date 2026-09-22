import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { products } from "@/data/products";
import { getProductBySlug } from "@/lib/products";
import { recommendationPages } from "@/data/recommendation-pages";
import { comparisonPages } from "@/data/comparison-pages";
import { AffiliateCta } from "@/components/AffiliateCta";
import { DisclosureNote } from "@/components/DisclosureNote";

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
      <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
      <p className="mt-2 text-gray-500">{product.pricing}</p>
      <p className="mt-1 text-xs text-gray-400">Checked {product.lastVerified}</p>

      <p className="mt-6 text-gray-700">{product.targetUsers}</p>

      <div className="mt-8">
        <AffiliateCta product={product} label={`Visit ${product.name}`} />
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Main features
      </h2>
      <ul className="mt-3 list-disc pl-5 text-gray-700">
        {product.mainFeatures.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Pros</h2>
          <ul className="mt-3 list-disc pl-5 text-gray-700">
            {product.pros.map((pro) => (
              <li key={pro}>{pro}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Cons</h2>
          <ul className="mt-3 list-disc pl-5 text-gray-700">
            {product.cons.map((con) => (
              <li key={con}>{con}</li>
            ))}
          </ul>
        </div>
      </div>

      {guides.length > 0 && (
        <>
          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-gray-400">
            {product.name} in our guides
          </h2>
          <ul className="mt-3 space-y-1">
            {guides.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="text-indigo-600 hover:underline">
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-10">
        <DisclosureNote />
      </div>
    </main>
  );
}
