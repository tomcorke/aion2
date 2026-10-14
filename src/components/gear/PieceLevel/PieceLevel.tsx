import type { GearDrop } from "../../../data/gear.ts";
import STYLES from "./PieceLevel.module.css";

type Level = GearDrop["pieceItemLevel"];

export function pieceLevelText(level: Level) {
  if (typeof level === "number") return String(level);

  return "min" in level ? `${level.min}–${level.max}` : `up to ${level.max}`;
}

/** A piece's own item level, never a total. */
export function PieceLevel({ level }: { level: Level }) {
  return <span className={STYLES.level}>{pieceLevelText(level)}</span>;
}
