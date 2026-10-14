import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { PityTable } from "./PityTable.tsx";

test("Conquest pity rows do not claim a membership bonus", () => {
  renderWithProviders(<PityTable />);

  const row = screen.getByRole("row", { name: /^Conquest: Urugugu Canyon/ });

  expect(row.textContent).toContain("21");
  expect(row.textContent).toContain("Not recorded");
});
