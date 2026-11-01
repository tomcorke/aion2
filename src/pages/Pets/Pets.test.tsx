import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test } from "vitest";
import { petAreas, pets } from "../../data/pets.ts";
import { renderWithProviders } from "../../testing/render.tsx";
import { Pets } from "./Pets.tsx";

const farmed = pets.filter(({ areas }) => areas.length > 0);
const first = farmed[0];

const render = () => renderWithProviders(<Pets />, { path: "/pets" });

const tiles = () =>
  within(screen.getByRole("region", { name: "Farming map" })).getAllByRole(
    "button",
    { name: /to finish/ },
  );

const tileFor = (areaId: string) => {
  const name = petAreas.find(({ id }) => id === areaId)?.name;

  return tiles().find((tile) =>
    tile.getAttribute("aria-label")?.startsWith(`${name}, `),
  )!;
};

// Labels read "Name, 12 to finish" with an optional ", best area" suffix.
const left = (tile: HTMLElement) =>
  Number(tile.getAttribute("aria-label")?.split(", ")[1].split(" ")[0]);

const level = (name: string, n: number) =>
  screen.getByRole("checkbox", { name: `${name} level ${n}` });

const option = (name: string) => screen.getByRole("button", { name });

beforeEach(() => localStorage.clear());

test("lists every obtainable pet with a checklist for levels 1 to 3", () => {
  render();

  expect(screen.getAllByRole("checkbox", { name: /level 1$/ })).toHaveLength(
    pets.length,
  );
  expect(screen.getAllByRole("checkbox", { name: /level 3$/ })).toHaveLength(
    pets.length,
  );
  expect(
    screen.getByText(`0/${pets.length} owned · 0 at level 3`),
  ).toBeTruthy();
});

test("ticks save in this browser and count toward progress", async () => {
  render();

  await userEvent.click(level(first.name, 3));

  expect((level(first.name, 1) as HTMLInputElement).checked).toBe(true);
  expect((level(first.name, 2) as HTMLInputElement).checked).toBe(true);
  expect(JSON.parse(localStorage.getItem("pet-levels") ?? "{}")).toEqual({
    [first.id]: 3,
  });
  expect(
    screen.getByText(`1/${pets.length} owned · 1 at level 3`),
  ).toBeTruthy();

  await userEvent.click(level(first.name, 2));

  expect((level(first.name, 3) as HTMLInputElement).checked).toBe(false);
  expect(
    screen.getByText(`1/${pets.length} owned · 0 at level 3`),
  ).toBeTruthy();
});

test("hovering a pet marks its areas on the map", async () => {
  render();

  await userEvent.hover(level(first.name, 1));

  for (const id of first.areas)
    expect(tileFor(id).getAttribute("data-lit")).toBe("true");

  expect(tiles().filter((tile) => tile.dataset.lit === "true")).toHaveLength(
    first.areas.length,
  );

  await userEvent.unhover(level(first.name, 1));

  expect(tiles().some((tile) => tile.dataset.lit === "true")).toBe(false);
});

test("selected pets stay marked, and select all and none fill or clear them", async () => {
  render();
  const [, second] = farmed.filter(({ areas }) => areas[0] !== first.areas[0]);

  await userEvent.click(
    screen.getByRole("checkbox", { name: `Show ${first.name} on the map` }),
  );
  await userEvent.click(
    screen.getByRole("checkbox", { name: `Show ${second.name} on the map` }),
  );

  const marked = new Set([...first.areas, ...second.areas]);

  expect(tiles().filter((tile) => tile.dataset.lit === "true")).toHaveLength(
    marked.size,
  );
  expect(screen.getByText("2 selected")).toBeTruthy();

  await userEvent.click(option(`Select all shown (${pets.length})`));

  expect(screen.getByText(`${pets.length} selected`)).toBeTruthy();
  expect(tiles().every((tile) => tile.dataset.lit === "true")).toBe(true);

  await userEvent.click(option("Select none"));

  expect(screen.getByText("0 selected")).toBeTruthy();
  expect(tiles().some((tile) => tile.dataset.lit === "true")).toBe(false);
});

test("select all covers only the pets that match the filters", async () => {
  render();

  await userEvent.click(option("Cogni"));

  const cogni = pets.filter(({ type }) => type === "Cogni").length;

  await userEvent.click(option(`Select all shown (${cogni})`));

  expect(screen.getByText(`${cogni} selected`)).toBeTruthy();
});

test("highlights the area where the most pets are still below level 3", async () => {
  render();

  expect(tiles().some((tile) => tile.dataset.best === "true")).toBe(false);

  await userEvent.click(option("Highlight best area"));

  const best = tiles().filter((tile) => tile.dataset.best === "true");

  expect(best).toHaveLength(1);
  expect(left(best[0])).toBe(Math.max(...tiles().map(left)));
  expect(screen.getByText(/Best next area:/)).toBeTruthy();
});

test("the best area moves on once its pets are maxed", async () => {
  render();
  await userEvent.click(option("Highlight best area"));

  const before = tiles().find((tile) => tile.dataset.best === "true")!;

  await userEvent.click(before);

  for (const box of screen.getAllByRole("checkbox", { name: /level 3$/ }))
    await userEvent.click(box);

  await userEvent.click(option("Show all pets"));

  const after = tiles().find((tile) => tile.dataset.best === "true")!;

  expect(after).not.toBe(before);
  expect(left(before)).toBe(0);
});

test("the heatmap shades areas by pets left", async () => {
  render();

  expect(tiles().every((tile) => tile.dataset.heat === undefined)).toBe(true);

  await userEvent.click(option("Heatmap of pets left"));

  const heat = (tile: HTMLElement) => Number(tile.dataset.heat);

  expect(Math.max(...tiles().map(heat))).toBe(4);
  expect(heat(tiles().find((tile) => left(tile) === 1)!)).toBeLessThan(4);
});

test("picking an area lists only the pets that drop there", async () => {
  render();

  const area = first.areas[0];
  const dropping = pets.filter(({ areas }) => areas.includes(area));

  await userEvent.click(tileFor(area));

  expect(screen.getAllByRole("checkbox", { name: /level 1$/ })).toHaveLength(
    dropping.length,
  );

  await userEvent.click(option("Show all pets"));

  expect(screen.getAllByRole("checkbox", { name: /level 1$/ })).toHaveLength(
    pets.length,
  );
});

test("search and hiding level 3 pets narrow the list", async () => {
  render();

  await userEvent.type(
    screen.getByRole("searchbox", { name: "Search pets" }),
    first.name,
  );

  expect(level(first.name, 1)).toBeTruthy();

  await userEvent.click(level(first.name, 3));
  await userEvent.click(option("Hide level 3 pets"));

  expect(
    screen.queryByRole("checkbox", { name: `${first.name} level 1` }),
  ).toBeNull();
});

test("select all adds to picks that a filter hides", async () => {
  render();

  await userEvent.click(
    screen.getByRole("checkbox", { name: `Show ${first.name} on the map` }),
  );
  await userEvent.click(option("Cogni"));

  const cogni = pets.filter(({ type }) => type === "Cogni").length;

  await userEvent.click(option(`Select all shown (${cogni})`));

  expect(screen.getByText(`${cogni + 1} selected`)).toBeTruthy();
});

test("a hovered row that a filter removes stops marking its areas", async () => {
  render();

  await userEvent.click(option("Hide level 3 pets"));
  await userEvent.hover(level(first.name, 3));
  await userEvent.click(level(first.name, 3));

  expect(tiles().some((tile) => tile.dataset.lit === "true")).toBe(false);
});

test("the level 3 box only option leaves one box that sets or clears level 3", async () => {
  render();

  await userEvent.click(option("Level 3 box only"));

  expect(screen.queryByRole("checkbox", { name: /level 1$/ })).toBeNull();

  await userEvent.click(level(first.name, 3));

  expect(JSON.parse(localStorage.getItem("pet-levels") ?? "{}")).toEqual({
    [first.id]: 3,
  });

  await userEvent.click(level(first.name, 3));

  expect(JSON.parse(localStorage.getItem("pet-levels") ?? "{}")).toEqual({});
});
