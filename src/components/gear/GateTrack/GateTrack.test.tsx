import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { gearTiers } from "../../../data/gear.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { GateTrack } from "./GateTrack.tsx";

const tier = (id: string) => gearTiers.find((row) => row.id === id)!;

test("the top tier has no next step", () => {
  renderWithProviders(<GateTrack tier={tier("102")} />);

  expect(
    screen.getByRole("definition", { name: "Opens at total item level" })
      .textContent,
  ).toMatch(/^2,800.*Abyssal Forge: Ludra Raid/);
  expect(screen.queryByRole("definition", { name: "Next tier" })).toBeNull();
});
