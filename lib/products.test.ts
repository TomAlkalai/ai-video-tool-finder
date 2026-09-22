import { describe, it, expect } from "vitest";
import { getProductBySlug, getProductsBySlugs } from "./products";

describe("getProductBySlug", () => {
  it("returns the matching product", () => {
    const product = getProductBySlug("veed");
    expect(product?.name).toBe("VEED");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProductBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("getProductsBySlugs", () => {
  it("returns products in the requested order", () => {
    const result = getProductsBySlugs(["descript", "veed"]);
    expect(result.map((p) => p.slug)).toEqual(["descript", "veed"]);
  });

  it("silently skips unknown slugs", () => {
    const result = getProductsBySlugs(["veed", "nope"]);
    expect(result.map((p) => p.slug)).toEqual(["veed"]);
  });
});
