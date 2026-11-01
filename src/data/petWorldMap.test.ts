import { expect, test } from "vitest";
import { petAreas } from "./pets.ts";
import { worldLand, worldMapSize, worldPoints } from "./petWorldMap.ts";

test("every farming area has a spot on the map, and no spot is unused", () => {
  const ids = petAreas.map(({ id }) => id).sort();

  expect([...worldPoints.keys()].sort()).toEqual(ids);
});

test("spots sit inside the map and clear of each other", () => {
  const spots = [...worldPoints.entries()];
  const crowded: string[] = [];

  for (const [id, [x, y]] of spots) {
    expect(x, id).toBeGreaterThan(10);
    expect(x, id).toBeLessThan(worldMapSize.width - 10);
    expect(y, id).toBeGreaterThan(10);
    expect(y, id).toBeLessThan(worldMapSize.height - 10);
  }

  for (const [index, [id, [x, y]]] of spots.entries())
    for (const [other, [ox, oy]] of spots.slice(index + 1))
      if (Math.hypot(x - ox, y - oy) < 16) crowded.push(`${id} / ${other}`);

  expect(crowded).toEqual([]);
});

test("each region with zones has a landmass and a label", () => {
  expect(worldLand.map(({ id }) => id).sort()).toEqual([
    "altgard",
    "lower-reshanta",
    "middle-reshanta",
    "other",
    "verteron",
  ]);

  for (const { path, label } of worldLand) {
    expect(path.startsWith("M")).toBe(true);
    expect(label).toHaveLength(2);
  }
});
