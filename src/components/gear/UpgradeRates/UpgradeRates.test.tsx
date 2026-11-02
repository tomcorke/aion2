import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import {
  amplificationRates,
  amplificationCraftedCaps,
  amplificationTracks,
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
  const firstRate = screen.getByRole("row", { name: /\+10 → \+11/ });

  expect(firstRate.textContent).toContain("8");
  expect(firstRate.textContent).toContain("360,000 + 9,310");
});

test("Amplified track shows only its own rates", () => {
  renderWithProviders(<UpgradeRates track="amplification" />);

  expect(screen.getAllByRole("table")).toHaveLength(3);
  expect(screen.getAllByRole("row")).toHaveLength(
    amplificationTracks.length +
      amplificationCraftedCaps.length +
      amplificationRates.length +
      3,
  );
  expect(
    screen.getByRole("table", {
      name: "Amplified track checkpoints by item level",
    }),
  ).toBeDefined();
  expect(
    screen.getByRole("table", {
      name: "28 October crafted gear cap changes",
    }),
  ).toBeDefined();
  const trueDragon = screen.getByRole("row", {
    name: /True and Star Dragon Lord/,
  });
  const whiteDragon = screen.getByRole("row", {
    name: /White and Dark Dragon Lord/,
  });

  expect(trueDragon.textContent).toContain("+3");
  expect(whiteDragon.textContent).toContain("+5");
  expect(
    screen.getByText(
      /crafted caps take precedence.*item-level 62.*item-level 78/i,
    ),
  ).toBeDefined();
  expect(screen.getByRole("row", { name: /36–51 None/ })).toBeDefined();
  const maximumRate = screen.getByRole("row", { name: /^\+5/ });

  expect(maximumRate.textContent).toContain("81");
  expect(maximumRate.textContent).toContain("3,000,000 + 20");
  expect(screen.getByText(/Kina \+ Amplify Stones per attempt/)).toBeDefined();
});
