import { screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { resourceCounters } from "../../../data/alts.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { CounterTable } from "./CounterTable.tsx";

const row = (name: string) =>
  screen.getByRole("row", { name: new RegExp(name) });

test("lists every curated counter once", () => {
  renderWithProviders(<CounterTable />);

  for (const { name } of Object.values(resourceCounters))
    expect(screen.getByRole("rowheader", { name })).toBeDefined();
});

test("groups counters by how they refill", () => {
  renderWithProviders(<CounterTable />);

  const groups = screen
    .getAllByRole("columnheader")
    .filter((cell) => cell.getAttribute("scope") === "colgroup")
    .map((cell) => cell.textContent);

  expect(groups).toEqual([
    "Continuous refills",
    "Daily grants",
    "Weekly allowances",
    "Time budgets",
  ]);
});

test("shows current scope, refill and caps", () => {
  renderWithProviders(<CounterTable />);

  const energy = row("^Odyle Energy Each");

  expect(within(energy).getByText("Each character")).toBeDefined();
  expect(
    within(energy).getByText("15 every 3 hours, cap 560 (840 with membership)"),
  ).toBeDefined();

  const daily = row("Daily Dungeon");

  expect(within(daily).getByText("Server")).toBeDefined();
  expect(within(daily).getByText("14 entries each week")).toBeDefined();
  expect(within(daily).getByText(/this is a weekly pool/)).toBeDefined();

  expect(
    within(row("Lower Abyss")).getByText(
      "7 hours each week; 14 with membership",
    ),
  ).toBeDefined();
});

test("links each counter to its guide", () => {
  renderWithProviders(<CounterTable />);

  expect(
    within(row("Raid attempts"))
      .getByRole("link", { name: "Raid gates and drops" })
      .getAttribute("href"),
  ).toBe("/gear");
});
