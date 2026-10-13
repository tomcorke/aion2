import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PageHero } from "./PageHero.tsx";

test("shows the title and lede over a decorative image", () => {
  render(<PageHero title="Timers" lede="Resets and bosses." />);

  expect(
    screen.getByRole("heading", { level: 1, name: "Timers" }),
  ).toBeDefined();
  expect(screen.getByText("Resets and bosses.")).toBeDefined();
  expect(screen.getByRole("presentation").getAttribute("alt")).toBe("");
});

test("the lede is optional", () => {
  const { container } = render(<PageHero title="Not found" />);

  expect(container.querySelector("p")).toBeNull();
});
