// Every top-level page. Drives the router, the nav bar, and the home page index.
// docs/scope.md says what each page will be built from.
export type Section = {
  path: string;
  title: string;
  summary: string;
};

export const sections = [
  {
    path: "progression",
    title: "Progression",
    summary:
      "Item-level gates from a fresh level 45 to 2,800: what unlocks when, what to spend, and what to save.",
  },
  {
    path: "gear",
    title: "Gear",
    summary:
      "What each activity drops, how to upgrade it, and where power outside your gear comes from.",
  },
  {
    path: "daevanion",
    title: "Daevanion",
    summary:
      "Board-by-board buying order for every class, with the Azphel route that still works in PvE.",
  },
  {
    path: "timers",
    title: "Timers",
    summary:
      "Field boss respawn tracker, Lower Reshanta schedule, and recurring events.",
  },
  {
    path: "routine",
    title: "Routine",
    summary: "Daily and weekly checklist with reset times and per-server caps.",
  },
  {
    path: "alts",
    title: "Alts",
    summary:
      "What carries over between characters on a server, and which jobs belong on the main.",
  },
  {
    path: "growth",
    title: "Growth",
    summary: "Growth materials: what each one grows and where it comes from.",
  },
  {
    path: "skins",
    title: "Skins",
    summary: "Skin sets checklist with sources and search.",
  },
  {
    path: "festival",
    title: "Shugo Festival",
    summary: "Games, keys, reward rolls, shop prices, and a token simulator.",
  },
  {
    path: "sources",
    title: "Sources",
    summary: "Where these notes come from, image credits, and open questions.",
  },
] as const satisfies readonly Section[];

export type SectionPath = (typeof sections)[number]["path"];
