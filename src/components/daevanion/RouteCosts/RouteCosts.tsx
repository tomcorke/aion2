import { useId } from "react";
import {
  daevanionBoards,
  daevanionCaveats,
  daevanionPools,
  daevanionVariants,
  type DaevanionClass,
} from "../../../data/daevanion.ts";
import STYLES from "./RouteCosts.module.css";

const pveBoards = daevanionPools.pve.boardIds.map((boardId) => ({
  ...daevanionBoards.find(({ id }) => id === boardId)!,
  id: boardId,
}));
const pveFullCost = pveBoards.reduce((sum, { fullCost }) => sum + fullCost, 0);

type CostProps = {
  cost?: number;
  max: number;
  label: string;
};

function Cost({ cost, max, label }: CostProps) {
  if (cost === undefined)
    return <td className={STYLES.missing}>Not recorded</td>;

  return (
    <td>
      <span className={STYLES.figure}>{cost}</span>
      <meter
        min={0}
        max={max}
        value={cost}
        aria-label={`${label}: ${cost} of ${max} points`}
      />
    </td>
  );
}

/** The class's three PvE route totals, with each board's cost against its full cost. */
export function RouteCosts({ entry }: { entry: DaevanionClass }) {
  const id = useId();

  const missing = daevanionVariants.some(
    (variant) =>
      Object.keys(entry.routes[variant.id].boardCosts).length <
      pveBoards.length,
  );

  return (
    <section aria-labelledby={id} className={STYLES.costs}>
      <h2 id={id}>Route costs</h2>

      <p>{daevanionPools.pve.description}</p>

      <div className={STYLES.scroll}>
        <table className={STYLES.table}>
          <caption>
            {entry.name} route points by board, against each board’s full cost
          </caption>
          <thead>
            <tr>
              <th scope="col">Board</th>
              {daevanionVariants.map((variant) => (
                <th key={variant.id} scope="col">
                  {variant.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pveBoards.map((board) => (
              <tr key={board.id}>
                <th scope="row">
                  {board.name}
                  <span className={STYLES.meta}>
                    Opens at level {board.opensAt} · {board.fullCost} full
                  </span>
                </th>
                {daevanionVariants.map((variant) => (
                  <Cost
                    key={variant.id}
                    cost={entry.routes[variant.id].boardCosts[board.id]}
                    max={board.fullCost}
                    label={`${variant.label} on ${board.name}`}
                  />
                ))}
              </tr>
            ))}
            <tr className={STYLES.total}>
              <th scope="row">
                All four boards
                <span className={STYLES.meta}>{pveFullCost} full</span>
              </th>
              {daevanionVariants.map((variant) => (
                <Cost
                  key={variant.id}
                  cost={entry.routes[variant.id].total}
                  max={pveFullCost}
                  label={`${variant.label} in total`}
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <dl className={STYLES.variants}>
        {daevanionVariants.map((variant) => (
          <div key={variant.id}>
            <dt>{variant.label}</dt>
            <dd>{variant.description}</dd>
          </div>
        ))}
      </dl>

      {missing && (
        <p className={STYLES.note}>{daevanionCaveats.missingCosts}</p>
      )}
    </section>
  );
}
