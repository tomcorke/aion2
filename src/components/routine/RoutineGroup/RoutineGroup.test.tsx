import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { routineTasks } from "../../../data/routine.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { RoutineGroup } from "./RoutineGroup.tsx";

const tasks = routineTasks.filter(({ group }) => group === "daily");

const renderGroup = (ticks: string[], onClear = vi.fn()) =>
  renderWithProviders(
    <RoutineGroup
      title="Daily"
      tasks={tasks}
      ticks={ticks}
      onToggle={vi.fn()}
      onClear={onClear}
    />,
  );

afterEach(() => vi.restoreAllMocks());

test("counts only its own ticked tasks", () => {
  renderGroup([tasks[0]!.id, "weekly-thing"]);

  expect(screen.getByText(`1/${tasks.length} done`)).toBeDefined();
  expect(
    screen
      .getByRole("progressbar", { name: "Daily progress" })
      .getAttribute("max"),
  ).toBe(String(tasks.length));
});

test("clear asks first and does nothing when cancelled", async () => {
  const onClear = vi.fn();
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);

  renderGroup([tasks[0]!.id], onClear);
  await userEvent.click(screen.getByRole("button", { name: "Clear daily" }));

  expect(confirm).toHaveBeenCalledWith(
    expect.stringMatching(/Weekly ticks stay/),
  );
  expect(onClear).not.toHaveBeenCalled();
});

test("clear is unavailable with nothing ticked", () => {
  renderGroup([]);

  expect(
    (screen.getByRole("button", { name: "Clear daily" }) as HTMLButtonElement)
      .disabled,
  ).toBe(true);
});
