import { PageHero } from "../../components/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/SiteFooter/SiteFooter.tsx";
import type { Section } from "../../sections.ts";
import { useTitle } from "../../useTitle.ts";
import STYLES from "./SectionPage.module.css";

/** Stand-in for sections not built yet. */
export function SectionPage({ section }: { section: Section }) {
  useTitle(section.title);

  return (
    <>
      <PageHero title={section.title} lede={section.summary} />
      <p className={STYLES.soon}>This page is not written yet.</p>
      <SiteFooter />
    </>
  );
}
