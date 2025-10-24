import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "@/components/ui/card";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

describe("Accessibility", () => {
  it("has no obvious a11y violations on a basic card", async () => {
    const { container } = render(
      <Card>
        <h2>Title</h2>
        <p>Body</p>
      </Card>
    );
    const results = await axe(container, {
      rules: {
        region: { enabled: false } // avoid complaining about landmark roles for this tiny snippet
      }
    });
    expect(results).toHaveNoViolations();
  });
});