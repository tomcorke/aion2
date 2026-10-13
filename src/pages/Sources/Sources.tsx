import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { imageCredits, sourceList } from "../../data/sources.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import STYLES from "./Sources.module.css";

export function Sources() {
  useTitle("Sources");

  return (
    <>
      <PageHero
        title="Sources"
        lede="Where these notes come from, and the image credits."
      />

      <div className={STYLES.body}>
        <section className={STYLES.section}>
          <h2>Guides and data</h2>

          <ul className={STYLES.list}>
            {sourceList.map(({ name, covers, url }) => (
              <li key={name} className={STYLES.item}>
                {url ? <a href={url}>{name}</a> : name}
                <span className={STYLES.covers}>{covers}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={STYLES.section}>
          <h2>Images</h2>

          <ul className={STYLES.list}>
            {imageCredits.map(({ name, url }) => (
              <li key={name} className={STYLES.item}>
                <a href={url}>{name}</a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <SiteFooter reviewed="2026-10-14" />
    </>
  );
}
