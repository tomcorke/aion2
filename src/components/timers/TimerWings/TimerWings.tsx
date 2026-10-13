import { markerSize, type Timer } from "../../../lib/resolveTimer.ts";
import { Orb } from "../../trim/Orb/Orb.tsx";
import { TimerDial } from "../TimerDial/TimerDial.tsx";
import { TimerLabel } from "../TimerLabel/TimerLabel.tsx";
import STYLES from "./TimerWings.module.css";

// Board geometry in pixels: the dial sits in the middle, fixed timers stack in a column to
// its left and bosses to its right, each joined to the dial by a spoke.
const WIDTH = 1060;
const HEIGHT = 440;
const CENTRE = { x: WIDTH / 2, y: HEIGHT / 2 };
const COLUMN_OFFSET = 270;
const LABEL_GAP = 10;

type Props = {
  timers: Timer[];
  now: Date;
  onMarkKill: (id: string) => void;
  onClearKill: (id: string) => void;
};

type Placed = {
  timer: Timer;
  x: number;
  y: number;
  size: number;
  side: "left" | "right";
};

function stack(timers: Timer[], side: Placed["side"]): Placed[] {
  const x = CENTRE.x + (side === "left" ? -COLUMN_OFFSET : COLUMN_OFFSET);
  const gap = Math.min(66, 400 / Math.max(1, timers.length));

  return timers.map((timer, i) => ({
    timer,
    x,
    y: CENTRE.y + (i - (timers.length - 1) / 2) * gap,
    size: markerSize(timer.itemLevel),
    side,
  }));
}

function labelPosition({ x, y, size, side }: Placed) {
  const edge = size / 2 + LABEL_GAP;

  return side === "left"
    ? { right: WIDTH - x + edge, top: y }
    : { left: x + edge, top: y };
}

export function TimerWings({ timers, now, onMarkKill, onClearKill }: Props) {
  const placed = [
    ...stack(
      timers.filter((t) => !t.itemLevel),
      "left",
    ),
    ...stack(
      timers.filter((t) => t.itemLevel),
      "right",
    ),
  ];

  return (
    <div className={STYLES.board} style={{ width: WIDTH, height: HEIGHT }}>
      <svg
        className={STYLES.spokes}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        aria-hidden="true"
      >
        {placed.map(({ timer, x, y }) => (
          <line
            key={timer.id}
            x1={CENTRE.x}
            y1={CENTRE.y}
            x2={x}
            y2={y}
            data-untracked={timer.secondsLeft === null}
          />
        ))}
      </svg>

      <div className={STYLES.dial}>
        <TimerDial now={now} />
      </div>

      <ul className={STYLES.timers}>
        {placed.map((p) => (
          <li key={p.timer.id}>
            <span
              className={STYLES.marker}
              style={{ left: p.x - p.size / 2, top: p.y - p.size / 2 }}
            >
              <Orb
                size={p.size}
                ring={!p.timer.itemLevel}
                dim={p.timer.secondsLeft === null}
              />
            </span>

            <div className={STYLES.label} style={labelPosition(p)}>
              <TimerLabel
                timer={p.timer}
                now={now}
                align={p.side === "left" ? "end" : "start"}
                onMarkKill={onMarkKill}
                onClearKill={onClearKill}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
