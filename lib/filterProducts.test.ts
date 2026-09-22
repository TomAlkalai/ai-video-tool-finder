import { describe, it, expect } from "vitest";
import { filterProducts } from "./filterProducts";
import type { Product } from "@/data/products";

function makeProduct(overrides: Partial<Product>): Product {
  return {
    name: "Test",
    slug: "test",
    category: [],
    pricing: "",
    freePlan: false,
    startingPriceUSD: null,
    mainFeatures: [],
    targetUsers: "",
    pros: [],
    cons: [],
    affiliateUrl: "https://a.example.com",
    officialUrl: "https://o.example.com",
    affiliateStatus: "pending",
    lastVerified: "2026-01-01",
    ...overrides,
  };
}

const products: Product[] = [
  makeProduct({ name: "VEED", slug: "veed", category: ["editing", "youtube"], freePlan: true }),
  makeProduct({ name: "Synthesia", slug: "synthesia", category: ["avatar"], freePlan: false }),
  makeProduct({ name: "Descript", slug: "descript", category: ["editing"], freePlan: true }),
];

describe("filterProducts", () => {
  it("returns all products when no filter is given", () => {
    expect(filterProducts(products, {})).toHaveLength(3);
  });

  it("filters by case-insensitive name substring", () => {
    const result = filterProducts(products, { query: "vee" });
    expect(result.map((p) => p.slug)).toEqual(["veed"]);
  });

  it("filters by category tag", () => {
    const result = filterProducts(products, { category: "editing" });
    expect(result.map((p) => p.slug)).toEqual(["veed", "descript"]);
  });

  it("filters by free plan only", () => {
    const result = filterProducts(products, { freePlanOnly: true });
    expect(result.map((p) => p.slug)).toEqual(["veed", "descript"]);
  });

  it("combines query, category, and freePlanOnly", () => {
    const result = filterProducts(products, { query: "de", category: "editing", freePlanOnly: true });
    expect(result.map((p) => p.slug)).toEqual(["descript"]);
  });
});
