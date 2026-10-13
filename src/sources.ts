// Every source the site names. Page footers pick from these; the Sources page lists them all.
export type Source = {
  name: string;
  covers: string;
  url?: string;
};

export const sources = {
  metabotEvents: {
    name: "MetaBot event schedule",
    covers:
      "Resets, Artifact Siege, Spacetime Rifts, Dimensional Invasions and Lower Reshanta times, read from the Global client",
    url: "https://metabot.gg/en/aion-2/events",
  },
  metabotMonsters: {
    name: "MetaBot monster database",
    covers:
      "Field boss levels, zones and gear item levels, read from the Global client",
    url: "https://metabot.gg/en/aion-2/monsters",
  },
  couga54: {
    name: "couga54's Global boss guide",
    covers: "Field boss respawn times, counted from the kill",
    url: "https://couga54.github.io/aion2-guides/en/bosses/",
  },
  wikily: {
    name: "Wikily boss spawn times",
    covers: "Lower Reshanta boss schedules",
    url: "https://wikily.gg/aion-2/bosses/spawn-times",
  },
  ownChecks: {
    name: "My own checks on an EU server",
    covers:
      "In-game boss timers that set the Executors and Nahma 10 minutes after published times",
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof sources;

export const imageCredits = [
  {
    name: "AION 2 press kit screenshots, NCSOFT",
    url: "https://www.igdb.com/games/aion-2/presskit",
  },
];
