import { markerSize, type Timer } from "../../../lib/resolveTimer.ts";
import { Orb } from "../../trim/Orb/Orb.tsx";
import { TimerDial } from "../TimerDial/TimerDial.tsx";
import { TimerLabel } from "../TimerLabel/TimerLabel.tsx";
import STYLES from "./TimerSpine.module.css";

type Props = {
  timers: Timer[];
  now: Date;
  onMarkKill: (id: string) => void;
  onClearKill: (id: string) => void;
};

/** The phone layout: a smaller dial, then one row per timer hanging off a vertical spine. */
export function TimerSpine({ timers, now, onMarkKill, onClearKill }: Props) {
  return (
    <div className={STYLES.spine}>
      <TimerDial now={now} />

      <ul className={STYLES.timers}>
        {timers.map((timer) => (
          <li key={timer.id} className={STYLES.row}>
            <span className={STYLES.marker}>
              <Orb
                size={markerSize(timer.itemLevel)}
                ring={!timer.itemLevel}
                dim={timer.secondsLeft === null}
              />
            </span>

            <TimerLabel
              timer={timer}
              now={now}
              onMarkKill={onMarkKill}
              onClearKill={onClearKill}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
