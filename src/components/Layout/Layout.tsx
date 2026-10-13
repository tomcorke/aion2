import { Outlet, ScrollRestoration } from "react-router";
import { SiteFooter } from "../SiteFooter/SiteFooter.tsx";
import { SiteHeader } from "../SiteHeader/SiteHeader.tsx";
import styles from "./Layout.module.css";

export function Layout() {
  return (
    <>
      <SiteHeader />

      <main className={styles.page}>
        <Outlet />
      </main>

      <SiteFooter />
      <ScrollRestoration />
    </>
  );
}
