import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../testing/render.tsx";
import { Timers } from "./Timers.tsx";

test("shows the timer board under its title, with sources", () => {
  renderWithProviders(<Timers />, { path: "/timers" });

  expect(
    screen.getByRole("heading", { level: 1, name: "Timers" }),
  ).toBeDefined();
  expect(screen.getByRole("region", { name: "Timers" })).toBeDefined();
  expect(screen.getByRole("contentinfo").textContent).toContain("couga54");
  expect(document.title).toBe("Timers · AION 2 Notes");
});
