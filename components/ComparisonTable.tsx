import type { ReactNode } from "react";
import Link from "next/link";
import type { Product } from "@/data/products";
import { AffiliateCta } from "./AffiliateCta";

const rows: { label: string; render: (p: Product) => ReactNode }[] = [
  { label: "Pricing", render: (p) => p.pricing },
  { label: "Free plan", render: (p) => (p.freePlan ? "Yes" : "No") },
  {
    label: "Main features",
    render: (p) => (
      <ul className="list-disc pl-4">
        {p.mainFeatures.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    ),
  },
  { label: "Best for", render: (p) => p.targetUsers },
  {
    label: "Pros",
    render: (p) => (
      <ul className="list-disc pl-4">
        {p.pros.map((pro) => (
          <li key={pro}>{pro}</li>
        ))}
      </ul>
    ),
  },
  {
    label: "Cons",
    render: (p) => (
      <ul className="list-disc pl-4">
        {p.cons.map((con) => (
          <li key={con}>{con}</li>
        ))}
      </ul>
    ),
  },
];

export function ComparisonTable({ products }: { products: Product[] }) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr>
          <th className="border-b border-gray-200 py-2 pr-4"></th>
          {products.map((p) => (
            <th key={p.slug} className="border-b border-gray-200 py-2 pr-4 align-bottom">
              <Link href={`/tools/${p.slug}`} className="text-base font-semibold hover:underline">
                {p.name}
              </Link>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row" className="border-b border-gray-100 py-3 pr-4 align-top font-medium text-gray-500">
              {row.label}
            </th>
            {products.map((p) => (
              <td key={p.slug} className="border-b border-gray-100 py-3 pr-4 align-top">
                {row.render(p)}
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <th scope="row" className="py-3 pr-4"></th>
          {products.map((p) => (
            <td key={p.slug} className="py-3 pr-4">
              <AffiliateCta product={p} />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
