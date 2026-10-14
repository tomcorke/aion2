import {
  counterSourceAdditions,
  cubeWarning,
  refillClockNote,
  resourceCounters,
  type CounterId,
} from "./alts.ts";
import type { GuideLink } from "./progression.ts";
import type { Source, SourceId } from "./sources.ts";

export type RoutineGroup = "daily" | "weekly";

export type RoutineTask = {
  id: string;
  group: RoutineGroup;
  title: string;
  purpose: string;
  // Read scope, kind, limit and caps from resourceCounters in alts.ts.
  counterIds: CounterId[];
  guide: GuideLink;
  details?: string;
  warning?: string;
};

// Groups organise reminders, not game refills. IDs are browser-storage keys.
export const routineContract =
  "Ticks are reminders saved in this browser, not synchronized clears, minutes, keys or live resource counters. Daily and weekly ticks clear only when you confirm that group's manual-clear action. They do not clear on mount, at midnight, at an assumed reset or after days offline. One checkbox records a reminder, not how many rewards you have left.";

export const bankingReminders = [
  `Odyle Energy, Conquest and Transcendence reward counts refill continuously, not as fixed daily allocations. Odyle Energy: ${resourceCounters["odyle-energy"].limit}, cap ${resourceCounters["odyle-energy"].cap} (${resourceCounters["odyle-energy"].membershipCap} with membership). Conquest: ${resourceCounters["conquest-rewards"].limit}, cap ${resourceCounters["conquest-rewards"].cap}. Transcendence: ${resourceCounters["transcendence-rewards"].limit}, cap ${resourceCounters["transcendence-rewards"].cap}. Spend useful rewards before caps stop the refill.`,
  `Duty Missions bank up to ${resourceCounters["duty-missions"].cap} with ${resourceCounters["duty-missions"].limit}, shared by the server. Nightmare banks up to ${resourceCounters.nightmare.cap} with ${resourceCounters.nightmare.limit}, per character, and spends an entry only on a clear.`,
  "Daily Dungeon entries are a weekly server pool even though the task appears under daily reminders. Weekly task grouping is not a promise that every shop or recipe shares the same counter.",
  "Festival Key storage caps are not daily allocations. Check live keys and reward previews; disputed refill quantities must not become checklist quotas.",
  refillClockNote,
];

export const dailyDungeonRewardNote =
  "In Daeva Bio-Research Base, a final score of 10,000 or more pays 10,000 Enhance Stones. Fourteen top-score runs give 140,000 a week before ticket entries.";

export const routineTasks: RoutineTask[] = [
  {
    id: "duty-missions",
    group: "daily",
    title: "Complete useful Duty Missions",
    purpose: "Earn 50,000 bound Kina per mission for the character doing it.",
    counterIds: ["duty-missions"],
    guide: { to: "/progression", label: "Duty Missions and Kina" },
    details:
      "Unlocks at level 45. Banked completions are shared by the server; leave them to the main when its progression matters most.",
  },
  {
    id: "nightmare",
    group: "daily",
    title: "Clear Nightmare",
    purpose:
      "Earn Phantasmal Fragments for the Nightmare Trade Shop's Clash Rune Chests.",
    counterIds: ["nightmare"],
    guide: { to: "/gear", label: "Nightmare and Clash Runes" },
    details:
      "Unlocks at total item level 1,000. Entries bank and are spent only on a clear; checking this row does not count clears.",
  },
  {
    id: "daily-dungeon",
    group: "daily",
    title: "Run Daily Dungeon when entries are useful",
    purpose: dailyDungeonRewardNote,
    counterIds: ["daily-dungeon"],
    guide: { to: "/gear", label: "Enhance Stone sources" },
    details:
      "A solo timed kill challenge, unlocked at level 30. Daily is the Global name, not a daily allocation: all same-server characters share the weekly entries. Two a day is pacing advice, not a refill rule. Entries are spent on entry and unused entries are lost at Wednesday reset.",
  },
  {
    id: "conquest",
    group: "daily",
    title: "Spend Conquest energy and reward counts",
    purpose:
      "Take useful gear and unbound Kina from Conquest cubes before replenishing counters cap.",
    counterIds: ["odyle-energy", "conquest-rewards", "unobtained-cubes"],
    guide: { to: "/gear", label: "Conquest drops and pity" },
    warning: cubeWarning,
  },
  {
    id: "transcendence",
    group: "daily",
    title: "Spend Transcendence energy and reward counts",
    purpose:
      "Collect Arcana and other useful cube rewards before replenishing counters cap.",
    counterIds: ["odyle-energy", "transcendence-rewards", "unobtained-cubes"],
    guide: { to: "/gear", label: "Transcendence and Arcana" },
    details:
      "The first tier opens at total item level 1,600. A daily reminder does not turn the continuous refill into a daily quota.",
    warning: cubeWarning,
  },
  {
    id: "festival",
    group: "daily",
    title: "Optional: use Festival keys when rewards are useful",
    purpose:
      "Check available Festival rewards and Centuryroot Token goals rather than assuming a daily key allocation.",
    counterIds: ["festival-keys"],
    guide: { to: "/festival", label: "Festival games, keys and rewards" },
    details:
      "Use this reminder only when you have keys and want the available rewards. Storage caps are confirmed, but daily quantities and reset behaviour are disputed. Whether a participation package can be claimed without a key is unresolved; check the live reward preview.",
  },
  {
    id: "exploration",
    group: "weekly",
    title: "Use useful Exploration rewards",
    purpose:
      "Collect dungeon gear and advance Exploration pity. Krao Cave and Urugugu Canyon Exploration cubes offer Enhance Stones for 20 Odyle Energy.",
    counterIds: ["exploration", "odyle-energy"],
    guide: { to: "/gear", label: "Exploration loot and pity" },
    details:
      "Exploration pity takes 3 runs; with membership each run counts as 2. The contents of each pity reward were not recorded, so this is not a promise of a chosen item.",
  },
  {
    id: "ascension-trial",
    group: "weekly",
    title: "Run Ascension Trial",
    purpose:
      "Collect Enhance Stones, Unique Amplify Stone Fragments, Growth Pet Chests and Ascension Binding Chests; reward amounts grow with difficulty and final score.",
    counterIds: ["ascension-trial"],
    guide: { to: "/gear", label: "Ascension Trial rewards" },
  },
  {
    id: "subjugation",
    group: "weekly",
    title: "Use Subjugation tickets",
    purpose:
      "Plan the character's limited entries into four-player Balaur-base assaults.",
    counterIds: ["subjugation"],
    guide: { to: "/progression", label: "Subjugation difficulty gates" },
    details:
      "Entry spends a ticket. The Global item rewards and menu path are unverified; this reminder does not promise an item payout.",
  },
  {
    id: "raids",
    group: "weekly",
    title: "Plan available raid attempts",
    purpose:
      "Use eligible raid attempts for higher-tier gear; Ludra opens at total item level 2,800 and can supply gear up to item level 102.",
    counterIds: ["raids"],
    guide: { to: "/gear", label: "Raid gates and drops" },
    details:
      "The weekly allowance is per raid, not one total across every raid.",
  },
  {
    id: "growth-time",
    group: "weekly",
    title: "Use Growth dungeon time",
    purpose:
      "Farm Soul Crystals, Enhance Stones and Shulak Loot Bundles in Silent Graveyard and Fafnite Amphitheater.",
    counterIds: ["growth-graveyard", "growth-amphitheater"],
    guide: { to: "/growth", label: "Growth dungeon materials" },
    details:
      "Each dungeon has its own weekly time budget. A tick does not measure minutes used.",
  },
  {
    id: "abyss-time",
    group: "weekly",
    title: "Use useful Abyss time",
    purpose:
      "Plan Abyss Point farming and useful elite drops within the character's layer-specific time budgets.",
    counterIds: ["abyss-lower", "abyss-middle", "abyss-upper"],
    guide: { to: "/timers", label: "Abyss timing and limits" },
    details:
      "Membership doubles Lower and Middle time, not a documented Upper allowance. A Lower Abyss Rift Stone adds 1 hour to Lower usage time; Middle and Upper stone effects were not checked. AP earning-cap values and scope remain unverified.",
  },
  {
    id: "abyss-shop",
    group: "weekly",
    title: "Review Abyss Trade Shop purchases",
    purpose:
      "Spend AP on needed progression rather than ordinary consumables; consider Stigma Shards first and medals only when pursuing Centurion appearances.",
    counterIds: ["lesser-abyssal-manastones", "silver-medals"],
    guide: { to: "/growth", label: "AP shop materials and spend priorities" },
    details:
      "Potential Stones are offered at 25,000 to 100,000 AP across four weekly tiers. Their exact purchase quantities are not established here. The listed 50-stone allowance is for Lesser Abyssal Manastones, not every stone variant or shop item.",
  },
  {
    id: "morph-energy",
    group: "weekly",
    title: "Check Odyle Energy Substance Morph recipes",
    purpose:
      "Review the separate character and server recipes for Odyle Energy (Bound) when extra energy is useful.",
    counterIds: ["morph-energy-character", "morph-energy-server"],
    guide: { to: "/growth", label: "Substance Morph limits" },
    details:
      "These are Global client build 0.0.4387.0 limits, not imported Korean allowances. Check the current recipe's materials and limit before crafting.",
  },
  {
    id: "morph-medals",
    group: "weekly",
    title: "Optional: review Silver Medal recipes",
    purpose:
      "Convert Silver Fragments of Merit (Bound) into medals only when their appearance cost is useful to you.",
    counterIds: ["medal-morph"],
    guide: { to: "/skins", label: "Centurion medal costs" },
    details:
      "The two recipes list separate entries but may share their weekly counter. The cheaper recipe has only a 10% success chance; check the preview rather than assuming a guaranteed medal.",
  },
  {
    id: "membership-spiritstones",
    group: "weekly",
    title: "Optional: check membership Resurrection Spiritstones",
    purpose:
      "Review both Wind Breeze shop stocks if your server has the required membership.",
    counterIds: ["resurrection-server", "resurrection-character"],
    guide: { to: "/alts", label: "Membership and stock scopes" },
    details:
      "Membership required. The server stock is shared; the character stock is separate. This does not promise equivalent purchases without membership.",
  },
];

export const routineSources: SourceId[] = [
  "metabotSubstanceMorph",
  "metabotManastones",
  "metabotAbyssPoints",
  "metabotLowerAbyssRiftStone",
  "redditBeginnerDps",
  "allThingsDailyDungeon",
  "metabotChecklist",
  "metabotDungeons",
  "metabotContentUnlocks",
  "metabotGear",
  "metabotAbyss",
  "metabotCurrencies",
  "game8Abyss",
  "gamerBlurbClashRunes",
  "destructoidClashRunes",
  "officialMembership",
  "ownChecks",
];

// S145; also needed by Gear's Enhance Stone source row (#27).
export const routineSourceAdditions = {
  ...counterSourceAdditions,
  allThingsDailyDungeon: {
    name: "All Things How Daily Dungeon guide",
    covers:
      "Daeva Bio-Research Base's solo score challenge and 10,000-score Enhance Stone reward",
    url: "https://allthings.how/?p=264760",
  },
} satisfies Record<string, Source>;

export const routineReviewed = "2026-10-13";
