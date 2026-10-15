import { useId } from "react";
import type { PurchaseRoute } from "../../../data/daevanionRoutes.ts";
import {
  describeNode,
  position,
  type ViewNode,
} from "../../../lib/daevanionNode.ts";
import STYLES from "./PurchaseList.module.css";

type Props = {
  nodes: ViewNode[];
  route: PurchaseRoute;
  phases: string[];
  selected: string | null;
  onSelect: (key: string) => void;
};

/** The route as an ordered text list, grouped by phase; each entry selects its node. */
export function PurchaseList({
  nodes,
  route,
  phases,
  selected,
  onSelect,
}: Props) {
  const id = useId();
  const byKey = new Map(nodes.map((view) => [view.node.key, view]));

  const groups = phases
    .map((name, phase) => ({
      name,
      end: route.phaseEnd[phase],
      cost: route.phaseEnd[phase] - (route.phaseEnd[phase - 1] ?? 0),
      steps: route.steps
        .map((step, index) => ({ ...step, index }))
        .filter((step) => step.phase === phase),
    }))
    .filter(({ steps }) => steps.length > 0);

  return (
    <section aria-labelledby={id} className={STYLES.list}>
      <h3 id={id}>Purchase order</h3>
      <p>Every purchase starts from Start or a node bought earlier.</p>

      {groups.map((group) => (
        <section key={group.name} aria-label={group.name}>
          <h4>
            {group.name}: {group.cost} points, {group.end} in total
          </h4>

          <ol start={group.steps[0].index + 1}>
            {group.steps.map((step) => {
              const view = byKey.get(step.node)!;

              return (
                <li key={step.node}>
                  <button
                    type="button"
                    aria-pressed={step.node === selected}
                    className={view.bought ? STYLES.bought : undefined}
                    onClick={() => onSelect(step.node)}
                  >
                    <span className={STYLES.name}>{describeNode(view)}</span>
                    <span className={STYLES.meta}>
                      {position(view.node)} · {step.cumulativeCost} points so
                      far
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </section>
  );
}
