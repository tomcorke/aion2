import { Diamond } from "../../trim/Diamond/Diamond.tsx";
import STYLES from "./ContentsRail.module.css";

type Props = {
  // Each id names a focusable heading on the page.
  entries: { id: string; title: string }[];
};

/** Jumps to a section in code, so the hash route never changes. */
export function ContentsRail({ entries }: Props) {
  const jump = (id: string) => {
    const heading = document.getElementById(id);

    heading?.scrollIntoView({ block: "start" });
    heading?.focus({ preventScroll: true });
  };

  return (
    <nav aria-label="Contents" className={STYLES.rail}>
      <ul className={STYLES.list}>
        {entries.map(({ id, title }) => (
          <li key={id}>
            <button
              type="button"
              className={STYLES.entry}
              onClick={() => jump(id)}
            >
              <Diamond />
              {title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
