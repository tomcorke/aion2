import type { ReactNode } from "react";
import type { TimerGroup } from "../../../data/timers.ts";
import STYLES from "./TimerIcon.module.css";

// Line glyphs on a 24px grid, drawn in the accent. Fixed events get their own shape;
// bosses share one per group, since their orbs already scale with item level.
const events: Record<string, ReactNode> = {
  weekly: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4M9 15.5h6" />
    </>
  ),
  siege: (
    <path d="M4 20.5V7.5h3V10h3V7.5h4V10h3V7.5h3v13ZM10 20.5V16a2 2 0 0 1 4 0v4.5" />
  ),
  rift: (
    <path d="M12 12a1 1 0 0 1 2 0a3 3 0 0 1-6 0a5 5 0 0 1 10 0a7 7 0 0 1-14 0" />
  ),
  invasion: (
    <path d="M4 4l11 11M12.5 17.5l5-5M16 16l3.5 3.5M20 4L9 15M6.5 12.5l5 5M8 16l-3.5 3.5" />
  ),
  festival: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="M11 11l9 9M15.5 15.5l2.5-2.5M18 18l2.5-2.5" />
    </>
  ),
};

const groups: Partial<Record<TimerGroup, ReactNode>> = {
  reshanta: (
    <path d="M11 12.5C8.5 7.5 5.5 5.5 2 6c.5 3.5 2.5 5.5 5.5 6.3-1 .8-2.2 1.1-3.5 1 2 2.2 5 2.4 7 .7ZM13 12.5c2.5-5 5.5-7 9-6.5-.5 3.5-2.5 5.5-5.5 6.3 1 .8 2.2 1.1 3.5 1-2 2.2-5 2.4-7 .7ZM12 11v7" />
  ),
  field: (
    <>
      <path d="M6.5 16.5a7 7 0 1 1 11 0v3h-3V21h-5v-1.5h-3Z" />
      <circle cx="9.5" cy="12" r="1.5" />
      <circle cx="14.5" cy="12" r="1.5" />
    </>
  ),
};

type Props = {
  id: string;
  group: TimerGroup;
};

/** A small event glyph that sits beside a timer's name; the name carries the meaning. */
export function TimerIcon({ id, group }: Props) {
  const glyph = events[id] ?? groups[group];

  if (!glyph) return null;

  return (
    <svg className={STYLES.icon} viewBox="0 0 24 24" aria-hidden="true">
      {glyph}
    </svg>
  );
}
