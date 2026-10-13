import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { timerDefs } from "../../../data/timers.ts";
import { resolveTimer } from "../../../lib/resolveTimer.ts";
import { NOW, renderWithProviders } from "../../../testing/render.tsx";
import { TimerSpine } from "./TimerSpine.tsx";

test("shows the dial, then one row per timer in order", () => {
  const timers = timerDefs.map((def) => resolveTimer(def, NOW, "elyos", {}));

  renderWithProviders(
    <TimerSpine
      timers={timers}
      now={NOW}
      onMarkKill={() => {}}
      onClearKill={() => {}}
    />,
  );

  const rows = screen.getAllByRole("listitem");

  expect(screen.getByText("Daily reset in")).toBeDefined();
  expect(rows).toHaveLength(timers.length);
  expect(rows[0].textContent).toContain("Weekly reset");
});
