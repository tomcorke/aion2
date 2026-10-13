import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Tests that opt into the node environment have no DOM to set up.
const hasDom = typeof window !== "undefined";

afterEach(() => {
  vi.useRealTimers();

  if (!hasDom) return;

  cleanup();
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.metal;
});

if (hasDom) {
  // jsdom has no matchMedia; report a screen that prefers dark.
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList;
}
