import { format } from "date-fns";
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

  test("throws when no weekday is allowed", () => {
    expect(() =>
      secondsUntilNext(NOW, { hours: [1], minute: 0, days: [] }),
    ).toThrow();
  });
});

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
});
