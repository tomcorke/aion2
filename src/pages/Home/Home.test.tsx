import { screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { sections } from "../../data/sections.ts";
import { renderWithProviders } from "../../testing/render.tsx";
import { Home } from "./Home.tsx";

test("leads with the timers, then links every section", () => {
  renderWithProviders(<Home />);

  const index = screen.getByRole("navigation", { name: "All sections" });

  expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
  expect(screen.getByRole("region", { name: "Timers" })).toBeDefined();
  expect(within(index).getAllByRole("link")).toHaveLength(sections.length);
  expect(document.title).toBe("AION 2 Notes");
});

test("names the timer sources in the footer", () => {
  renderWithProviders(<Home />);

  expect(screen.getByRole("contentinfo").textContent).toContain(
    "MetaBot event schedule",
  );
});
