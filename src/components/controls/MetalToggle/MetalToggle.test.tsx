import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle.tsx";
import { MetalToggle } from "./MetalToggle.tsx";

test("swaps the accent metal", async () => {
  renderWithProviders(<MetalToggle />);

  await userEvent.click(
    screen.getByRole("button", { name: "Accent gold; switch to silver" }),
  );

  expect(document.documentElement.dataset.metal).toBe("silver");
});

test("each theme keeps its own metal", async () => {
  renderWithProviders(
    <>
      <MetalToggle />
      <ThemeToggle />
    </>,
  );

  await userEvent.click(screen.getByRole("button", { name: /^Accent/ }));
  await userEvent.click(
    screen.getByRole("button", { name: "Switch to day mode" }),
  );

  expect(document.documentElement.dataset.metal).toBe("silver");

  await userEvent.click(screen.getByRole("button", { name: /^Accent/ }));
  await userEvent.click(
    screen.getByRole("button", { name: "Switch to night mode" }),
  );

  expect(document.documentElement.dataset.metal).toBe("silver");
});
