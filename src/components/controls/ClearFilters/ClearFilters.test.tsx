import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { ClearFilters } from "./ClearFilters.tsx";

test("clears through the caller without submitting a form", async () => {
  const clear = vi.fn();

  renderWithProviders(<ClearFilters onClear={clear} />);

  const button = screen.getByRole("button", { name: "Clear filters" });

  expect(button.getAttribute("type")).toBe("button");
  await userEvent.click(button);
  expect(clear).toHaveBeenCalledOnce();
});
