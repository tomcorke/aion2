import type { RoutineTask as Task } from "../../../data/routine.ts";
import { RoutineTask } from "../RoutineTask/RoutineTask.tsx";
import STYLES from "./RoutineGroup.module.css";

type Props = {
  title: "Daily" | "Weekly";
  tasks: Task[];
  ticks: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
};

/** A group's reminders, its progress, and a clear action that asks first. */
export function RoutineGroup({
  title,
  tasks,
  ticks,
  onToggle,
  onClear,
}: Props) {
  const name = title.toLowerCase();
  const done = tasks.filter(({ id }) => ticks.includes(id)).length;

  const clear = () => {
    const other = name === "daily" ? "Weekly" : "Daily";

    if (window.confirm(`Clear all ${name} ticks? ${other} ticks stay.`))
      onClear();
  };

  return (
    <section className={STYLES.group} aria-labelledby={`routine-${name}`}>
      <header className={STYLES.header}>
        <h2 id={`routine-${name}`}>{title}</h2>
        <progress
          value={done}
          max={tasks.length}
          aria-label={`${title} progress`}
        />
        <span className={STYLES.count}>
          {done}/{tasks.length} done
        </span>
        <button
          type="button"
          className={STYLES.clear}
          onClick={clear}
          disabled={done === 0}
        >
          Clear {name}
        </button>
      </header>

      <ul className={STYLES.tasks}>
        {tasks.map((task) => (
          <RoutineTask
            key={task.id}
            task={task}
            checked={ticks.includes(task.id)}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </section>
  );
}
