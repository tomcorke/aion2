import { useId, useState } from "react";
import {
  gearActivities,
  gearDrops,
  type GearActivity,
  type GearSlot,
} from "../../../data/gear.ts";
import { FilterChips } from "../../controls/FilterChips/FilterChips.tsx";
import { GearName } from "../GearName/GearName.tsx";
import { pieceLevelText } from "../PieceLevel/PieceLevel.tsx";
import STYLES from "./DropMatrix.module.css";

// Mixed is its own column: a set of mixed slots, not every slot.
const slots: GearSlot[] = [
  "Weapons",
  "Guards",
  "Armor",
  "Accessories",
  "Breastplate",
  "Mixed",
];

const number = new Intl.NumberFormat("en-GB");

const dropsOf = (activity: GearActivity) =>
  [...new Set(activity.modes.flatMap(({ dropIds }) => dropIds))].map((id) =>
    gearDrops.find((drop) => drop.id === id)!,
  );

function MatrixRow({ activity }: { activity: GearActivity }) {
  const drops = dropsOf(activity);

  const materials = [
    ...new Set(activity.modes.flatMap(({ materials = [] }) => materials)),
  ];

  return (
    <tr>
      <th scope="row">
        <GearName name={activity.name} />
        <span className={STYLES.kind}>{activity.kind}</span>
      </th>
      <td>
        {activity.modes.map((mode) => (
          <span key={mode.name} className={STYLES.mode}>
            {mode.name}
            {mode.totalItemLevel !== undefined && (
              <span className={STYLES.level}>
                {" "}
                {number.format(mode.totalItemLevel)}
              </span>
            )}
            {mode.cubeOdyleEnergy !== undefined &&
              ` (cube: ${mode.cubeOdyleEnergy} Odyle Energy)`}
          </span>
        ))}
      </td>
      {slots.map((slot) => (
        <td key={slot} className={STYLES.level}>
          {[
            ...new Set(
              drops
                .filter((drop) => drop.slots.includes(slot))
                .map((drop) => pieceLevelText(drop.pieceItemLevel)),
            ),
          ].join(", ")}
        </td>
      ))}
      <td>{materials.join(", ")}</td>
    </tr>
  );
}

/** Every activity against the slots it drops, with a temporary slot filter. */
export function DropMatrix() {
  const id = useId();
  const [slot, setSlot] = useState<GearSlot>();

  const rows = slot
    ? gearActivities.filter((activity) =>
        dropsOf(activity).some((drop) => drop.slots.includes(slot)),
      )
    : gearActivities;

  return (
    <section aria-labelledby={id} className={STYLES.matrix}>
      <h2 id={id}>Activity drops by slot</h2>

      <p className={STYLES.note}>
        Numbers are piece item levels; totals sit beside each mode. A listed
        drop is a loot-table entry, not a promised amount.
      </p>

      <FilterChips
        label="Slot"
        chips={slots.map((value) => ({
          value,
          label: value,
          pressed: slot === value,
        }))}
        onToggle={(value) => setSlot(slot === value ? undefined : value)}
      />

      <div
        className={STYLES.scroll}
        role="region"
        aria-label="Activity drop matrix, scrolls sideways"
        tabIndex={0}
      >
        <table className={STYLES.table}>
          <caption>Activity drop matrix</caption>
          <thead>
            <tr>
              <th scope="col">Activity</th>
              <th scope="col">Modes and total gates</th>
              {slots.map((value) => (
                <th key={value} scope="col">
                  {value}
                </th>
              ))}
              <th scope="col">Materials</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((activity) => (
              <MatrixRow key={activity.id} activity={activity} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
