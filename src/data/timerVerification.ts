import type { SourceId } from "./sources.ts";
import { timerSources } from "./timers.ts";

// Checked against knowledge/topics/research/timer-verification.md, reviewed 2026-11-01.
// Public schedules are not EU in-game observations or publisher confirmation.
export const timerClockWarning =
  "Berlin is a site assumption, not a confirmed EU server clock. The dial follows MetaBot's 16:00 server-time ticket-table reset; Shugo.GG reports daily and weekly resets at 16:00 Korea time / 07:00 UTC (08:00 Berlin after the 25 October change). MetaBot reports a Wednesday weekly reset at 16:00 server time. NC's 08:00 CET notices name only the Gathering limit and current Attendance event. EU timing and which counters share these schedules remain unresolved. Treat both countdown targets as provisional and check the in-game countdown.";

export const timerVerificationNotes = [
  {
    id: "rift",
    timerIds: ["rift"],
    message:
      "Spacetime Rift slots remain provisional: public reports differ on the starting hour and the clock used. Check the live portal timer; the entry window is not the duration of the stay inside.",
  },
  {
    id: "rift-entry",
    timerIds: ["rift"],
    message:
      "At level 45 or higher, enter through your faction's portal. A system message announces each rift, and a vortex icon marks it on the map. Elyos can start the quests from Mino at the Dawn Legion Temporary Outpost in Verteron; Asmodians can start theirs from Uru at the Collapsed Chasm Region in Altgard. Accept the quests before entering. The portal stays open for 10 minutes; after entry, your stay lasts one hour.",
  },
  {
    id: "invasion",
    timerIds: ["invasion"],
    message:
      "Dimensional Invasion is shown at :30 each hour. Combat duration and rotation among the three invasions remain unresolved; this timer does not predict which invasion will run.",
  },
  {
    id: "siege",
    timerIds: ["siege"],
    message:
      "The reported group schedules for Artifact Siege, Executors and Nahma have not been checked on this EU server. Executors at 21:40 and Nahma at 21:10 match screenshots from one evening only; they do not confirm repeating times.",
  },
  {
    id: "reshanta",
    timerIds: ["kaira", "executors", "nahma"],
    message:
      "The EU boss-time estimates rest on two screenshots from one evening, 9 October 2026. Watcher Kaira's three-hour interval remains unconfirmed. Executors at 21:40 and Nahma at 21:10 are observation-based estimates, not a check of every weekly spawn. Argo, the Spirit King's spawn rule is unknown.",
  },
  {
    id: "field",
    timerIds: ["gartua", "lagta", "kashapa", "dartan"],
    message:
      "Field respawns count from the kill you record. The half-of-Korea rule was checked on Altgard; Verteron intervals remain an extrapolation. Unmarked bosses stay untimed; check the in-game Field Boss tab for availability.",
  },
  {
    id: "festival",
    timerIds: ["festival"],
    message:
      "On Global EU, the Festival was observed on 5 October 2026 opening at :00 each hour. Public schedules still agree, but this is not a new live observation. Game duration and rotation are not established by this entry timer.",
  },
];

export const timerVerificationSources: SourceId[] = [
  "ncGlobal28Oct",
  "ncAtreiasCall",
  "shugoTimers",
  "metabotEvents",
  "metabotMethodology",
  "couga54",
  "wikily",
  "space4GamesRifts",
  "game8RiftQuests",
  "game8Festival",
  "ownChecks",
];

export const timerPageSources: SourceId[] = [
  ...new Set([...timerSources, ...timerVerificationSources]),
];
