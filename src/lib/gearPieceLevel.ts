import type { GearDrop } from "../data/gear.ts";

type Level = GearDrop["pieceItemLevel"];

export function pieceLevelText(level: Level) {
  if (typeof level === "number") return String(level);

  return "min" in level ? `${level.min}–${level.max}` : `up to ${level.max}`;
}
