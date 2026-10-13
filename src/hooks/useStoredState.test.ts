import { act, renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import { useStoredState } from "./useStoredState.ts";

test("starts from the stored value", () => {
  localStorage.setItem("count", "3");

  const { result } = renderHook(() => useStoredState("count", 0));

  expect(result.current[0]).toBe(3);
});

test("starts from the initial value when nothing is stored", () => {
  const { result } = renderHook(() => useStoredState("count", 7));

  expect(result.current[0]).toBe(7);
});

test("stores each change", () => {
  const { result } = renderHook(() => useStoredState("count", 0));

  act(() => result.current[1](5));

  expect(result.current[0]).toBe(5);
  expect(localStorage.getItem("count")).toBe("5");
});
