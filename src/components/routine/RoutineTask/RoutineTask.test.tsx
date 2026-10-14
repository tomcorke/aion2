import { screen } from "@testing-library/react";
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
    screen.getByText(
      /Exploration rewards: 7 each week per Expedition dungeon\./,
    ),
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
