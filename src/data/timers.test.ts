import { expect, test } from "vitest";
import { sources } from "./sources.ts";
import { dailyReset, timerDefs, timerSources } from "./timers.ts";
import { resolveTimer } from "../lib/resolveTimer.ts";
import { secondsUntilNext } from "../lib/time.ts";

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

test("Festival is a notes-backed fixed hourly entry timer without a duration or gear filter", () => {
  expect(timerDefs.find(({ id }) => id === "festival")).toEqual({
    id: "festival",
    name: "Shugo Festival",
    group: "fixed",
    schedule: {
      kind: "slots",
      hours: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ],
      minute: 0,
    },
  });
  expect(timerSources).toContain("game8Festival");
  expect(timerDefs.map(({ name }) => name)).not.toContain("Singularity Rift");
});

test("legacy IDs and faction kill semantics remain unchanged", () => {
  expect(
    timerDefs.filter(({ id }) => id !== "festival").map(({ id }) => id),
  ).toEqual([
    "weekly",
    "siege",
    "rift",
    "invasion",
    "nahma",
    "executors",
    "gartua",
    "kaira",
    "lagta",
    "kashapa",
    "dartan",
  ]);
  const now = new Date("2026-10-14T12:00:00Z");
  const killedAt = new Date("2026-10-14T11:00:00Z").getTime();

  for (const [id, elyos, asmodians] of [
    ["gartua", 18000, 39600],
    ["lagta", 18000, 39600],
    ["kashapa", 18000, 18000],
    ["dartan", 7200, 18000],
  ] as const) {
    const def = timerDefs.find((timer) => timer.id === id)!;

    expect(resolveTimer(def, now, "elyos", {}).secondsLeft).toBeNull();
    expect(resolveTimer(def, now, "asmodians", {}).secondsLeft).toBeNull();
    expect(
      resolveTimer(def, now, "elyos", { [id]: killedAt }).secondsLeft,
    ).toBe(elyos);
    expect(
      resolveTimer(def, now, "asmodians", { [id]: killedAt }).secondsLeft,
    ).toBe(asmodians);
  }
});

test("Festival rolls forward at the exact slot and the Berlin reset assumption handles daylight saving", () => {
  const festival = timerDefs.find(({ id }) => id === "festival")!;
  const weekly = timerDefs.find(({ id }) => id === "weekly")!;

  expect(
    resolveTimer(festival, new Date("2026-10-14T12:59:59Z"), "elyos", {})
      .secondsLeft,
  ).toBe(1);
  expect(
    resolveTimer(festival, new Date("2026-10-14T13:00:00Z"), "elyos", {})
      .secondsLeft,
  ).toBe(3600);
  expect(secondsUntilNext(new Date("2026-10-14T13:59:59Z"), dailyReset)).toBe(
    1,
  );
  expect(secondsUntilNext(new Date("2026-10-24T14:00:00Z"), dailyReset)).toBe(
    90000,
  );
  expect(
    resolveTimer(weekly, new Date("2026-10-21T14:00:00Z"), "elyos", {})
      .secondsLeft,
  ).toBe(608400);
});
