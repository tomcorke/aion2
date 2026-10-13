import { useEffect } from "react";
import { Link } from "react-router";
import { sections, type Section } from "./sections.ts";

function useTitle(title?: string) {
  useEffect(() => {
    document.title = title
      ? `${title} · AION 2 Field Notes`
      : "AION 2 Field Notes";
  }, [title]);
}

export function Home() {
  useTitle();
  return (
    <>
      <header className="page-head">
        <p className="eyebrow">AION 2 · Global (EU) · Season 1</p>
        <h1>Field notes</h1>
        <p className="lede">
          Sourced guides for progression, gear, Daevanion boards, timers and
          events. Every claim is tagged by where it comes from, so you can tell
          game data from player experience.
        </p>
      </header>
      <ul className="cards">
        {sections.map(({ path, title, summary }) => (
          <li key={path}>
            <Link to={`/${path}`} className="card">
              <h2>{title}</h2>
              <p>{summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function SectionPage({ section }: { section: Section }) {
  useTitle(section.title);
  return (
    <header className="page-head">
      <p className="eyebrow">Coming soon</p>
      <h1>{section.title}</h1>
      <p className="lede">{section.summary}</p>
      <p className="muted">Built from: {section.source}</p>
    </header>
  );
}

export function NotFound() {
  useTitle("Not found");
  return (
    <header className="page-head">
      <h1>Page not found</h1>
      <p className="lede">
        That page does not exist. <Link to="/">Back to the start</Link>.
      </p>
    </header>
  );
}
