import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { routineEventReminders } from "../../../data/routine.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { EventReminderGroup } from "./EventReminderGroup.tsx";

const renderGroup = (ticks: string[] = [], onClear = vi.fn()) =>
  renderWithProviders(
    <EventReminderGroup
      reminders={routineEventReminders}
      ticks={ticks}
      onToggle={vi.fn()}
      onClear={onClear}
    />,
  );

afterEach(() => vi.restoreAllMocks());

test("shows event dates and mail expiry beside optional reminder ticks", () => {
  renderGroup();

  expect(
    screen.getByRole("heading", { name: "Optional event reminders" }),
  ).toBeDefined();
  expect(
    screen.getByRole("checkbox", { name: "Check Atreia's Call Attendance" }),
  ).toBeDefined();
  expect(
    screen.getByText(/before maintenance on 2 December 2026/),
  ).toBeDefined();
  expect(screen.getByText(/expires 7 days after receipt/)).toBeDefined();
});

test("clearing event ticks asks first and leaves the caller in control", async () => {
  const onClear = vi.fn();
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);

  renderGroup([routineEventReminders[0]!.id], onClear);
  await userEvent.click(
    screen.getByRole("button", { name: "Clear event reminders" }),
  );

  expect(confirm).toHaveBeenCalledWith(
    "Clear checked event reminder ticks only? Daily and weekly ticks stay.",
  );
  expect(onClear).toHaveBeenCalledOnce();
});

test("disables clearing when no event reminders are ticked", () => {
  renderGroup();

  expect(
    (
      screen.getByRole("button", {
        name: "Clear event reminders",
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true);
});
