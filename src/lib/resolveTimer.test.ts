import { addSeconds } from "date-fns";
import { describe, expect, test } from "vitest";
import { timerDefs, type TimerDef } from "../data/timers.ts";
import { HOUR, NOW } from "../testing/render.tsx";
import { markerSize, resolveTimer } from "./resolveTimer.ts";
import { formatAt } from "./time.ts";

const def = (id: string) =>
  timerDefs.find((timer) => timer.id === id) as TimerDef;
const hoursAgo = (hours: number) => NOW.getTime() - hours * HOUR * 1000;

describe("resolveTimer", () => {
  test("counts fixed slots down on the server clock", () => {
    const weekly = resolveTimer(def("weekly"), NOW, "elyos", {});

    expect(weekly).toMatchObject({
      name: "Weekly reset",
      secondsLeft: 2 * HOUR,
      respawns: false,
    });
  });

  test("counts field bosses from the marked kill, per faction", () => {
    const kills = { dartan: hoursAgo(1) };

    expect(resolveTimer(def("dartan"), NOW, "elyos", kills).secondsLeft).toBe(
      2 * HOUR,
    );
    expect(
      resolveTimer(def("dartan"), NOW, "asmodians", kills).secondsLeft,
    ).toBe(5 * HOUR);
  });

  test.each([
    ["elyos", "2026-10-14T14:00:00.123Z", "Wed 16:00"],
    ["asmodians", "2026-10-14T17:00:00.123Z", "Wed 19:00"],
  ] as const)(
    "preserves marked-kill milliseconds for %s deadlines",
    (faction, expected, server) => {
      const now = new Date("2026-10-14T12:00:00.789Z");
      const kills = { dartan: new Date("2026-10-14T11:00:00.123Z").getTime() };
      const timer = resolveTimer(def("dartan"), now, faction, kills);
      const target = addSeconds(now, timer.secondsLeft!);

      expect(target.toISOString()).toBe(expected);
      expect(formatAt(target, "server")).toBe(server);
      expect(formatAt(target, "utc")).toBe(
        faction === "elyos" ? "Wed 14:00" : "Wed 17:00",
      );
      expect(kills.dartan).toBe(new Date("2026-10-14T11:00:00.123Z").getTime());
    },
  );

  test.each([
    ["2026-10-14T14:00:00.122Z", 0.001],
    ["2026-10-14T14:00:00.123Z", null],
    ["2026-10-14T14:00:00.124Z", null],
  ] as const)(
    "keeps a marked boss timed until its exact respawn at %s",
    (now, expected) => {
      const kills = { dartan: new Date("2026-10-14T11:00:00.123Z").getTime() };

      expect(
        resolveTimer(def("dartan"), new Date(now), "elyos", kills).secondsLeft,
      ).toBe(expected);
    },
  );

  test("leaves a field boss untimed with no kill, or once it has respawned", () => {
    expect(
      resolveTimer(def("dartan"), NOW, "elyos", {}).secondsLeft,
    ).toBeNull();
    expect(
      resolveTimer(def("dartan"), NOW, "elyos", { dartan: hoursAgo(4) })
        .secondsLeft,
    ).toBeNull();
  });

  test("names the boss for the reader's faction", () => {
    expect(resolveTimer(def("gartua"), NOW, "elyos", {}).name).toBe(
      "Eternal Gartua",
    );
    expect(resolveTimer(def("gartua"), NOW, "asmodians", {}).name).toBe(
      "Immortal Gartua",
    );
  });
});

describe("markerSize", () => {
  test("grows with gear item level, with a small ring for fixed timers", () => {
    expect(markerSize()).toBe(14);
    expect(markerSize(46)).toBeLessThan(markerSize(86));
  });
});
