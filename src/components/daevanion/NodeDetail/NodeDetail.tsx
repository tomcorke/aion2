import {
  describeNode,
  position,
  type ViewNode,
} from "../../../lib/daevanionNode.ts";
import STYLES from "./NodeDetail.module.css";

const roles = {
  core: "Core multiplier",
  "damage-core": "Damage passive or core skill",
  damage: "Other damage skill",
  utility: "Utility skill",
  defensive: "Defensive skill",
} as const;

/** The selected node's details, read out as they change. */
export function NodeDetail({
  view,
  traversal,
}: {
  view: ViewNode | undefined;
  traversal: boolean;
}) {
  return (
    <section
      aria-label="Selected node"
      aria-live="polite"
      className={STYLES.detail}
    >
      {view ? (
        <>
          <h3>{view.node.type === "Start" ? "Start" : view.name}</h3>
          <p>{describeNode(view)}.</p>

          <dl>
            <dt>Position</dt>
            <dd>{position(view.node)}</dd>

            {view.node.grade && (
              <>
                <dt>Grade</dt>
                <dd>{view.node.grade}</dd>
              </>
            )}

            {view.phase && (
              <>
                <dt>Phase</dt>
                <dd>{view.phase}</dd>
                <dt>
                  {traversal
                    ? "Route spend through this node"
                    : "Route spend after this purchase"}
                </dt>
                <dd>{view.cumulativeCost} points</dd>
              </>
            )}

            {view.skill && (
              <>
                <dt>Skill role</dt>
                <dd>{roles[view.skill.role]}</dd>
                <dt>
                  {view.skill.tooltipLabel ??
                    "The skill at its normal maximum rank"}
                </dt>
                <dd>{view.skill.maxRankTooltip}</dd>
                {view.skill.tooltipNote && (
                  <>
                    <dt>Current Global tooltip status</dt>
                    <dd>{view.skill.tooltipNote}</dd>
                  </>
                )}
              </>
            )}
          </dl>

          {view.skill && (
            <p className={STYLES.note}>
              This tooltip describes the whole skill, not the gain from this
              node&apos;s extra rank.
            </p>
          )}
        </>
      ) : (
        <p className={STYLES.note}>
          Select a node on the board or in the{" "}
          {traversal ? "traversal list" : "purchase order"} to see its details.
        </p>
      )}
    </section>
  );
}
