import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { FilterChips } from "./FilterChips.tsx";

const chips = [
  { value: 46, label: "46+", pressed: true },
  { value: 70, label: "70+", pressed: false },
];

test("shows which chips are pressed", () => {
  render(<FilterChips label="Item level" chips={chips} onToggle={() => {}} />);

  expect(screen.getByRole("group", { name: "Item level" })).toBeDefined();
  expect(
    screen.getByRole("button", { name: "46+" }).getAttribute("aria-pressed"),
  ).toBe("true");
  expect(
    screen.getByRole("button", { name: "70+" }).getAttribute("aria-pressed"),
  ).toBe("false");
});

test("reports the chip value when toggled", async () => {
  const onToggle = vi.fn();

  render(<FilterChips label="Item level" chips={chips} onToggle={onToggle} />);
  await userEvent.click(screen.getByRole("button", { name: "70+" }));

  expect(onToggle).toHaveBeenCalledWith(70);
});
