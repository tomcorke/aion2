import { screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { TierDrops } from "./TierDrops.tsx";

test("an unrecorded total gate says so rather than guessing", () => {
  renderWithProviders(<TierDrops tierId="54" />);

  const row = screen.getByRole("row", {
    name: /Bakarma.*Draupnir.*Exploration/,
  });

  expect(within(row).getByText("Not recorded")).toBeDefined();
});

test("shared loot tables list both modes", () => {
  renderWithProviders(<TierDrops tierId="70" />);

  expect(
    screen.getAllByRole("row", { name: /^Vakron Sky Island armor/ }),
  ).toHaveLength(2);
});
