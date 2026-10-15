import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { addSeconds, format } from "date-fns";
import { dailyReset, timerDefs } from "../data/timers.ts";
import { resolveTimer } from "./resolveTimer.ts";
import { describe, expect, test } from "vitest";
import { HOUR, NOW } from "../testing/render.tsx";
import {
  everyHours,
  formatAt,
  formatCountdown,
  formatDate,
  formatServerClock,
  secondsUntilNext,
} from "./time.ts";

const MON = 1;
const WED = 3;
const THU = 4;
const SAT = 6;

describe("everyHours", () => {
  test("lists each slot from the start hour until midnight", () => {
    expect(everyHours(2, 3)).toEqual([2, 5, 8, 11, 14, 17, 20, 23]);
    expect(everyHours(0, 1)).toHaveLength(24);
  });
});

describe("secondsUntilNext", () => {
  test("finds the next slot today", () => {
    expect(secondsUntilNext(NOW, { hours: [16], minute: 0 })).toBe(2 * HOUR);
    expect(secondsUntilNext(NOW, { hours: everyHours(0, 1), minute: 30 })).toBe(
      HOUR / 2,
    );
  });

  test("skips past slots, including the one happening now", () => {
    expect(secondsUntilNext(NOW, { hours: everyHours(2, 3), minute: 0 })).toBe(
      3 * HOUR,
    );
  });

  test("only counts the given weekdays", () => {
    expect(secondsUntilNext(NOW, { hours: [16], minute: 0, days: [WED] })).toBe(
      2 * HOUR,
    );
    expect(
      secondsUntilNext(NOW, { hours: [21], minute: 0, days: [MON, THU, SAT] }),
    ).toBe(31 * HOUR);
    expect(secondsUntilNext(NOW, { hours: [13], minute: 0, days: [WED] })).toBe(
      7 * 24 * HOUR - HOUR,
    );
  });

  test("keeps server wall-clock times across the end of summer time", () => {
    // Saturday 24 October 17:00 CEST. Sunday 16:00 CET is 23 wall-clock hours later, plus the
    // hour gained when the clocks go back.
    expect(
      secondsUntilNext(new Date("2026-10-24T15:00:00Z"), {
        hours: [16],
        minute: 0,
      }),
    ).toBe(24 * HOUR);
  });

  test.each([
    ["2026-10-24T23:30:00.123Z", 0, "2026-10-25T00:00:00Z"],
    ["2026-10-24T23:45:00Z", 30, "2026-10-25T00:30:00Z"],
    ["2026-10-25T00:15:00.123Z", 30, "2026-10-25T00:30:00Z"],
    ["2026-10-25T00:30:00.123Z", 0, "2026-10-25T01:00:00Z"],
    ["2026-10-25T00:45:00.123Z", 30, "2026-10-25T01:30:00Z"],
    ["2026-10-25T00:00:00Z", 0, "2026-10-25T01:00:00Z"],
    ["2026-10-25T01:00:00Z", 0, "2026-10-25T02:00:00Z"],
    ["2026-10-25T01:30:00Z", 30, "2026-10-25T02:30:00Z"],
    ["2026-03-29T00:30:00.123Z", 0, "2026-03-29T01:00:00Z"],
    ["2026-03-29T00:45:00.123Z", 30, "2026-03-29T01:30:00Z"],
    ["2026-03-29T01:00:00Z", 0, "2026-03-29T02:00:00Z"],
  ])(
    "after %s, hourly minute %i slots respect repeated and missing Berlin hours",
    (nowISO, minute, nextISO) => {
      const now = new Date(nowISO);
      const seconds = secondsUntilNext(now, {
        hours: everyHours(0, 1),
        minute,
      });

      expect(new Date(now.getTime() + seconds * 1000).toISOString()).toBe(
        new Date(nextISO).toISOString(),
      );

      const def = timerDefs.find(
        ({ id }) => id === (minute === 0 ? "festival" : "invasion"),
      )!;

      expect(resolveTimer(def, now, "elyos", {}).secondsLeft).toBe(seconds);
    },
  );

  test("does not invent a 02:00 slot inside the spring clock gap", () => {
    expect(
      secondsUntilNext(new Date("2026-03-29T00:30:00Z"), {
        hours: everyHours(2, 3),
        minute: 0,
        days: [0],
      }),
    ).toBe(9000);
  });

  test.each([
    ["2026-10-24T23:45:00Z", [2], 30, [0], "2026-10-25T00:30:00Z"],
    ["2026-10-25T00:45:00Z", [2], 30, [0], "2026-10-25T01:30:00Z"],
    ["2026-03-29T00:30:00Z", [2], 0, [0], "2026-04-05T00:00:00Z"],
    ["2026-10-21T14:00:00Z", [16], 0, [3], "2026-10-28T15:00:00Z"],
    ["2026-03-25T15:00:00Z", [16], 0, [3], "2026-04-01T14:00:00Z"],
    ["2026-03-28T15:00:00Z", [16], 0, undefined, "2026-03-29T14:00:00Z"],
  ] satisfies [string, number[], number, number[] | undefined, string][])(
    "fixed and weekly slots after %s keep their Berlin hour and weekday",
    (nowISO, hours, minute, days, nextISO) => {
      const now = new Date(nowISO);
      const seconds = secondsUntilNext(now, { hours, minute, days });

      expect(new Date(now.getTime() + seconds * 1000).toISOString()).toBe(
        new Date(nextISO).toISOString(),
      );
    },
  );

  test("throws when no weekday is allowed", () => {
    expect(() =>
      secondsUntilNext(NOW, { hours: [1], minute: 0, days: [] }),
    ).toThrow();
  });
});

test("sub-second reset countdown reconstructs the exact UTC and server minute", () => {
  const now = new Date("2026-10-14T12:00:00.123Z");
  const seconds = secondsUntilNext(now, dailyReset);
  const target = addSeconds(now, seconds);

  expect(formatAt(target, "server")).toBe("Wed 16:00");
  expect(formatAt(target, "utc")).toBe("Wed 14:00");
  expect(target.toISOString()).toBe("2026-10-14T14:00:00.000Z");
  expect(seconds).toBeCloseTo(7199.877, 3);
});

test.each([
  ["2026-10-14T13:59:59.999Z", "2026-10-14T14:00:00.000Z", "Wed"],
  ["2026-10-14T14:00:00.000Z", "2026-10-15T14:00:00.000Z", "Thu"],
  ["2026-10-14T14:00:00.001Z", "2026-10-15T14:00:00.000Z", "Thu"],
])(
  "reset boundary %s reconstructs only the next future slot",
  (nowISO, expected, day) => {
    const now = new Date(nowISO);
    const target = addSeconds(now, secondsUntilNext(now, dailyReset));

    expect(target.toISOString()).toBe(expected);
    expect(formatAt(target, "server")).toBe(`${day} 16:00`);
    expect(formatAt(target, "utc")).toBe(`${day} 14:00`);
  },
);

describe("formatCountdown", () => {
  test("shows the two largest units", () => {
    expect(formatCountdown(31 * HOUR)).toBe("1d 7h");
    expect(formatCountdown(2 * HOUR)).toBe("2h 00m");
    expect(formatCountdown(65)).toBe("1m 05s");
  });
});

describe("clock formatting", () => {
  test("formats a time in the chosen zone", () => {
    expect(formatAt(NOW, "server")).toBe("Wed 14:00");
    expect(formatAt(NOW, "utc")).toBe("Wed 12:00");
    expect(formatAt(NOW, "local")).toBe(format(NOW, "EEE HH:mm"));
  });

  test("shows the server clock with seconds", () => {
    expect(formatServerClock(NOW)).toBe("14:00:00");
  });

  test("writes ISO dates out in full", () => {
    expect(formatDate("2026-10-14")).toBe("14 October 2026");
  });

  test("calendar source dates do not become the previous day in America/New_York", () => {
    const moduleURL = pathToFileURL(resolve("src/lib/time.ts")).href;
    const result = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import { formatDate } from ${JSON.stringify(moduleURL)}; process.stdout.write(formatDate("2026-10-14"));`,
      ],
      { env: { ...process.env, TZ: "America/New_York" }, encoding: "utf8" },
    );

    expect(result).toBe("14 October 2026");
  });
});
