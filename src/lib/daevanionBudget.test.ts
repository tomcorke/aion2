import { expect, test } from "vitest";
import { daevanionRouteData } from "../data/daevanionRoutes.ts";
import type { PurchaseRoute } from "../data/daevanionRoutes.ts";
import { getRouteBudget, parseRouteBudget } from "./daevanionBudget.ts";

// A connected order: a 1-point connector, 3-point target, 1-point target.
const route: PurchaseRoute = {
  total: 5,
  phaseEnd: [5],
  targets: ["7,9", "7,10"],
  steps: [
    { node: "7,8", phase: 0, cumulativeCost: 1 },
    { node: "7,9", phase: 0, cumulativeCost: 4 },
    { node: "7,10", phase: 0, cumulativeCost: 5 },
  ],
};

test.each([null, undefined, 0, "0"])(
  "missing or zero budget %s buys nothing",
  (raw) => {
    expect(getRouteBudget(route, raw)).toEqual({
      points: 0,
      message: null,
      purchases: [],
      spent: 0,
      leftover: 0,
      next: route.steps[0],
      nextCost: 1,
    });
  },
);

test.each([
  [1, 1, 1, 0, 3],
  [3, 1, 1, 2, 3],
  [4, 2, 4, 0, 1],
  [5, 3, 5, 0, null],
])(
  "whole budget %s takes only an affordable prefix",
  (raw, count, spent, leftover, nextCost) => {
    const result = getRouteBudget(route, raw);

    expect(result.purchases).toEqual(route.steps.slice(0, count!));
    expect(result).toMatchObject({
      points: raw,
      spent,
      leftover,
      nextCost,
      message: null,
    });
    expect(result.next).toEqual(route.steps[count!] ?? null);
  },
);

test.each([NaN, Infinity, -Infinity, "NaN", "Infinity", "oops", "", "  "])(
  "invalid budget %s is zero with a useful message",
  (raw) => {
    const result = parseRouteBudget(raw, 5);

    expect(result.points).toBe(0);
    expect(result.message).toContain("finite");
  },
);

test.each([
  [-1, 0],
  ["-6", 0],
  [2.9, 2],
  ["3.5", 3],
  [6, 5],
  ["100", 5],
])("budget %s is normalized to %s with an explanation", (raw, points) => {
  expect(parseRouteBudget(raw, 5)).toEqual({
    points,
    message: `Budget adjusted to ${points} whole points (0–5).`,
  });
});

test("changing selection clamps the budget without treating purchases as ownership", () => {
  const longRoute =
    daevanionRouteData.classes.spiritmaster.boards.nezekan.routes.utility;
  const shorterRoute =
    daevanionRouteData.classes.cleric.boards.vaizel.routes.damage;

  expect(getRouteBudget(longRoute, 113).spent).toBe(113);
  expect(getRouteBudget(shorterRoute, 113)).toMatchObject({
    points: 83,
    spent: 83,
    leftover: 0,
    next: null,
    nextCost: null,
  });
  expect(getRouteBudget(shorterRoute, 0).purchases).toEqual([]);
  expect(getRouteBudget(longRoute, 113).purchases).toHaveLength(
    longRoute.steps.length,
  );
});

test("Azphel's 36-point phase and +78 continuation end at 114 whole points", () => {
  const azphel = daevanionRouteData.azphel;
  const phaseOne = azphel.steps.filter((step) => step.phase === 0);

  expect(getRouteBudget(azphel, 36)).toMatchObject({
    purchases: phaseOne,
    spent: 36,
    leftover: 0,
  });
  expect(getRouteBudget(azphel, 114)).toMatchObject({
    purchases: azphel.steps,
    spent: 114,
    leftover: 0,
    next: null,
    nextCost: null,
  });
  expect(getRouteBudget(azphel, 224)).toMatchObject({
    points: 114,
    spent: 114,
  });
  expect(
    getRouteBudget(azphel, 114).spent - getRouteBudget(azphel, 36).spent,
  ).toBe(78);

  for (const [index, step] of azphel.steps.entries()) {
    const exact = getRouteBudget(azphel, step.cumulativeCost);
    const below = getRouteBudget(azphel, step.cumulativeCost - 1);

    expect(exact.purchases).toHaveLength(index + 1);
    expect(exact.spent).toBe(step.cumulativeCost);
    expect(below.purchases).toHaveLength(index);
    expect(below.next).toEqual(step);
  }
});
