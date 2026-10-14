import { Link } from "react-router";
import { skinCategories, type SkinEntry } from "../../../data/skins.ts";
import { ownedCount } from "../../../lib/skinOwnership.ts";
import STYLES from "./SkinList.module.css";

type Props = {
  entries: SkinEntry[];
  owned: string[];
  selected?: string;
};

/** Sets grouped by type, each a link to its own route with owned/total progress. */
export function SkinList({ entries, owned, selected }: Props) {
  return (
    <nav aria-label="Skin sets" className={STYLES.list}>
      {skinCategories.map(({ category, label }) => {
        const group = entries.filter((entry) => entry.category === category);

        if (group.length === 0) return null;

        return (
          <section key={category} className={STYLES.group}>
            <h2>{label}</h2>

            <ul>
              {group.map((entry) => {
                const count = ownedCount(entry.pieces, owned);
                const total = entry.pieces.length;

                return (
                  <li key={entry.id}>
                    <Link
                      to={`/skins/${entry.id}`}
                      aria-current={entry.id === selected ? "page" : undefined}
                      className={STYLES.entry}
                    >
                      <span>{entry.name}</span>
                      <progress value={count} max={total} aria-hidden="true" />
                      <span className={STYLES.count}>
                        {count}/{total}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}
