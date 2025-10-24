import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "@/components/ui/card";

describe("Basic UI sanity", () => {
  it("renders a Card with content", () => {
    render(<Card><div>Stat content</div></Card>);
    expect(screen.getByText("Stat content")).toBeInTheDocument();
  });
});