import type { Timer } from "../../timers.ts";
import STYLES from "./TimerEditor.module.css";

type Props = {
  timers: Timer[];
  hidden: string[];
  onToggle: (id: string) => void;
  onMove: (id: string, step: -1 | 1) => void;
};

/** Show, hide and reorder timers. Order within each side of the dial follows this list. */
export function TimerEditor({ timers, hidden, onToggle, onMove }: Props) {
  return (
    <ol className={STYLES.list} aria-label="Timers">
      {timers.map((timer, i) => (
        <li key={timer.id} className={STYLES.row}>
          <label className={STYLES.show}>
            <input
              type="checkbox"
              checked={!hidden.includes(timer.id)}
              onChange={() => onToggle(timer.id)}
            />
            {timer.name}
          </label>

          <button
            type="button"
            className={STYLES.move}
            aria-label={`Move ${timer.name} up`}
            disabled={i === 0}
            onClick={() => onMove(timer.id, -1)}
          >
            ↑
          </button>
          <button
            type="button"
            className={STYLES.move}
            aria-label={`Move ${timer.name} down`}
            disabled={i === timers.length - 1}
            onClick={() => onMove(timer.id, 1)}
          >
            ↓
          </button>
        </li>
      ))}
    </ol>
  );
}
