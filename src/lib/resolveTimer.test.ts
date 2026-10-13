import { describe, expect, test } from "vitest";
import { timerDefs, type TimerDef } from "../data/timers.ts";
import { HOUR, NOW } from "../testing/render.tsx";
import { markerSize, resolveTimer } from "./resolveTimer.ts";

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
