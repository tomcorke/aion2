import STYLES from "./FilterChips.module.css";

export type Chip<T extends string | number> = {
  value: T;
  label: string;
  pressed: boolean;
};

type Props<T extends string | number> = {
  label: string;
  chips: Chip<T>[];
  onToggle: (value: T) => void;
};

/** Pill toggles. The caller decides whether one or many can be pressed. */
export function FilterChips<T extends string | number>({
  label,
  chips,
  onToggle,
}: Props<T>) {
  return (
    <div role="group" aria-label={label} className={STYLES.chips}>
      {chips.map((chip) => (
        <button
          key={chip.value}
          type="button"
          className={STYLES.chip}
          aria-pressed={chip.pressed}
          onClick={() => onToggle(chip.value)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
