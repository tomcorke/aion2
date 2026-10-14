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
      "Resets, Artifact Siege, Spacetime Rifts, Dimensional Invasions, Lower Reshanta times and conditional Festival rewards, read from the Global client",
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

  metabotGear: {
    name: "MetaBot gear progression guide",
    covers:
      "Level 45 gear sources by item level, crafting lines and upgrade order",
    url: "https://metabot.gg/en/aion-2/guides/gear-progression-guide",
  },
  metabotDungeons: {
    name: "MetaBot dungeon guide",
    covers: "Dungeon item-level gates, loot, entry limits and cube costs",
    url: "https://metabot.gg/en/aion-2/guides/dungeon-guide",
  },
  metabotContentUnlocks: {
    name: "MetaBot content unlocks",
    covers: "Conquest tier gates, read from the Global client",
    url: "https://metabot.gg/en/aion-2/content-unlocks",
  },
  gamesFuzeAfter45: {
    name: "GamesFuze after-45 guide",
    covers: "Post-45 order and item-level gates",
    url: "https://gamesfuze.com/guides/aion-2-what-to-do-after-lvl-45/",
  },
  metabotEnhancement: {
    name: "MetaBot enhancement guide",
    covers: "Enhancement rates, safe levels and what to save for kept gear",
    url: "https://metabot.gg/en/aion-2/guides/gear-enhancement-guide",
  },
  metabotChecklist: {
    name: "MetaBot daily and weekly checklist",
    covers:
      "Refills, caps, per-character and per-server counters, and the unobtained-cube lockout",
    url: "https://metabot.gg/en/aion-2/guides/daily-weekly-checklist",
  },
  metabotArcana: {
    name: "MetaBot Arcana guide",
    covers: "Arcana slots, grades, item level and sources",
    url: "https://metabot.gg/en/aion-2/guides/arcana-guide",
  },
  metabotDaevanion: {
    name: "MetaBot Daevanion guide",
    covers: "Boards, node costs and Daevanion Crystal sources",
    url: "https://metabot.gg/en/aion-2/guides/daevanion-guide",
  },
  metabotSpiritmasterPlanner: {
    name: "MetaBot Spiritmaster Daevanion planner",
    covers: "Azphel board node data",
    url: "https://metabot.gg/en/aion-2/daevanion/spiritmaster",
  },
  metabotAbyss: {
    name: "MetaBot Abyss guide",
    covers: "Lower Reshanta gate, Abyss Points and shop prices",
    url: "https://metabot.gg/en/aion-2/guides/abyss-pvp-guide",
  },
  metabotStigma: {
    name: "MetaBot Stigma guide",
    covers: "Stigma slots, point costs, specializations and point sources",
    url: "https://metabot.gg/en/aion-2/guides/stigma-guide",
  },
  metabotWings: {
    name: "MetaBot mounts, pets and wings guide",
    covers:
      "Wing effects and sources, wing recipes, pet genus bonuses and Genus Insight",
    url: "https://metabot.gg/en/aion-2/guides/mounts-wings-guide",
  },
  metabotHiddenCubes: {
    name: "MetaBot Hidden Cubes guide",
    covers: "Cube types, keyed rewards, level scaling and key sources",
    url: "https://metabot.gg/en/aion-2/guides/hidden-cubes-guide",
  },
  metabotDungeonPages: {
    name: "MetaBot dungeon pages",
    covers: "Sealed Dungeon clear rewards by faction, including Featherdown",
    url: "https://metabot.gg/en/aion-2/dungeons",
  },
  metabotCurrencies: {
    name: "MetaBot currency database",
    covers: "Kina wallets and bound-first spending",
    url: "https://metabot.gg/en/aion-2/currencies",
  },
  metabotBeginner: {
    name: "MetaBot beginner guide",
    covers: "Home-faction Sealed Dungeon rewards and genus collection bonuses",
    url: "https://metabot.gg/en/aion-2/guides/beginners-guide",
  },
  gameTruthAlts: {
    name: "GameTruth alt guide",
    covers:
      "Server and character storage, bound and unbound Kina, Closet and Monolith sharing",
    url: "https://www.gametruth.com/guides/aion-2-alts-shared-storage-kinah-guide/",
  },
  gamerBlurbShared: {
    name: "GamerBlurb shared-progress guide",
    covers: "What progress characters on one server share",
    url: "https://gamerblurb.com/guides/aion-2-what-progress-is-shared-between-characters",
  },
  ncPetSharing: {
    name: "NC 7 January 2026 update (Korea)",
    covers: "Pets and Genus Insight shared within a server",
    url: "https://about.ncsoft.com/news/article/aion2_update_260107",
  },
  game8Abyss: {
    name: "Game8 Abyss Points guide",
    covers: "Abyss Trade Shop spending priorities",
    url: "https://game8.co/games/Aion-2/archives/628796",
  },
  wikilyBlackCloud: {
    name: "Wikily Black Cloud Merchants",
    covers: "Black Cloud Merchant refresh costs",
    url: "https://wikily.gg/aion-2/shops/black-cloud-merchants",
  },
  destructoidClashRunes: {
    name: "Destructoid Clash Rune guide",
    covers: "Regional quests with Clash Rune Chests and the Nightmare unlock",
    url: "https://www.destructoid.com/how-to-get-and-use-clash-runes-in-aion-2/",
  },
  gamerBlurbClashRunes: {
    name: "GamerBlurb Clash Rune guide",
    covers: "Clash Rune Chests in the Nightmare Trade Shop",
    url: "https://gamerblurb.com/guides/aion-2-how-to-get-clash-runes",
  },
  space4GamesRifts: {
    name: "Space4Games Spacetime Rift guide",
    covers:
      "Enemy-map activities through Spacetime Rifts, including pet farming",
    url: "https://space4games.com/en/games-en/aion-2-spacetime-rift-guide/",
  },
  officialMembership: {
    name: "NCSOFT Global membership notice",
    covers: "Festival Key storage caps and membership's server scope",
    url: "https://aion2.plaync.com/fr-fr/board/notice/view?articleId=6a850010d97eae18cc40db25",
  },
  game8Festival: {
    name: "Game8 Shugo Festival guide",
    covers: "The nine games, entry window, player counts and reward cards",
    url: "https://game8.co/games/Aion-2/archives/612918",
  },
  aion2GuideFestival: {
    name: "Aion2 Guide Festival sheet",
    covers: "Reported level scaling, reward categories and regional limits",
    url: "https://aion2.run/en/systemes?s=festival-shugo",
  },
  metabotFestivalShop: {
    name: "MetaBot Festival Shop",
    covers: "Outfit, accessory and wing prices and listed purchase limits",
    url: "https://metabot.gg/en/aion-2/shops/festival-shop-centuryroot-token",
  },
  metabotMethodology: {
    name: "MetaBot methodology",
    covers: "The Global client provenance and build of its extracted data",
    url: "https://metabot.gg/en/aion-2/methodology",
  },
  ownChecks: {
    name: "My own checks on an EU server",
    covers:
      "EU checks of boss timers, entry gates, pity, cube lockout, Daevanion item level, sharing and currency rules, Sealed Dungeon rewards, and Festival opening hourly at :00 (5 October 2026)",
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof sources;

export const sourceList: Source[] = Object.values(sources);

export const imageCredits = [
  {
    name: "AION 2 press kit screenshots, NCSOFT",
    url: "https://www.igdb.com/games/aion-2/presskit",
  },
];
