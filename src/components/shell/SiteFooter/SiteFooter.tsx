import { Fragment } from "react";
import { Link, useLocation } from "react-router";
import { sources, type SourceId } from "../../../data/sources.ts";
import { questionsForTopic } from "../../../lib/questionsForTopic.ts";
import { formatDate } from "../../../lib/time.ts";
import { Rule } from "../../trim/Rule/Rule.tsx";
import STYLES from "./SiteFooter.module.css";

type Props = {
  sources?: SourceId[];
  // ISO date the page was last checked against the notes.
  reviewed?: string;
  // Data pages whose terms ask for a direct link to each page used.
  attribution?: { name: string; url: string }[];
};

const topicOf = (path: string) => path.split("/")[1] ?? "";

export function SiteFooter({
  sources: ids = [],
  reviewed,
  attribution = [],
}: Props) {
  const names = ids.map((id) => sources[id].name);
  const pages = [
    ...new Map(attribution.map((page) => [page.url, page])).values(),
  ];
  const topic = topicOf(useLocation().pathname);
  const questions = topic === "sources" ? [] : questionsForTopic(topic);

  return (
    <footer className={STYLES.footer}>
      <Rule />

      <p className={STYLES.text}>
        {names.length > 0 && `Sources: ${names.join(", ")}. `}
        {pages.length > 0 && (
          <>
            Data from{" "}
            {pages.map(({ name, url }, index) => (
              <Fragment key={url}>
                {index > 0 && ", "}
                <a href={url} className={STYLES.link}>
                  {name}
                </a>
              </Fragment>
            ))}
            .{" "}
          </>
        )}
        Banner art from the AION 2 press kit.{" "}
        {reviewed && `Reviewed ${formatDate(reviewed)}. `}
        Best-effort player notes; check anything important in game.{" "}
        {questions.length > 0 && (
          <>
            <Link to={`/sources?topic=${topic}`} className={STYLES.link}>
              {questions.length} open{" "}
              {questions.length === 1 ? "question" : "questions"} for this
              section
            </Link>
            {" · "}
          </>
        )}
        <Link to="/sources" className={STYLES.link}>
          All sources
        </Link>
      </p>
    </footer>
  );
}
