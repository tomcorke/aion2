import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { stoneEngraving } from "../../../data/gearUpgrades.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { UpgradeStones } from "./UpgradeStones.tsx";

test("lists each stone kind with its slots and any warning", () => {
  renderWithProviders(<UpgradeStones />);

  for (const { name, slots } of stoneEngraving)
    expect(
      screen.getByRole("row", { name: new RegExp(`^${name}`) }).textContent,
    ).toContain(slots[0]);

  expect(screen.getAllByRole("note")).toHaveLength(
    stoneEngraving.filter(({ warning }) => warning).length,
  );
});

test("pairs each tier's line grades with their odds", () => {
  renderWithProviders(<UpgradeStones />);

  expect(screen.getByRole("row", { name: /^Lesser/ }).textContent).toContain(
    "Common 70%, Rare 30%",
  );
});
