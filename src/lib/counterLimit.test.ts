import { expect, test } from "vitest";
import { resourceCounters } from "../data/alts.ts";
import { counterLimit } from "./counterLimit.ts";

test("banked caps differ from weekly allowances and time budgets", () => {
  expect(counterLimit(resourceCounters["duty-missions"])).toBe(
    "5 completions per day, cap 20",
  );
  expect(counterLimit(resourceCounters["odyle-energy"])).toBe(
    "15 every 3 hours, cap 560 (840 with membership)",
  );
  expect(counterLimit(resourceCounters.raids)).toBe(
    "4 attempts per raid each week",
  );
  expect(counterLimit(resourceCounters["abyss-lower"])).toBe(
    "7 hours each week; 14 with membership",
  );
});
