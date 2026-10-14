import { screen } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { GearName } from "./GearName.tsx";

beforeEach(() => localStorage.clear());

test("shows a shared name as is", () => {
  renderWithProviders(<GearName name="Aulamus" />);

  expect(screen.getByText("Aulamus")).toBeDefined();
});

test("picks the name for the reader's faction", () => {
  renderWithProviders(
    <GearName name={{ elyos: "True Dragon Lord", asmodians: "Star line" }} />,
  );

  expect(screen.getByText("True Dragon Lord")).toBeDefined();
});
