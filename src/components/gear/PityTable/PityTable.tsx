import { Fragment, useId } from "react";
import {
  gearActivities,
  gearPity,
  gearPityLimitations,
} from "../../../data/gear.ts";
import { Diamond } from "../../trim/Diamond/Diamond.tsx";
import { GearName } from "../GearName/GearName.tsx";
import STYLES from "./PityTable.module.css";

const usersOf = (pityId: string) =>
  gearActivities.flatMap((activity) =>
    activity.modes
      .filter((mode) => mode.pityId === pityId)
      .map((mode) => ({ activity, mode })),
  );

/** Documented run counts to each pity reward. No personal counter. */
export function PityTable() {
  const id = useId();

  return (
    <section aria-labelledby={id} className={STYLES.pity}>
      <h2 id={id}>Pity</h2>

      <table className={STYLES.table}>
        <caption>Runs to a pity reward</caption>
        <thead>
          <tr>
            <th scope="col">Mode and dungeons</th>
            <th scope="col">Runs</th>
            <th scope="col">With membership</th>
          </tr>
        </thead>
        <tbody>
          {gearPity.map((pity) => {
            const users = usersOf(pity.id);

            return (
              <tr key={pity.id}>
                <th scope="row">
                  {users[0]?.mode.name}:{" "}
                  {users.map(({ activity }, index) => (
                    <Fragment key={activity.id}>
                      {index > 0 && ", "}
                      <GearName name={activity.name} />
                    </Fragment>
                  ))}
                </th>
                <td className={STYLES.runs}>{pity.requiredRuns}</td>
                <td>
                  {pity.memberRunCredit === undefined
                    ? "Not recorded"
                    : `Each run counts as ${pity.memberRunCredit}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ul className={STYLES.limits}>
        {gearPityLimitations.map((limit) => (
          <li key={limit}>
            <Diamond />
            <span>{limit}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
