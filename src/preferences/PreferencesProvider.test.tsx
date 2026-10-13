import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { expect, test } from "vitest";
import { usePreferences } from "./preferences.ts";
import { PreferencesProvider } from "./PreferencesProvider.tsx";

const wrapper = ({ children }: { children: ReactNode }) => (
  <PreferencesProvider>{children}</PreferencesProvider>
);
const root = document.documentElement;

test("applies the theme and its metal to the page", () => {
  renderHook(() => usePreferences(), { wrapper });

  expect(root.dataset.theme).toBe("night");
  expect(root.dataset.metal).toBe("gold");
});

test("saves changes and applies them", () => {
  const { result } = renderHook(() => usePreferences(), { wrapper });

  act(() => result.current.update({ theme: "day" }));

  expect(root.dataset.theme).toBe("day");
  expect(root.dataset.metal).toBe("silver");
  expect(JSON.parse(localStorage.getItem("preferences")!)).toMatchObject({
    theme: "day",
  });
});

test("fills keys missing from an older save with defaults", () => {
  localStorage.setItem("preferences", JSON.stringify({ theme: "day" }));

  const { result } = renderHook(() => usePreferences(), { wrapper });

  expect(result.current.preferences).toMatchObject({
    theme: "day",
    zone: "server",
    faction: "elyos",
  });
});

test("starts in day mode for readers whose system prefers light", () => {
  const matchMedia = window.matchMedia;

  window.matchMedia = (query: string) =>
    ({ matches: query.includes("light") }) as MediaQueryList;

  const { result } = renderHook(() => usePreferences(), { wrapper });

  expect(result.current.preferences.theme).toBe("day");
  window.matchMedia = matchMedia;
});
