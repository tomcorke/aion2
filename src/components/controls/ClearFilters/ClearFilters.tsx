import STYLES from "./ClearFilters.module.css";

export function ClearFilters({ onClear }: { onClear: () => void }) {
  return (
    <button type="button" className={STYLES.button} onClick={onClear}>
      Clear filters
    </button>
  );
}
