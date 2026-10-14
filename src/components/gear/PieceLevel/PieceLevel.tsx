import type { GearDrop } from "../../../data/gear.ts";
import { pieceLevelText } from "../../../lib/gearPieceLevel.ts";
import STYLES from "./PieceLevel.module.css";

type Level = GearDrop["pieceItemLevel"];

/** A piece's own item level, never a total. */
export function PieceLevel({ level }: { level: Level }) {
  return <span className={STYLES.level}>{pieceLevelText(level)}</span>;
}
