import { useState } from "react";
import { Link, NavLink } from "react-router";
import { sections } from "../../sections.ts";
import { MetalToggle } from "../MetalToggle/MetalToggle.tsx";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle.tsx";
import STYLES from "./SiteHeader.module.css";

const MENU = "M4 7h16M4 12h16M4 17h16";
const CLOSE = "M6 6l12 12M18 6 6 18";

export function SiteHeader() {
  // The nav folds behind a menu button on narrow screens.
  const [open, setOpen] = useState(false);

  return (
    <header className={STYLES.header} data-open={open}>
      <Link to="/" className={STYLES.wordmark} onClick={() => setOpen(false)}>
        AION 2
      </Link>

      <nav id="site-nav" aria-label="Sections" className={STYLES.nav}>
        {sections.map(({ path, title }) => (
          <NavLink key={path} to={`/${path}`} onClick={() => setOpen(false)}>
            {title}
          </NavLink>
        ))}
      </nav>

      <div className={STYLES.controls}>
        <MetalToggle />
        <ThemeToggle />

        <button
          type="button"
          className={STYLES.menu}
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d={open ? CLOSE : MENU} />
          </svg>
        </button>
      </div>
    </header>
  );
}
