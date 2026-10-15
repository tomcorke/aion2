import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test } from "vitest";
import {
  freezeClock,
  NOW,
  renderWithProviders,
} from "../../../testing/render.tsx";
import { TimerBoard } from "./TimerBoard.tsx";

// The board renders both layouts; CSS shows one. These tests read the phone spine.
const spine = () => within(screen.getAllByRole("list")[1]);
// A row reads "<name>in 1h 00m · …" or "<name>Mark kill".
const names = () =>
  spine()
    .getAllByRole("listitem")
    .map((row) => row.textContent!.split(/in \d|Mark kill/)[0]);

beforeEach(() => freezeClock());

test("shows every timer by default", () => {
  renderWithProviders(<TimerBoard />);

  expect(spine().getAllByRole("listitem")).toHaveLength(12);
});

test("marking a kill starts the respawn countdown and is saved", async () => {
  renderWithProviders(<TimerBoard />);

  const row = spine().getByText("Silent Dartan").closest("li")!;

  await userEvent.click(within(row).getByRole("button", { name: "Mark kill" }));

  expect(row.textContent).toContain("in 3h 00m");
  expect(JSON.parse(localStorage.getItem("timer-kills")!)).toEqual({
    dartan: NOW.getTime(),
  });
});

test("field bosses stay untimed until a kill is marked", () => {
  renderWithProviders(<TimerBoard />);

  for (const name of ["Eternal Gartua", "High Commander Lagta"]) {
    const row = spine().getByText(name).closest("li")!;

    expect(
      within(row).getByRole("button", { name: "Mark kill" }),
    ).toBeDefined();
    expect(row.textContent).not.toContain(" in ");
  }
});

test("group chips hide and show a whole group", async () => {
  renderWithProviders(<TimerBoard />);

  await userEvent.click(screen.getByRole("button", { name: "Field bosses" }));

  expect(spine().queryByText("Silent Dartan")).toBeNull();
  expect(spine().getByText("Watcher Kaira")).toBeDefined();
});

test("the item-level filter hides lower bosses but keeps every fixed timer", async () => {
  renderWithProviders(<TimerBoard />);

  await userEvent.click(screen.getByRole("button", { name: "86+" }));

  expect(names()).toEqual([
    "Weekly reset",
    "Artifact Siege",
    "Spacetime Rift",
    "Dimensional Invasion",
    "Guardian Lord Nahma",
    "Shugo Festival",
  ]);
});

test("the faction switch renames and retimes field bosses", async () => {
  renderWithProviders(<TimerBoard />);

  await userEvent.click(screen.getByRole("button", { name: "Asmodians" }));

  expect(spine().getByText("Immortal Gartua")).toBeDefined();
});

test("times show in the chosen zone", async () => {
  renderWithProviders(<TimerBoard />);

  const festival = () => spine().getByText("Shugo Festival").closest("li")!;

  expect(festival().textContent).toContain("in 1h 00m · Wed 15:00");

  await userEvent.click(screen.getByRole("button", { name: "UTC" }));

  expect(festival().textContent).toContain("in 1h 00m · Wed 13:00");
});

test("the editor hides a timer", async () => {
  renderWithProviders(<TimerBoard />);

  await userEvent.click(screen.getByRole("button", { name: "Edit timers" }));
  await userEvent.click(screen.getByRole("checkbox", { name: "Weekly reset" }));

  expect(spine().queryByText("Weekly reset")).toBeNull();
  expect(screen.getByRole("button", { name: "Done" })).toBeDefined();
});

test("the editor reorders timers", async () => {
  renderWithProviders(<TimerBoard />);

  await userEvent.click(screen.getByRole("button", { name: "Edit timers" }));
  await userEvent.click(
    screen.getByRole("button", { name: "Move Artifact Siege up" }),
  );

  expect(spine().getAllByRole("listitem")[0].textContent).toContain(
    "Artifact Siege",
  );
});

test("always warns that the clock is a provisional assumption", () => {
  renderWithProviders(<TimerBoard />);

  const warning = screen.getByText(/not a confirmed EU server clock/);
  const firstTimer = screen.getAllByText("Weekly reset")[0];

  expect(
    warning.compareDocumentPosition(firstTimer) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});

test("keeps the one clock warning when every timer is hidden", () => {
  seed({ ...seeded, groups: [] });
  renderWithProviders(<TimerBoard />);

  expect(spine().queryAllByRole("listitem")).toHaveLength(0);
  expect(screen.getAllByText(/not a confirmed EU server clock/)).toHaveLength(
    1,
  );
});

test("notes cover only the timers on show", async () => {
  renderWithProviders(<TimerBoard />);

  const notes = () => screen.getByRole("list", { name: "Timer notes" });

  expect(notes().textContent).toContain("Field respawns count from the kill");
  expect(notes().textContent).toContain("Watcher Kaira's three-hour interval");

  await userEvent.click(screen.getByRole("button", { name: "Field bosses" }));

  expect(notes().textContent).not.toContain("Field respawns");
  expect(notes().textContent).toContain("Spacetime Rift slots");
});

const seeded = {
  order: ["executors", "weekly", "kaira", "nahma"],
  hidden: ["kaira", "rift"],
  groups: ["field"],
  minItemLevel: 0,
};

function seed(setup: object = seeded) {
  localStorage.setItem("timer-setup", JSON.stringify(setup));
  localStorage.setItem(
    "timer-kills",
    JSON.stringify({ dartan: NOW.getTime() }),
  );
}

test("a group view shows only that group, in saved order, without saving a change", () => {
  seed();
  renderWithProviders(<TimerBoard group="reshanta" />);

  expect(names()).toEqual(["Executors", "Guardian Lord Nahma"]);
  expect(screen.queryByRole("group", { name: "Timer groups" })).toBeNull();
  expect(JSON.parse(localStorage.getItem("timer-setup")!)).toEqual(seeded);
});

test("a group view still honours the item-level filter", async () => {
  seed({ ...seeded, hidden: [] });
  renderWithProviders(<TimerBoard group="reshanta" />);

  await userEvent.click(screen.getByRole("button", { name: "70+" }));

  expect(names()).toEqual(["Executors", "Guardian Lord Nahma"]);
});

test("an empty group view says why instead of clearing preferences", () => {
  seed({ ...seeded, minItemLevel: 86, hidden: ["nahma"] });
  renderWithProviders(<TimerBoard group="reshanta" />);

  expect(spine().queryAllByRole("listitem")).toHaveLength(0);
  expect(screen.getByRole("status").textContent).toContain(
    "No Lower Reshanta timers",
  );
  expect(JSON.parse(localStorage.getItem("timer-setup")!).hidden).toEqual([
    "nahma",
  ]);
});
