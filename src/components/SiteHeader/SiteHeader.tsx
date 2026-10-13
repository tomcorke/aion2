import { Link, NavLink } from "react-router";
import { sections } from "../../sections.ts";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.mark}>AION 2</span>
          <span className={styles.sub}>Field notes</span>
        </Link>

        <nav aria-label="Sections" className={styles.nav}>
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
