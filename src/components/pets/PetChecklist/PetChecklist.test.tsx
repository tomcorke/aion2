import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import type { Pet } from "../../../data/pets.ts";
import { PetChecklist } from "./PetChecklist.tsx";

const pets: Pet[] = [
  {
    id: "a",
    name: "Aberrant Test",
    type: "Natura",
    areas: ["x", "y"],
    other: ["Random shop"],
  },
  {
    id: "b",
    name: "Shop Only",
    type: "Special",
    areas: [],
    other: ["Pet chests"],
  },
];

const renderList = (
  levels = {},
  selected = new Set<string>(),
  maxOnly = false,
) => {
  const handlers = {
    onToggleLevel: vi.fn(),
    onToggleSelected: vi.fn(),
    onHover: vi.fn(),
  };

  render(
    <PetChecklist
      pets={pets}
      levels={levels}
      selected={selected}
      maxOnly={maxOnly}
      {...handlers}
    />,
  );

  return handlers;
};

test("lists the stats given at each level for the pet type", () => {
  renderList();

  expect(screen.getByText("Stamina +3")).toBeTruthy();
  expect(screen.getByText("Stamina +6, Critical Hit Resist +1")).toBeTruthy();
  expect(
    screen.getByText("Stamina +9, Critical Hit Resist +2, Precision +1"),
  ).toBeTruthy();
  expect(screen.getAllByText("No stat bonus")).toHaveLength(3);
});

test("says where each pet comes from", () => {
  renderList();

  expect(
    screen.getByText("Natura · 2 farming areas · Random shop"),
  ).toBeTruthy();
  expect(screen.getByText("Special · Pet chests")).toBeTruthy();
});

test("a pet level ticks every level up to its own", () => {
  renderList({ a: 2 });

  expect(
    (
      screen.getByRole("checkbox", {
        name: "Aberrant Test level 1",
      }) as HTMLInputElement
    ).checked,
  ).toBe(true);
  expect(
    (
      screen.getByRole("checkbox", {
        name: "Aberrant Test level 2",
      }) as HTMLInputElement
    ).checked,
  ).toBe(true);
  expect(
    (
      screen.getByRole("checkbox", {
        name: "Aberrant Test level 3",
      }) as HTMLInputElement
    ).checked,
  ).toBe(false);
});

test("colours each marked level and the row by the highest level", () => {
  renderList({ a: 2 });

  const done = (n: number) =>
    screen
      .getByRole("checkbox", { name: `Aberrant Test level ${n}` })
      .closest("label")
      ?.getAttribute("data-done");

  expect([done(1), done(2), done(3)]).toEqual(["true", "true", "false"]);
  expect(
    screen.getByText("Aberrant Test").closest("li")?.getAttribute("data-level"),
  ).toBe("2");
});

test("can show a single box for level 3", () => {
  renderList({ a: 3 }, new Set(), true);

  expect(screen.queryByRole("checkbox", { name: /level [12]$/ })).toBeNull();
  expect(
    (
      screen.getByRole("checkbox", {
        name: "Aberrant Test level 3",
      }) as HTMLInputElement
    ).checked,
  ).toBe(true);
});

test("reports level ticks, map selection and hover", async () => {
  const { onToggleLevel, onToggleSelected, onHover } = renderList(
    {},
    new Set(["b"]),
  );

  await userEvent.click(
    screen.getByRole("checkbox", { name: "Aberrant Test level 3" }),
  );
  await userEvent.click(
    screen.getByRole("checkbox", { name: "Show Aberrant Test on the map" }),
  );
  await userEvent.hover(screen.getByText("Shop Only"));

  expect(onToggleLevel).toHaveBeenCalledWith("a", 3);
  expect(onToggleSelected).toHaveBeenCalledWith("a");
  expect(onHover).toHaveBeenLastCalledWith("b");
  expect(
    (
      screen.getByRole("checkbox", {
        name: "Show Shop Only on the map",
      }) as HTMLInputElement
    ).checked,
  ).toBe(true);
});

test("says when nothing matches", () => {
  render(
    <PetChecklist
      pets={[]}
      levels={{}}
      selected={new Set()}
      onToggleLevel={() => {}}
      onToggleSelected={() => {}}
      onHover={() => {}}
    />,
  );

  expect(screen.getByText("No pets match these filters.")).toBeTruthy();
});
