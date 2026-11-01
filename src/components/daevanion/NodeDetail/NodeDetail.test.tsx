import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { loadClassRoutes } from "../../../lib/daevanionLoader.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { BoardView } from "../BoardView/BoardView.tsx";

const data = await loadClassRoutes("spiritmaster");
const board = data.classRoutes.boards.nezekan;
const assassinData = await loadClassRoutes("assassin");
const assassinBoard = assassinData.classRoutes.boards.nezekan;

const spiritStrike = data.classRoutes.skills.find(
  ({ name }) => name === "Spirit Strike",
)!;

const renderBoard = () =>
  renderWithProviders(
    <BoardView
      geometry={data.geometry.nezekan}
      route={board.routes.damage}
      phases={data.phases}
      skillMap={board.skills}
      skills={data.classRoutes.skills}
      rawPoints={null}
    />,
  );

const detail = () =>
  within(screen.getByRole("region", { name: "Selected node" }));

const choose = (position: string) =>
  userEvent.click(
    screen.getByRole("button", { name: new RegExp(`^${position}:`) }),
  );

test("asks for a selection until a node is chosen", () => {
  renderBoard();

  expect(detail().getByText(/Select a node/)).toBeDefined();
});

test("a skill node names its skill and role, and labels the tooltip as the whole skill", async () => {
  renderBoard();
  await choose("Row 5, column 3");

  expect(detail().getByRole("heading").textContent).toBe(
    "Spirit Strike +1 rank",
  );
  expect(detail().getByText("Core multiplier")).toBeDefined();
  expect(
    detail().getByText("The skill at its normal maximum rank"),
  ).toBeDefined();
  expect(detail().getByText(spiritStrike.maxRankTooltip)).toBeDefined();
  expect(detail().getByText(/not the gain from this/)).toBeDefined();
  expect(detail().getByText(data.phases[0])).toBeDefined();
});

test("a changed tooltip is shown as an earlier report with current status", async () => {
  const skill = assassinData.classRoutes.skills.find(
    ({ name }) => name === "Heightened Sixth Sense",
  )!;
  const key = Object.entries(assassinBoard.skills).find(
    ([, id]) => id === skill.id,
  )?.[0];
  const [row, col] = key!.split(",").map(Number);

  renderWithProviders(
    <BoardView
      geometry={assassinData.geometry.nezekan}
      route={assassinBoard.routes.damage}
      phases={assassinData.phases}
      skillMap={assassinBoard.skills}
      skills={assassinData.classRoutes.skills}
      rawPoints={null}
    />,
  );
  await choose(`Row ${row}, column ${col}`);

  expect(detail().getByText("Earlier max-rank report")).toBeDefined();
  expect(detail().getByText("Current Global tooltip status")).toBeDefined();
  expect(detail().getByText(skill.maxRankTooltip)).toBeDefined();
  expect(
    detail().getByText(/Skill levels 5, 10, and 20 list HP effects of 1,000/),
  ).toBeDefined();
  expect(
    detail().getByText(/unverified for the current Global client/),
  ).toBeDefined();
});

test("a stat node shows its in-game label, not raw client values", async () => {
  renderBoard();
  await choose("Row 3, column 3");

  expect(detail().getByRole("heading").textContent).toBe("Combat Speed +1.5%");
  expect(detail().queryByText(/150/)).toBeNull();
  expect(detail().getByText("Unique")).toBeDefined();
});
