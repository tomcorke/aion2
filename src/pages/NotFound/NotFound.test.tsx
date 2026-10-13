import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../testing/render.tsx";
import { NotFound } from "./NotFound.tsx";

test("says the page is missing and links home", () => {
  renderWithProviders(<NotFound />, { path: "/nowhere" });

  expect(
    screen.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeDefined();
  expect(
    screen
      .getByRole("link", { name: "Back to the start" })
      .getAttribute("href"),
  ).toBe("/");
});
