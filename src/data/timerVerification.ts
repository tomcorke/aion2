import type { SourceId } from "./sources.ts";

// Retained in aion2-knowledge main@ffdb7d0, research/timer-verification.md (2026-10-14).
// Public rechecks are not new EU in-game observations or publisher confirmation.
export const timerClockWarning =
  "Timers use Berlin as a site assumption, not a confirmed EU server clock. The EU daily and weekly reset time remains unresolved; other reports use 07:00 UTC. Treat these countdowns as provisional and check the in-game countdown.";

export const timerVerificationNotes = [
  {
    id: "rift",
    timerIds: ["rift"],
    message:
      "Spacetime Rift slots remain provisional: public reports differ on the starting hour and the clock used. Check the live portal timer; the entry window is not the duration of the stay inside.",
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
      "Artifact Siege's Monday, Thursday and Saturday 21:00 slot has not been checked live on EU. The regional clock behind that slot remains disputed.",
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
  "shugoTimers",
  "metabotEvents",
  "couga54",
  "wikily",
  "space4GamesRifts",
  "game8Festival",
  "ownChecks",
];
