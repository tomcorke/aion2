import type { ReactNode } from "react";
import styles from "./PageHead.module.css";

type Props = {
  eyebrow?: string;
  title: string;
  lede: ReactNode;
  children?: ReactNode;
};

export function PageHead({ eyebrow, title, lede, children }: Props) {
  return (
    <header className={styles.head}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h1>{title}</h1>
      <p className={styles.lede}>{lede}</p>
      {children}
    </header>
  );
}
