import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { DropMatrix } from "./DropMatrix.tsx";

const activities = () =>
  within(screen.getByRole("table"))
    .getAllByRole("rowheader")
    .map((cell) => cell.textContent);

test("Mixed sets do not match a specific slot", async () => {
  renderWithProviders(<DropMatrix />);

  await userEvent.click(screen.getByRole("button", { name: "Weapons" }));

  expect(activities().some((name) => name?.startsWith("Argo"))).toBe(false);
  expect(activities().some((name) => name?.startsWith("Abyssal Forge"))).toBe(
    true,
  );
});

test("pressing the chosen slot again clears the filter", async () => {
  renderWithProviders(<DropMatrix />);

  const all = activities().length;

  await userEvent.click(screen.getByRole("button", { name: "Mixed" }));

  expect(activities().length).toBeLessThan(all);

  await userEvent.click(screen.getByRole("button", { name: "Mixed" }));

  expect(activities()).toHaveLength(all);
});

test("shows upper-bound levels and Exploration cube costs", () => {
  renderWithProviders(<DropMatrix />);

  expect(
    screen.getByRole("row", { name: /^Abyssal Forge: Ludra/ }).textContent,
  ).toContain("up to 102");
  expect(screen.getByRole("row", { name: /^Krao Cave/ }).textContent).toContain(
    "cube: 20 Odyle Energy",
  );
});

test("shows Hard gates and their documented rewards without inventing equipment drops", () => {
  renderWithProviders(<DropMatrix />);

  const krao = screen.getByRole("row", { name: /^Krao Cave/ });
  const vakron = screen.getByRole("row", { name: /^Vakron Sky Island/ });

  expect(krao.textContent).toContain("Hard 2,600");
  expect(krao.textContent).toContain("four-minute Frenzy timer");
  expect(krao.textContent).toContain("Philosopher's Stone: Revelation");
  expect(vakron.textContent).toContain("Hard 2,700");
  expect(vakron.textContent).toContain(
    "Ariel Fragment matching the dungeon is guaranteed",
  );
  expect(vakron.textContent).toContain("drop rate is not recorded");
});

test("a mode's own condition sits with that mode", () => {
  renderWithProviders(<DropMatrix />);

  const tier4 = screen.getByText(/^Tier 4/);

  expect(tier4.textContent).toContain("Unique Chalice drops only in tier 4.");
  expect(screen.getByText(/^Tier 3/).textContent).not.toContain("Chalice");
});

test("gear-dropping modes leave their reward rules to the tier view", () => {
  renderWithProviders(<DropMatrix />);

  expect(
    screen.getByRole("row", { name: /^Silent Dartan/ }).textContent,
  ).not.toContain("loot chest is guaranteed");
});
