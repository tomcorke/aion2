import { Link, NavLink, Outlet, ScrollRestoration } from "react-router";
import { sections } from "./sections.ts";

export function Layout() {
  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">AION 2</span>
            <span className="brand-sub">Field notes</span>
          </Link>
          <nav aria-label="Sections" className="site-nav">
            {sections.map(({ path, title }) => (
              <NavLink key={path} to={`/${path}`}>
                {title}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
      <footer className="site-footer">
        Global (EU) · Season 1 · Every claim is sourced; see{" "}
        <Link to="/sources">Sources</Link>.
      </footer>
      <ScrollRestoration />
    </>
  );
}
