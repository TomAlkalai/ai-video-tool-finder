import { UseCaseGrid } from "@/components/UseCaseGrid";

const useCases = [
  { href: "/best-ai-video-generator-for-youtube", label: "YouTube videos", description: "Full-length YouTube content, from script to upload." },
  { href: "/best-ai-video-generator-for-faceless-youtube", label: "Faceless YouTube channels", description: "No on-camera presenter, script-to-video workflows." },
  { href: "/best-ai-video-tool-for-tiktok", label: "TikTok / Shorts", description: "Fast, vertical, short-form clips." },
  { href: "/best-ai-avatar-generator", label: "AI avatar videos", description: "A synthetic presenter without filming a person." },
  { href: "/best-ai-video-tool-for-product-ads", label: "Product ads", description: "Short promotional videos for a product or offer." },
  { href: "/best-ai-video-editor", label: "General editing", description: "Editing existing footage, captions, and cleanup." },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">AI Video Tool Finder</h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-600">
        Compare AI video generation and editing tools by what you&apos;re
        actually trying to make. No hands-on testing claims &mdash; just a
        clear breakdown of pricing, features, and trade-offs from official
        sources.
      </p>
      <div className="mt-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          What are you trying to make?
        </h2>
        <UseCaseGrid items={useCases} />
      </div>
    </main>
  );
}
