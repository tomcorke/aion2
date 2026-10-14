import { Fragment, useId } from "react";
import {
  gearActivities,
  gearDrops,
  gearRewardConditions,
  type GearActivity,
  type GearDrop,
  type GearMode,
  type GearTierId,
} from "../../../data/gear.ts";
import { Diamond } from "../../trim/Diamond/Diamond.tsx";
import { GearName } from "../GearName/GearName.tsx";
import { PieceLevel } from "../PieceLevel/PieceLevel.tsx";
import STYLES from "./TierDrops.module.css";

const number = new Intl.NumberFormat("en-GB");

type Row = { activity: GearActivity; mode: GearMode; drop: GearDrop };

const dropById = (id: string) => gearDrops.find((drop) => drop.id === id)!;

function rowsOf(tierId: GearTierId): Row[] {
  return gearActivities.flatMap((activity) =>
    activity.modes.flatMap((mode) =>
      mode.dropIds
        .map(dropById)
        .filter((drop) => drop.tierId === tierId)
        .map((drop) => ({ activity, mode, drop })),
    ),
  );
}

function DropRow({ activity, mode, drop }: Row) {
  const notes = [drop.condition, mode.condition].filter(Boolean);

  return (
    <tr>
      <td>
        <GearName name={drop.name} />
      </td>
      <td>{drop.slots.join(", ")}</td>
      <td>
        <PieceLevel level={drop.pieceItemLevel} />
      </td>
      <td>
        <GearName name={activity.name} />
        <span className={STYLES.kind}>{activity.kind}</span>
      </td>
      <td>{mode.name}</td>
      <td className={STYLES.total}>
        {mode.totalItemLevel === undefined ? (
          <span className={STYLES.unknown}>Not recorded</span>
        ) : (
          number.format(mode.totalItemLevel)
        )}
      </td>
      <td className={STYLES.notes}>{notes.join(" ")}</td>
    </tr>
  );
}

function RewardRules({ rows }: { rows: Row[] }) {
  const id = useId();

  const used = gearRewardConditions.flatMap((condition) => {
    const modes = rows.filter(
      ({ mode }, index) =>
        mode.rewardConditionId === condition.id &&
        rows.findIndex((row) => row.mode === mode) === index,
    );

    return modes.length > 0 ? [{ condition, modes }] : [];
  });

  if (used.length === 0) return null;

  return (
    <section aria-labelledby={id} className={STYLES.rules}>
      <h3 id={id}>Reward rules</h3>
      <ul>
        {used.map(({ condition, modes }) => (
          <li key={condition.id}>
            <Diamond />
            <div>
              <strong>
                {modes.map(({ activity, mode }, index) => (
                  <Fragment key={activity.id + mode.name}>
                    {index > 0 && ", "}
                    <GearName name={activity.name} /> {mode.name}
                  </Fragment>
                ))}
              </strong>
              {condition.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Every activity mode that drops gear in the selected tier, with its gate and conditions. */
export function TierDrops({ tierId }: { tierId: GearTierId }) {
  const rows = rowsOf(tierId);

  return (
    <div className={STYLES.drops}>
      <div className={STYLES.scroll}>
        <table className={STYLES.table}>
          <caption>Drops and alternatives in this tier</caption>
          <thead>
            <tr>
              <th scope="col">Gear</th>
              <th scope="col">Slots</th>
              <th scope="col">Piece</th>
              <th scope="col">Source</th>
              <th scope="col">Mode</th>
              <th scope="col">Total gate</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <DropRow
                key={row.activity.id + row.mode.name + row.drop.id}
                {...row}
              />
            ))}
          </tbody>
        </table>
      </div>

      <RewardRules rows={rows} />
    </div>
  );
}
