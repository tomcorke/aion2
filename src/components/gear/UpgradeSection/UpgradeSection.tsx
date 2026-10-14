import type { ReactNode } from "react";
import { Link } from "react-router";
import type { GearUpgradeSection } from "../../../data/gearUpgrades.ts";
import { Diamond } from "../../trim/Diamond/Diamond.tsx";
import STYLES from "./UpgradeSection.module.css";

type Props = {
  section: GearUpgradeSection;
  // Tables that belong to this section, shown after its advice.
  children?: ReactNode;
};

/** One upgrade topic: advice rows, its loss warning beside them, then tables and links. */
export function UpgradeSection({ section, children }: Props) {
  const { id, title, items, warning, links } = section;

  return (
    <section aria-labelledby={id} className={STYLES.section}>
      <h2 id={id} tabIndex={-1}>
        {title}
      </h2>

      <ul className={STYLES.items}>
        {items.map((item) => (
          <li key={item}>
            <Diamond />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {warning && (
        <p role="note" className={STYLES.warning}>
          {warning}
        </p>
      )}

      {children && <div className={STYLES.tables}>{children}</div>}

      {links && (
        <p className={STYLES.links}>
          {links.map(({ to, label }) => (
            <Link key={to + label} to={to}>
              {label} →
            </Link>
          ))}
        </p>
      )}
    </section>
  );
}
