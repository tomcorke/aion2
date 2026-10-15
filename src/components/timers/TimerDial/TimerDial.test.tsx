import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { NOW, renderWithProviders } from "../../../testing/render.tsx";
import { TimerDial } from "./TimerDial.tsx";

const CIRCUMFERENCE = 2 * Math.PI * 140;

// The share of the arc drawn, from its stroke-dasharray.
function arcFraction(now: Date) {
  const { container } = renderWithProviders(<TimerDial now={now} />);
  const dash = container.querySelector("[stroke-dasharray]")!;

  return (
    Number(dash.getAttribute("stroke-dasharray")!.split(" ")[0]) / CIRCUMFERENCE
  );
}

test("counts down to the daily reset and shows the server clock", () => {
  renderWithProviders(<TimerDial now={NOW} />);

  expect(screen.getByText("2h 00m")).toBeDefined();
  expect(screen.getByText("Wed 16:00")).toBeDefined();
  expect(screen.getByText("14:00:00")).toBeDefined();
});

test("fills the arc with the share of the reset cycle gone", () => {
  expect(arcFraction(NOW)).toBeCloseTo(22 / 24);
});

test("starts empty at the reset before the 25-hour autumn cycle", () => {
  const reset = new Date("2026-10-24T14:00:00Z");

  expect(arcFraction(reset)).toBeCloseTo(0);
  expect(screen.getByText("1d 1h")).toBeDefined();
  expect(screen.getByText("Sun 16:00")).toBeDefined();
});

test("is half full halfway through the 25-hour autumn cycle", () => {
  expect(arcFraction(new Date("2026-10-25T02:30:00Z"))).toBeCloseTo(0.5);
});

test("starts empty at the reset before the 23-hour spring cycle", () => {
  const reset = new Date("2026-03-28T15:00:00Z");

  expect(arcFraction(reset)).toBeCloseTo(0);
  expect(screen.getByText("23h 00m")).toBeDefined();
  expect(screen.getByText("Sun 16:00")).toBeDefined();
});
