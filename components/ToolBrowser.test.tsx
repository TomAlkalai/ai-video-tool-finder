import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToolBrowser } from "./ToolBrowser";
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
  makeProduct({ name: "VEED", slug: "veed", category: ["editing"], freePlan: true }),
  makeProduct({ name: "Synthesia", slug: "synthesia", category: ["avatar"], freePlan: false }),
];

describe("ToolBrowser", () => {
  it("renders a card for every product initially", () => {
    render(<ToolBrowser products={products} />);
    expect(screen.getByRole("link", { name: "VEED" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Synthesia" })).toBeInTheDocument();
  });

  it("filters cards by search text", () => {
    render(<ToolBrowser products={products} />);
    const search = screen.getByRole("searchbox");
    fireEvent.change(search, { target: { value: "syn" } });
    expect(screen.queryByRole("link", { name: "VEED" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Synthesia" })).toBeInTheDocument();
  });

  it("shows the compare bar prompt after checking one product", () => {
    render(<ToolBrowser products={products} />);
    screen.getByRole("checkbox", { name: /compare veed/i }).click();
    expect(screen.getByText(/select one more/i)).toBeInTheDocument();
  });

  it("marks the cheapest product in the full catalog, even when filtered out of view", () => {
    const priced: Product[] = [
      makeProduct({ name: "VEED", slug: "veed", category: ["editing"], startingPriceUSD: 20 }),
      makeProduct({ name: "Synthesia", slug: "synthesia", category: ["avatar"], startingPriceUSD: 9 }),
    ];
    render(<ToolBrowser products={priced} />);
    expect(screen.getAllByText("Cheapest")).toHaveLength(1);
  });
});
