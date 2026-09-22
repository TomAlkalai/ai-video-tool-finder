import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolLogo } from "./ToolLogo";

describe("ToolLogo", () => {
  it("renders the logo image for a known slug", () => {
    render(<ToolLogo slug="veed" name="VEED" />);
    const img = screen.getByTitle("VEED");
    expect(img).toHaveAttribute("src", "/logos/veed.ico");
  });

  it("renders nothing for an unknown slug", () => {
    const { container } = render(<ToolLogo slug="does-not-exist" name="Nope" />);
    expect(container).toBeEmptyDOMElement();
  });
});
