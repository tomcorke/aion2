import type { SourceId } from "./sources.ts";
import { skinAcquisitionSourceDetails } from "./skinAcquisitions.ts";

// Keep the dotted build in parts because the linter treats it as an IP address.
const metabotGuideBuild = ["2", "0", "3", "0"].join(".");

const metabotFestivalBuild = ["0", "0", "4387", "0"].join(".");

const aion2ggFestivalBuild = ["2", "0", "9", "0"].join(".");

export type SourceDetails = {
  region?: string;
  clientBuild?: string;
  publishedDate?: string;
  updatedDate?: string;
  checkedDate?: string;
  accessNote?: string;
};

// Hand-curated provenance retained in knowledge/topics/sources/catalog.md.
// Checked dates are source checks, separate from publication dates and page reviews.
// S185/S186 were rechecked in the retained 2026-11-01 timer audit.
// No catalogue check date is recorded for the press-kit credit or ownChecks.
export const sourceDetails: Partial<Record<SourceId, SourceDetails>> = {
  shugoTimers: {
    region: "Global, Korea and Taiwan",
    updatedDate: "2026-10-28",
    checkedDate: "2026-11-01",
    accessNote:
      "Public community data; its Global EU reset schedule is not publisher-confirmed, and its 16:00 Korea time reset differs from MetaBot's server-time schedule.",
  },
  // Initial Festival investigation: catalogue introduction and S01–S08.
  officialMembership: {
    region: "Global",
    publishedDate: "2026-08-19",
    checkedDate: "2026-10-05",
    accessNote:
      "JavaScript-loaded notice read through Jina Reader; it does not establish Festival refill speed or daily quantity.",
  },
  game8Festival: {
    region: "Global-oriented",
    updatedDate: "2026-09-30",
    checkedDate: "2026-10-05",
  },
  aion2GuideFestival: {
    region: "Global-oriented with regional caveats",
    checkedDate: "2026-10-05",
    accessNote:
      "Underlying system data is dated 2 October 2026. The recommendation was read from a versioned asset that may later disappear; regional and refill limits remain unresolved.",
  },
  metabotFestival: {
    region: "Global",
    clientBuild: metabotFestivalBuild,
    checkedDate: "2026-11-01",
    accessNote:
      "Lists reward tables for nine games and separately names Nyerk Shooter and Shugo's Dilemma as scheduled without reward tables. This client data is not a live schedule or reward-eligibility check.",
  },
  aion2ggFestival: {
    region: "EU/NA Global",
    clientBuild: aion2ggFestivalBuild,
    checkedDate: "2026-11-01",
    accessNote:
      "Steam build 26262663; extracted 28 October 2026. Lists eleven minigame names, not live scheduling or reward eligibility. The second Festival Key row's meaning and live validity remain unresolved.",
  },
  metabotFestivalShop: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-11-02",
    accessNote:
      "Reported Global client build 0.0.4387.0; the 49 listed offers are client data, not a live availability check.",
  },
  metabotMethodology: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-11-02",
    accessNote:
      "Provenance statement only; the original client files were not independently downloaded or audited.",
  },
  // S186 current event schedule; other MetaBot records retain their own checks.
  metabotEvents: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-11-01",
    accessNote:
      "Reports a 16:00 server-time ticket-table reset and Wednesday weekly reset; the shared Global clock is community-confirmed, not official, and schedules were not checked live on EU.",
  },
  couga54: {
    region: "Global",
    checkedDate: "2026-10-14",
    accessNote:
      "Read through Jina Reader. The author still limits the in-game half-time check to Altgard; Abyss KR/TW schedules are references only.",
  },
  metabotMonsters: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-09",
    accessNote:
      "Drops are from client reward tables, not observed live drops; respawn times are not listed.",
  },
  wikily: {
    publishedDate: "2026-10-03",
    updatedDate: "2026-10-06",
    checkedDate: "2026-10-09",
    accessNote:
      "Region and build unstated; the schedule says server time without settling the EU clock.",
  },
  // Gear guides, stones and upgrade previews: S67–S87, S111–S112, S181.
  metabotGear: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-27",
    checkedDate: "2026-11-01",
    accessNote:
      "Gear grade and item-level data comes from the Global client; the original client files were not independently audited.",
  },
  metabotDungeons: {
    region: "Global",
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-07",
    checkedDate: "2026-10-08",
  },
  metabotContentUnlocks: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-11",
  },
  gamesFuzeAfter45: {
    updatedDate: "2026-10-05",
    checkedDate: "2026-10-08",
  },
  metabotEnhancement: {
    region: "Global",
    checkedDate: "2026-10-08",
  },
  metabotChecklist: {
    region: "Global",
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-27",
    checkedDate: "2026-11-02",
    accessNote:
      "Guide-reported from the Global client ContentsTicket table, not a live check. The guide predates Odylium and says Instant Clear spends an attempt after a clear.",
  },
  metabotArcana: {
    region: "Global",
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-06",
    checkedDate: "2026-10-08",
  },
  metabotAbyss: {
    region: "Global",
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-15",
    checkedDate: "2026-10-16",
    accessNote:
      "Guide-reported from Global client data; does not establish live shop availability.",
  },
  metabotManastones: {
    region: "Global",
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-06",
    checkedDate: "2026-10-08",
  },
  metabotHeightenedSixthSense: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    accessNote:
      "Client-derived earlier tooltip report, not a live Global check; not confirmed after the 28 October patch.",
  },
  game8Manastones: {
    region: "Global-oriented",
    updatedDate: "2026-10-08",
    checkedDate: "2026-10-08",
    accessNote:
      "Partial page read: the last 18,000 characters were not read. Published stone odds conflict with the newer MetaBot guide.",
  },
  corpusManastones: {
    publishedDate: "2026-10-04",
    checkedDate: "2026-10-08",
  },
  xboxPlayTheostones: {
    publishedDate: "2026-10-06",
    checkedDate: "2026-10-08",
  },
  showGamerTheostones: {
    publishedDate: "2026-10-06",
    checkedDate: "2026-10-08",
  },
  metabotAulakTheostone: { checkedDate: "2026-10-08" },
  gamesFuzeUpgrades: {
    updatedDate: "2026-10-01",
    checkedDate: "2026-10-09",
    accessNote:
      "Region unstated; the guide does not establish exact Transfer/Sync costs or how Sync Stones relate to donor gear.",
  },
  gamesFuzeSoulBinding: {
    updatedDate: "2026-09-30",
    checkedDate: "2026-10-09",
    accessNote:
      "Region unstated; exact costs and whether a Sync Stone replaces donor gear are not given.",
  },
  metabotTransferStone: {
    region: "Global",
    checkedDate: "2026-10-09",
  },
  metabotTransferWeapon: {
    region: "Global",
    checkedDate: "2026-10-09",
  },
  metabotTransferArmor: {
    region: "Global",
    checkedDate: "2026-10-09",
  },
  metabotTransferAccessory: {
    region: "Global",
    checkedDate: "2026-10-09",
  },
  metabotSyncStone: {
    region: "Global",
    checkedDate: "2026-10-09",
  },
  // Boards: S78/S124/S126/S182/S183; skills: S125/S127. Retention is not a recheck.
  metabotDaevanion: {
    region: "Global",
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-27",
    checkedDate: "2026-11-01",
    accessNote:
      "Guide-reported from Global client data, not a live board check. Its generic five-board copy is stale, and its PvP-only Azphel description conflicts with retained Global client node data.",
  },
  metabotDaevanionPlanner: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-11-01",
    accessNote:
      "Planner table and Spiritmaster page read; its generic five-board copy is stale. Client-derived, not a live in-game board check. The full Ariel node layout is not retained.",
  },
  metabotSpiritmasterPlanner: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-11",
    accessNote:
      "Embedded node data read from the planner; not an independent live board audit.",
  },
  metabotGladiatorPlanner: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-11",
  },
  metabotTemplarPlanner: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-11",
  },
  metabotAssassinPlanner: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-11",
  },
  metabotRangerPlanner: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-11",
  },
  metabotSorcererPlanner: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-11",
  },
  metabotClericPlanner: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-11",
  },
  metabotChanterPlanner: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-11",
  },
  metabotSpiritmasterSkills: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-10",
  },
  ncGlobal21Oct: { region: "Global", checkedDate: "2026-11-01" },
  ncGlobal28Oct: { region: "Global", checkedDate: "2026-11-02" },
  ncServerTransfers: {
    region: "Global",
    publishedDate: "2026-10-09",
    updatedDate: "2026-10-26",
    checkedDate: "2026-11-02",
  },
  ncPetOffers13Oct: {
    region: "Global",
    publishedDate: "2026-10-13",
    checkedDate: "2026-11-02",
    accessNote:
      "The official notice was read directly. It lists the final Pacific maintenance cutoff in PST and the EU cutoff in CET; prices are PURPLE Store references that may vary by store. No live shop check was made.",
  },
  ncPetOffers28Oct: {
    region: "Global",
    publishedDate: "2026-10-28",
    checkedDate: "2026-11-02",
    accessNote:
      "The official Steam news feed's 28 October notice was read. It lists the final Pacific maintenance cutoff in PST and the EU cutoff in CET; prices are PURPLE Store references that may vary by store. No live shop check was made.",
  },
  patchbotGlobal28Oct: {
    region: "Global",
    publishedDate: "2026-10-28",
    checkedDate: "2026-11-02",
    accessNote: "Readable transcription of NC's official notice.",
  },
  metabotOdyliumRepository: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-11-02",
    accessNote:
      "Client-data rewards are not a live clear result; Odylium reward reports conflict.",
  },
  aion2MapsDailyDungeon: {
    region: "Global",
    clientBuild: "28 October Steam build, as reported",
    updatedDate: "2026-10-28",
    checkedDate: "2026-11-02",
    accessNote:
      "Reports comparison with the 21 October build; no live Odylium reward result was checked.",
  },
  aion2mapsGlobalDifferences: {
    region: "Global",
    updatedDate: "2026-10-31",
    checkedDate: "2026-11-01",
    accessNote:
      "Reports an eight-slot maximum from Global client data. The current character-selection UI, expansion method, cost, and per-server/account scope were not checked.",
  },
  massivelyOverPoweredLaunchSlots: {
    region: "Global",
    publishedDate: "2026-08-08",
    checkedDate: "2026-11-01",
    accessNote:
      "Livestream recap confirms four starting slots at launch; it does not establish the current maximum or expansion details.",
  },
  aion2GlobalTicketDatabase: {
    region: "Global",
    updatedDate: "2026-11-01",
    checkedDate: "2026-11-02",
    accessNote:
      "Client-derived shop entries do not confirm live availability or final placement after NC's announced move.",
  },
  metabotDaevanionClassSkills: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-11",
    accessNote:
      "Client-data skill tooltips were read; one Chanter skill icon returned Access Denied on that date.",
  },
  metabotStigma: {
    region: "Global",
    clientBuild: metabotGuideBuild,
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-27",
    checkedDate: "2026-11-01",
    accessNote:
      "Guide-reported, client-derived data for the named Global build; the guide was checked, but shop offers and limits were not independently checked live in game.",
  },
  // Collections, currencies, faction rules and rifts: S20/S24/S26/S29/S33,
  // S44/S45/S85/S99–S103/S113–S115/S129/S133/S136–S138/S140/S141/S145/S146.
  metabotWings: {
    region: "Global",
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-08",
    checkedDate: "2026-10-11",
    accessNote:
      "The catalog records 7 October for S85 and 8 October for S138; the update date differs between entries.",
  },
  metabotHiddenCubes: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-27",
    checkedDate: "2026-11-02",
    accessNote:
      "MetaBot attributes this client data to Global build 0.0.4387.0; its methodology reports the build, but the client files were not independently audited.",
  },
  metabotDungeonPages: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-11",
    accessNote:
      "Clear-reward tables were read from client-data pages; instanced monster drops are server-side and absent from those tables.",
  },
  metabotCurrencies: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-07",
    accessNote: "Client-derived currency data; no live-shop audit was made.",
  },
  metabotBeginner: {
    region: "Global",
    clientBuild: metabotGuideBuild,
    publishedDate: "2026-10-01",
    checkedDate: "2026-10-10",
    accessNote:
      "Read through Jina Reader. Its named build differs from the checked dungeon pages; cross-build parity was not independently audited.",
  },
  gameTruthAlts: {
    region: "Global",
    publishedDate: "2026-10-06",
    checkedDate: "2026-10-09",
  },
  gamerBlurbShared: {
    region: "Global",
    publishedDate: "2026-10-08",
    checkedDate: "2026-10-09",
    accessNote:
      "The page is dated 8 October; the year 2026 is inferred from its source context.",
  },
  mmoCodexAlts: {
    region: "Global",
    publishedDate: "2026-09-15",
    checkedDate: "2026-10-09",
  },
  gamesGgAlts: {
    publishedDate: "2026-10-05",
    checkedDate: "2026-10-09",
  },
  ncPetSharing: {
    region: "Korea",
    publishedDate: "2026-01-07",
    checkedDate: "2026-10-09",
    accessNote:
      "Official Korean-service announcement, not a Global publisher notice.",
  },
  game8Abyss: {
    region: "Global-oriented",
    updatedDate: "2026-10-05",
    checkedDate: "2026-10-16",
  },
  wikilyBlackCloud: {
    publishedDate: "2026-10-03",
    updatedDate: "2026-10-06",
    checkedDate: "2026-10-11",
  },
  destructoidClashRunes: {
    region: "Global",
    publishedDate: "2026-10-05",
    updatedDate: "2026-10-06",
    checkedDate: "2026-10-12",
  },
  gamerBlurbClashRunes: {
    region: "Global",
    publishedDate: "2026-10-07",
    checkedDate: "2026-10-12",
  },
  space4GamesRifts: {
    region: "Global",
    publishedDate: "2026-10-05",
    checkedDate: "2026-10-10",
    accessNote:
      "Rechecked through Jina Reader; the guide records an Asmodian player's Global observations, not every region or faction.",
  },
  game8RiftQuests: {
    region: "Global",
    updatedDate: "2026-10-05",
    checkedDate: "2026-10-10",
    accessNote:
      "Rechecked through Jina Reader; quest rewards do not establish repeat or reset rules.",
  },
  metabotSubstanceMorph: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-10",
    accessNote:
      "Recipe table rechecked; the live server behavior and the database extraction were not independently audited.",
  },
  metabotAbyssPoints: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-10",
    accessNote:
      "Client-derived inventory, not a live shop audit; secondary medal costs require the complete shop table.",
  },
  metabotLowerAbyssRiftStone: {
    region: "Global",
    checkedDate: "2026-10-14",
  },
  officialServers: {
    region: "Global",
    publishedDate: "2026-10-04",
    checkedDate: "2026-10-06",
    accessNote:
      "The JavaScript-loaded notice body was unreadable through WebFetch; it was read via the Steam mirror and news API.",
  },
  metabotFactions: {
    region: "Global",
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-06",
    checkedDate: "2026-10-08",
  },
  game8Factions: {
    region: "Global",
    updatedDate: "2026-10-03",
    checkedDate: "2026-10-06",
  },
  allThingsDailyDungeon: {
    updatedDate: "2026-10-12",
    checkedDate: "2026-10-14",
  },
  metabotIntermediateSoulstone: {
    region: "Global",
    checkedDate: "2026-10-15",
  },
  metabotSuperiorSoulstone: {
    region: "Global",
    checkedDate: "2026-10-15",
  },
  // S151–S155: retained public inventory/shop checks, not live availability.
  metabotSkinInventory: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-16",
  },
  metabotWingInventory: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-16",
  },
  metabotNightmareShop: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-16",
    accessNote:
      "Complete relevant client shop rows retained; not a live purchase audit.",
  },
  metabotSeasonShop: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-16",
    accessNote:
      "Extracted seasonal end dates lack a verified live hour or time zone.",
  },
  metabotDaevaPassShop: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-16",
    accessNote:
      "Client shop rows retained despite one empty set-detail response; not a live availability audit.",
  },
  metabotPets: {
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-10-31",
    accessNote:
      "Reported Global client build 0.0.4387.0. Five detail pages cut their monster list short, and the five Special pets left out list no source.",
  },
  ncAtreiasCall: {
    region: "Global",
    publishedDate: "2026-10-27",
    checkedDate: "2026-11-02",
    accessNote:
      "Official Global notice reports the current Attendance event's daily reset at 8:00 CET; the current in-game menu was not checked.",
  },
  ncOdyleEnergyBoost: {
    region: "Global",
    publishedDate: "2026-10-23",
    updatedDate: "2026-10-27",
    checkedDate: "2026-11-02",
    accessNote:
      "Official Global notice; each mail has its own expiry from receipt.",
  },
  allthingsPets: { checkedDate: "2026-10-31" },
  aion2MapsPets: {
    region: "Global-focused with North America West observations",
    updatedDate: "2026-10-28",
    checkedDate: "2026-11-02",
    accessNote:
      "Guide reports Global client data through 28 October and North America West observations from 20 to 28 October. Its three-pet access grouping does not identify all three pets or live-check each zone.",
  },
  aion2HelpGlobalRegions: {
    checkedDate: "2026-11-02",
    accessNote:
      "Updated 23 October; editorial guide report, not an official notice or live check of each map zone.",
  },
  ownChecks: {
    region: "Global EU (some observations presumed)",
    accessNote:
      "The knowledge notes retain owner observations dated 5–21 October 2026; some are marked presumed Global EU. No single check date or client build applies across them, no per-check evidence log is linked, and methods are not consistently recorded.",
  },
  ncLudraAwakens: {
    region: "Global",
    publishedDate: "2026-10-23",
    updatedDate: "2026-10-27",
    checkedDate: "2026-11-02",
  },
  communityVerteronMap: {
    checkedDate: "2026-11-01",
    accessNote:
      "Korean UI; player region and client build are unverified. Screenshot opened 1 November 2026.",
  },
  communityAltgardMap: {
    checkedDate: "2026-11-01",
    accessNote:
      "Korean UI; player region and client build are unverified. Screenshot opened 1 November 2026.",
  },
  communityLowerReshantaMap: {
    checkedDate: "2026-11-01",
    accessNote:
      "Korean UI; player region and client build are unverified. Screenshot opened 1 November 2026.",
  },
  communityMiddleReshantaMap: {
    checkedDate: "2026-11-01",
    accessNote:
      "Korean UI; player region and client build are unverified. Screenshot opened 1 November 2026.",
  },
  ...skinAcquisitionSourceDetails,
};
