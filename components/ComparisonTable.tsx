import type { ReactNode } from "react";
import Link from "next/link";
import type { Product } from "@/data/products";
import { getCheapestSlug } from "@/lib/pricing";
import { AffiliateCta } from "./AffiliateCta";
import { ToolLogo } from "./ToolLogo";
import { CheckIcon, DashIcon, WarningIcon } from "./icons";

function FreePlanIndicator({ freePlan }: { freePlan: boolean }) {
  if (freePlan) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50">
          <CheckIcon className="h-3 w-3 text-green-600" />
        </span>
        Yes
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
        <DashIcon className="h-3 w-3 text-slate-400" />
      </span>
      No
    </span>
  );
}

function ProCard({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-slate-700">
          <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ConCard({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-slate-700">
          <WarningIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CheapestBadge() {
  return (
    <span className="ml-2 inline-flex items-center rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-semibold text-green-700">
      Cheapest
    </span>
  );
}

function buildRows(cheapestSlug: string | null): { label: string; render: (p: Product) => ReactNode }[] {
  return [
    {
      label: "Pricing",
      render: (p) => (
        <span className="font-medium text-slate-900">
          {p.pricing}
          {p.slug === cheapestSlug && <CheapestBadge />}
        </span>
      ),
    },
    { label: "Free plan", render: (p) => <FreePlanIndicator freePlan={p.freePlan} /> },
  {
    label: "Main features",
    render: (p) => (
      <ul className="space-y-1">
        {p.mainFeatures.map((f) => (
          <li key={f} className="flex items-start gap-2 text-slate-700">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    ),
  },
    { label: "Best for", render: (p) => <span className="text-slate-700">{p.targetUsers}</span> },
    { label: "Pros", render: (p) => <ProCard items={p.pros} /> },
    { label: "Cons", render: (p) => <ConCard items={p.cons} /> },
  ];
}

export function ComparisonTable({ products }: { products: Product[] }) {
  const rows = buildRows(getCheapestSlug(products));

  return (
    <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-sm">
      <thead>
        <tr>
          <th className="w-32 border-b border-slate-200 bg-slate-50 py-3 pr-4"></th>
          {products.map((p, i) => (
            <th
              key={p.slug}
              className={`border-b border-slate-200 bg-slate-50 px-4 py-3 align-bottom ${
                i > 0 ? "border-l border-l-slate-200" : ""
              }`}
            >
              <Link
                href={`/tools/${p.slug}`}
                className="flex items-center gap-2 text-base font-semibold text-slate-900 hover:text-blue-600"
              >
                <ToolLogo slug={p.slug} name={p.name} size={24} />
                {p.name}
              </Link>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={row.label} className={rowIndex % 2 === 1 ? "bg-slate-50/60" : undefined}>
            <th
              scope="row"
              className="w-32 border-b border-slate-100 py-3 pr-4 align-top text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              {row.label}
            </th>
            {products.map((p, i) => (
              <td
                key={p.slug}
                className={`border-b border-slate-100 px-4 py-3 align-top ${
                  i > 0 ? "border-l border-l-slate-100" : ""
                }`}
              >
                {row.render(p)}
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <th scope="row" className="w-32 py-4 pr-4"></th>
          {products.map((p, i) => (
            <td key={p.slug} className={`px-4 py-4 ${i > 0 ? "border-l border-l-slate-100" : ""}`}>
              <AffiliateCta product={p} />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
