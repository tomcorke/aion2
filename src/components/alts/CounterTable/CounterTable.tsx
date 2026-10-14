import { useId } from "react";
import { Link } from "react-router";
import {
  refillClockNote,
  resourceCounters,
  type ResourceCounter,
} from "../../../data/alts.ts";
import { counterLimit } from "../../../lib/counterLimit.ts";
import STYLES from "./CounterTable.module.css";

const kinds: { kind: ResourceCounter["kind"]; title: string }[] = [
  { kind: "continuous", title: "Continuous refills" },
  { kind: "daily", title: "Daily grants" },
  { kind: "weekly", title: "Weekly allowances" },
  { kind: "time-budget", title: "Time budgets" },
];

const scopes: Record<ResourceCounter["scope"], string> = {
  character: "Each character",
  server: "Server",
};

const counters = Object.values(resourceCounters);

/** Every curated counter with its scope and refill, grouped by refill kind. */
export function CounterTable() {
  const id = useId();

  return (
    <section aria-labelledby={id} className={STYLES.counters}>
      <h2 id={id}>Limits and refills</h2>
      <p className={STYLES.note}>{refillClockNote}</p>

      <table className={STYLES.table}>
        <thead>
          <tr>
            <th scope="col">Counter</th>
            <th scope="col">Scope</th>
            <th scope="col">Limit</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>

        {kinds.map(({ kind, title }) => (
          <tbody key={kind}>
            <tr>
              <th scope="colgroup" colSpan={4} className={STYLES.group}>
                {title}
              </th>
            </tr>

            {counters
              .filter((counter) => counter.kind === kind)
              .map((counter) => (
                <tr key={counter.name}>
                  <th scope="row">{counter.name}</th>
                  <td className={STYLES.scope}>{scopes[counter.scope]}</td>
                  <td className={STYLES.limit}>{counterLimit(counter)}</td>
                  <td>
                    {counter.notes && <p>{counter.notes}</p>}
                    <Link to={counter.guide.to} className={STYLES.link}>
                      {counter.guide.label}
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        ))}
      </table>
    </section>
  );
}
