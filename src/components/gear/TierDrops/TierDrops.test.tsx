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

test("shows Hard rewards in the relevant tier view without adding gear rows", () => {
  renderWithProviders(<TierDrops tierId="70" />);

  const rules = screen.getByRole("region", { name: "Reward rules" });

  expect(rules.textContent).toContain("Urugugu Canyon Hard");
  expect(rules.textContent).toContain("Vakron Sky Island Hard");
  expect(rules.textContent).toContain(
    "A bound Ariel Fragment matching the dungeon is guaranteed",
  );
  expect(rules.textContent).toContain(
    "Hard-mode equipment drop table and rates are not recorded",
  );
  expect(screen.queryByRole("row", { name: /Philosopher's Stone/ })).toBeNull();
});
