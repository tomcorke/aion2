import { Link } from "react-router";
import { ContentsRail } from "../../components/progression/ContentsRail/ContentsRail.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { Diamond } from "../../components/trim/Diamond/Diamond.tsx";
import { Rule } from "../../components/trim/Rule/Rule.tsx";
import {
  gates,
  progressionReviewed,
  progressionSections,
  progressionSourceIds,
  type ProgressionSection,
} from "../../data/progression.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import STYLES from "./Progression.module.css";

const number = new Intl.NumberFormat("en-GB");

function GateTable() {
  return (
    <table className={STYLES.gates}>
      <caption>Item-level gates</caption>
      <thead>
        <tr>
          <th scope="col">Total item level</th>
          <th scope="col">Opens</th>
        </tr>
      </thead>
      <tbody>
        {gates.map(({ itemLevel, unlocks }) => (
          <tr key={itemLevel}>
            <td className={STYLES.level}>{number.format(itemLevel)}</td>
            <td>{unlocks.join("; ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GuideSection({
  id,
  title,
  intro,
  items,
  showGates,
  links,
}: ProgressionSection) {
  return (
    <section aria-labelledby={id} className={STYLES.section}>
      <h2 id={id} tabIndex={-1}>
        {title}
      </h2>

      {intro && <p>{intro}</p>}

      {items && (
        <ul className={STYLES.items}>
          {items.map((item) => (
            <li key={item}>
              <Diamond />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {showGates && <GateTable />}

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

export function Progression() {
  useTitle("Progression");

  return (
    <>
      <PageHero
        title="Progression"
        lede="What opens at each total item level, what to do first, and what to save."
      />

      <div className={STYLES.body}>
        <ContentsRail entries={progressionSections} />

        <div className={STYLES.guide}>
          {progressionSections.map((section, i) => (
            <div key={section.id} className={STYLES.part}>
              {i > 0 && <Rule gem />}
              <GuideSection {...section} />
            </div>
          ))}
        </div>
      </div>

      <SiteFooter
        sources={progressionSourceIds}
        reviewed={progressionReviewed}
      />
    </>
  );
}
