import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import {
  growthLimitations,
  growthSpendGuidance,
} from "../../../data/growth.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { GrowthAdvice } from "./GrowthAdvice.tsx";

test("shows every spend group and open limitation", () => {
  renderWithProviders(<GrowthAdvice />);

  for (const { title } of growthSpendGuidance)
    expect(screen.getByRole("heading", { name: title })).toBeDefined();

  for (const item of growthLimitations)
    expect(screen.getByText(item)).toBeDefined();
});
