import { everyHours, type Slots } from "../lib/time.ts";
import type { Faction } from "../preferences/preferences.ts";
import type { SourceId } from "./sources.ts";

// Timer facts come from the notes repo: exploration/field-bosses.md, exploration/spacetime-rifts.md,
// events/incursion-of-the-spirits.md, events/shugo-festival/overview.md and basics/alts.md.
// Slots use the site's provisional Berlin clock; timerVerification.ts retains the limits.

export const timerSources: SourceId[] = [
  "shugoTimers",
  "metabotEvents",
  "metabotMonsters",
  "couga54",
  "wikily",
  "game8Festival",
  "ownChecks",
];

export type TimerGroup = "fixed" | "reshanta" | "field";

/** Fixed slots on the server clock, or a respawn counted from a kill the reader marks. */
export type Schedule =
  | ({ kind: "slots" } & Slots)
  | { kind: "respawn"; hours: Record<Faction, number> };

export type TimerDef = {
  id: string;
  name: string | Record<Faction, string>;
  group: TimerGroup;
  // Gear item level of the boss's best drop; bosses only.
  itemLevel?: number;
  schedule: Schedule;
};

const SUN = 0;
const MON = 1;
const WED = 3;
const THU = 4;
const FRI = 5;
const SAT = 6;

export const dailyReset: Slots = { hours: [16], minute: 0 };

export const timerDefs: TimerDef[] = [
  {
    id: "weekly",
    name: "Weekly reset",
    group: "fixed",
    schedule: { kind: "slots", hours: [16], minute: 0, days: [WED] },
  },
  {
    id: "siege",
    name: "Artifact Siege",
    group: "fixed",
    schedule: { kind: "slots", hours: [21], minute: 0, days: [MON, THU, SAT] },
  },
  {
    id: "rift",
    name: "Spacetime Rift",
    group: "fixed",
    schedule: { kind: "slots", hours: everyHours(2, 3), minute: 0 },
  },
  {
    id: "invasion",
    name: "Dimensional Invasion",
    group: "fixed",
    schedule: { kind: "slots", hours: everyHours(0, 1), minute: 30 },
  },
  {
    id: "nahma",
    name: "Guardian Lord Nahma",
    group: "reshanta",
    itemLevel: 86,
    schedule: { kind: "slots", hours: [21], minute: 10, days: [FRI, SUN] },
  },
  {
    id: "executors",
    name: "Executors",
    group: "reshanta",
    itemLevel: 70,
    schedule: { kind: "slots", hours: [21], minute: 40, days: [MON, THU, SAT] },
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
    schedule: { kind: "slots", hours: everyHours(1, 3), minute: 0 },
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
  {
    id: "festival",
    name: "Shugo Festival",
    group: "fixed",
    schedule: { kind: "slots", hours: everyHours(0, 1), minute: 0 },
  },
];
