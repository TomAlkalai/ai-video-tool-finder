import type { Metadata } from "next";
import { RecommendationPage } from "@/components/RecommendationPage";
import { recommendationPages } from "@/data/recommendation-pages";

const config = recommendationPages.find((p) => p.slug === "best-ai-video-tool-for-product-ads")!;

export const metadata: Metadata = {
  title: `${config.title} | AI Video Tool Finder`,
  description: config.metaDescription,
};

export default function Page() {
  return <RecommendationPage config={config} />;
}
