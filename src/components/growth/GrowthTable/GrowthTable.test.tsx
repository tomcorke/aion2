import { screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { growthMaterials } from "../../../data/growth.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { GrowthTable } from "./GrowthTable.tsx";

test("renders one row per material under labelled columns", () => {
  renderWithProviders(<GrowthTable materials={growthMaterials.slice(0, 3)} />);

  const table = screen.getByRole("table", { name: "Growth materials" });

  expect(within(table).getAllByRole("rowheader")).toHaveLength(3);
  expect(
    within(table)
      .getAllByRole("columnheader")
      .map(({ textContent }) => textContent),
  ).toEqual(["Item", "Grows", "From", "Limits and conditions"]);
});
