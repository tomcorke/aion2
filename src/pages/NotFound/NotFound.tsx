import { Link } from "react-router";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { useTitle } from "../../hooks/useTitle.ts";
import STYLES from "./NotFound.module.css";

export function NotFound() {
  useTitle("Not found");

  return (
    <>
      <PageHero title="Page not found" />
      <p className={STYLES.text}>
        That page does not exist. <Link to="/">Back to the start</Link>.
      </p>
      <SiteFooter />
    </>
  );
}
