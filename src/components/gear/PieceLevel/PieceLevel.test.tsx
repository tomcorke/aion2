import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PieceLevel, pieceLevelText } from "./PieceLevel.tsx";

test("formats exact levels, ranges and upper bounds", () => {
  expect(pieceLevelText(54)).toBe("54");
  expect(pieceLevelText({ min: 36, max: 41 })).toBe("36–41");
  expect(pieceLevelText({ max: 102 })).toBe("up to 102");
});

test("renders the level", () => {
  render(<PieceLevel level={70} />);

  expect(screen.getByText("70")).toBeDefined();
});
