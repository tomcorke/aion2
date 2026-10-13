import { expect, test } from "vitest";
import { sources } from "./sources.ts";
import { dailyReset, timerDefs, timerSources } from "./timers.ts";

test("timer ids are unique", () => {
  const ids = timerDefs.map(({ id }) => id);

  expect(new Set(ids).size).toBe(ids.length);
});

test("slots are real clock times and weekdays", () => {
  const slots = [
    dailyReset,
    ...timerDefs.flatMap(({ schedule }) =>
      schedule.kind === "slots" ? [schedule] : [],
    ),
  ];

  for (const { hours, minute, days = [] } of slots) {
    expect(hours.every((hour) => hour >= 0 && hour < 24)).toBe(true);
    expect(minute).toBeGreaterThanOrEqual(0);
    expect(minute).toBeLessThan(60);
    expect(days.every((day) => day >= 0 && day < 7)).toBe(true);
  }
});

test("bosses carry a gear item level and fixed timers do not", () => {
  for (const { group, itemLevel } of timerDefs) {
    if (group === "fixed") expect(itemLevel).toBeUndefined();
    else expect(itemLevel).toBeGreaterThan(0);
  }
});

test("field bosses respawn and nothing else does", () => {
  for (const { group, schedule } of timerDefs) {
    expect(schedule.kind === "respawn").toBe(group === "field");
  }
});

test("timer sources are all known sources", () => {
  for (const id of timerSources) expect(sources).toHaveProperty(id);
});
