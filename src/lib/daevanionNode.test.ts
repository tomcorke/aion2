import { expect, test } from "vitest";
import type { BoardNode } from "../data/daevanionRoutes.ts";
import {
  describeNode,
  plural,
  position,
  type ViewNode,
} from "./daevanionNode.ts";

const node = (overrides: Partial<BoardNode> = {}): BoardNode => ({
  key: "9,8",
  row: 9,
  col: 8,
  type: "Stat",
  grade: "Common",
  cost: 1,
  label: "HP +100",
  short: "+100",
  stats: [],
  skillLevels: 1,
  ...overrides,
});

const view = (overrides: Partial<ViewNode> = {}): ViewNode => ({
  node: node(),
  name: "HP +100",
  step: 3,
  phase: "HP and MP",
  cumulativeCost: 3,
  target: true,
  bought: false,
  next: false,
  ...overrides,
});

test("plural and position read naturally", () => {
  expect(plural(1, "point")).toBe("1 point");
  expect(plural(0, "point")).toBe("0 points");
  expect(position(node())).toBe("Row 9, column 8");
});

test("Start is free whatever the route", () => {
  expect(
    describeNode(view({ node: node({ type: "Start", cost: 0 }), step: null })),
  ).toBe("Start, free");
});

test("a node the route skips says so", () => {
  expect(describeNode(view({ step: null, target: false }))).toBe(
    "HP +100, 1 point, not on this route",
  );
});

test.each([
  [{ bought: true }, "target, within budget"],
  [{ next: true }, "target, next purchase"],
  [{}, "target, beyond budget"],
  [{ target: false, node: node({ cost: 3 }) }, "connector, beyond budget"],
])("a route node states its role and budget status", (overrides, tail) => {
  expect(describeNode(view(overrides))).toMatch(new RegExp(`step 3, ${tail}$`));
});

test("costs above one are plural", () => {
  expect(describeNode(view({ node: node({ cost: 3 }) }))).toMatch(
    /^HP \+100, 3 points,/,
  );
});
