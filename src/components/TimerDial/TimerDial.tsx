import { usePreferences } from "../../preferences.ts";
import {
  formatAt,
  formatCountdown,
  formatServerClock,
  secondsUntil,
} from "../../time.ts";
import { dailyReset } from "../../timers.ts";
import STYLES from "./TimerDial.module.css";

const RADIUS = 140;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Counts down to the daily reset, with the arc filling as the day passes. */
export function TimerDial({ now }: { now: Date }) {
  const { zone } = usePreferences().preferences;
  const left = secondsUntil(now, dailyReset.hour, dailyReset.minute);
  const filled = (1 - left / 86_400) * CIRCUMFERENCE;

  return (
    <div className={STYLES.dial}>
      <svg viewBox="0 0 300 300" aria-hidden="true" className={STYLES.face}>
        <circle cx="150" cy="150" r={RADIUS} className={STYLES.disc} />
        <circle
          cx="150"
          cy="150"
          r={RADIUS}
          className={STYLES.arc}
          strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
          transform="rotate(-90 150 150)"
        />
        <circle cx="150" cy="150" r="126" className={STYLES.ticks} />
      </svg>

      <div className={STYLES.readout}>
        <span className={STYLES.caption}>Daily reset in</span>
        <span className={STYLES.countdown}>{formatCountdown(left)}</span>
        <span className={STYLES.at}>
          {formatAt(new Date(now.getTime() + left * 1000), zone)}
        </span>

        <span className={STYLES.clock}>{formatServerClock(now)}</span>
        <span className={STYLES.caption}>Server time · Europe</span>
      </div>
    </div>
  );
}
