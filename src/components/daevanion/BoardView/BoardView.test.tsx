import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { loadClassRoutes } from "../../../lib/daevanionLoader.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { BoardView } from "./BoardView.tsx";

const data = await loadClassRoutes("spiritmaster");
const board = data.classRoutes.boards.nezekan;
const route = board.routes.damage;

const renderBoard = (rawPoints: string | null = null) =>
  renderWithProviders(
    <BoardView
      geometry={data.geometry.nezekan}
      route={route}
      phases={data.phases}
      skillMap={board.skills}
      skills={data.classRoutes.skills}
      rawPoints={rawPoints}
    />,
  );

const stepOf = (label: string) => Number(/ step (\d+),/.exec(label)?.[1]);

const diagramSteps = () =>
  within(screen.getByRole("group", { name: "Nezekan board diagram" }))
    .getAllByRole("button")
    .map((node) => node.getAttribute("aria-label")!)
    .filter((label) => stepOf(label) > 0)
    .sort((a, b) => stepOf(a) - stepOf(b));

const listSteps = () =>
  within(screen.getByRole("region", { name: "Purchase order" }))
    .getAllByRole("button")
    .map((button) => button.textContent);

test("the diagram and the text list give the same purchases in the same order", () => {
  renderBoard("30");

  const diagram = diagramSteps();
  const list = listSteps();

  expect(diagram).toHaveLength(route.steps.length);
  expect(list).toHaveLength(route.steps.length);

  diagram.forEach((label, index) => {
    const split = label.indexOf(": ");
    const where = label.slice(0, split);
    const description = label.slice(split + 2);

    expect(list[index]).toBe(
      `${description}${where} · ${route.steps[index].cumulativeCost} points so far`,
    );
  });

  const affordable = route.steps.filter((step) => step.cumulativeCost <= 30);

  expect(
    diagram.filter((label) => label.includes("within budget")),
  ).toHaveLength(affordable.length);
  expect(diagram.filter((label) => label.includes("next purchase"))).toEqual([
    diagram[affordable.length],
  ]);
});

test("choosing a list entry selects the same node on the board", async () => {
  renderBoard();

  await userEvent.click(
    screen.getByRole("button", {
      name: /^Defense Bonus \+30, 1 point, step 1,/,
    }),
  );

  const node = screen.getByRole("button", { name: /^Row 9, column 8:/ });
  const detail = within(screen.getByRole("region", { name: "Selected node" }));

  expect(node.getAttribute("aria-pressed")).toBe("true");
  expect(detail.getByRole("heading").textContent).toBe("Defense Bonus +30");
  expect(detail.getByText("Row 9, column 8")).toBeDefined();
});
