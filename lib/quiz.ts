import { recommendationPages } from "@/data/recommendation-pages";
import { getProductBySlug } from "@/lib/products";

export type QuizAnswers = {
  goal: "youtube" | "faceless" | "tiktok" | "avatar" | "ads" | "editing";
  needsFreePlan: boolean;
};

export type QuizResult = {
  pageSlug: string;
  topProductSlug: string;
};

const goalToPageSlug: Record<QuizAnswers["goal"], string> = {
  youtube: "best-ai-video-generator-for-youtube",
  faceless: "best-ai-video-generator-for-faceless-youtube",
  tiktok: "best-ai-video-tool-for-tiktok",
  avatar: "best-ai-avatar-generator",
  ads: "best-ai-video-tool-for-product-ads",
  editing: "best-ai-video-editor",
};

export function pickRecommendation(answers: QuizAnswers): QuizResult {
  const pageSlug = goalToPageSlug[answers.goal];
  const page = recommendationPages.find((p) => p.slug === pageSlug)!;

  let topProductSlug = page.productSlugs[0];
  if (answers.needsFreePlan) {
    const freeSlug = page.productSlugs.find((slug) => getProductBySlug(slug)?.freePlan);
    if (freeSlug) topProductSlug = freeSlug;
  }

  return { pageSlug, topProductSlug };
}
