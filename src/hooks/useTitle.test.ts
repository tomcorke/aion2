import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import { useTitle } from "./useTitle.ts";

test("prefixes the page title to the site name", () => {
  renderHook(() => useTitle("Timers"));

  expect(document.title).toBe("Timers · AION 2 Notes");
});

test("uses the site name alone without a page title", () => {
  renderHook(() => useTitle());

  expect(document.title).toBe("AION 2 Notes");
});
