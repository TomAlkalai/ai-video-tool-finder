import type { MetadataRoute } from "next";
import { recommendationPages } from "@/data/recommendation-pages";
import { comparisonPages } from "@/data/comparison-pages";

const base = "https://aivideofinder.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/ai-video-tools", "/affiliate-disclosure"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const recommendationRoutes = recommendationPages.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: new Date(),
  }));

  const comparisonRoutes = comparisonPages.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...recommendationRoutes, ...comparisonRoutes];
}
