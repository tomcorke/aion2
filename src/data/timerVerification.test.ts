import { expect, test } from "vitest";
import { timerDefs } from "./timers.ts";
import {
  timerClockWarning,
  timerPageSources,
  timerVerificationNotes,
  timerVerificationSources,
} from "./timerVerification.ts";
import { sources } from "./sources.ts";

test("the shared clock warning keeps EU resets and Berlin conditional", () => {
  expect(timerClockWarning).toMatch(/Berlin.*assumption/);
  expect(timerClockWarning).toMatch(/EU timing.*remain unresolved/);
  expect(timerClockWarning).toContain("ticket-table reset");
  expect(timerClockWarning).toContain("Wednesday weekly reset");
  expect(timerClockWarning).toContain("16:00 Korea time / 07:00 UTC");
  expect(timerClockWarning).toContain("08:00 Berlin");
  expect(timerClockWarning).toContain("Gathering limit and current Attendance");
  expect(timerClockWarning).toContain("07:00 UTC");
  expect(timerClockWarning).toContain(
    "Treat both countdown targets as provisional",
  );
  expect(timerClockWarning).toMatch(/in-game countdown/);
  expect(timerClockWarning).toContain("not a confirmed EU server clock");
  expect(timerClockWarning).not.toMatch(/one universal reset/i);
});

test.each([
  ["rift", /starting hour.*clock/],
  ["invasion", /duration.*rotation.*unresolved/],
  [
    "siege",
    /reported group schedules.*not been checked.*one evening.*do not confirm repeating times/,
  ],
  ["reshanta", /one evening.*three-hour interval.*unconfirmed/],
  ["field", /Altgard.*Verteron.*extrapolation/],
  ["festival", /5 October 2026.*:00.*duration.*rotation/],
])(
  "retains the current %s evidence limit without a certainty badge",
  (id, meaning) => {
    const note = timerVerificationNotes.find((entry) => entry.id === id);

    expect(note?.message).toMatch(meaning);
  },
);

test("warnings use stable IDs, actual timers and known registry sources", () => {
  expect(new Set(timerVerificationNotes.map(({ id }) => id)).size).toBe(
    timerVerificationNotes.length,
  );

  for (const { timerIds, message } of timerVerificationNotes) {
    expect(timerIds.length).toBeGreaterThan(0);

    for (const id of timerIds)
      expect(timerDefs.some((timer) => timer.id === id)).toBe(true);

    expect(message).not.toMatch(
      /https?:|\[S\d+\]|Client-derived:|Community-reported:/,
    );
  }

  for (const id of timerVerificationSources) expect(id in sources).toBe(true);
  for (const id of timerPageSources) expect(id in sources).toBe(true);
  expect(new Set(timerPageSources).size).toBe(timerPageSources.length);
});
