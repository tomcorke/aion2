import { TZDate } from "@date-fns/tz";
import { differenceInSeconds, subDays } from "date-fns";
import { usePreferences } from "../../../preferences/preferences.ts";
import {
  formatAt,
  formatCountdown,
  formatServerClock,
  secondsUntilNext,
  SERVER_ZONE,
} from "../../../lib/time.ts";
import { dailyReset } from "../../../data/timers.ts";
import STYLES from "./TimerDial.module.css";

const RADIUS = 140;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Counts down to the daily reset, with the arc filling as the reset cycle passes. */
export function TimerDial({ now }: { now: Date }) {
  const { zone } = usePreferences().preferences;
  const left = secondsUntilNext(now, dailyReset);

  // A server calendar day back from the next reset: 23 or 25 hours across daylight saving.
  const next = new TZDate(now.getTime() + left * 1000, SERVER_ZONE);
  const previous = subDays(next, 1);

  const filled =
    (differenceInSeconds(now, previous) / differenceInSeconds(next, previous)) *
    CIRCUMFERENCE;

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
        <span className={STYLES.at}>{formatAt(next, zone)}</span>

        <span className={STYLES.clock}>{formatServerClock(now)}</span>
        <span className={STYLES.caption}>Server time · Europe</span>
      </div>
    </div>
  );
}
