import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import type { Timer } from "../../../lib/resolveTimer.ts";
import { HOUR, NOW, renderWithProviders } from "../../../testing/render.tsx";
import { TimerLabel } from "./TimerLabel.tsx";

const timer = (overrides: Partial<Timer>): Timer => ({
  id: "dartan",
  name: "Silent Dartan",
  group: "field",
  itemLevel: 46,
  secondsLeft: 2 * HOUR,
  respawns: true,
  ...overrides,
});

const handlers = () => ({ onMarkKill: vi.fn(), onClearKill: vi.fn() });

test("shows the countdown and when it ends", () => {
  renderWithProviders(
    <TimerLabel timer={timer({ respawns: false })} now={NOW} {...handlers()} />,
  );

  expect(screen.getByText("Silent Dartan")).toBeDefined();
  expect(screen.getByText(/in 2h 00m/)).toBeDefined();
  expect(screen.getByText("· Wed 16:00")).toBeDefined();
  expect(screen.queryByRole("button")).toBeNull();
});

test("offers Mark kill for an untimed field boss", async () => {
  const { onMarkKill, onClearKill } = handlers();

  renderWithProviders(
    <TimerLabel
      timer={timer({ secondsLeft: null })}
      now={NOW}
      onMarkKill={onMarkKill}
      onClearKill={onClearKill}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: "Mark kill" }));

  expect(onMarkKill).toHaveBeenCalledWith("dartan");
});

test("offers Clear for a timed field boss", async () => {
  const { onMarkKill, onClearKill } = handlers();

  renderWithProviders(
    <TimerLabel
      timer={timer({})}
      now={NOW}
      onMarkKill={onMarkKill}
      onClearKill={onClearKill}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: "Clear" }));

  expect(onClearKill).toHaveBeenCalledWith("dartan");
});
