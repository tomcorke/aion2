import { Link } from "react-router";
import { resourceCounters, type ResourceCounter } from "../../../data/alts.ts";
import type { RoutineTask as Task } from "../../../data/routine.ts";
import { counterLimit } from "../../../lib/counterLimit.ts";
import STYLES from "./RoutineTask.module.css";

type Props = {
  task: Task;
  checked: boolean;
  onToggle: (id: string) => void;
};

const scopes: Record<ResourceCounter["scope"], string> = {
  character: "Per character",
  server: "Server-shared",
};

/** One reminder row: tick, purpose, the counters it spends and its guide. */
export function RoutineTask({ task, checked, onToggle }: Props) {
  const { id, title, purpose, details, warning, guide } = task;
  const titleId = `routine-${id}`;

  return (
    <li className={STYLES.task} aria-labelledby={titleId}>
      <label className={STYLES.tick}>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(id)}
        />
        <span id={titleId}>{title}</span>
      </label>

      <div className={STYLES.body}>
        <p>{purpose}</p>

        <ul className={STYLES.counters}>
          {task.counterIds.map((counterId) => {
            const counter = resourceCounters[counterId];

            return (
              <li key={counterId}>
                <span className={STYLES.scope}>{scopes[counter.scope]}</span>
                <span>
                  {counter.name}: {counterLimit(counter)}.
                  {counter.notes && ` ${counter.notes}`}
                </span>
              </li>
            );
          })}
        </ul>

        {details && <p className={STYLES.muted}>{details}</p>}
        {warning && <p className={STYLES.warning}>{warning}</p>}

        <Link to={guide.to} className={STYLES.link}>
          {guide.label}
        </Link>
      </div>
    </li>
  );
}
