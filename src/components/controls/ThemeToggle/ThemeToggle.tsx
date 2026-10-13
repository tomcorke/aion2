import { usePreferences } from "../../../preferences/preferences.ts";
import STYLES from "./ThemeToggle.module.css";

const SUN =
  "M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z";
const MOON = "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z";

export function ThemeToggle() {
  const { preferences, update } = usePreferences();
  const next = preferences.theme === "night" ? "day" : "night";

  return (
    <button
      type="button"
      className={STYLES.toggle}
      aria-label={`Switch to ${next} mode`}
      onClick={() => update({ theme: next })}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
        <path d={next === "day" ? SUN : MOON} />
      </svg>
    </button>
  );
}
