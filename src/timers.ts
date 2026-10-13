import type { Faction } from "./preferences.ts";
import type { SourceId } from "./sources.ts";
import { secondsUntil, secondsUntilEvery } from "./time.ts";

// Timer facts come from the notes repo: exploration/field-bosses.md, exploration/spacetime-rifts.md,
// events/incursion-of-the-spirits.md and basics/alts.md. All times are server time.

export const timerSources: SourceId[] = [
  "metabotEvents",
  "metabotMonsters",
  "couga54",
  "wikily",
  "ownChecks",
];

export type TimerGroup = "fixed" | "reshanta" | "field";

type Schedule =
  | { kind: "weekly"; days?: number[]; hour: number; minute: number }
  | { kind: "every"; startHour: number; startMinute: number; hours: number }
  | { kind: "respawn"; hours: Record<Faction, number> };

export type TimerDef = {
  id: string;
  name: string | Record<Faction, string>;
  group: TimerGroup;
  // Gear item level of the boss's best drop; bosses only.
  itemLevel?: number;
  schedule: Schedule;
};

const MON = 1;
const WED = 3;
const THU = 4;
const FRI = 5;
const SAT = 6;
const SUN = 0;

export const dailyReset = { hour: 16, minute: 0 };

export const timerDefs: TimerDef[] = [
  {
    id: "weekly",
    name: "Weekly reset",
    group: "fixed",
    schedule: { kind: "weekly", days: [WED], hour: 16, minute: 0 },
  },
  {
    id: "siege",
    name: "Artifact Siege",
    group: "fixed",
    schedule: { kind: "weekly", days: [MON, THU, SAT], hour: 21, minute: 0 },
  },
  {
    id: "rift",
    name: "Spacetime Rift",
    group: "fixed",
    schedule: { kind: "every", startHour: 2, startMinute: 0, hours: 3 },
  },
  {
    id: "invasion",
    name: "Dimensional Invasion",
    group: "fixed",
    schedule: { kind: "every", startHour: 0, startMinute: 30, hours: 1 },
  },
  {
    id: "nahma",
    name: "Guardian Lord Nahma",
    group: "reshanta",
    itemLevel: 86,
    schedule: { kind: "weekly", days: [FRI, SUN], hour: 21, minute: 10 },
  },
  {
    id: "executors",
    name: "Executors",
    group: "reshanta",
    itemLevel: 70,
    schedule: { kind: "weekly", days: [MON, THU, SAT], hour: 21, minute: 40 },
  },
  {
    id: "gartua",
    name: { elyos: "Eternal Gartua", asmodians: "Immortal Gartua" },
    group: "field",
    itemLevel: 70,
    schedule: { kind: "respawn", hours: { elyos: 6, asmodians: 12 } },
  },
  {
    id: "kaira",
    name: "Watcher Kaira",
    group: "reshanta",
    itemLevel: 56,
    schedule: { kind: "every", startHour: 1, startMinute: 0, hours: 3 },
  },
  {
    id: "lagta",
    name: "High Commander Lagta",
    group: "field",
    itemLevel: 46,
    schedule: { kind: "respawn", hours: { elyos: 6, asmodians: 12 } },
  },
  {
    id: "kashapa",
    name: "Soul Ruler Kashapa",
    group: "field",
    itemLevel: 46,
    schedule: { kind: "respawn", hours: { elyos: 6, asmodians: 6 } },
  },
  {
    id: "dartan",
    name: "Silent Dartan",
    group: "field",
    itemLevel: 46,
    schedule: { kind: "respawn", hours: { elyos: 3, asmodians: 6 } },
  },
];

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

function secondsLeft(def: TimerDef, now: Date, faction: Faction, kills: Kills) {
  const { schedule } = def;

  if (schedule.kind === "weekly")
    return secondsUntil(now, schedule.hour, schedule.minute, schedule.days);

  if (schedule.kind === "every") {
    return secondsUntilEvery(
      now,
      schedule.startHour,
      schedule.startMinute,
      schedule.hours,
    );
  }

  const killedAt = kills[def.id];

  if (killedAt === undefined) return null;

  const left =
    schedule.hours[faction] * 3600 - (now.getTime() - killedAt) / 1000;

  return left > 0 ? left : null;
}

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
