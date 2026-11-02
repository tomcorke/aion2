import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import { Route, Routes } from "react-router";
import { afterEach, expect, test, vi } from "vitest";
import { NotFound } from "../pages/NotFound/NotFound.tsx";
import { Routine } from "../pages/Routine/Routine.tsx";
import { Timers } from "../pages/Timers/Timers.tsx";
import { freezeClock, renderWithProviders } from "../testing/render.tsx";
import { resourceCounters } from "./alts.ts";
import {
  bankingReminders,
  activeRoutineEventReminders,
  routineEventReminders,
  routineContract,
  routineSources,
  routineTasks,
} from "./routine.ts";
import { sections } from "./sections.ts";

afterEach(() => vi.useRealTimers());

test("the Abyss reminder opens the delivered Timers page instead of Not Found", async () => {
  freezeClock();
  renderWithProviders(
    createElement(
      Routes,
      null,
      createElement(Route, {
        path: "/routine",
        element: createElement(Routine),
      }),
      createElement(Route, {
        path: "/timers/:view",
        element: createElement(Timers),
      }),
      createElement(Route, { path: "*", element: createElement(NotFound) }),
    ),
    { path: "/routine" },
  );

  await userEvent.click(
    screen.getByRole("link", { name: "Lower Reshanta timers" }),
  );

  expect(
    screen.getByRole("heading", { name: "Timers", level: 1 }),
  ).toBeDefined();
  expect(screen.queryByRole("heading", { name: "Page not found" })).toBeNull();
});

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

test("the Invasion key reminder stays optional and keeps its client scope qualified", () => {
  const invasion = routineTasks.find((row) => row.id === "invasion-keys");

  expect(invasion?.group).toBe("daily");
  expect(invasion?.title).toMatch(/^Optional:/);
  expect(invasion?.counterIds).toEqual(["invasion-keys"]);
  expect(invasion?.details).toMatch(/only when participating/i);
  expect(invasion?.details).toMatch(/client-derived.*not been confirmed/i);
  expect(routineSources).toContain("metabotEvents");
});

test("Gathering is a selected daily reminder with its official limits qualified", () => {
  const gathering = routineTasks.find(({ id }) => id === "gathering");

  expect(gathering?.group).toBe("daily");
  expect(gathering?.title).toMatch(/^Optional:/);
  expect(gathering?.counterIds).toEqual([]);
  expect(gathering?.warning).toContain("requires level 45");
  expect(gathering?.warning).toContain("1,000 gathers per server");
  expect(gathering?.warning).toContain("08:00 CET");
  expect(gathering?.warning).toMatch(
    /does not explain how this count is attributed/i,
  );
  expect(gathering?.warning).toMatch(/players, accounts or characters/);
  expect(routineSources).toContain("ncGlobal28Oct");
});

test("login event reminders keep separate dates, expiry context and visibility windows", () => {
  const attendance = routineEventReminders.find(
    ({ id }) => id === "atreias-call-attendance",
  );
  const odyleMail = routineEventReminders.find(
    ({ id }) => id === "odyle-energy-boost-mail",
  );

  expect(attendance?.dateContext).toMatch(/2 December 2026/);
  expect(odyleMail?.dateContext).toMatch(/11 November 2026/);
  expect(odyleMail?.dateContext).toMatch(/7 days after receipt/);
  expect(activeRoutineEventReminders("2026-11-18").map(({ id }) => id)).toEqual(
    expect.arrayContaining([
      "atreias-call-attendance",
      "odyle-energy-boost-mail",
    ]),
  );
  expect(activeRoutineEventReminders("2026-11-19").map(({ id }) => id)).toEqual(
    ["atreias-call-attendance"],
  );
  expect(activeRoutineEventReminders("2026-12-03")).toEqual([]);
  expect(routineSources).toEqual(
    expect.arrayContaining(["ncAtreiasCall", "ncOdyleEnergyBoost"]),
  );
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
  expect(weekly.find((task) => task.id === "raids")?.purpose).toContain(
    "Ludra Normal (2,800) and Hard (3,000)",
  );
  expect(weekly.find((task) => task.id === "raids")?.purpose).toContain(
    "scheduled to return on 4 November 2026; both are still upcoming as checked on 1 November 2026",
  );
  expect(
    weekly.find((task) => task.id === "membership-spiritstones")?.details,
  ).toMatch(/membership/i);
});

test("Abyss shop reminder lists Potential tiers and the full item budget", () => {
  const details = routineTasks.find(({ id }) => id === "abyss-shop")?.details;

  expect(details).toContain("2 at 25,000 AP each, 4 at 50,000");
  expect(details).toContain("20 per account per week");
  expect(details).toContain("550,000 AP");
  expect(details).toContain("950,000 AP budget");
  expect(routineSources).toContain("metabotAbyssPoints");
  expect(routineSources).toContain("metabotEnhancementCalculator");
});

test("all stable task IDs resolve to canonical scope and limits and detailed guides", () => {
  expect(new Set(routineTasks.map((task) => task.id)).size).toBe(
    routineTasks.length,
  );

  const paths = sections.map((section) => `/${section.path}`);

  for (const task of routineTasks) {
    expect(task.id).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
    expect(task.purpose.length).toBeGreaterThan(0);
    if (task.id === "gathering") expect(task.counterIds).toEqual([]);
    else expect(task.counterIds.length).toBeGreaterThan(0);
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
