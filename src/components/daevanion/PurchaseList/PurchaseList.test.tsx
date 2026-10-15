import { screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { loadClassRoutes } from "../../../lib/daevanionLoader.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { BoardView } from "../BoardView/BoardView.tsx";

const data = await loadClassRoutes("spiritmaster");
const board = data.classRoutes.boards.nezekan;

test("groups the order by phase with each phase's cost and running total", () => {
  renderWithProviders(
    <BoardView
      geometry={data.geometry.nezekan}
      route={board.routes.damage}
      phases={data.phases}
      skillMap={board.skills}
      skills={data.classRoutes.skills}
      rawPoints="66"
    />,
  );

  const order = within(screen.getByRole("region", { name: "Purchase order" }));

  expect(
    order.getAllByRole("heading", { level: 4 }).map((h) => h.textContent),
  ).toEqual([
    "Damage multipliers: 66 points, 66 in total",
    "Damage passives and core skills: 12 points, 78 in total",
    "Attack, Critical Hit and other damage skills: 29 points, 107 in total",
  ]);

  const lists = order.getAllByRole("list");
  const first = within(lists[0]).getAllByRole("button");
  const second = within(lists[1]).getAllByRole("button");

  expect(lists[1].getAttribute("start")).toBe(String(first.length + 1));
  expect(first.every((b) => b.textContent.includes("within budget"))).toBe(
    true,
  );
  expect(second[0].textContent).toMatch(/next purchase/);
});
