// Every top-level page. Drives the router, the nav bar, and the home page cards.
// `source` names the claude.ai artifact or knowledge-base topic the page will be built from;
// see docs/scope.md.
export type Section = {
  path: string;
  title: string;
  summary: string;
  source: string;
};

export const sections: Section[] = [
  {
    path: "progression",
    title: "Progression",
    summary:
      "Item-level gates from a fresh level 45 to 2,800: what unlocks when, what to spend, and what to save.",
    source: "Artifact: AION 2 Progression Route",
  },
  {
    path: "gear",
    title: "Gear",
    summary:
      "What each activity drops, how to upgrade it, and where power outside your gear comes from.",
    source: "Artifacts: Level 45 Gearing, Level 45 Companion (Gearing tab)",
  },
  {
    path: "daevanion",
    title: "Daevanion",
    summary:
      "Board-by-board buying order for every class, with the Azphel route that still works in PvE.",
    source: "Artifact: Azphel Board Route",
  },
  {
    path: "timers",
    title: "Timers",
    summary:
      "Field boss respawn tracker, Lower Reshanta schedule, and recurring events.",
    source: "Artifact: Level 45 Companion (Timers tab)",
  },
  {
    path: "routine",
    title: "Routine",
    summary: "Daily and weekly checklist with reset times and per-server caps.",
    source: "Artifacts: Level 45 Gearing, Progression Route",
  },
  {
    path: "alts",
    title: "Alts",
    summary:
      "What carries over between characters on a server, and which jobs belong on the main.",
    source: "Artifact: AION 2 Main vs Alts",
  },
  {
    path: "festival",
    title: "Shugo Festival",
    summary: "Games, keys, reward rolls, shop prices, and a token simulator.",
    source: "Artifact: Shugo Festival Datasheet",
  },
  {
    path: "sources",
    title: "Sources",
    summary: "Where these notes come from, image credits, and open questions.",
    source: "Knowledge base: sources/catalog.md, research/open-questions.md",
  },
];
