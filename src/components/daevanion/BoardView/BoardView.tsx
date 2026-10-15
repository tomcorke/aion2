import { useState } from "react";
import { useSearchParams } from "react-router";
import type {
  BoardGeometry,
  PurchaseRoute,
  RouteSkill,
} from "../../../data/daevanionRoutes.ts";
import { getRouteBudget } from "../../../lib/daevanionBudget.ts";
import { plural, position, type ViewNode } from "../../../lib/daevanionNode.ts";
import { BoardDiagram } from "../BoardDiagram/BoardDiagram.tsx";
import { NodeDetail } from "../NodeDetail/NodeDetail.tsx";
import { PurchaseList } from "../PurchaseList/PurchaseList.tsx";
import STYLES from "./BoardView.module.css";

type Props = {
  geometry: BoardGeometry;
  route: PurchaseRoute;
  phases: string[];
  skillMap: Record<string, number>;
  skills: RouteSkill[];
  rawPoints: string | null;
};

function buildNodes(props: Props, bought: number): ViewNode[] {
  const { geometry, route, phases, skillMap, skills } = props;
  const steps = new Map(route.steps.map((step, index) => [step.node, index]));
  const targets = new Set(route.targets);

  return geometry.nodes.map((node) => {
    const index = steps.get(node.key);
    const step = index === undefined ? undefined : route.steps[index];
    const skill = skills.find(({ id }) => id === skillMap[node.key]);

    return {
      node,
      name:
        node.label ??
        (skill ? `${skill.name} +${node.skillLevels} rank` : "Skill node"),
      skill,
      step: index === undefined ? null : index + 1,
      phase: step ? phases[step.phase] : null,
      cumulativeCost: step?.cumulativeCost ?? null,
      target: targets.has(node.key),
      bought: index !== undefined && index < bought,
      next: index === bought,
    };
  });
}

/** The selected route: budget scrubber, summary, diagram, node detail and text order. */
export function BoardView(props: Props) {
  const { geometry, route, rawPoints } = props;
  const [, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<string | null>(null);
  const budget = getRouteBudget(route, rawPoints);
  const nodes = buildNodes(props, budget.purchases.length);
  const nextView = nodes.find((view) => view.next);
  const selectedView = nodes.find((view) => view.node.key === selected);

  // Scrubbing replaces the entry, so Back returns to the previous route, not every point.
  const setPoints = (points: number) =>
    setSearchParams(points ? { points: String(points) } : {}, {
      replace: true,
    });

  return (
    <div className={STYLES.view}>
      <div className={STYLES.budget}>
        <label>
          <span>Point budget</span>
          <input
            type="range"
            min={0}
            max={route.total}
            step={1}
            value={budget.points}
            onChange={(event) => setPoints(Number(event.target.value))}
          />
        </label>

        <p className={STYLES.figure}>
          {budget.points} of {route.total} points
        </p>

        {budget.message && <p className={STYLES.message}>{budget.message}</p>}

        <p aria-live="polite">
          {`Buys the first ${plural(budget.purchases.length, "purchase")} of ${route.steps.length} for ${plural(budget.spent, "point")}, with ${budget.leftover} left over. `}
          {nextView
            ? `Next: ${nextView.name} (${position(nextView.node).toLowerCase()}) costs ${plural(budget.nextCost!, "point")}, ${budget.nextCost! - budget.leftover} more than you have left.`
            : "The whole route fits this budget."}
        </p>
      </div>

      <BoardDiagram
        name={geometry.name}
        nodes={nodes}
        steps={route.steps.map(({ node }) => node)}
        start={geometry.start}
        selected={selected}
        onSelect={setSelected}
      />

      <NodeDetail view={selectedView} />

      <PurchaseList
        nodes={nodes}
        route={route}
        phases={props.phases}
        selected={selected}
        onSelect={setSelected}
      />
    </div>
  );
}
