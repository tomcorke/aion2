import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Rule } from "./Rule.tsx";

test("renders a separator", () => {
  render(<Rule />);

  expect(screen.getByRole("separator")).toBeDefined();
});

test("the gem variant is styled differently", () => {
  render(
    <>
      <Rule />
      <Rule gem />
    </>,
  );

  const [plain, gem] = screen.getAllByRole("separator");

  expect(gem.className).not.toBe(plain.className);
});
