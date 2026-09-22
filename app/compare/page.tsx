import type { Metadata } from "next";
import Link from "next/link";
import { getProductsBySlugs } from "@/lib/products";
import { ComparisonTable } from "@/components/ComparisonTable";
import { DisclosureNote } from "@/components/DisclosureNote";

export const metadata: Metadata = {
  title: "Compare AI Video Tools | AI Video Tool Finder",
  robots: { index: false },
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ tools?: string }>;
}) {
  const { tools } = await searchParams;
  const slugs = tools ? tools.split(",").filter(Boolean) : [];
  const products = getProductsBySlugs(slugs);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Compare AI Video Tools</h1>

      {products.length < 2 ? (
        <p className="mt-6 text-gray-600">
          Select at least two tools to compare from the{" "}
          <Link href="/" className="underline">
            tool browser
          </Link>
          .
        </p>
      ) : (
        <>
          <div className="mt-8 overflow-x-auto">
            <ComparisonTable products={products} />
          </div>
          <div className="mt-10">
            <DisclosureNote />
          </div>
        </>
      )}
    </main>
  );
}
