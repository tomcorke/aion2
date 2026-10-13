import { addHours, differenceInSeconds } from "date-fns";
import type { TimerDef, TimerGroup } from "../data/timers.ts";
import type { Faction } from "../preferences/preferences.ts";
import { secondsUntilNext } from "./time.ts";

export type Timer = {
  id: string;
  name: string;
  group: TimerGroup;
  itemLevel?: number;
  // Null for a field boss with no recorded kill, or whose respawn has passed.
  secondsLeft: number | null;
  respawns: boolean;
};

/** Field boss kill times, as epoch milliseconds keyed by timer id. */
export type Kills = Record<string, number>;

function secondsLeft(
  { id, schedule }: TimerDef,
  now: Date,
  faction: Faction,
  kills: Kills,
) {
  if (schedule.kind === "slots") return secondsUntilNext(now, schedule);

  const killedAt = kills[id];

  if (killedAt === undefined) return null;

  const left = differenceInSeconds(
    addHours(killedAt, schedule.hours[faction]),
    now,
  );

  return left > 0 ? left : null;
}

/** A timer as one reader sees it now: named for their faction, counting down from their marked kills. */
export function resolveTimer(
  def: TimerDef,
  now: Date,
  faction: Faction,
  kills: Kills,
): Timer {
  return {
    id: def.id,
    name: typeof def.name === "string" ? def.name : def.name[faction],
    group: def.group,
    itemLevel: def.itemLevel,
    secondsLeft: secondsLeft(def, now, faction, kills),
    respawns: def.schedule.kind === "respawn",
  };
}

/** Marker diameter in pixels: boss orbs grow with gear item level; fixed-timer rings stay small. */
export function markerSize(itemLevel?: number) {
  return itemLevel ? Math.round(18 + (itemLevel - 40) * 0.6) : 14;
}
