import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { NOW } from "../testing/render.tsx";
import { useNow } from "./useNow.ts";

test("ticks once per interval", () => {
  vi.useFakeTimers({ now: NOW });

  const { result } = renderHook(() => useNow(1000));

  expect(result.current).toEqual(NOW);

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.getTime()).toBe(NOW.getTime() + 1000);
});

test("stops ticking when unmounted", () => {
  vi.useFakeTimers({ now: NOW });

  const { unmount } = renderHook(() => useNow());

  unmount();

  expect(vi.getTimerCount()).toBe(0);
});
