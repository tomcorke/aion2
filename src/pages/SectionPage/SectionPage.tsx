import { PageHead } from "../../components/PageHead/PageHead.tsx";
import type { Section } from "../../sections.ts";
import { useTitle } from "../../useTitle.ts";
import styles from "./SectionPage.module.css";

export function SectionPage({ section }: { section: Section }) {
  useTitle(section.title);

  return (
    <PageHead
      eyebrow="Coming soon"
      title={section.title}
      lede={section.summary}
    >
      <p className={styles.source}>Built from: {section.source}</p>
    </PageHead>
  );
}
