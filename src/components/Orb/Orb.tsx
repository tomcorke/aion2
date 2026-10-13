import STYLES from "./Orb.module.css";

type Props = {
  // Diameter in pixels.
  size: number;
  // A metal orb marks a boss; a ring marks a fixed timer.
  ring?: boolean;
  dim?: boolean;
};

export function Orb({ size, ring = false, dim = false }: Props) {
  return (
    <span
      aria-hidden="true"
      className={ring ? STYLES.ring : STYLES.orb}
      data-dim={dim}
      style={{ width: size, height: size }}
    />
  );
}
