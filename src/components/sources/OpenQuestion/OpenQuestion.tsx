import { Link } from "react-router";
import type { OpenQuestion as Question } from "../../../data/openQuestions.ts";
import { sources, type Source } from "../../../data/sources.ts";
import STYLES from "./OpenQuestion.module.css";

type Props = {
  question: Question;
};

/** One open question: what is unknown, why it matters, what to check, and where it applies. */
export function OpenQuestion({ question }: Props) {
  const { id, unknown, why, practicalCheck, relatedGuideLinks } = question;
  const supporting = question.supportingSourceIDs
    .map((sourceId): Source => sources[sourceId])
    .filter((source) => source.url);

  return (
    <li className={STYLES.question} aria-labelledby={`question-${id}`}>
      <p id={`question-${id}`} className={STYLES.unknown}>
        {unknown}
      </p>

      <dl className={STYLES.details}>
        <dt>Why it matters</dt>
        <dd>{why}</dd>
        <dt>What to check</dt>
        <dd>{practicalCheck}</dd>
      </dl>

      <p className={STYLES.links}>
        {relatedGuideLinks.map(({ to, label }) => (
          <Link key={to + label} to={to}>
            {label} →
          </Link>
        ))}
      </p>

      {supporting.length > 0 && (
        <p className={STYLES.sources}>
          <span>Sources: </span>
          {supporting.map(({ name, url }, i) => (
            <span key={name}>
              {i > 0 && ", "}
              <a href={url}>{name}</a>
            </span>
          ))}
        </p>
      )}
    </li>
  );
}
