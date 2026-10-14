import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import {
  amplificationRates,
  enhancementGrades,
  enhancementRates,
} from "../../../data/gearUpgrades.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { UpgradeRates } from "./UpgradeRates.tsx";

test("ordinary track shows every grade and rate from the data", () => {
  renderWithProviders(<UpgradeRates track="enhancement" />);

  expect(screen.getAllByRole("table")).toHaveLength(2);
  expect(screen.getAllByRole("row")).toHaveLength(
    enhancementGrades.length + enhancementRates.length + 2,
  );
});

test("Amplified track shows only its own rates", () => {
  renderWithProviders(<UpgradeRates track="amplification" />);

  expect(screen.getAllByRole("table")).toHaveLength(1);
  expect(screen.getAllByRole("row")).toHaveLength(
    amplificationRates.length + 1,
  );
});
