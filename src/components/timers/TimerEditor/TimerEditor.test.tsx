import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { timerDefs } from "../../../data/timers.ts";
import { resolveTimer } from "../../../lib/resolveTimer.ts";
import { NOW } from "../../../testing/render.tsx";
import { TimerEditor } from "./TimerEditor.tsx";

const timers = timerDefs
  .slice(0, 3)
  .map((def) => resolveTimer(def, NOW, "elyos", {}));

const renderEditor = () => {
  const handlers = { onToggle: vi.fn(), onMove: vi.fn() };

  render(<TimerEditor timers={timers} hidden={["siege"]} {...handlers} />);

  return handlers;
};

test("ticks the timers that are shown", () => {
  renderEditor();

  expect(
    (screen.getByRole("checkbox", { name: "Weekly reset" }) as HTMLInputElement)
      .checked,
  ).toBe(true);
  expect(
    (
      screen.getByRole("checkbox", {
        name: "Artifact Siege",
      }) as HTMLInputElement
    ).checked,
  ).toBe(false);
});

test("reports toggles and moves", async () => {
  const { onToggle, onMove } = renderEditor();

  await userEvent.click(
    screen.getByRole("checkbox", { name: "Artifact Siege" }),
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Move Artifact Siege up" }),
  );

  expect(onToggle).toHaveBeenCalledWith("siege");
  expect(onMove).toHaveBeenCalledWith("siege", -1);
});

test("cannot move past either end", () => {
  renderEditor();

  expect(
    (
      screen.getByRole("button", {
        name: "Move Weekly reset up",
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true);
  expect(
    (
      screen.getByRole("button", {
        name: "Move Spacetime Rift down",
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true);
});
