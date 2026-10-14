import type { GuideLink } from "./progression.ts";
import type { SourceId } from "./sources.ts";

// Manually curated from research/open-questions.md and current topic notes.
// Topic notes take precedence over unresolved rows left in the older question list.
// Reading/copying notes does not advance their external source-check dates.
export const openQuestionGroups = [
  { id: "timers", title: "EU clocks and event schedules" },
  { id: "festival", title: "Shugo Festival rewards and keys" },
  { id: "cubes", title: "Hidden Cube rewards" },
  { id: "gear", title: "Upgrades, stones and material sources" },
  { id: "appearances", title: "Alts and appearances" },
] as const;

export type OpenQuestion = {
  id: string;
  groupId: (typeof openQuestionGroups)[number]["id"];
  unknown: string;
  why: string;
  practicalCheck: string;
  relatedGuideLinks: GuideLink[];
  supportingSourceIDs: SourceId[];
};

export const openQuestions: OpenQuestion[] = [
  {
    id: "eu-reset",
    groupId: "timers",
    unknown: "The Global EU daily and weekly reset clocks are not settled.",
    why: "A server-time reset rule does not establish the EU wall-clock time when reward counters refresh.",
    practicalCheck:
      "Record local and UTC time when daily quests and reward keys refresh on an EU server. Keep Routine checks manual and trust the live countdown.",
    relatedGuideLinks: [
      { to: "/timers", label: "Reset timers" },
      { to: "/routine", label: "Daily and weekly routine" },
    ],
    supportingSourceIDs: ["metabotEvents", "metabotChecklist"],
  },
  {
    id: "eu-server-zone",
    groupId: "timers",
    unknown:
      "The EU server clock's time zone is not confirmed, including how it behaves when daylight saving changes.",
    why: "Berlin is a scheduling assumption, not a verified regional clock. A wrong zone shifts every fixed event and reset.",
    practicalCheck:
      "Compare the in-game clock and a scheduled event with local and UTC time on Global EU. Repeat across a daylight-saving change or check a current regional publisher rule.",
    relatedGuideLinks: [
      { to: "/timers", label: "Server, local and UTC timers" },
    ],
    supportingSourceIDs: ["metabotEvents"],
  },
  {
    id: "kaira-argo-spawns",
    groupId: "timers",
    unknown:
      "Watcher Kaira's three-hour interval and Argo, the Spirit King's spawn rule remain unconfirmed on EU.",
    why: "A single observed next spawn does not establish a repeating cycle; an assumed rule can send players to the wrong time.",
    practicalCheck:
      "Record two consecutive Watcher Kaira spawns and several Argo timer readings with real EU times. Use the live Abyss boss list until the rules are checked.",
    relatedGuideLinks: [
      { to: "/timers/abyss", label: "Lower Reshanta schedule" },
    ],
    supportingSourceIDs: ["wikily", "metabotEvents"],
  },
  {
    id: "faction-boss-respawns",
    groupId: "timers",
    unknown:
      "Verteron field-boss respawn intervals still rely on a half-of-Korea rule checked only on Altgard.",
    why: "Faction-specific respawn advice should not be treated as equally tested on both maps.",
    practicalCheck:
      "After killing a Verteron boss, read its timer in Map → Exploration → Field Boss. Record the boss, kill time and interval on Global EU.",
    relatedGuideLinks: [{ to: "/timers", label: "Field boss kill timers" }],
    supportingSourceIDs: ["couga54"],
  },
  {
    id: "invasion-duration-rotation",
    groupId: "timers",
    unknown:
      "Dimensional Invasion duration and rotation among Incursion of the Spirits, Beritra Air Raid and Accursed Sword remain unsettled.",
    why: "A shared hourly slot does not identify which invasion will run or how much ready and combat time to allow.",
    practicalCheck:
      "Record one Global EU run's ready and combat timers, then note which invasion appears at several consecutive :30 slots. Do not treat a timer window as the combat duration.",
    relatedGuideLinks: [
      { to: "/timers", label: "Dimensional Invasion timers" },
      { to: "/growth", label: "Invasion rewards" },
    ],
    supportingSourceIDs: ["metabotEvents"],
  },
  {
    id: "festival-card-key-mapping",
    groupId: "festival",
    unknown:
      "The mapping from rank to card selections, reward openings and keys consumed remains unknown.",
    why: "Opening odds alone cannot establish tokens per key or a verified key budget for a purchase.",
    practicalCheck:
      "Record region, level, placement, card selections, keys before and after claiming, and each package's rewards on a live result screen.",
    relatedGuideLinks: [
      { to: "/festival/simulator", label: "Conditional opening simulator" },
    ],
    supportingSourceIDs: ["game8Festival", "metabotEvents"],
  },
  {
    id: "festival-refill",
    groupId: "festival",
    unknown:
      "The live Festival Key refill quantity, reset behavior and character/server/account sharing are not independently settled.",
    why: "Larger key storage does not establish faster refill. Conflicting daily quantities change any farming forecast.",
    practicalCheck:
      "Observe counters across reset below the storage cap and compare characters and servers. Treat the per-server client rule as current advice, not proof of every live refill detail.",
    relatedGuideLinks: [
      { to: "/festival", label: "Key limits and membership" },
      { to: "/alts", label: "Shared reward pools" },
    ],
    supportingSourceIDs: [
      "metabotEvents",
      "metabotChecklist",
      "aion2GuideFestival",
      "officialMembership",
    ],
  },
  {
    id: "festival-participation-claim",
    groupId: "festival",
    unknown:
      "Whether the separate participation package can be claimed without a key remains unknown.",
    why: "Separate package records do not prove free claiming. Participation-only income cannot be treated as guaranteed.",
    practicalCheck:
      "Complete an event with zero keys and inspect the claim options. Leave the simulator's participation pairing off unless deliberately modeling that assumption.",
    relatedGuideLinks: [
      { to: "/festival/simulator", label: "Participation model toggle" },
    ],
    supportingSourceIDs: ["game8Festival", "metabotEvents"],
  },
  {
    id: "festival-level-mapping",
    groupId: "festival",
    unknown:
      "The level-50 additional-token odds are not verified at level 45; the reported level-13 key unlock and level-45 full rewards also need live checks.",
    why: "Applying one level's distribution to another can change expected rewards and when saving keys is worthwhile.",
    practicalCheck:
      "Compare reward previews or current client tables at the relevant levels on Global. Keep the simulator conditional on its level-50 distribution.",
    relatedGuideLinks: [
      { to: "/festival/simulator", label: "Opening odds and assumptions" },
    ],
    supportingSourceIDs: [
      "metabotEvents",
      "metabotMethodology",
      "aion2GuideFestival",
    ],
  },
  {
    id: "festival-shop-rotation",
    groupId: "festival",
    unknown:
      "Whether individual Festival shop items rotate out by season is unresolved; no official Global Festival end date was found in the retained notes.",
    why: "Recurring entry opportunities do not establish that every appearance remains available indefinitely.",
    practicalCheck:
      "Check the live item's expiry information and current regional shop notices before saving toward it. Do not turn opening counts into a completion date.",
    relatedGuideLinks: [
      { to: "/festival", label: "Festival shop purchases" },
      { to: "/skins", label: "Festival appearances" },
    ],
    supportingSourceIDs: ["metabotFestivalShop", "game8Festival"],
  },
  {
    id: "hidden-cube-level-scaling",
    groupId: "cubes",
    unknown:
      "The size of Hidden Cube level scaling, and whether Verteron and Altgard key-only cubes scale, is not documented.",
    why: "Without those values, saving keys until a higher level cannot be given a precise reward advantage.",
    practicalCheck:
      "Compare keyed cubes in the same zone at different levels, or compare decoded reward tables. Open free regular cubes without spending keys.",
    relatedGuideLinks: [
      { to: "/progression", label: "Cube spending priorities" },
      { to: "/growth", label: "Keys and growth materials" },
    ],
    supportingSourceIDs: ["metabotHiddenCubes"],
  },
  {
    id: "transfer-sync-requirements",
    groupId: "gear",
    unknown:
      "Exact Transfer and Sync costs, eligible gear pairs, the source item's fate, and whether Sync Stones replace donor gear remain unverified.",
    why: "A tooltip naming an operation does not establish its full material bill or protect valuable gear from loss.",
    practicalCheck:
      "Inspect both live previews with spare gear. Record stone quantities, Kina, accepted donors and source-item warnings; check losses of Potential, stones and the extra Soul Fuse effect before confirming.",
    relatedGuideLinks: [
      { to: "/gear/enhancement", label: "Transfer and Soul Binding" },
      { to: "/growth", label: "Upgrade materials" },
    ],
    supportingSourceIDs: [
      "metabotTransferStone",
      "metabotSyncStone",
      "gamesFuzeUpgrades",
      "gamesFuzeSoulBinding",
    ],
  },
  {
    id: "soul-binding-cost",
    groupId: "gear",
    unknown:
      "Soul Binding Bind's exact cost and whether it uses Soul Codex are not confirmed.",
    why: "Material sources do not establish the cost of increasing an existing bound stat.",
    practicalCheck:
      "Hover Bind on a Unique item and record the live material and Kina costs before spending. Do not infer Bind's bill from Sync or Reset.",
    relatedGuideLinks: [
      { to: "/gear/enhancement", label: "Soul Binding operations" },
      { to: "/growth", label: "Soul Binding materials" },
    ],
    supportingSourceIDs: ["gamesFuzeUpgrades", "gamesFuzeSoulBinding"],
  },
  {
    id: "engraving-stone-loss",
    groupId: "gear",
    unknown:
      "Whether re-engraving changes only ticked slots, and which upgrades or transfers keep engraved stones, remains disputed.",
    why: "Conflicting reroll and retention rules can erase a good line or waste stones on gear that will be replaced.",
    practicalCheck:
      "Use spare two-slot gear with one slot unticked to check reroll behavior. Inspect upgrade and Transfer previews separately; check valuable lines and loss warnings before confirming.",
    relatedGuideLinks: [
      { to: "/gear/enhancement", label: "Engraving and stone loss" },
      { to: "/growth", label: "Manastones and Soulstones" },
    ],
    supportingSourceIDs: [
      "metabotManastones",
      "corpusManastones",
      "gamesFuzeUpgrades",
    ],
  },
  {
    id: "clash-rune-shop",
    groupId: "gear",
    unknown:
      "The Global Nightmare Trade Shop's Clash Rune Chest price and stock limit have not been verified.",
    why: "A repeatable source is not a known replacement budget after the regional quest chests are spent.",
    practicalCheck:
      "Open the Nightmare Trade Shop on Global EU and record the Phantasmal Fragment price and purchase limit. Keep the warning that a failed Clash Rune upgrade destroys it.",
    relatedGuideLinks: [
      { to: "/growth", label: "Clash Rune sources" },
      { to: "/gear/enhancement", label: "Clash Rune failure warning" },
    ],
    supportingSourceIDs: ["gamerBlurbClashRunes", "destructoidClashRunes"],
  },
  {
    id: "skin-owned-stat-sharing",
    groupId: "appearances",
    unknown:
      "Whether a skin's owned stats apply to same-server alts along with its shared Closet appearance is unknown.",
    why: "Access to an appearance does not establish that buying its stat effect benefits every character.",
    practicalCheck:
      "Compare a same-server alt's PvP Damage Tolerance before and after the main obtains a Centurion skin. Do not budget alt stat gains from appearance sharing alone.",
    relatedGuideLinks: [
      { to: "/alts", label: "Shared and character progress" },
      { to: "/skins", label: "Appearance catalogue" },
    ],
    supportingSourceIDs: ["gameTruthAlts", "gamerBlurbShared"],
  },
  {
    id: "optional-skin-chests",
    groupId: "appearances",
    unknown:
      "The origin of Skin Chest (10 times) (Bound) and the identity of the Reward Chest listed for Skyfeather Guardian are unknown.",
    why: "A named chest is not a usable farming route until its acquisition source and contents are identified.",
    practicalCheck:
      "Inspect the chest's Source Information and reward preview in the Global client. Treat these as optional acquisition gaps; Extract Skin is already known to cost Kina and destroy its item.",
    relatedGuideLinks: [{ to: "/skins", label: "Curated appearance sources" }],
    // Public Wikily chest listing needs coordinator registration before linking it here.
    supportingSourceIDs: [],
  },
];
