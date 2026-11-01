import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { gearTiers } from "../../../data/gear.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { GateTrack } from "./GateTrack.tsx";

const tier = (id: string) => gearTiers.find((row) => row.id === id)!;

test("the top tier shows both Ludra gates and has no next step", () => {
  renderWithProviders(<GateTrack tier={tier("102")} />);

  const gates = screen.getByRole("definition", {
    name: "Opens at total item level",
  }).textContent;

  expect(gates).toContain("2,800 Abyssal Forge: Ludra Normal");
  expect(gates).toContain("3,000 Abyssal Forge: Ludra Hard");
  expect(gates).toContain("still upcoming when checked on 1 November 2026");
  expect(screen.queryByRole("definition", { name: "Next tier" })).toBeNull();
});

test("Hard Expedition entry modes appear in the matching tier track", () => {
  renderWithProviders(<GateTrack tier={tier("54")} />);

  const gates = screen.getByRole("definition", {
    name: "Opens at total item level",
  }).textContent;

  expect(gates).toContain("2,600 Krao Cave Hard");
  expect(gates).toContain("2,600 Draupnir Hard");
});
