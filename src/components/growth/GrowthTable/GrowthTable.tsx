import type { GrowthMaterial } from "../../../data/growth.ts";
import { GrowthRow } from "../GrowthRow/GrowthRow.tsx";
import STYLES from "./GrowthTable.module.css";

/**
 * The material table. Narrow containers restyle each row as a labelled entry
 * instead of scrolling sideways; explicit roles keep the table semantics.
 */
export function GrowthTable({ materials }: { materials: GrowthMaterial[] }) {
  return (
    <div className={STYLES.frame}>
      <table className={STYLES.table} role="table">
        <caption>Growth materials</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">
              Item
            </th>
            <th scope="col" role="columnheader">
              Grows
            </th>
            <th scope="col" role="columnheader">
              From
            </th>
            <th scope="col" role="columnheader">
              Limits and conditions
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {materials.map((material) => (
            <GrowthRow key={material.id} material={material} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
