import { Link } from "react-router";
import { sources, type SourceId } from "../../sources.ts";
import { Rule } from "../Rule/Rule.tsx";
import STYLES from "./SiteFooter.module.css";

type Props = {
  sources?: SourceId[];
  // ISO date the page was last checked against the notes.
  reviewed?: string;
};

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" });

export function SiteFooter({ sources: ids = [], reviewed }: Props) {
  const names = ids.map((id) => sources[id].name);

  return (
    <footer className={STYLES.footer}>
      <Rule />

      <p className={STYLES.text}>
        {names.length > 0 && `Sources: ${names.join(", ")}. `}
        Banner art from the AION 2 press kit.{" "}
        {reviewed && `Reviewed ${dateFormat.format(new Date(reviewed))}. `}
        Best-effort player notes; check anything important in game.{" "}
        <Link to="/sources" className={STYLES.link}>
          All sources
        </Link>
      </p>
    </footer>
  );
}
