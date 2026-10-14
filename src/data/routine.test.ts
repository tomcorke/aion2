import { expect, test } from "vitest";
import { resourceCounters } from "./alts.ts";
import { bankingReminders, routineContract, routineTasks } from "./routine.ts";
import { sections } from "./sections.ts";

test("daily reminders reuse canonical limits without converting weekly entries into daily grants", () => {
  const task = (id: string) => routineTasks.find((row) => row.id === id);

  expect(task("duty-missions")?.group).toBe("daily");
  expect(task("duty-missions")?.counterIds).toEqual(["duty-missions"]);
  expect(task("nightmare")?.counterIds).toEqual(["nightmare"]);
  expect(task("daily-dungeon")?.counterIds).toEqual(["daily-dungeon"]);
  expect(resourceCounters["daily-dungeon"].kind).toBe("weekly");
  expect(task("daily-dungeon")?.purpose).toMatch(/10,000.*10,000.*140,000/);
  expect(task("conquest")?.counterIds).toEqual([
    "odyle-energy",
    "conquest-rewards",
    "unobtained-cubes",
  ]);
  expect(task("transcendence")?.counterIds).toEqual([
    "odyle-energy",
    "transcendence-rewards",
    "unobtained-cubes",
  ]);
  expect(task("conquest")?.warning).toMatch(/At 0.*no character/);
});

test("weekly work covers dungeon, time, shop and crafting allowances", () => {
  const weekly = routineTasks.filter((task) => task.group === "weekly");

  expect(weekly.map((task) => task.id)).toEqual(
    expect.arrayContaining([
      "exploration",
      "ascension-trial",
      "subjugation",
      "raids",
      "growth-time",
      "abyss-time",
      "abyss-shop",
      "morph-energy",
      "morph-medals",
      "membership-spiritstones",
    ]),
  );

  const crafting = weekly.find((task) => task.id === "morph-energy");

  expect(crafting?.counterIds).toEqual([
    "morph-energy-character",
    "morph-energy-server",
  ]);
  expect(weekly.find((task) => task.id === "subjugation")?.details).toMatch(
    /item rewards.*unverified/i,
  );
  expect(
    weekly.find((task) => task.id === "membership-spiritstones")?.details,
  ).toMatch(/membership/i);
});

test("all stable task IDs resolve to canonical scope and limits and detailed guides", () => {
  expect(new Set(routineTasks.map((task) => task.id)).size).toBe(
    routineTasks.length,
  );

  const paths = sections.map((section) => `/${section.path}`);

  for (const task of routineTasks) {
    expect(task.id).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
    expect(task.purpose.length).toBeGreaterThan(0);
    expect(task.counterIds.length).toBeGreaterThan(0);
    expect(paths).toContain(`/${task.guide.to.split("/")[1]}`);

    for (const id of task.counterIds) {
      expect(resourceCounters[id].limit).not.toBe("");
      expect(["character", "server"]).toContain(resourceCounters[id].scope);
    }
  }
});

test("banking reminders and checklist copy forbid automatic reset interpretation", () => {
  expect(bankingReminders.join(" ")).toMatch(/continuous/i);
  expect(bankingReminders.join(" ")).toMatch(/Nightmare.*14/);
  expect(bankingReminders.join(" ")).toMatch(
    /EU reset clock remains unresolved/,
  );
  expect(routineContract).toMatch(/not.*live.*counters/i);
  expect(routineContract).toMatch(/only.*confirm/i);
  expect(routineContract).toMatch(/do not clear.*midnight.*offline/i);
});
