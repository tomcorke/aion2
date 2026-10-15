import type { SourceId } from "./sources.ts";
import { skinAcquisitionSourceDetails } from "./skinAcquisitions.ts";

export type SourceDetails = {
  checkedDate?: string;
  accessNote?: string;
};

// Partial, hand-curated metadata from knowledge/topics/sources/catalog.md.
// Dates are external checks, not publication dates, topic reviews or app builds.
// S120/S105 were actually rechecked in the retained 2026-10-14 timer audit.
// No catalogue check date is recorded for the press-kit credit or ownChecks.
export const sourceDetails: Partial<Record<SourceId, SourceDetails>> = {
  shugoTimers: {
    checkedDate: "2026-10-14",
    accessNote:
      "Public regional timer feed, not publisher confirmation. Its EU reset clock conflicts with the event guide.",
  },
  // Initial Festival investigation: catalogue introduction and S01–S08.
  officialMembership: {
    checkedDate: "2026-10-05",
    accessNote:
      "JavaScript-loaded notice read through Jina Reader; it does not establish Festival refill speed or daily quantity.",
  },
  game8Festival: { checkedDate: "2026-10-05" },
  aion2GuideFestival: {
    checkedDate: "2026-10-05",
    accessNote:
      "The recommendation was read from a versioned system-data asset that may later disappear; regional and refill limits remain unresolved.",
  },
  metabotFestivalShop: {
    checkedDate: "2026-10-05",
    accessNote:
      "Reported Global client build 0.0.4387.0; not a live shop or key-budget audit.",
  },
  metabotMethodology: {
    checkedDate: "2026-10-05",
    accessNote:
      "Provenance statement only; the original client files were not independently downloaded or audited.",
  },
  // S120/S105 current rechecks; S104 and S109 retain their earlier checks.
  metabotEvents: {
    checkedDate: "2026-10-14",
    accessNote:
      "Schedules rechecked through Jina Reader; not a live EU check or a fresh audit of detailed opening odds. Public clock interpretations still conflict.",
  },
  couga54: {
    checkedDate: "2026-10-14",
    accessNote:
      "Read through Jina Reader. The author still limits the in-game half-time check to Altgard; Abyss KR/TW schedules are references only.",
  },
  metabotMonsters: {
    checkedDate: "2026-10-09",
    accessNote:
      "Drops are from client reward tables, not observed live drops; respawn times are not listed.",
  },
  wikily: {
    checkedDate: "2026-10-09",
    accessNote:
      "Region and build unstated; the schedule says server time without settling the EU clock.",
  },
  // Gear guides, stones and upgrade previews: S67–S87, S111–S112.
  metabotGear: { checkedDate: "2026-10-08" },
  metabotDungeons: { checkedDate: "2026-10-08" },
  metabotContentUnlocks: { checkedDate: "2026-10-11" },
  gamesFuzeAfter45: { checkedDate: "2026-10-08" },
  metabotEnhancement: { checkedDate: "2026-10-08" },
  metabotChecklist: { checkedDate: "2026-10-09" },
  metabotArcana: { checkedDate: "2026-10-08" },
  metabotAbyss: { checkedDate: "2026-10-08" },
  metabotManastones: { checkedDate: "2026-10-08" },
  game8Manastones: {
    checkedDate: "2026-10-08",
    accessNote:
      "Partial page read: the last 18,000 characters were not read. Published stone odds conflict with the newer MetaBot guide.",
  },
  corpusManastones: { checkedDate: "2026-10-08" },
  xboxPlayTheostones: { checkedDate: "2026-10-08" },
  showGamerTheostones: { checkedDate: "2026-10-08" },
  metabotAulakTheostone: { checkedDate: "2026-10-08" },
  gamesFuzeUpgrades: {
    checkedDate: "2026-10-09",
    accessNote:
      "Region unstated; the guide does not establish exact Transfer/Sync costs or how Sync Stones relate to donor gear.",
  },
  gamesFuzeSoulBinding: {
    checkedDate: "2026-10-09",
    accessNote:
      "Region unstated; exact costs and whether a Sync Stone replaces donor gear are not given.",
  },
  metabotTransferStone: { checkedDate: "2026-10-09" },
  metabotTransferWeapon: { checkedDate: "2026-10-09" },
  metabotTransferArmor: { checkedDate: "2026-10-09" },
  metabotTransferAccessory: { checkedDate: "2026-10-09" },
  metabotSyncStone: { checkedDate: "2026-10-09" },
  // Boards: S78/S124/S126; skills: S125/S127. Retention is not a recheck.
  metabotDaevanion: {
    checkedDate: "2026-10-10",
    accessNote:
      "Rechecked through Jina Reader; its PvP-only Azphel description conflicts with the retained client node data.",
  },
  metabotSpiritmasterPlanner: {
    checkedDate: "2026-10-11",
    accessNote:
      "Embedded node data read from the planner; not an independent live board audit.",
  },
  metabotGladiatorPlanner: { checkedDate: "2026-10-11" },
  metabotTemplarPlanner: { checkedDate: "2026-10-11" },
  metabotAssassinPlanner: { checkedDate: "2026-10-11" },
  metabotRangerPlanner: { checkedDate: "2026-10-11" },
  metabotSorcererPlanner: { checkedDate: "2026-10-11" },
  metabotClericPlanner: { checkedDate: "2026-10-11" },
  metabotChanterPlanner: { checkedDate: "2026-10-11" },
  metabotSpiritmasterSkills: { checkedDate: "2026-10-10" },
  metabotDaevanionClassSkills: {
    checkedDate: "2026-10-11",
    accessNote:
      "Client-data skill tooltips were read; one Chanter skill icon returned Access Denied on that date.",
  },
  metabotStigma: { checkedDate: "2026-10-10" },
  // Collections, currencies, faction rules and rifts: S20/S24/S26/S29/S33,
  // S44/S45/S85/S99–S103/S113–S115/S129/S133/S136–S138/S140/S141/S145/S146.
  metabotWings: { checkedDate: "2026-10-11" },
  metabotHiddenCubes: { checkedDate: "2026-10-06" },
  metabotDungeonPages: {
    checkedDate: "2026-10-11",
    accessNote:
      "Clear-reward tables were read from client-data pages; instanced monster drops are server-side and absent from those tables.",
  },
  metabotCurrencies: { checkedDate: "2026-10-07" },
  metabotBeginner: {
    checkedDate: "2026-10-10",
    accessNote:
      "Read through Jina Reader. Its named build differs from the checked dungeon pages; cross-build parity was not independently audited.",
  },
  gameTruthAlts: { checkedDate: "2026-10-09" },
  gamerBlurbShared: { checkedDate: "2026-10-09" },
  mmoCodexAlts: { checkedDate: "2026-10-09" },
  gamesGgAlts: { checkedDate: "2026-10-09" },
  ncPetSharing: {
    checkedDate: "2026-10-09",
    accessNote:
      "Official Korean-service announcement, not a Global publisher notice.",
  },
  game8Abyss: { checkedDate: "2026-10-10" },
  wikilyBlackCloud: { checkedDate: "2026-10-11" },
  destructoidClashRunes: { checkedDate: "2026-10-12" },
  gamerBlurbClashRunes: { checkedDate: "2026-10-12" },
  space4GamesRifts: {
    checkedDate: "2026-10-10",
    accessNote:
      "Rechecked through Jina Reader; the guide records an Asmodian player's Global observations, not every region or faction.",
  },
  game8RiftQuests: {
    checkedDate: "2026-10-10",
    accessNote:
      "Rechecked through Jina Reader; quest rewards do not establish repeat or reset rules.",
  },
  metabotSubstanceMorph: {
    checkedDate: "2026-10-10",
    accessNote:
      "Recipe table rechecked; the live server behavior and the database extraction were not independently audited.",
  },
  metabotAbyssPoints: {
    checkedDate: "2026-10-10",
    accessNote:
      "Client-derived inventory, not a live shop audit; secondary medal costs require the complete shop table.",
  },
  metabotLowerAbyssRiftStone: { checkedDate: "2026-10-14" },
  officialServers: {
    checkedDate: "2026-10-06",
    accessNote:
      "The JavaScript-loaded notice body was unreadable through WebFetch; it was read via the Steam mirror and news API.",
  },
  metabotFactions: { checkedDate: "2026-10-08" },
  game8Factions: { checkedDate: "2026-10-06" },
  allThingsDailyDungeon: { checkedDate: "2026-10-14" },
  metabotIntermediateSoulstone: { checkedDate: "2026-10-15" },
  metabotSuperiorSoulstone: { checkedDate: "2026-10-15" },
  ...skinAcquisitionSourceDetails,
};
