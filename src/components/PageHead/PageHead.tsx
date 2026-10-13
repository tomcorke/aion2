import type { ReactNode } from "react";
import STYLES from "./PageHead.module.css";

type Props = {
  eyebrow?: string;
  title: string;
  lede: ReactNode;
  children?: ReactNode;
};

export function PageHead({ eyebrow, title, lede, children }: Props) {
  return (
    <header className={STYLES.head}>
      {eyebrow && <p className={STYLES.eyebrow}>{eyebrow}</p>}
      <h1>{title}</h1>
      <p className={STYLES.lede}>{lede}</p>
      {children}
    </header>
  );
}
