import assert from "node:assert/strict";
import { test } from "node:test";
import {
  formatCountdown,
  secondsUntil,
  secondsUntilEvery,
} from "../src/time.ts";
import { resolveTimer, timerDefs } from "../src/timers.ts";

// Wednesday 14 October 2026, 14:00 server time (Berlin, UTC+2).
const now = new Date("2026-10-14T12:00:00Z");
const HOUR = 3600;

test("weekly schedules count to the next matching server-time slot", () => {
  assert.equal(secondsUntil(now, 16, 0), 2 * HOUR);
  assert.equal(secondsUntil(now, 16, 0, [3]), 2 * HOUR);
  assert.equal(secondsUntil(now, 21, 0, [1, 4, 6]), 31 * HOUR);
  assert.equal(secondsUntil(now, 13, 0, [3]), 7 * 24 * HOUR - HOUR);
});

test("repeating schedules count to the next slot, never zero", () => {
  assert.equal(secondsUntilEvery(now, 2, 0, 3), 3 * HOUR);
  assert.equal(secondsUntilEvery(now, 0, 30, 1), HOUR / 2);
  assert.equal(secondsUntilEvery(now, 1, 0, 3), 2 * HOUR);
});

test("countdowns read in days, hours or minutes", () => {
  assert.equal(formatCountdown(2 * HOUR), "2h 00m");
  assert.equal(formatCountdown(31 * HOUR), "1d 7h");
  assert.equal(formatCountdown(65), "1m 05s");
});

test("field bosses count from the kill, per faction", () => {
  const dartan = timerDefs.find(({ id }) => id === "dartan")!;
  const kills = { dartan: now.getTime() - HOUR * 1000 };

  assert.equal(resolveTimer(dartan, now, "elyos", kills).secondsLeft, 2 * HOUR);
  assert.equal(
    resolveTimer(dartan, now, "asmodians", kills).secondsLeft,
    5 * HOUR,
  );
  assert.equal(resolveTimer(dartan, now, "elyos", {}).secondsLeft, null);
  assert.equal(
    resolveTimer(
      dartan,
      new Date(now.getTime() + 3 * HOUR * 1000),
      "elyos",
      kills,
    ).secondsLeft,
    null,
  );
});
