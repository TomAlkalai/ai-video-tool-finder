import type { Metadata } from "next";
import { RecommendationPage } from "@/components/RecommendationPage";
import { recommendationPages } from "@/data/recommendation-pages";

const config = recommendationPages.find((p) => p.slug === "best-ai-video-editor")!;

export const metadata: Metadata = {
  title: `${config.title} | AI Video Tool Finder`,
  description: config.metaDescription,
};

export default function Page() {
  return <RecommendationPage config={config} />;
}
