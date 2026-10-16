import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { growthMaterials, type GrowthMaterial } from "../../../data/growth.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { GrowthRow } from "./GrowthRow.tsx";

const base: GrowthMaterial = {
  id: "test",
  name: "Test Stone",
  aliases: [],
  kind: "material",
  targets: ["engraving"],
  use: "Test use.",
  acquisition: [{ name: "Somewhere" }],
  links: [],
  sourceIds: [],
};

const renderRow = (material: GrowthMaterial) =>
  renderWithProviders(
    <table>
      <tbody>
        <GrowthRow material={material} />
      </tbody>
    </table>,
  );

test("Kina displays the bankable Duty Missions cap", () => {
  renderRow(growthMaterials.find((material) => material.id === "kina")!);

  expect(
    screen.getByText(
      "Duty Missions: 5 completions per day, cap 20, shared on the server.",
    ),
  ).toBeDefined();
});

test("an unrecorded limit reads as unrecorded, not zero or unlimited", () => {
  renderRow(base);

  expect(screen.getByText("No limit recorded.")).toBeDefined();
  expect(screen.getByText("Engraving")).toBeDefined();
});

test("shared counters show their scope and route limits sit beside the route", () => {
  renderRow({
    ...base,
    acquisition: [
      { name: "Shop", limit: "5 a week." },
      { name: "Dungeon", counterId: "daily-dungeon" },
    ],
    condition: "Bound.",
  });

  expect(screen.getByText("5 a week.")).toBeDefined();
  expect(screen.getByText(/shared on the server\.$/)).toBeDefined();
  expect(screen.getByText("Bound.")).toBeDefined();
  expect(screen.queryByText("No limit recorded.")).toBeNull();
});

test("each cell carries its column name for the stacked layout", () => {
  renderRow(base);

  const labels = screen.getAllByRole("cell").map((cell) => cell.dataset.label);

  expect(labels).toEqual(["Grows", "From", "Limits and conditions"]);
});
