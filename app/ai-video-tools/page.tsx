import type { Metadata } from "next";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "AI Video Tools Compared | AI Video Tool Finder",
  description: "A plain breakdown of pricing, features, and trade-offs for the leading AI video generation and editing tools.",
};

export default function AiVideoToolsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">AI Video Tools</h1>
      <p className="mt-4 max-w-2xl text-gray-600">
        Short profiles of each tool we track. For a recommendation tailored
        to a specific use case, see the{" "}
        <a href="/" className="underline">
          use-case guides
        </a>
        .
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </main>
  );
}
