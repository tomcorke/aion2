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
