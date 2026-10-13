import { usePreferences, type Zone } from "../../../preferences/preferences.ts";
import STYLES from "./ZoneSwitch.module.css";

const zones: { zone: Zone; label: string }[] = [
  { zone: "server", label: "Server" },
  { zone: "local", label: "Local" },
  { zone: "utc", label: "UTC" },
];

export function ZoneSwitch() {
  const { preferences, update } = usePreferences();

  return (
    <div role="group" aria-label="Show times in" className={STYLES.switch}>
      <span className={STYLES.label}>Times in</span>

      {zones.map(({ zone, label }) => (
        <button
          key={zone}
          type="button"
          className={STYLES.option}
          aria-pressed={preferences.zone === zone}
          onClick={() => update({ zone })}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
