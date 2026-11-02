import { altsSourceAdditions } from "./alts.ts";
import { gearUpgradeSourceAdditions } from "./gearUpgrades.ts";
import { growthSourceAdditions } from "./growth.ts";
import { petSourceAdditions } from "./pets.ts";
import { skinAcquisitionSourceAdditions } from "./skinAcquisitions.ts";
import { skinCatalogueSourceAdditions } from "./skinCatalogueMetadata.ts";

// Every source the site names. Page footers pick from these; the Sources page lists them all.
export type Source = {
  name: string;
  covers: string;
  url?: string;
};

export const sources = {
  ...altsSourceAdditions,
  ...gearUpgradeSourceAdditions,
  ...growthSourceAdditions,
  ...petSourceAdditions,
  ...skinAcquisitionSourceAdditions,
  ...skinCatalogueSourceAdditions,
  shugoTimers: {
    name: "Shugo.GG timer data",
    covers:
      "Regional fixed schedules and the disputed EU event/reset clocks; no publisher confirmation",
    url: "https://shugo.gg/timers.json",
  },
  metabotEvents: {
    name: "MetaBot event schedule",
    covers:
      "Resets, Artifact Siege, Spacetime Rifts, Dimensional Invasions, Lower Reshanta times and conditional Festival rewards, read from the Global client",
    url: "https://metabot.gg/en/aion-2/events",
  },
  metabotFestival: {
    name: "MetaBot Shugo Festival data",
    covers:
      "Global client-listed Festival games, reward tables, and scheduled minigames",
    url: "https://metabot.gg/en/aion-2/events/shugo-festival",
  },
  aion2ggFestival: {
    name: "AION2.GG Shugo Festival timer",
    covers: "EU/NA client-listed Festival minigame names and timer data",
    url: "https://aion2.gg/tools/event-timer/shugo-festival",
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
    name: "MetaBot gear progression guide (Global client data)",
    covers:
      "Gear grade comparison, level 45 gear sources by item level, crafting lines and upgrade order",
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
    covers:
      "Board unlocks, node costs and Daevanion Crystal sources; its generic five-board copy is stale",
    url: "https://metabot.gg/en/aion-2/guides/daevanion-guide",
  },
  metabotDaevanionPlanner: {
    name: "MetaBot Daevanion planner",
    covers:
      "Six-board table and Ariel's level, node counts and completion cost from Global client build 0.0.4387.0",
    url: "https://metabot.gg/en/aion-2/daevanion",
  },
  metabotSpiritmasterPlanner: {
    name: "MetaBot Spiritmaster Daevanion planner",
    covers:
      "PvE and Azphel board nodes, costs and Spiritmaster skill associations",
    url: "https://metabot.gg/en/aion-2/daevanion/spiritmaster",
  },
  metabotGladiatorPlanner: {
    name: "MetaBot Gladiator Daevanion planner",
    covers:
      "Shared board nodes and Gladiator skill associations from the Global client",
    url: "https://metabot.gg/en/aion-2/daevanion/gladiator",
  },
  metabotTemplarPlanner: {
    name: "MetaBot Templar Daevanion planner",
    covers:
      "Shared board nodes and Templar skill associations from the Global client",
    url: "https://metabot.gg/en/aion-2/daevanion/templar",
  },
  metabotAssassinPlanner: {
    name: "MetaBot Assassin Daevanion planner",
    covers:
      "Shared board nodes and Assassin skill associations from the Global client",
    url: "https://metabot.gg/en/aion-2/daevanion/assassin",
  },
  metabotRangerPlanner: {
    name: "MetaBot Ranger Daevanion planner",
    covers:
      "Shared board nodes and Ranger skill associations from the Global client",
    url: "https://metabot.gg/en/aion-2/daevanion/ranger",
  },
  metabotSorcererPlanner: {
    name: "MetaBot Sorcerer Daevanion planner",
    covers:
      "Shared board nodes and Sorcerer skill associations from the Global client",
    url: "https://metabot.gg/en/aion-2/daevanion/sorcerer",
  },
  metabotClericPlanner: {
    name: "MetaBot Cleric Daevanion planner",
    covers:
      "Shared board nodes and Cleric skill associations from the Global client",
    url: "https://metabot.gg/en/aion-2/daevanion/cleric",
  },
  metabotChanterPlanner: {
    name: "MetaBot Chanter Daevanion planner",
    covers:
      "Shared board nodes and Chanter skill associations from the Global client",
    url: "https://metabot.gg/en/aion-2/daevanion/chanter",
  },
  metabotSpiritmasterSkills: {
    name: "MetaBot Spiritmaster skill tooltips",
    covers: "Spiritmaster skill effects and estimated route priorities",
    url: "https://metabot.gg/en/aion-2/skills/spirit-strike",
  },
  metabotDaevanionClassSkills: {
    name: "MetaBot class skill tooltips",
    covers: "Skill-role estimates for class routes",
    url: "https://metabot.gg/en/aion-2/skills/attack-preparation-chanter",
  },
  metabotHeightenedSixthSense: {
    name: "MetaBot Heightened Sixth Sense skill page",
    covers:
      "Earlier max-rank tooltip report from Global client build 0.0.4387.0; not confirmed after the 28 October patch",
    url: "https://metabot.gg/en/aion-2/skills/heightened-sixth-sense",
  },
  metabotAbyss: {
    name: "MetaBot Abyss guide",
    covers:
      "Lower Reshanta gate, Abyss Point sources and weekly limits, and shop prices",
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
  aion2MapsPets: {
    name: "AION 2 Maps pets and mounts guide",
    covers:
      "Pet mounts, Genus Insight, collection rewards, and level-3 Empathy Candy transformation",
    url: "https://aion2maps.com/guides/pets/",
  },
  metabotHiddenCubes: {
    name: "MetaBot Hidden Cubes guide",
    covers:
      "Key-only cubes in Verteron and Altgard, both cube types in Eltnen and Morheim, level-scaled rewards and key sources",
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
  wikilySkyfeatherGuardian: {
    name: "Wikily Skyfeather Guardian helm skin",
    covers:
      "Listed Black Cloud Merchant and bound skin-chest sources; not the chest’s origin",
    url: "https://wikily.gg/aion-2/skins/skyfeather-guardian-skin-helm-bound",
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
  allThingsHowFestival: {
    name: "AllThingsHow Shugo Festival guide",
    covers:
      "Guide-reported qualifying participation rewards, one key per card pick and rank-to-pick examples",
    url: "https://allthings.how/aion-2-every-shugo-festival-minigame-and-its-rewards/",
  },
  metabotFestivalShop: {
    name: "MetaBot Festival Shop",
    covers:
      "The 49-item client-listed Festival Shop inventory, its prices and purchase limits",
    url: "https://metabot.gg/en/aion-2/shops/festival-shop-centuryroot-token",
  },
  metabotMethodology: {
    name: "MetaBot methodology",
    covers: "The Global client provenance and build of its extracted data",
    url: "https://metabot.gg/en/aion-2/methodology",
  },
  ncGlobal21Oct: {
    name: "NC Global patch notice, 21 October 2026",
    covers:
      "Krao Cave and Draupnir Hard mode, Ariel Daevanion board addition and Ariel Fragment source",
    url: "https://steamcommunity.com/ogg/3393110/announcements/detail/670631196372241777",
  },
  aion2BuildsGlobal21Oct: {
    name: "AION 2 Builds: Global patch-notes transcription, 21 October 2026",
    covers: "Krao Cave and Draupnir Hard entry gate at item level 2,600",
    url: "https://aion2builds.com/updates/patch-notes-2026-10-20/",
  },
  ncGlobal28Oct: {
    name: "NC Global patch notes, 28 October 2026",
    covers:
      "Odylium Repository and its shared Daily Dungeon entry pool; the transfer period's end and removal of its shop tab; the Instant Clear ticket's 30,000 Kina offer, 14-per-server weekly limit and announced shop move; Heightened Sixth Sense HP changes; other 28 October updates",
    url: "https://aion2.plaync.com/en-us/board/update/view?articleId=6ae19668577e8c01355e0210",
  },
  ncLudraAwakens: {
    name: "NC: Ludra Awakens on November 4th",
    covers:
      "Ludra's scheduled return and Normal and Hard item-level entry requirements",
    url: "https://lounge.plaync.com/feed/85150?country=US&locale=en-US",
  },
  ncAtreiasCall: {
    name: "NC: Atreia's Call 28-day Attendance event",
    covers:
      "Global Attendance menu and the event's 2 December 2026 CET maintenance cutoff",
    url: "https://steamcommunity.com/app/3393110/announcements/",
  },
  ncOdyleEnergyBoost: {
    name: "NC: Odyle Energy Boost event",
    covers:
      "Four Odyle Energy per account per day by mail through 11 November 2026 CET maintenance; seven-day mail expiry",
    url: "https://lounge.plaync.com/feed/85150?country=US&locale=en-US",
  },
  ownChecks: {
    name: "My own gameplay checks",
    covers:
      "Boss timers, entry gates, pity, cube lockout, Daevanion item level, sharing and currency rules, Sealed Dungeon rewards, and the Festival opening observation (5 October 2026)",
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
