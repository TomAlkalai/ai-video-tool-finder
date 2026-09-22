import Link from "next/link";
import { products } from "@/data/products";
import { ToolBrowser } from "@/components/ToolBrowser";
import { UseCaseGrid } from "@/components/UseCaseGrid";

const guides = [
  { href: "/best-ai-video-generator-for-youtube", label: "YouTube videos", description: "Full-length YouTube content, from script to upload." },
  { href: "/best-ai-video-generator-for-faceless-youtube", label: "Faceless YouTube channels", description: "No on-camera presenter, script-to-video workflows." },
  { href: "/best-ai-video-tool-for-tiktok", label: "TikTok / Shorts", description: "Fast, vertical, short-form clips." },
  { href: "/best-ai-avatar-generator", label: "AI avatar videos", description: "A synthetic presenter without filming a person." },
  { href: "/best-ai-video-tool-for-product-ads", label: "Product ads", description: "Short promotional videos for a product or offer." },
  { href: "/best-ai-video-editor", label: "General editing", description: "Editing existing footage, captions, and cleanup." },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 pb-24">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">AI Video Tool Finder</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Search, filter, and compare AI video tools side by side. No hands-on
            testing claims &mdash; a clear breakdown of pricing, features, and
            trade-offs from official sources.
          </p>
        </div>
        <Link
          href="/find-my-tool"
          className="whitespace-nowrap rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-indigo-400"
        >
          Not sure what to make? Ask our AI &rarr;
        </Link>
      </div>

      <div className="mt-10">
        <ToolBrowser products={products} />
      </div>

      <div id="guides" className="mt-20">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Buying guides by use case
        </h2>
        <UseCaseGrid items={guides} />
      </div>
    </main>
  );
}
