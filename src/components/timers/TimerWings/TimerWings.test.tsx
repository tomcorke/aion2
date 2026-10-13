import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { timerDefs } from "../../../data/timers.ts";
import { resolveTimer } from "../../../lib/resolveTimer.ts";
import { NOW, renderWithProviders } from "../../../testing/render.tsx";
import { TimerWings } from "./TimerWings.tsx";

const timers = timerDefs.map((def) => resolveTimer(def, NOW, "elyos", {}));

const renderWings = () =>
  renderWithProviders(
    <TimerWings
      timers={timers}
      now={NOW}
      onMarkKill={() => {}}
      onClearKill={() => {}}
    />,
  );

test("lists every timer around the dial", () => {
  renderWings();

  expect(screen.getAllByRole("listitem")).toHaveLength(timers.length);
  expect(screen.getByText("Daily reset in")).toBeDefined();
});

test("draws one spoke per timer, dashed for untimed bosses", () => {
  const { container } = renderWings();
  const spokes = [...container.querySelectorAll("line")];
  const untimed = timers.filter((timer) => timer.secondsLeft === null).length;

  expect(spokes).toHaveLength(timers.length);
  expect(
    spokes.filter((spoke) => spoke.dataset.untracked === "true"),
  ).toHaveLength(untimed);
});

test("puts fixed timers on the left and bosses on the right", () => {
  renderWings();

  const left = (name: string) =>
    screen.getByText(name).closest("[data-align]")?.getAttribute("data-align");

  expect(left("Weekly reset")).toBe("end");
  expect(left("Guardian Lord Nahma")).toBe("start");
});
