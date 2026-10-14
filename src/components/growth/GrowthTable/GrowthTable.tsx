import type { GrowthMaterial } from "../../../data/growth.ts";
import { GrowthRow } from "../GrowthRow/GrowthRow.tsx";
import STYLES from "./GrowthTable.module.css";

/** The material table in a keyboard-scrollable region for narrow screens. */
export function GrowthTable({ materials }: { materials: GrowthMaterial[] }) {
  return (
    <div
      className={STYLES.scroll}
      role="region"
      aria-label="Growth materials, scrolls sideways"
      tabIndex={0}
    >
      <table className={STYLES.table}>
        <caption>Growth materials</caption>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Grows</th>
            <th scope="col">From</th>
            <th scope="col">Limits and conditions</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <GrowthRow key={material.id} material={material} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
