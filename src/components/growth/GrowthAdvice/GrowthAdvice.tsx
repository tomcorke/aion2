import { Link } from "react-router";
import {
  growthLimitations,
  growthSpendGuidance,
} from "../../../data/growth.ts";
import { Diamond } from "../../trim/Diamond/Diamond.tsx";
import STYLES from "./GrowthAdvice.module.css";

/** Caps and spend order beside the table, then what the notes leave open. */
export function GrowthAdvice() {
  return (
    <aside aria-label="Spend guidance" className={STYLES.advice}>
      {growthSpendGuidance.map((group) => (
        <section key={group.id}>
          <h2>{group.title}</h2>
          <ul>
            {group.items.map((item) => (
              <li key={item}>
                <Diamond /> {item}
              </li>
            ))}
          </ul>
          {group.links.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              className={STYLES.link}
            >
              {link.label}
            </Link>
          ))}
        </section>
      ))}

      <section>
        <h2>Not covered yet</h2>
        <ul>
          {growthLimitations.map((item) => (
            <li key={item}>
              <Diamond /> {item}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
