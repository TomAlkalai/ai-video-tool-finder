import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DisclosureNote } from "./DisclosureNote";

describe("DisclosureNote", () => {
  it("discloses the affiliate relationship and links to the full policy", () => {
    render(<DisclosureNote />);
    expect(screen.getByText(/may earn a commission/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /affiliate disclosure/i })).toHaveAttribute(
      "href",
      "/affiliate-disclosure"
    );
  });
});
