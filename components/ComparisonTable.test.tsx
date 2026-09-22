import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComparisonTable } from "./ComparisonTable";
import type { Product } from "@/data/products";

const products: Product[] = [
  {
    name: "VEED",
    slug: "veed",
    category: [],
    pricing: "Free plan; paid from $12/mo",
    freePlan: true,
    mainFeatures: ["Auto captions"],
    targetUsers: "Creators",
    pros: ["Fast"],
    cons: ["Watermark on free plan"],
    affiliateUrl: "https://a.example.com",
    officialUrl: "https://o.example.com",
    affiliateStatus: "pending",
    lastVerified: "2026-01-01",
  },
  {
    name: "Descript",
    slug: "descript",
    category: [],
    pricing: "Free plan; paid from $12/mo",
    freePlan: true,
    mainFeatures: ["Transcript editing"],
    targetUsers: "Podcasters",
    pros: ["Text-based editing"],
    cons: ["Limited free minutes"],
    affiliateUrl: "https://a2.example.com",
    officialUrl: "https://o2.example.com",
    affiliateStatus: "pending",
    lastVerified: "2026-01-01",
  },
];

describe("ComparisonTable", () => {
  it("renders one column per product with name and pricing", () => {
    render(<ComparisonTable products={products} />);
    expect(screen.getByText("VEED")).toBeInTheDocument();
    expect(screen.getByText("Descript")).toBeInTheDocument();
    expect(screen.getAllByText(/Free plan; paid from \$12\/mo/)).toHaveLength(2);
  });

  it("renders a CTA linking through /go/[slug] for every product", () => {
    render(<ComparisonTable products={products} />);
    expect(screen.getByRole("link", { name: /visit veed/i })).toHaveAttribute("href", "/go/veed");
    expect(screen.getByRole("link", { name: /visit descript/i })).toHaveAttribute("href", "/go/descript");
  });
});
