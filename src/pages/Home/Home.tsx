import { Link } from "react-router";
import hero from "../../assets/hero.jpg";
import { Diamond } from "../../components/Diamond/Diamond.tsx";
import { Rule } from "../../components/Rule/Rule.tsx";
import { SiteFooter } from "../../components/SiteFooter/SiteFooter.tsx";
import { TimerBoard } from "../../components/TimerBoard/TimerBoard.tsx";
import { sections } from "../../sections.ts";
import { timerSources } from "../../timers.ts";
import { useTitle } from "../../useTitle.ts";
import STYLES from "./Home.module.css";

export function Home() {
  useTitle();

  return (
    <>
      <div className={STYLES.top}>
        <img src={hero} alt="" className={STYLES.backdrop} />
        <h1 className={STYLES.heading}>AION 2 player notes</h1>
        <TimerBoard />
      </div>

      <div className={STYLES.rule}>
        <Rule gem />
      </div>

      <nav aria-label="All sections" className={STYLES.index}>
        {sections.map(({ path, title, summary }) => (
          <Link key={path} to={`/${path}`} className={STYLES.section}>
            <span className={STYLES.title}>
              <Diamond />
              {title}
            </span>
            <span className={STYLES.summary}>{summary}</span>
          </Link>
        ))}
      </nav>

      <SiteFooter sources={timerSources} reviewed="2026-10-14" />
    </>
  );
}
