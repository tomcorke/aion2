import { Link } from "react-router";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      Global (EU) · Season 1 · Best-effort player notes; see{" "}
      <Link to="/sources">Sources</Link>.
    </footer>
  );
}
