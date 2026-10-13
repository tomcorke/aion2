import { createContext, useContext } from "react";

export type Theme = "night" | "day";
export type Metal = "gold" | "silver";
export type Zone = "server" | "local" | "utc";
export type Faction = "elyos" | "asmodians";

export type Preferences = {
  theme: Theme;
  // Each theme remembers its own metal: night defaults to gold, day to silver.
  metals: Record<Theme, Metal>;
  zone: Zone;
  faction: Faction;
};

export const defaultPreferences: Preferences = {
  theme: "night",
  metals: { night: "gold", day: "silver" },
  zone: "server",
  faction: "elyos",
};

type PreferencesContext = {
  preferences: Preferences;
  update: (change: Partial<Preferences>) => void;
};

export const PreferencesContext = createContext<PreferencesContext | null>(
  null,
);

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) throw new Error("usePreferences needs a PreferencesProvider");

  return context;
}
