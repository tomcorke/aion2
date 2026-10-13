import { Outlet, ScrollRestoration } from "react-router";
import { SiteHeader } from "../SiteHeader/SiteHeader.tsx";
import STYLES from "./Layout.module.css";

/** Every page renders its own hero and footer, since each footer names that page's sources. */
export function Layout() {
  return (
    <>
      <SiteHeader />

      <main className={STYLES.page}>
        <Outlet />
      </main>

      <ScrollRestoration />
    </>
  );
}
