import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { timerDefs, type TimerGroup } from "../../../data/timers.ts";
import { TimerIcon } from "./TimerIcon.tsx";

const glyph = (id: string, group: TimerGroup = "fixed") =>
  render(<TimerIcon id={id} group={group} />).container.querySelector("svg");

test("every timer gets a decorative icon", () => {
  for (const { id, group } of timerDefs) {
    const { container, unmount } = render(<TimerIcon id={id} group={group} />);
    const svg = container.querySelector("svg");

    expect(svg, id).not.toBeNull();
    expect(svg!.getAttribute("aria-hidden")).toBe("true");
    unmount();
  }
});

test("fixed timers each have their own shape", () => {
  const fixed = timerDefs.filter(({ group }) => group === "fixed");
  const shapes = fixed.map(({ id }) => glyph(id)!.innerHTML);

  expect(new Set(shapes).size).toBe(fixed.length);
});

test("bosses share their group's shape, and the two groups differ", () => {
  const shape = (id: string, group: "reshanta" | "field") =>
    render(<TimerIcon id={id} group={group} />).container.querySelector("svg")!
      .innerHTML;

  expect(shape("nahma", "reshanta")).toBe(shape("kaira", "reshanta"));
  expect(shape("dartan", "field")).toBe(shape("lagta", "field"));
  expect(shape("nahma", "reshanta")).not.toBe(shape("dartan", "field"));
});

test("an unknown fixed timer draws nothing", () => {
  expect(glyph("retired")).toBeNull();
});
