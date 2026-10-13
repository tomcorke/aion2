import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { NOW, renderWithProviders } from "../../../testing/render.tsx";
import { TimerDial } from "./TimerDial.tsx";

test("counts down to the daily reset and shows the server clock", () => {
  renderWithProviders(<TimerDial now={NOW} />);

  expect(screen.getByText("2h 00m")).toBeDefined();
  expect(screen.getByText("Wed 16:00")).toBeDefined();
  expect(screen.getByText("14:00:00")).toBeDefined();
});
