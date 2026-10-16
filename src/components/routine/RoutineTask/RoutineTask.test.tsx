import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { routineTasks } from "../../../data/routine.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { RoutineTask } from "./RoutineTask.tsx";

const task = (id: string) => routineTasks.find((other) => other.id === id)!;

const renderTask = (id: string, onToggle = vi.fn()) =>
  renderWithProviders(
    <ul>
      <RoutineTask task={task(id)} checked={false} onToggle={onToggle} />
    </ul>,
  );

test("ticking reports the task ID", async () => {
  const onToggle = vi.fn();

  renderTask("nightmare", onToggle);
  await userEvent.click(
    screen.getByRole("checkbox", { name: "Clear Nightmare" }),
  );

  expect(onToggle).toHaveBeenCalledWith("nightmare");
});

test("banking counters show their cap, weekly ones only their allowance", () => {
  renderTask("exploration");

  expect(
    screen.getByText(/Exploration rewards: 7 each week per Expedition dungeon/),
  ).toBeDefined();
  expect(screen.queryByText(/Exploration rewards.*cap 7/)).toBeNull();
  expect(
    screen.getByText(/Odyle Energy: 15 every 3 hours, cap 560/),
  ).toBeDefined();
});

test("both scopes are labelled", () => {
  renderTask("membership-spiritstones");

  expect(screen.getByText("Server-shared")).toBeDefined();
  expect(screen.getByText("Per character")).toBeDefined();
});

// The compact row: everything outside the closed disclosure.
const row = (title: RegExp) => {
  const item = screen.getByRole("listitem", { name: title });
  const details = item.querySelector("details")!;
  const visible = item.cloneNode(true) as HTMLElement;

  visible.querySelector("details")!.remove();

  return { details, visible };
};

test("the row shows each counter's scope and limit without opening details", () => {
  renderTask("conquest");

  const { visible } = row(/Conquest/);

  expect(visible.textContent).toContain(
    "Odyle Energy: 15 every 3 hours, cap 560 (840 with membership)",
  );
  expect(visible.textContent).toContain(
    "Conquest reward count: 1 every 8 hours, cap 21",
  );
  expect(within(visible).getAllByText("Per character")).toHaveLength(2);
  expect(within(visible).getAllByText("Server-shared")).toHaveLength(1);
});

test.each(routineTasks.filter(({ warning }) => warning).map(({ id }) => id))(
  "%s shows its warning in the row, word for word",
  (id) => {
    renderTask(id);

    const { visible, details } = row(new RegExp(task(id).title));

    expect(visible.textContent).toContain(task(id).warning);
    expect(details.textContent).not.toContain(task(id).warning);
  },
);

test("purpose and notes wait behind a disclosure that does not tick", async () => {
  const onToggle = vi.fn();

  renderTask("duty-missions", onToggle);

  const { visible, details } = row(/Duty Missions/);

  expect(details.open).toBe(false);
  expect(visible.textContent).not.toContain(task("duty-missions").purpose);
  expect(details.textContent).toContain(task("duty-missions").purpose);

  await userEvent.click(within(details).getByText(/Details/));

  expect(details.open).toBe(true);
  expect(onToggle).not.toHaveBeenCalled();
});

test("a ticked row says so on its checkbox", () => {
  renderWithProviders(
    <ul>
      <RoutineTask task={task("nightmare")} checked onToggle={vi.fn()} />
    </ul>,
  );

  expect(
    (
      screen.getByRole("checkbox", {
        name: "Clear Nightmare",
      }) as HTMLInputElement
    ).checked,
  ).toBe(true);
});
