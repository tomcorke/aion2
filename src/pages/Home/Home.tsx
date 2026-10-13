import { Link } from "react-router";
import { PageHead } from "../../components/PageHead/PageHead.tsx";
import { sections } from "../../sections.ts";
import { useTitle } from "../../useTitle.ts";
import styles from "./Home.module.css";

export function Home() {
  useTitle();

  return (
    <>
      <PageHead
        eyebrow="AION 2 · Global (EU) · Season 1"
        title="Field notes"
        lede="Player notes on progression, gear, Daevanion boards, timers and events. Best effort: check anything important in game."
      />

      <ul className={styles.cards}>
        {sections.map(({ path, title, summary }) => (
          <li key={path}>
            <Link to={`/${path}`} className={styles.card}>
              <h2>{title}</h2>
              <p>{summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
