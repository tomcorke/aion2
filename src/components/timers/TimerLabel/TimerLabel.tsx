import { usePreferences } from "../../../preferences/preferences.ts";
import { formatAt, formatCountdown } from "../../../lib/time.ts";
import type { Timer } from "../../../lib/resolveTimer.ts";
import STYLES from "./TimerLabel.module.css";

type Props = {
  timer: Timer;
  now: Date;
  align?: "start" | "end";
  onMarkKill: (id: string) => void;
  onClearKill: (id: string) => void;
};

/** A timer's name and countdown, or for an untracked field boss, the Mark kill button. */
export function TimerLabel({
  timer,
  now,
  align = "start",
  onMarkKill,
  onClearKill,
}: Props) {
  const { zone } = usePreferences().preferences;
  const { secondsLeft, itemLevel } = timer;
  const nameSize = itemLevel ? `${15 + (itemLevel - 40) / 10}px` : undefined;

  return (
    <div className={STYLES.label} data-align={align}>
      <span className={STYLES.name} style={{ fontSize: nameSize }}>
        {timer.name}
      </span>

      {secondsLeft === null ? (
        <button
          type="button"
          className={STYLES.action}
          onClick={() => onMarkKill(timer.id)}
        >
          Mark kill
        </button>
      ) : (
        <span className={STYLES.time}>
          in {formatCountdown(secondsLeft)}{" "}
          <span className={STYLES.at}>
            · {formatAt(new Date(now.getTime() + secondsLeft * 1000), zone)}
          </span>
          {timer.respawns && (
            <button
              type="button"
              className={STYLES.clear}
              onClick={() => onClearKill(timer.id)}
            >
              Clear
            </button>
          )}
        </span>
      )}
    </div>
  );
}
