import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | AI Video Tool Finder",
  description: "How AI Video Tool Finder makes money and how that affects the recommendations on this site.",
};

export default function AffiliateDisclosurePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Affiliate Disclosure
      </h1>
      <div className="mt-6 space-y-4 text-slate-700">
        <p>
          AI Video Tool Finder is supported by affiliate relationships. When
          you click a &quot;Visit&quot; link on this site and sign up for a
          product, we may earn a commission, at no extra cost to you.
        </p>
        <p>
          Not every product listed on this site has an active affiliate
          relationship with us. Where we don&apos;t yet have one, the link
          simply goes to the product&apos;s official site directly, and we
          earn nothing from your click.
        </p>
        <p>
          Affiliate relationships never determine which products we list or
          how we describe their pricing, features, or trade-offs. We have
          not personally tested every product on this site; comparisons are
          based on each product&apos;s current public pricing pages and
          documentation, checked at the date shown on each page.
        </p>
        <p>
          If you have questions about a specific recommendation or spot
          outdated information, feel free to reach out.
        </p>
      </div>
    </main>
  );
}
