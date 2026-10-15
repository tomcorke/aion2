import { OpenQuestion } from "../../components/sources/OpenQuestion/OpenQuestion.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { Rule } from "../../components/trim/Rule/Rule.tsx";
import { openQuestionGroups, openQuestions } from "../../data/openQuestions.ts";
import { sourceDetails } from "../../data/sourceDetails.ts";
import {
  imageCredits,
  sources,
  type Source,
  type SourceId,
} from "../../data/sources.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import { formatDate } from "../../lib/time.ts";
import STYLES from "./Sources.module.css";

export function Sources() {
  useTitle("Sources");

  return (
    <>
      <PageHero
        title="Sources"
        lede="Where these notes come from, the image credits, and what is still unknown."
      />

      <div className={STYLES.body}>
        <section aria-labelledby="guides" className={STYLES.section}>
          <h2 id="guides">Guides and data</h2>

          <ul className={STYLES.list}>
            {(Object.keys(sources) as SourceId[]).map((id) => {
              const { name, covers, url } = sources[id] as Source;
              const { checkedDate, accessNote } = sourceDetails[id] ?? {};

              return (
                <li key={id} className={STYLES.item}>
                  {url ? <a href={url}>{name}</a> : name}
                  <span className={STYLES.covers}>{covers}</span>
                  {(checkedDate || accessNote) && (
                    <span className={STYLES.checked}>
                      {checkedDate && (
                        <>
                          Checked{" "}
                          <time dateTime={checkedDate}>
                            {formatDate(checkedDate)}
                          </time>
                          .{" "}
                        </>
                      )}
                      {accessNote}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="images" className={STYLES.section}>
          <h2 id="images">Images</h2>

          <ul className={STYLES.list}>
            {imageCredits.map(({ name, url }) => (
              <li key={name} className={STYLES.item}>
                <a href={url}>{name}</a>
              </li>
            ))}
          </ul>
        </section>

        <Rule gem />

        <section aria-labelledby="open-questions" className={STYLES.section}>
          <h2 id="open-questions">Open questions</h2>

          <p className={STYLES.intro}>
            Things these notes cannot settle yet, why each changes the advice,
            and the smallest check that would settle it. Reviewed dates on each
            page mark when its content was last compared with the notes, not a
            new check of these sources.
          </p>

          {openQuestionGroups.map(({ id, title }) => (
            <section
              key={id}
              aria-labelledby={`questions-${id}`}
              className={STYLES.group}
            >
              <h3 id={`questions-${id}`}>{title}</h3>

              <ul className={STYLES.list}>
                {openQuestions
                  .filter((question) => question.groupId === id)
                  .map((question) => (
                    <OpenQuestion key={question.id} question={question} />
                  ))}
              </ul>
            </section>
          ))}
        </section>
      </div>

      <SiteFooter reviewed="2026-10-14" />
    </>
  );
}
