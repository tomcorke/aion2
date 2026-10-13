import { useEffect, useMemo, type ReactNode } from "react";
import {
  defaultPreferences,
  PreferencesContext,
  type Preferences,
} from "../../preferences.ts";
import { useStoredState } from "../../useStoredState.ts";

function initialPreferences(): Preferences {
  const prefersDay = window.matchMedia("(prefers-color-scheme: light)").matches;

  return { ...defaultPreferences, theme: prefersDay ? "day" : "night" };
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useStoredState(
    "preferences",
    initialPreferences(),
  );

  // Older saves may lack newer keys.
  const preferences = useMemo(
    () => ({ ...defaultPreferences, ...stored }),
    [stored],
  );

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = preferences.theme;
    root.dataset.metal = preferences.metals[preferences.theme];
  }, [preferences]);

  const value = useMemo(
    () => ({
      preferences,
      update: (change: Partial<Preferences>) =>
        setStored((current) => ({ ...current, ...change })),
    }),
    [preferences, setStored],
  );

  return <PreferencesContext value={value}>{children}</PreferencesContext>;
}
