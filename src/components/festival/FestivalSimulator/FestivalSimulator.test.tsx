import { screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { FestivalSimulator } from "./FestivalSimulator.tsx";

afterEach(() => {
  vi.restoreAllMocks();
});

test("samples the URL inputs on load", () => {
  vi.spyOn(Math, "random").mockReturnValue(0.999);

  renderWithProviders(<FestivalSimulator />, {
    path: "/festival/simulator?openings=0&startTokens=7&target=custom&customTarget=7",
  });

  expect(
    screen.getByRole("definition", { name: /Chance to reach 7 tokens/ })
      .textContent,
  ).toBe("100%");
  expect(
    screen.getByRole("definition", { name: "Expected total" }).textContent,
  ).toBe("7");
});

test("highest-band draws reach the top outcome", () => {
  vi.spyOn(Math, "random").mockReturnValue(0.999);

  renderWithProviders(<FestivalSimulator />, {
    path: "/festival/simulator?openings=1",
  });

  expect(
    screen.getByRole("definition", { name: "Sample mean" }).textContent,
  ).toBe("100");
});

test("an invalid URL shows no results", () => {
  renderWithProviders(<FestivalSimulator />, {
    path: "/festival/simulator?participation=maybe",
  });

  expect(screen.getByText("Participation must be on or off.")).toBeDefined();
  expect(screen.getByRole("alert").textContent).toMatch(/No results/);
});
