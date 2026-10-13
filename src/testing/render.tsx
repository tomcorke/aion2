import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { vi } from "vitest";
import { PreferencesProvider } from "../preferences/PreferencesProvider.tsx";

/** Wednesday 14 October 2026, 14:00 server time (Berlin, UTC+2). */
export const NOW = new Date("2026-10-14T12:00:00Z");

export const HOUR = 3600;

/** Freezes the clock at NOW. Timers still run, so `useNow` keeps ticking from there. */
export function freezeClock(at = NOW) {
  vi.useFakeTimers({ now: at, toFake: ["Date"] });
}

/** Renders inside the preferences provider and a router at `path`. */
export function renderWithProviders(ui: ReactElement, { path = "/" } = {}) {
  const router = createMemoryRouter([{ path: "*", element: ui }], {
    initialEntries: [path],
  });

  return render(
    <PreferencesProvider>
      <RouterProvider router={router} />
    </PreferencesProvider>,
  );
}
