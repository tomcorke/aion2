import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { Diamond } from "./Diamond.tsx";

test("is decorative", () => {
  const { container } = render(<Diamond />);

  expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
});
