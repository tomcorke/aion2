import type { GearName as Name } from "../../../data/gear.ts";
import { usePreferences } from "../../../preferences/preferences.ts";

/** A gear or activity name in the reader's faction, where the factions differ. */
export function GearName({ name }: { name: Name }) {
  const { faction } = usePreferences().preferences;

  return <>{typeof name === "string" ? name : name[faction]}</>;
}
