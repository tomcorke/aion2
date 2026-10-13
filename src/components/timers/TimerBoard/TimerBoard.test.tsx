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

beforeEach(() => {
  freezeClock();
  renderWithProviders(<TimerBoard />);
});

test("shows every timer by default", () => {
  expect(spine().getAllByRole("listitem")).toHaveLength(11);
});

test("marking a kill starts the respawn countdown and is saved", async () => {
  const row = spine().getByText("Silent Dartan").closest("li")!;

  await userEvent.click(within(row).getByRole("button", { name: "Mark kill" }));

  expect(row.textContent).toContain("in 3h 00m");
  expect(JSON.parse(localStorage.getItem("timer-kills")!)).toEqual({
    dartan: NOW.getTime(),
  });
});

test("group chips hide and show a whole group", async () => {
  await userEvent.click(screen.getByRole("button", { name: "Field bosses" }));

  expect(spine().queryByText("Silent Dartan")).toBeNull();
  expect(spine().getByText("Watcher Kaira")).toBeDefined();
});

test("the item-level filter hides lower bosses but keeps fixed timers", async () => {
  await userEvent.click(screen.getByRole("button", { name: "70+" }));

  expect(spine().queryByText("Watcher Kaira")).toBeNull();
  expect(spine().getByText("Executors")).toBeDefined();
  expect(spine().getByText("Weekly reset")).toBeDefined();
});

test("the faction switch renames and retimes field bosses", async () => {
  await userEvent.click(screen.getByRole("button", { name: "Asmodians" }));

  expect(spine().getByText("Immortal Gartua")).toBeDefined();
});

test("the editor hides a timer", async () => {
  await userEvent.click(screen.getByRole("button", { name: "Edit timers" }));
  await userEvent.click(screen.getByRole("checkbox", { name: "Weekly reset" }));

  expect(spine().queryByText("Weekly reset")).toBeNull();
  expect(screen.getByRole("button", { name: "Done" })).toBeDefined();
});

test("the editor reorders timers", async () => {
  await userEvent.click(screen.getByRole("button", { name: "Edit timers" }));
  await userEvent.click(
    screen.getByRole("button", { name: "Move Artifact Siege up" }),
  );

  expect(spine().getAllByRole("listitem")[0].textContent).toContain(
    "Artifact Siege",
  );
});
