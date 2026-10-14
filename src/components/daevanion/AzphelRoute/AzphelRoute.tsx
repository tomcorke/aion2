import { useId } from "react";
import {
  azphelOverview,
  daevanionBoards,
  daevanionPools,
} from "../../../data/daevanion.ts";
import { Diamond } from "../../trim/Diamond/Diamond.tsx";
import STYLES from "./AzphelRoute.module.css";

const board = daevanionBoards.find(({ id }) => id === azphelOverview.boardId)!;

const stats = (phase: (typeof azphelOverview.phases)[number]) =>
  "hp" in phase ? `+${phase.hp} HP, +${phase.mp} MP. ` : "";

/** The class-independent Azphel route: its own crystal pool and two phases. */
export function AzphelRoute() {
  const id = useId();

  return (
    <section aria-labelledby={id} className={STYLES.azphel}>
      <h2 id={id}>{board.name}, shared by every class</h2>

      <p className={STYLES.meta}>
        Opens at level {board.opensAt} · {board.fullCost} points to fill the
        board
      </p>

      <p>{daevanionPools.azphel.description}</p>
      <p>{azphelOverview.description}</p>

      <ol className={STYLES.phases}>
        {azphelOverview.phases.map((phase) => (
          <li key={phase.id}>
            <h3>{phase.label}</h3>
            <p className={STYLES.figure}>
              {phase.cost} points · {phase.cumulativeCost} in total
            </p>
            <meter
              min={0}
              max={board.fullCost}
              value={phase.cumulativeCost}
              aria-label={`${phase.label}: ${phase.cumulativeCost} of ${board.fullCost} points in total`}
            />
            <p>
              {stats(phase)}
              {phase.description}
            </p>
          </li>
        ))}
      </ol>

      <ul className={STYLES.notes}>
        {[
          azphelOverview.statusEffectCaveat,
          azphelOverview.alternativeCaveat,
        ].map((note) => (
          <li key={note}>
            <Diamond />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
