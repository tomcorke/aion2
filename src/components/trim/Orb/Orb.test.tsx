import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { Orb } from "./Orb.tsx";

const renderOrb = (props: Parameters<typeof Orb>[0]) =>
  render(<Orb {...props} />).container.firstElementChild as HTMLElement;

test("is decorative and sized in pixels", () => {
  const orb = renderOrb({ size: 30 });

  expect(orb.getAttribute("aria-hidden")).toBe("true");
  expect(orb.style.width).toBe("30px");
  expect(orb.style.height).toBe("30px");
});

test("a ring is styled apart from an orb", () => {
  expect(renderOrb({ size: 14, ring: true }).className).not.toBe(
    renderOrb({ size: 14 }).className,
  );
});

test("marks itself dim", () => {
  expect(renderOrb({ size: 14, dim: true }).dataset.dim).toBe("true");
});
