import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { routineSources, routineTasks } from "../../data/routine.ts";
import { sources } from "../../data/sources.ts";
import {
  freezeClock,
  NOW,
  renderWithProviders,
} from "../../testing/render.tsx";
import { Routine } from "./Routine.tsx";

const KEY = "routine-ticks";
const EVENT_KEY = "routine-event-ticks";

const DAY = 24 * 3600 * 1000;

const renderPage = () => renderWithProviders(<Routine />, { path: "/routine" });

const group = (name: "Daily" | "Weekly") =>
  screen.getByRole("region", { name });

const tick = (name: string) =>
  userEvent.click(screen.getByRole("checkbox", { name }));

const progress = (name: "Daily" | "Weekly") =>
  within(group(name)).getByRole("progressbar");

const stored = () => JSON.parse(localStorage.getItem(KEY)!) as string[];

const confirmWith = (answer: boolean) =>
  vi.spyOn(window, "confirm").mockReturnValue(answer);

const daily = routineTasks.filter((task) => task.group === "daily");
const weekly = routineTasks.filter((task) => task.group === "weekly");

beforeEach(() => localStorage.clear());

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

test("lists every task in its group with a checkbox", () => {
  renderPage();

  expect(within(group("Daily")).getAllByRole("checkbox")).toHaveLength(
    daily.length,
  );
  expect(within(group("Weekly")).getAllByRole("checkbox")).toHaveLength(
    weekly.length,
  );
  expect(
    within(group("Daily")).getByText(`0/${daily.length} done`),
  ).toBeDefined();
});

test("rows show rewards, limits, caps and scope from the shared counters", async () => {
  renderPage();

  const duty = screen.getByRole("listitem", { name: /Duty Missions/ });

  await userEvent.click(duty.querySelector("summary")!);
  expect(
    within(duty).getByText(
      "Earn 50,000 bound Kina and 1,000 Abyss Points per mission. The bound Kina goes to the character doing it.",
    ),
  ).toBeDefined();
  expect(within(duty).getByText(/5 completions per day/)).toBeDefined();
  expect(within(duty).getByText(/cap 20/)).toBeDefined();
  expect(within(duty).getByText("Server-shared")).toBeDefined();

  const conquest = screen.getByRole("listitem", { name: /Conquest/ });

  expect(
    within(conquest).getByText(/cap 560 \(840 with membership\)/),
  ).toBeDefined();
  expect(within(conquest).getAllByText("Per character")).toHaveLength(2);
  expect(within(conquest).getByText(/unobtained-cube count/)).toBeDefined();
});

test("Daily Dungeon distinguishes its two choices and leaves Odylium rewards unresolved", () => {
  const task = routineTasks.find(({ id }) => id === "daily-dungeon")!;

  expect(task.purpose).toContain("Daeva Bio-Research Base");
  expect(task.purpose).toContain("10,000 Enhance Stones");
  expect(task.purpose).toContain("Odylium Repository");
  expect(task.purpose).toContain("score reward remains unresolved");
  expect(task.details).toContain(
    "Unknown Fissure Challenge Ticket adds an entry",
  );
  expect(task.details).toContain(
    "Instant Clear Ticket repeats that reward and still spends an attempt",
  );
  expect(task.details).toContain("Both dungeons share the pool");
  expect(task.details).toContain(
    "Two a day is pacing advice, not a refill rule",
  );
  expect(task.details).toContain("unused entries are lost at Wednesday reset");
});

test("Routine describes its selected scope and shows Gathering without an inferred counter scope", () => {
  renderPage();

  expect(
    screen.getByText(
      /Selected daily and weekly reminders; this is not an exhaustive list/i,
    ),
  ).toBeDefined();

  const gathering = screen.getByRole("listitem", {
    name: "Optional: gather useful materials",
  });

  expect(within(gathering).getByText(/requires level 45/i)).toBeDefined();
  expect(
    within(gathering).getByText(/1,000 gathers per server/i),
  ).toBeDefined();
  expect(within(gathering).getByText(/resetting at 08:00 CET/i)).toBeDefined();
  expect(
    within(gathering).getByText(
      /does not explain how this count is attributed/i,
    ),
  ).toBeDefined();
  expect(within(gathering).queryByText("Server-shared")).toBeNull();
  expect(within(gathering).queryByText("Per character")).toBeNull();
});

test("guide links go to the detailed pages", () => {
  renderPage();

  for (const { guide } of routineTasks)
    expect(
      screen
        .getAllByRole("link", { name: guide.label })[0]!
        .getAttribute("href"),
    ).toBe(guide.to);

  expect(
    screen.getByRole("link", { name: /Timers/ }).getAttribute("href"),
  ).toBe("/timers");
});

test("says ticks are browser reminders and shows banking reminders", () => {
  renderPage();

  expect(screen.getByText(/not synchronized clears/)).toBeDefined();
  expect(screen.getByText(/refill continuously/)).toBeDefined();
  expect(screen.getByText(/EU reset clock remains unresolved/)).toBeDefined();
});

test("ticking updates group progress and survives a remount", async () => {
  const { unmount } = renderPage();

  await tick(daily[0]!.title);
  await tick(daily[1]!.title);
  await tick(daily[0]!.title);
  await tick(weekly[0]!.title);

  expect(
    within(group("Daily")).getByText(`1/${daily.length} done`),
  ).toBeDefined();
  expect(progress("Daily").getAttribute("value")).toBe("1");
  expect(
    within(group("Weekly")).getByText(`1/${weekly.length} done`),
  ).toBeDefined();
  expect(stored()).toEqual([daily[1]!.id, weekly[0]!.id]);

  unmount();
  renderPage();

  expect(
    (
      screen.getByRole("checkbox", {
        name: daily[1]!.title,
      }) as HTMLInputElement
    ).checked,
  ).toBe(true);
});

test.each([
  ["Daily", daily, weekly],
  ["Weekly", weekly, daily],
] as const)(
  "cancelling Clear %s changes nothing",
  async (name, mine, other) => {
    renderPage();
    await tick(mine[0]!.title);
    await tick(other[0]!.title);

    const confirm = confirmWith(false);

    await userEvent.click(
      within(group(name)).getByRole("button", {
        name: `Clear ${name.toLowerCase()}`,
      }),
    );

    expect(confirm).toHaveBeenCalledOnce();
    expect(stored()).toEqual([mine[0]!.id, other[0]!.id]);
  },
);

test.each([
  ["Daily", daily, weekly],
  ["Weekly", weekly, daily],
] as const)(
  "confirming Clear %s clears only that group",
  async (name, mine, other) => {
    renderPage();
    await tick(mine[0]!.title);
    await tick(mine[1]!.title);
    await tick(other[0]!.title);

    confirmWith(true);
    await userEvent.click(
      within(group(name)).getByRole("button", {
        name: `Clear ${name.toLowerCase()}`,
      }),
    );

    expect(stored()).toEqual([other[0]!.id]);
    expect(
      within(group(name)).getByText(`0/${mine.length} done`),
    ).toBeDefined();
  },
);

test("clearing leaves other features' storage alone", async () => {
  const others = {
    "skin-owned": '["spirit-wings-appearance"]',
    "timer-kills": '{"boss":123}',
    "timer-setup": '{"hidden":[]}',
  };

  for (const [key, value] of Object.entries(others))
    localStorage.setItem(key, value);

  renderPage();
  await tick(daily[0]!.title);
  confirmWith(true);
  await userEvent.click(screen.getByRole("button", { name: "Clear daily" }));

  for (const [key, value] of Object.entries(others))
    expect(localStorage.getItem(key)).toBe(value);
});

test("ticks never clear on their own as days pass", async () => {
  freezeClock();

  const { unmount } = renderPage();

  await tick(daily[0]!.title);
  await tick(weekly[0]!.title);
  unmount();

  for (const days of [1, 7, 30]) {
    vi.setSystemTime(NOW.getTime() + days * DAY);

    const view = renderPage();

    expect(stored()).toEqual([daily[0]!.id, weekly[0]!.id]);
    expect(
      within(group("Daily")).getByText(`1/${daily.length} done`),
    ).toBeDefined();
    view.unmount();
  }
});

test("malformed, unknown and duplicate stored ticks are ignored", () => {
  localStorage.setItem(
    KEY,
    JSON.stringify(["retired", daily[0]!.id, daily[0]!.id, 7]),
  );
  const first = renderPage();

  expect(
    within(group("Daily")).getByText(`1/${daily.length} done`),
  ).toBeDefined();
  first.unmount();

  for (const raw of ["{not json", '{"a":true}', '"duty-missions"']) {
    localStorage.setItem(KEY, raw);

    const view = renderPage();

    expect(
      within(group("Daily")).getByText(`0/${daily.length} done`),
    ).toBeDefined();
    view.unmount();
  }
});

test("blocked storage still allows ticking for this visit", async () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  renderPage();

  await tick(daily[0]!.title);

  expect(
    within(group("Daily")).getByText(`1/${daily.length} done`),
  ).toBeDefined();
});

test("event reminders have separate browser ticks and a separate manual clear", async () => {
  freezeClock(new Date("2026-11-02T12:00:00Z"));
  localStorage.setItem(KEY, JSON.stringify([daily[0]!.id]));
  renderPage();

  await tick("Check Atreia's Call Attendance");
  expect(JSON.parse(localStorage.getItem(EVENT_KEY)!)).toEqual([
    "atreias-call-attendance",
  ]);

  confirmWith(true);
  await userEvent.click(screen.getByRole("button", { name: "Clear daily" }));

  expect(stored()).toEqual([]);
  expect(JSON.parse(localStorage.getItem(EVENT_KEY)!)).toEqual([
    "atreias-call-attendance",
  ]);
});

test.each([
  ["2026-11-19T12:00:00Z", true, false],
  ["2026-12-03T12:00:00Z", false, false],
] as const)(
  "hides event reminder rows after their event-specific display windows",
  (date, attendanceVisible, mailVisible) => {
    freezeClock(new Date(date));
    renderPage();

    expect(
      screen.queryByRole("checkbox", {
        name: "Check Atreia's Call Attendance",
      }) !== null,
    ).toBe(attendanceVisible);
    expect(
      screen.queryByRole("checkbox", {
        name: "Claim Odyle Energy Boost mail",
      }) !== null,
    ).toBe(mailVisible);
  },
);

test("the footer names the page's sources", () => {
  renderPage();

  const footer = screen.getByRole("contentinfo");

  for (const id of routineSources)
    expect(footer.textContent).toContain(sources[id].name);
});
