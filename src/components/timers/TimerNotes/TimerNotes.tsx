import { timerVerificationNotes } from "../../../data/timerVerification.ts";
import { Diamond } from "../../trim/Diamond/Diamond.tsx";
import STYLES from "./TimerNotes.module.css";

type Props = {
  // Ids of the timers on show; notes for other timers stay out of the way.
  shown: string[];
};

/** The limits of each timer on show; the board carries the clock warning. */
export function TimerNotes({ shown }: Props) {
  const notes = timerVerificationNotes.filter(({ timerIds }) =>
    timerIds.some((id) => shown.includes(id)),
  );

  if (notes.length === 0) return null;

  return (
    <ul aria-label="Timer notes" className={STYLES.notes}>
      {notes.map(({ id, message }) => (
        <li key={id} className={STYLES.note}>
          <Diamond />
          {message}
        </li>
      ))}
    </ul>
  );
}
