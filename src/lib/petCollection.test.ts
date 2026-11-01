import { describe, expect, test } from "vitest";
import type { Pet } from "../data/pets.ts";
import {
  areasOf,
  bestArea,
  countByArea,
  filterPets,
  heatStep,
  toggleLevel,
  toggleMax,
  validLevels,
} from "./petCollection.ts";

const pet = (id: string, ...areas: string[]): Pet => ({
  id,
  name: id,
  type: "Fera",
  areas,
  other: [],
});

const pets = [
  pet("a", "north", "south"),
  pet("b", "north"),
  pet("c", "south"),
  pet("d", "east"),
  pet("shop"),
];

describe("validLevels", () => {
  test("keeps known pets with levels 1 to 3 only", () => {
    const known = new Set(["a", "b", "c"]);

    expect(validLevels({ a: 2, b: 0, c: 4, x: 3, d: "1" }, known)).toEqual({
      a: 2,
    });
    expect(validLevels([1, 2], known)).toEqual({});
    expect(validLevels(null, known)).toEqual({});
  });
});

describe("toggleLevel", () => {
  test("ticking a level sets it, including the ones below", () => {
    expect(toggleLevel({}, "a", 3)).toEqual({ a: 3 });
  });

  test("unticking a level drops to the level below", () => {
    expect(toggleLevel({ a: 3 }, "a", 2)).toEqual({ a: 1 });
    expect(toggleLevel({ a: 3 }, "a", 3)).toEqual({ a: 2 });
    expect(toggleLevel({ a: 1 }, "a", 1)).toEqual({});
  });
});

describe("toggleMax", () => {
  test("ticking sets level 3 and unticking clears the pet", () => {
    expect(toggleMax({ a: 1 }, "a")).toEqual({ a: 3 });
    expect(toggleMax({ a: 3, b: 2 }, "a")).toEqual({ b: 2 });
  });
});

describe("farming areas", () => {
  test("counts unfinished and unowned pets per area, skipping maxed pets", () => {
    const counts = countByArea(pets, { a: 3, b: 1 });

    expect(counts.get("north")).toEqual({ unfinished: 1, unowned: 0 });
    expect(counts.has("south")).toBe(true);
    expect(counts.get("south")).toEqual({ unfinished: 1, unowned: 1 });
    expect(counts.get("east")).toEqual({ unfinished: 1, unowned: 1 });
  });

  test("picks the area with the most unfinished pets", () => {
    const order = ["south", "north", "east"];

    expect(bestArea(countByArea(pets, {}), order)).toBe("south");
    expect(bestArea(countByArea(pets, { c: 3 }), order)).toBe("north");
  });

  test("breaks ties with unowned pets, then map order", () => {
    const tied = [pet("p", "x"), pet("q", "y")];

    expect(bestArea(countByArea(tied, { p: 1 }), ["x", "y"])).toBe("y");
    expect(bestArea(countByArea(tied, {}), ["x", "y"])).toBe("x");
  });

  test("has no best area once everything is maxed", () => {
    const maxed = Object.fromEntries(pets.map(({ id }) => [id, 3 as const]));

    expect(bestArea(countByArea(pets, maxed), ["north"])).toBeUndefined();
  });

  test("lists the areas of chosen pets", () => {
    expect(areasOf(pets, new Set(["b", "d", "shop"]))).toEqual(
      new Set(["north", "east"]),
    );
  });
});

test("heat steps run from none to four", () => {
  expect(heatStep(0, 8)).toBe(0);
  expect(heatStep(1, 8)).toBe(1);
  expect(heatStep(4, 8)).toBe(2);
  expect(heatStep(8, 8)).toBe(4);
});

describe("filterPets", () => {
  const typed = [
    { ...pet("Alpha", "north"), type: "Natura" as const },
    { ...pet("Beta", "south"), type: "Cogni" as const },
    pet("Gamma", "north"),
  ];
  const none = { query: "", types: new Set<string>(), hideMaxed: false };

  test("matches names, types, areas and hides maxed pets", () => {
    const names = (
      filters: Partial<typeof none> & { area?: string },
      levels = {},
    ) => filterPets(typed, levels, { ...none, ...filters }).map(({ id }) => id);

    expect(names({})).toEqual(["Alpha", "Beta", "Gamma"]);
    expect(names({ query: " ALP " })).toEqual(["Alpha"]);
    expect(names({ types: new Set(["Natura", "Cogni"]) })).toEqual([
      "Alpha",
      "Beta",
    ]);
    expect(names({ area: "north" })).toEqual(["Alpha", "Gamma"]);
    expect(names({ hideMaxed: true }, { Beta: 3, Gamma: 2 })).toEqual([
      "Alpha",
      "Gamma",
    ]);
  });
});
