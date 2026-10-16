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

/** One checklist row: tick, limits and any warning at a glance; purpose, notes and guide on demand. */
export function RoutineTask({ task, checked, onToggle }: Props) {
  const { id, title, purpose, details, warning, guide } = task;
  const titleId = `routine-${id}`;
  const counters = task.counterIds.map(
    (counterId) => resourceCounters[counterId],
  );

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

      <ul className={STYLES.limits}>
        {counters.map((counter) => (
          <li key={counter.name}>
            <span className={STYLES.scope}>{scopes[counter.scope]}</span>
            <span>
              {counter.name}: {counterLimit(counter)}
            </span>
          </li>
        ))}
      </ul>

      {warning && <p className={STYLES.warning}>{warning}</p>}

      <details className={STYLES.more}>
        <summary>
          <span className={STYLES.hidden}>Details: {title}</span>
        </summary>

        <div className={STYLES.body}>
          <p>{purpose}</p>

          {counters.map(
            (counter) =>
              counter.notes && (
                <p key={counter.name} className={STYLES.muted}>
                  {counter.name}: {counter.notes}
                </p>
              ),
          )}

          {details && <p className={STYLES.muted}>{details}</p>}

          <Link to={guide.to} className={STYLES.link}>
            {guide.label}
          </Link>
        </div>
      </details>
    </li>
  );
}
