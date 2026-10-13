import STYLES from "./Rule.module.css";

/** A hairline in the accent metal; `gem` adds a small centre diamond. */
export function Rule({ gem = false }: { gem?: boolean }) {
  return <hr className={gem ? `${STYLES.rule} ${STYLES.gem}` : STYLES.rule} />;
}
