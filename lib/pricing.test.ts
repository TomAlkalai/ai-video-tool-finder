import { describe, it, expect } from "vitest";
import { getCheapestSlug } from "./pricing";
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

describe("getCheapestSlug", () => {
  it("returns null for an empty list", () => {
    expect(getCheapestSlug([])).toBeNull();
  });

  it("returns null when every product has no starting price", () => {
    const products = [makeProduct({ slug: "a" }), makeProduct({ slug: "b" })];
    expect(getCheapestSlug(products)).toBeNull();
  });

  it("returns the slug of the lowest-priced product", () => {
    const products = [
      makeProduct({ slug: "a", startingPriceUSD: 20 }),
      makeProduct({ slug: "b", startingPriceUSD: 8 }),
      makeProduct({ slug: "c", startingPriceUSD: 12 }),
    ];
    expect(getCheapestSlug(products)).toBe("b");
  });

  it("ignores products with no starting price when comparing", () => {
    const products = [
      makeProduct({ slug: "a", startingPriceUSD: null }),
      makeProduct({ slug: "b", startingPriceUSD: 12 }),
    ];
    expect(getCheapestSlug(products)).toBe("b");
  });

  it("returns the first product encountered on a tie", () => {
    const products = [
      makeProduct({ slug: "a", startingPriceUSD: 12 }),
      makeProduct({ slug: "b", startingPriceUSD: 12 }),
    ];
    expect(getCheapestSlug(products)).toBe("a");
  });
});
