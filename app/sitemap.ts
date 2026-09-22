import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { recommendationPages } from "@/data/recommendation-pages";
import { comparisonPages } from "@/data/comparison-pages";

const base = "https://aivideofinder.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/affiliate-disclosure", "/find-my-tool"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const toolRoutes = products.map((p) => ({
    url: `${base}/tools/${p.slug}`,
    lastModified: new Date(p.lastVerified),
  }));

  const recommendationRoutes = recommendationPages.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: new Date(),
  }));

  const comparisonRoutes = comparisonPages.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...toolRoutes, ...recommendationRoutes, ...comparisonRoutes];
}
