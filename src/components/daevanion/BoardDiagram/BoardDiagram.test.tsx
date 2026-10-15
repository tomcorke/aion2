import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { loadClassRoutes } from "../../../lib/daevanionLoader.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { BoardView } from "../BoardView/BoardView.tsx";

const data = await loadClassRoutes("spiritmaster");

// Driven through BoardView, which owns the selection the diagram reports.
const renderAzphel = (rawPoints: string | null = null) =>
  renderWithProviders(
    <BoardView
      geometry={data.geometry.azphel}
      route={data.azphel}
      phases={data.azphel.phases}
      skillMap={{}}
      skills={[]}
      rawPoints={rawPoints}
    />,
  );

const label = (element: Element | null) => element?.getAttribute("aria-label");

const pressedNodes = () =>
  screen
    .getAllByRole("button", { pressed: true })
    .filter((element) => element.tagName === "g")
    .map(label);

test("the board has one tab stop, on the next purchase", () => {
  renderAzphel("1");

  const stops = screen
    .getAllByRole("button")
    .filter(
      (element) =>
        element.tagName === "g" && element.getAttribute("tabindex") === "0",
    );

  expect(stops.map(label)).toEqual([
    "Row 7, column 8: HP +100, 1 point, step 2, target, next purchase",
  ]);
});

test("arrow keys walk between nodes and show each one's detail", async () => {
  renderAzphel();

  screen.getByRole("button", { name: /^Row 9, column 8:/ }).focus();
  await userEvent.keyboard("{ArrowUp}");

  expect(label(document.activeElement)).toBe("Row 8, column 8: Start, free");
  expect(pressedNodes()).toEqual(["Row 8, column 8: Start, free"]);
  expect(
    screen.getByRole("region", { name: "Selected node" }).textContent,
  ).toMatch(/^Start/);

  // Azphel has no node at 8,9, so the move skips the gap.
  await userEvent.keyboard("{ArrowRight}");

  expect(label(document.activeElement)).toMatch(/^Row 8, column 10:/);
});

test("Enter and taps select a node, including ones the route skips", async () => {
  renderAzphel();

  await userEvent.click(
    screen.getByRole("button", { name: /^Row 1, column 1:/ }),
  );

  expect(pressedNodes()).toEqual([
    "Row 1, column 1: PvP Damage Tolerance +1.5%, 4 points, not on this route",
  ]);

  screen.getByRole("button", { name: /^Row 7, column 8:/ }).focus();
  await userEvent.keyboard("{Enter}");

  expect(pressedNodes()[0]).toMatch(/^Row 7, column 8: HP \+100/);
});

test("the board keeps 44px tap targets by default and can fit the screen on request", async () => {
  renderAzphel();

  const board = screen.getByRole("group", { name: "Azphel board diagram" });
  const fit = screen.getByRole("button", {
    name: "Fit the whole board on screen",
  });

  // One SVG unit is one CSS pixel until the reader asks to fit the board.
  expect(board.getAttribute("width")).toBe("660");
  expect(board.getAttribute("viewBox")).toBe("0 0 660 660");

  for (const node of screen
    .getAllByRole("button")
    .filter((element) => element.tagName === "g")) {
    expect(
      Number(node.querySelector("rect")!.getAttribute("width")),
    ).toBeGreaterThanOrEqual(40);
  }

  expect(fit.getAttribute("aria-pressed")).toBe("false");

  await userEvent.click(fit);

  expect(fit.getAttribute("aria-pressed")).toBe("true");
  expect(board.getAttribute("width")).toBeNull();
});
