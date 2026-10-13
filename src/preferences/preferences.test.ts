import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import { defaultPreferences, usePreferences } from "./preferences.ts";

test("night defaults to gold and day to silver", () => {
  expect(defaultPreferences.metals).toEqual({ night: "gold", day: "silver" });
});

test("times default to server time", () => {
  expect(defaultPreferences.zone).toBe("server");
});

test("usePreferences needs a provider", () => {
  expect(() => renderHook(() => usePreferences())).toThrow(
    /PreferencesProvider/,
  );
});
