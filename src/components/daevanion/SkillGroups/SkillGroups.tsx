import { useId } from "react";
import type { DaevanionClass } from "../../../data/daevanion.ts";
import { Diamond } from "../../trim/Diamond/Diamond.tsx";
import STYLES from "./SkillGroups.module.css";

const groups = [
  { key: "core", label: "Core multipliers" },
  { key: "damage", label: "Damage" },
  { key: "utility", label: "Utility" },
  { key: "defensive", label: "Defensive" },
] as const;

/** The class's skills sorted into the four roles the routes are built from. */
export function SkillGroups({ entry }: { entry: DaevanionClass }) {
  const id = useId();

  return (
    <section aria-labelledby={id} className={STYLES.skills}>
      <h2 id={id}>Skill roles</h2>

      <div className={STYLES.groups}>
        {groups.map(({ key, label }) => (
          <section key={key} aria-labelledby={`${id}-${key}`}>
            <h3 id={`${id}-${key}`}>{label}</h3>

            {entry.skills[key].length > 0 && (
              <ul className={STYLES.list}>
                {entry.skills[key].map((skill) => (
                  <li key={skill}>
                    <Diamond />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            )}

            {key === "damage" && (
              <p className={STYLES.note}>{entry.damageNote}</p>
            )}
          </section>
        ))}
      </div>
    </section>
  );
}
