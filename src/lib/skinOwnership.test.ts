import { expect, test } from "vitest";
import { ownedCount, toggleOwned, validOwned } from "./skinOwnership.ts";

const known = new Set(["a", "b"]);

test("keeps only known piece IDs, once each", () => {
  expect(validOwned(["a", "x", 3, "a", "b"], known)).toEqual(["a", "b"]);
});

test("a stored value that is not a list owns nothing", () => {
  expect(validOwned({ a: true }, known)).toEqual([]);
  expect(validOwned("a", known)).toEqual([]);
  expect(validOwned(null, known)).toEqual([]);
});

test("toggling adds then removes one piece", () => {
  expect(toggleOwned(["a"], "b")).toEqual(["a", "b"]);
  expect(toggleOwned(["a", "b"], "a")).toEqual(["b"]);
});

test("counts only the listed pieces that are owned", () => {
  expect(ownedCount([{ id: "a" }, { id: "c" }], ["a", "b"])).toBe(1);
});
