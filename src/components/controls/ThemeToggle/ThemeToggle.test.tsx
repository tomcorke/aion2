import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { ThemeToggle } from "./ThemeToggle.tsx";

test("switches between night and day", async () => {
  renderWithProviders(<ThemeToggle />);

  await userEvent.click(
    screen.getByRole("button", { name: "Switch to day mode" }),
  );

  expect(document.documentElement.dataset.theme).toBe("day");
  expect(
    screen.getByRole("button", { name: "Switch to night mode" }),
  ).toBeDefined();
});
