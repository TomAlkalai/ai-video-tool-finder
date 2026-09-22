import type { Metadata } from "next";
import { ComparisonPage } from "@/components/ComparisonPage";
import { comparisonPages } from "@/data/comparison-pages";

const config = comparisonPages.find((p) => p.slug === "invideo-vs-pictory")!;

export const metadata: Metadata = {
  title: `${config.title} | AI Video Tool Finder`,
  description: config.metaDescription,
};

export default function Page() {
  return <ComparisonPage config={config} />;
}
