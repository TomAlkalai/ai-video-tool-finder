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
    startingPriceUSD: 12,
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
    pricing: "Free plan; paid from $15/mo",
    freePlan: true,
    startingPriceUSD: 15,
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
    expect(screen.getByText(/Free plan; paid from \$12\/mo/)).toBeInTheDocument();
    expect(screen.getByText(/Free plan; paid from \$15\/mo/)).toBeInTheDocument();
  });

  it("renders a CTA linking through /go/[slug] for every product", () => {
    render(<ComparisonTable products={products} />);
    expect(screen.getByRole("link", { name: /visit veed/i })).toHaveAttribute("href", "/go/veed");
    expect(screen.getByRole("link", { name: /visit descript/i })).toHaveAttribute("href", "/go/descript");
  });

  it("links each product name to its tool detail page", () => {
    render(<ComparisonTable products={products} />);
    expect(screen.getByRole("link", { name: "VEED" })).toHaveAttribute("href", "/tools/veed");
    expect(screen.getByRole("link", { name: "Descript" })).toHaveAttribute("href", "/tools/descript");
  });

  it("shows a Yes/No free-plan indicator for both truth values", () => {
    const mixed: Product[] = [products[0], { ...products[1], freePlan: false }];
    render(<ComparisonTable products={mixed} />);
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("marks the lowest-priced product as Cheapest", () => {
    render(<ComparisonTable products={products} />);
    expect(screen.getAllByText("Cheapest")).toHaveLength(1);
  });

  it("shows no Cheapest badge when no product has a starting price", () => {
    const noPrices: Product[] = products.map((p) => ({ ...p, startingPriceUSD: null }));
    render(<ComparisonTable products={noPrices} />);
    expect(screen.queryByText("Cheapest")).not.toBeInTheDocument();
  });
});
