import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { PieceLevel } from "./PieceLevel.tsx";

test("renders the level", () => {
  renderWithProviders(<PieceLevel level={70} />);

  expect(screen.getByText("70")).toBeDefined();
});
