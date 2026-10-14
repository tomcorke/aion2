import { Fragment } from "react";
import { Link } from "react-router";
import { CounterTable } from "../../components/alts/CounterTable/CounterTable.tsx";
import { SharingLedger } from "../../components/alts/SharingLedger/SharingLedger.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { Diamond } from "../../components/trim/Diamond/Diamond.tsx";
import { Rule } from "../../components/trim/Rule/Rule.tsx";
import {
  altsReviewed,
  altsSections,
  altsSources,
  cubeWarning,
  resourceCounters,
} from "../../data/alts.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import STYLES from "./Alts.module.css";

const cubes = resourceCounters["unobtained-cubes"];

export function Alts() {
  useTitle("Alts");

  return (
    <>
      <PageHero
        title="Alts"
        lede="What a same-server alt shares with your main, what stays on each character, and which jobs suit each."
      />

      <div className={STYLES.body}>
        <section aria-labelledby="alts-ledger">
          <h2 id="alts-ledger" className={STYLES.heading}>
            What carries over
          </h2>
          <SharingLedger />
        </section>

        <section aria-labelledby="alts-cubes" className={STYLES.warning}>
          <h2 id="alts-cubes" className={STYLES.heading}>
            Skipped cubes can lock the main out
          </h2>
          <p>{cubeWarning}</p>
          <p className={STYLES.muted}>
            {cubes.name}: {cubes.limit}, shared by the whole server.
          </p>
        </section>

        <Rule gem />
        <CounterTable />

        {altsSections.map(({ id, title, items, links }) => (
          <Fragment key={id}>
            <Rule gem />
            <section aria-labelledby={`alts-${id}`}>
              <h2 id={`alts-${id}`} className={STYLES.heading}>
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
              {links?.map(({ to, label }) => (
                <Link key={to + label} to={to} className={STYLES.link}>
                  {label}
                </Link>
              ))}
            </section>
          </Fragment>
        ))}
      </div>

      <SiteFooter sources={altsSources} reviewed={altsReviewed} />
    </>
  );
}
