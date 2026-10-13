import { Outlet, ScrollRestoration } from "react-router";
import { SiteFooter } from "../SiteFooter/SiteFooter.tsx";
import { SiteHeader } from "../SiteHeader/SiteHeader.tsx";
import STYLES from "./Layout.module.css";

export function Layout() {
  return (
    <>
      <SiteHeader />

      <main className={STYLES.page}>
        <Outlet />
      </main>

      <SiteFooter />
      <ScrollRestoration />
    </>
  );
}
