import { expect, test } from "vitest";
import { petAreas } from "./pets.ts";
import { worldLand, worldMapSize, worldPoints } from "./petWorldMap.ts";

type Point = readonly [number, number];

const polygonsFrom = (path: string): Point[][] =>
  path
    .split("Z")
    .filter(Boolean)
    .map((segment) => {
      const values = (segment.match(/-?[\d.]+/g) ?? []).map(Number);

      return Array.from(
        { length: values.length / 2 },
        (_, index) => [values[index * 2], values[index * 2 + 1]] as const,
      );
    });

function contains([px, py]: Point, polygon: Point[]) {
  let inside = false;

  for (
    let index = 0, previous = polygon.length - 1;
    index < polygon.length;
    previous = index++
  ) {
    const [x, y] = polygon[index];
    const [ox, oy] = polygon[previous];
    const cross = (px - ox) * (y - oy) - (py - oy) * (x - ox);
    const onSegment =
      Math.abs(cross) < 1e-6 &&
      px >= Math.min(x, ox) - 1e-6 &&
      px <= Math.max(x, ox) + 1e-6 &&
      py >= Math.min(y, oy) - 1e-6 &&
      py <= Math.max(y, oy) + 1e-6;

    if (onSegment) return false;

    if (y > py !== oy > py && px < ((ox - x) * (py - y)) / (oy - y) + x)
      inside = !inside;
  }

  return inside;
}

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

test("non-dungeon area markers sit on one of their region's land shapes", () => {
  const land = new Map(worldLand.map(({ id, path }) => [id, path]));
  const outside: string[] = [];

  for (const area of petAreas) {
    if (area.region === "dungeons") continue;

    const polygons = polygonsFrom(land.get(area.region)!);
    const point = worldPoints.get(area.id)!;
    const onLand = polygons.some((polygon) => contains(point, polygon));

    if (!onLand) outside.push(area.id);
  }

  expect(outside).toEqual([]);
});
