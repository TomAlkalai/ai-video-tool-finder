import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/products";

const product: Product = {
  name: "VEED",
  slug: "veed",
  category: [],
  pricing: "Free plan; paid from $12/mo",
  freePlan: true,
  startingPriceUSD: 12,
  mainFeatures: ["Auto captions", "Timeline editor", "Brand kit", "Templates"],
  targetUsers: "Creators",
  pros: [],
  cons: [],
  affiliateUrl: "https://a.example.com",
  officialUrl: "https://o.example.com",
  affiliateStatus: "pending",
  lastVerified: "2026-01-01",
};

describe("ProductCard", () => {
  it("links the product name to its tool detail page", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByRole("link", { name: "VEED" })).toHaveAttribute("href", "/tools/veed");
  });

  it("does not render a compare checkbox when no compare prop is given", () => {
    render(<ProductCard product={product} />);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("renders a checked/unchecked compare checkbox and calls onToggle when given", () => {
    const onToggle = vi.fn();
    render(<ProductCard product={product} compare={{ checked: true, onToggle }} />);
    const checkbox = screen.getByRole("checkbox", { name: /compare/i });
    expect(checkbox).toBeChecked();
    checkbox.click();
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("shows a Free plan badge when the product has one, and no Cheapest badge by default", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText("Free plan")).toBeInTheDocument();
    expect(screen.queryByText("Cheapest")).not.toBeInTheDocument();
  });

  it("shows a Cheapest badge when isCheapest is true", () => {
    render(<ProductCard product={product} isCheapest />);
    expect(screen.getByText("Cheapest")).toBeInTheDocument();
  });
});
