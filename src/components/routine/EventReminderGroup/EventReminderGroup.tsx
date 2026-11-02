import type { RoutineEventReminder } from "../../../data/routine.ts";
import STYLES from "./EventReminderGroup.module.css";

type Props = {
  reminders: RoutineEventReminder[];
  ticks: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
};

export function EventReminderGroup({
  reminders,
  ticks,
  onToggle,
  onClear,
}: Props) {
  const clear = () => {
    if (
      window.confirm(
        "Clear checked event reminder ticks only? Daily and weekly ticks stay.",
      )
    )
      onClear();
  };

  return (
    <section aria-labelledby="routine-event-reminders" className={STYLES.group}>
      <header className={STYLES.header}>
        <h2 id="routine-event-reminders">Optional event reminders</h2>
        <button
          type="button"
          className={STYLES.clear}
          onClick={clear}
          disabled={ticks.length === 0}
        >
          Clear event reminders
        </button>
      </header>

      <p className={STYLES.note}>
        These browser-only ticks are separate from Daily and Weekly. Clear them
        when you want to check again; they do not follow an event or game reset.
      </p>

      <ul className={STYLES.reminders}>
        {reminders.map(({ id, title, instruction, dateContext }) => (
          <li key={id} className={STYLES.reminder}>
            <label className={STYLES.tick}>
              <input
                type="checkbox"
                checked={ticks.includes(id)}
                onChange={() => onToggle(id)}
              />
              <span>{title}</span>
            </label>
            <p className={STYLES.instruction}>{instruction}</p>
            <p className={STYLES.context}>{dateContext}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
