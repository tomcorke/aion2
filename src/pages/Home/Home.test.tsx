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

  const footer = screen.getByRole("contentinfo").textContent;

  expect(footer).toContain("MetaBot event schedule");
  expect(footer).toContain("NC Global patch notes, 28 October 2026");
  expect(footer).toContain("NC: Atreia's Call 28-day Attendance event");
  expect(footer).toContain("MetaBot methodology");
  expect(footer).toContain("Reviewed 2 November 2026");
  expect(screen.getAllByText("Ticket-table reset in")).toHaveLength(2);
  expect(screen.getByText(/not a confirmed EU server clock/)).toBeDefined();
});
