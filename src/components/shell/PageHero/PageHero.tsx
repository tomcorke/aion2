import hero from "../../../assets/hero.jpg";
import STYLES from "./PageHero.module.css";

type Props = {
  title: string;
  lede?: string;
};

/** Press-kit image fading into the page, with the page title over its lower edge. */
export function PageHero({ title, lede }: Props) {
  return (
    <header className={STYLES.hero}>
      <img src={hero} alt="" className={STYLES.image} />

      <div className={STYLES.text}>
        <h1 className={STYLES.title}>{title}</h1>
        {lede && <p className={STYLES.lede}>{lede}</p>}
      </div>
    </header>
  );
}
