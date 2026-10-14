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

test("rows show limits, caps and scope from the shared counters", () => {
  renderPage();

  const duty = screen.getByRole("listitem", { name: /Duty Missions/ });

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

test("the footer names the page's sources", () => {
  renderPage();

  const footer = screen.getByRole("contentinfo");

  for (const id of routineSources)
    expect(footer.textContent).toContain(sources[id].name);
});
