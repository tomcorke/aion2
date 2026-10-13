import { Link, NavLink } from "react-router";
import { sections } from "../../sections.ts";
import STYLES from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={STYLES.header}>
      <div className={STYLES.inner}>
        <Link to="/" className={STYLES.brand}>
          <span className={STYLES.mark}>AION 2</span>
          <span className={STYLES.sub}>Field notes</span>
        </Link>

        <nav aria-label="Sections" className={STYLES.nav}>
          {sections.map(({ path, title }) => (
            <NavLink key={path} to={`/${path}`}>
              {title}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
