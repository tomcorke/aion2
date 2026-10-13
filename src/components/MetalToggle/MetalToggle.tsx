import { usePreferences } from "../../preferences.ts";
import STYLES from "./MetalToggle.module.css";

export function MetalToggle() {
  const { preferences, update } = usePreferences();
  const { theme, metals } = preferences;
  const metal = metals[theme];
  const other = metal === "gold" ? "silver" : "gold";

  return (
    <button
      type="button"
      className={STYLES.toggle}
      aria-label={`Accent ${metal}; switch to ${other}`}
      onClick={() => update({ metals: { ...metals, [theme]: other } })}
    >
      <span className={STYLES.gold} data-on={metal === "gold"} />
      <span className={STYLES.silver} data-on={metal === "silver"} />
    </button>
  );
}
