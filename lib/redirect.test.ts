import { describe, it, expect } from "vitest";
import { resolveOutboundUrl } from "./redirect";
import type { Product } from "@/data/products";

function makeProduct(overrides: Partial<Product>): Product {
  return {
    name: "Test",
    slug: "test",
    category: [],
    pricing: "",
    freePlan: false,
    mainFeatures: [],
    targetUsers: "",
    pros: [],
    cons: [],
    affiliateUrl: "https://affiliate.example.com/test",
    officialUrl: "https://official.example.com/test",
    affiliateStatus: "pending",
    lastVerified: "2026-01-01",
    ...overrides,
  };
}

describe("resolveOutboundUrl", () => {
  it("returns the official URL when affiliate status is pending", () => {
    const product = makeProduct({ affiliateStatus: "pending" });
    expect(resolveOutboundUrl(product)).toBe(product.officialUrl);
  });

  it("returns the official URL when affiliate status is rejected", () => {
    const product = makeProduct({ affiliateStatus: "rejected" });
    expect(resolveOutboundUrl(product)).toBe(product.officialUrl);
  });

  it("returns the affiliate URL when affiliate status is active", () => {
    const product = makeProduct({ affiliateStatus: "active" });
    expect(resolveOutboundUrl(product)).toBe(product.affiliateUrl);
  });
});
