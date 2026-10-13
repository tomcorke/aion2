import { Link } from "react-router";
import STYLES from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={STYLES.footer}>
      Global (EU) · Season 1 · Best-effort player notes; see{" "}
      <Link to="/sources">Sources</Link>.
    </footer>
  );
}
