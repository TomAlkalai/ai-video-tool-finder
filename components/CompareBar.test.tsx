import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompareBar } from "./CompareBar";

describe("CompareBar", () => {
  it("renders nothing when no tools are selected", () => {
    const { container } = render(<CompareBar selectedSlugs={[]} onClear={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("prompts for one more tool when exactly one is selected", () => {
    render(<CompareBar selectedSlugs={["veed"]} onClear={() => {}} />);
    expect(screen.getByText(/select one more/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /compare/i })).not.toBeInTheDocument();
  });

  it("links to /compare with the selected slugs when 2+ are selected", () => {
    render(<CompareBar selectedSlugs={["veed", "descript"]} onClear={() => {}} />);
    expect(screen.getByRole("link", { name: /compare 2 tools/i })).toHaveAttribute(
      "href",
      "/compare?tools=veed,descript"
    );
  });

  it("calls onClear when the clear button is clicked", () => {
    const onClear = vi.fn();
    render(<CompareBar selectedSlugs={["veed", "descript"]} onClear={onClear} />);
    screen.getByRole("button", { name: /clear/i }).click();
    expect(onClear).toHaveBeenCalledOnce();
  });
});
