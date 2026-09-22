import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AffiliateCta } from "./AffiliateCta";
import type { Product } from "@/data/products";

const product: Product = {
  name: "VEED",
  slug: "veed",
  category: [],
  pricing: "",
  freePlan: true,
  mainFeatures: [],
  targetUsers: "",
  pros: [],
  cons: [],
  affiliateUrl: "https://affiliate.example.com",
  officialUrl: "https://official.example.com",
  affiliateStatus: "pending",
  lastVerified: "2026-01-01",
};

describe("AffiliateCta", () => {
  it("always links through the /go/[slug] redirect route, never the raw URL", () => {
    render(<AffiliateCta product={product} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/go/veed");
  });

  it("uses a custom label when provided", () => {
    render(<AffiliateCta product={product} label="Try VEED free" />);
    expect(screen.getByRole("link", { name: "Try VEED free" })).toBeInTheDocument();
  });

  it("defaults to a generic visit label", () => {
    render(<AffiliateCta product={product} />);
    expect(screen.getByRole("link", { name: /visit veed/i })).toBeInTheDocument();
  });
});
