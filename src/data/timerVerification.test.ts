import { expect, test } from "vitest";
import { timerDefs } from "./timers.ts";
import {
  timerClockWarning,
  timerVerificationNotes,
  timerVerificationSources,
} from "./timerVerification.ts";
import { sources } from "./sources.ts";

test("the shared clock warning keeps EU resets and Berlin conditional", () => {
  expect(timerClockWarning).toMatch(/Berlin.*assumption/);
  expect(timerClockWarning).toMatch(/EU.*reset.*unresolved/);
  expect(timerClockWarning).toContain("07:00 UTC");
  expect(timerClockWarning).toMatch(/in-game countdown/);
  expect(timerClockWarning).toContain("not a confirmed EU server clock");
});

test.each([
  ["rift", /starting hour.*clock/],
  ["invasion", /duration.*rotation.*unresolved/],
  ["siege", /not.*checked live/],
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
});
