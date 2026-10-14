import { screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { daevanionClasses } from "../../../data/daevanion.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { RouteCosts } from "./RouteCosts.tsx";

const entry = (id: string) => daevanionClasses.find((c) => c.id === id)!;

const row = (name: RegExp) => screen.getByRole("row", { name });

test("each board row compares the three routes against the board's full cost", () => {
  renderWithProviders(<RouteCosts entry={entry("spiritmaster")} />);

  expect(row(/^Nezekan/).textContent).toMatch(/Opens at level 12.*134 full/);
  expect(
    within(row(/^Nezekan/))
      .getAllByRole("cell")
      .map((cell) => cell.textContent),
  ).toEqual(["107", "113", "115"]);
  expect(
    within(row(/^All four boards/))
      .getAllByRole("cell")
      .map((cell) => cell.textContent),
  ).toEqual(["409", "446", "453"]);

  const bar = screen.getByRole("meter", {
    name: "Damage on Triniel: 115 of 168 points",
  }) as HTMLMeterElement;

  expect(bar.value).toBe(115);
  expect(bar.max).toBe(168);
  expect(
    screen.getByRole("meter", {
      name: "Damage + utility in total: 446 of 570 points",
    }),
  ).toBeDefined();
  expect(screen.queryByText(/not recorded in the maintained notes/)).toBeNull();
});

test("missing defensive board costs say so instead of showing a bar", () => {
  renderWithProviders(<RouteCosts entry={entry("templar")} />);

  const cells = within(row(/^Zikel/)).getAllByRole("cell");

  expect(cells.map((cell) => cell.textContent)).toEqual([
    "96",
    "106",
    "Not recorded",
  ]);
  expect(within(cells[2]).queryByRole("meter")).toBeNull();
  expect(
    within(row(/^All four boards/)).getAllByRole("cell")[2].textContent,
  ).toBe("464");
  expect(
    screen.getByText(/not recorded in the maintained notes/),
  ).toBeDefined();
  expect(screen.getByText(/share one Daevanion point pool/)).toBeDefined();
});
