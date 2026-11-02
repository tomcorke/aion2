import type { SourceId } from "./sources.ts";

// Curated from aion2-knowledge/knowledge/topics/events/shugo-festival/.
// Source checks are recorded per source; MetaBot's shop and methodology were rechecked 2026-11-02.
export const festivalReviewed = "2026-11-02";

export const festivalSources: SourceId[] = [
  "game8Festival",
  "aion2GuideFestival",
  "officialMembership",
  "metabotEvents",
  "metabotMethodology",
  "metabotFestivalShop",
  "allThingsHowFestival",
  "ownChecks",
];

export const festivalEntry = {
  region: "Global",
  windowMinutes: 3,
  instructions:
    "Click the three-minute entry countdown beside the map and choose an activity during that window. Participant limits vary by game; Hidden Lugi needs at least two players.",
  availability:
    "On a Global EU server, the Festival was observed opening at :00 every hour as of 5 October 2026.",
  scheduleCondition:
    "Check the live timer. Regional schedules and rotation details remain unresolved. The table lists individual round limits, not the duration of the whole entry opportunity.",
  levelCondition:
    "Key availability at level 13 and full reward value at level 45 are reported but not independently verified live.",
};

export const festivalRewards = {
  cards: {
    offered: 5,
    selections:
      "Five randomized reward cards are offered; the number of selections depends on match placement.",
    pickExamples: [
      { game: "Jump Jump", rank: "1st place", picks: 4 },
      { game: "Jump Jump", rank: "3rd place", picks: 3 },
      { game: "Not This Tile?", rank: "1st or 2nd place", picks: 6 },
    ],
    pickCondition:
      "Guide-reported: AllThingsHow reports these rank-to-pick counts. They have not been checked in the current Global client.",
  },
  sharedTable:
    "All nine rewarded activities share one reward table across nine level brackets. This does not establish equal practical earnings; placement and selection may still matter.",
  participation: { tokens: 50, levels: "45–50", lowerBracketTokens: 40 },
  packageCondition:
    "AllThingsHow reports one participation package for each qualifying finish: 50 tokens at levels 45–50 and 40 in lower listed brackets. The participation package and keyed additional reward package are separate. Whether participation can be claimed without a key is unresolved.",
  mappingCondition:
    "The live rank → card selections → reward openings → keys consumed mapping remains unresolved. One key per pick is guide-reported, not checked in the current Global client.",
  otherRewards: [
    "Gear",
    "Gathering materials",
    "Abyss Points",
    "Wisdom Stones",
    "Daevanion Crystals",
    "Growth and appearance currencies",
  ],
};

export const festivalKeys = {
  storage: { normal: 12, specialQuairerk: 21 },
  storageCondition: "These are Global storage caps, not daily allocations.",
  membership: {
    name: "Special Quairerk",
    priceUsd: 14.99,
    days: 30,
    condition:
      "Benefits apply to characters on the server where membership was purchased; local-currency prices may differ.",
  },
  refillCondition:
    "Daily quantity, reset behavior, and character/server/account sharing remain unresolved. The membership notice does not establish faster Festival Key regeneration. Larger storage does not mean more keys each day.",
  claimingCondition:
    "A Festival Key is reported as needed for reward claiming. Whether the separate participation package can be claimed without a key is unresolved.",
};

export const festivalPickModel = {
  level: 50,
  build: "0.0.4387.0",
  outcomes: [
    { tokens: 30, probability: 0.5 },
    { tokens: 40, probability: 0.3 },
    { tokens: 60, probability: 0.17 },
    { tokens: 100, probability: 0.03 },
  ],
  meanTokens: 40.2,
  condition:
    "The detailed additional-token odds cover level 50 in reported Global client build 0.0.4387.0. Applying them unchanged at level 45 is an assumption. The mean is per keyed reward pick, not tokens per key, and excludes participation income.",
};

export type FestivalPurchasePiece = {
  id: string;
  name: string;
  price: number;
};

export type FestivalPurchase = {
  id: string;
  name: string;
  category: "outfit" | "accessory" | "wing";
  // This currency and purchase limit apply separately to each listed piece.
  currency: "Centuryroot Tokens";
  pieces: FestivalPurchasePiece[];
  total: number;
  sourceIds: SourceId[];
  limit: { quantity: 1; scope: "character"; appliesTo: "piece" };
  condition: string;
};

const purchaseTerms = {
  currency: "Centuryroot Tokens" as const,
  sourceIds: ["metabotFestivalShop", "metabotMethodology"] satisfies SourceId[],
  limit: { quantity: 1, scope: "character", appliesTo: "piece" } as const,
  condition:
    "Prices and one-per-character piece limits come from reported Global client build 0.0.4387.0, not established Korean or Taiwanese prices. Recheck the live shop before spending. Whether individual shop items rotate out by season is unresolved.",
};

export const festivalPurchases: FestivalPurchase[] = [
  {
    ...purchaseTerms,
    id: "lightpath-trace",
    name: "Lightpath Trace",
    category: "outfit",
    total: 5000,
    pieces: [
      { id: "lightpath-trace-gloves", name: "Gloves", price: 530 },
      { id: "lightpath-trace-cloak", name: "Cloak", price: 530 },
      { id: "lightpath-trace-helm", name: "Helm", price: 680 },
      {
        id: "lightpath-trace-pauldrons",
        name: "Pauldrons / shoulders",
        price: 680,
      },
      { id: "lightpath-trace-boots", name: "Boots", price: 680 },
      { id: "lightpath-trace-greaves", name: "Greaves / legs", price: 800 },
      {
        id: "lightpath-trace-breastplate",
        name: "Breastplate / chest",
        price: 1100,
      },
    ],
  },
  {
    ...purchaseTerms,
    id: "skilled-expert",
    name: "Skilled Expert",
    category: "outfit",
    total: 24900,
    pieces: [
      { id: "skilled-expert-gloves", name: "Gloves", price: 2650 },
      { id: "skilled-expert-cloak", name: "Cloak", price: 2650 },
      { id: "skilled-expert-helm", name: "Helm", price: 3400 },
      {
        id: "skilled-expert-pauldrons",
        name: "Pauldrons / shoulders",
        price: 3400,
      },
      { id: "skilled-expert-boots", name: "Boots", price: 3400 },
      { id: "skilled-expert-greaves", name: "Greaves / legs", price: 4000 },
      {
        id: "skilled-expert-breastplate",
        name: "Breastplate / chest",
        price: 5400,
      },
    ],
  },
  {
    ...purchaseTerms,
    id: "twilight-loop",
    name: "Twilight Loop",
    category: "accessory",
    total: 1210,
    pieces: [
      { id: "twilight-loop-earrings", name: "Earrings", price: 530 },
      { id: "twilight-loop-necklace", name: "Necklace", price: 680 },
    ],
  },
  {
    ...purchaseTerms,
    id: "starry-starry-night",
    name: "Starry Starry Night",
    category: "accessory",
    total: 6050,
    pieces: [
      { id: "starry-starry-night-earrings", name: "Earrings", price: 2650 },
      { id: "starry-starry-night-necklace", name: "Necklace", price: 3400 },
    ],
  },
  {
    ...purchaseTerms,
    id: "violet-butterfly-wings",
    name: "Violet Butterfly Wings",
    category: "wing",
    total: 2100,
    pieces: [
      {
        id: "violet-butterfly-wings-appearance",
        name: "Violet Butterfly Wings",
        price: 2100,
      },
    ],
  },
  {
    ...purchaseTerms,
    id: "spirit-wings",
    name: "Spirit Wings",
    category: "wing",
    total: 4200,
    pieces: [
      { id: "spirit-wings-appearance", name: "Spirit Wings", price: 4200 },
    ],
  },
  {
    ...purchaseTerms,
    id: "springflower-butterfly-wings",
    name: "Springflower Butterfly Wings",
    category: "wing",
    total: 8350,
    pieces: [
      {
        id: "springflower-butterfly-wings-appearance",
        name: "Springflower Butterfly Wings",
        price: 8350,
      },
    ],
  },
];

export type FestivalShopOffer = {
  id: string;
  category: "Progression" | "Consumable" | "Pet" | "Artwork";
  name: string;
  price: number;
  limit: string;
  faction: "Both factions" | "Elyos" | "Asmodian";
};

export const festivalShopOffers: FestivalShopOffer[] = [
  {
    id: "empathy-candy",
    category: "Consumable",
    name: "Empathy Candy (Bound)",
    price: 20,
    limit: "No limit listed",
    faction: "Both factions",
  },
  {
    id: "soul-crystal-100",
    category: "Consumable",
    name: "Soul Crystal (Bound) ×100",
    price: 50,
    limit: "30 per character per month",
    faction: "Both factions",
  },
  {
    id: "daevanion-crystal-50",
    category: "Progression",
    name: "Daevanion Crystal (Bound)",
    price: 50,
    limit: "10 per character",
    faction: "Both factions",
  },
  {
    id: "daevanion-crystal-100",
    category: "Progression",
    name: "Daevanion Crystal (Bound)",
    price: 100,
    limit: "10 per character",
    faction: "Both factions",
  },
  {
    id: "daevanion-crystal-200",
    category: "Progression",
    name: "Daevanion Crystal (Bound)",
    price: 200,
    limit: "15 per character",
    faction: "Both factions",
  },
  {
    id: "stigma-shard",
    category: "Progression",
    name: "Stigma Shard (Bound)",
    price: 300,
    limit: "35 per character",
    faction: "Both factions",
  },
  {
    id: "daevanion-crystal-400",
    category: "Progression",
    name: "Daevanion Crystal (Bound)",
    price: 400,
    limit: "15 per character",
    faction: "Both factions",
  },
  {
    id: "radiant-odyle",
    category: "Progression",
    name: "Radiant Odyle (Bound)",
    price: 1000,
    limit: "3 per character per month",
    faction: "Both factions",
  },
  {
    id: "artwork-cantas-valley",
    category: "Artwork",
    name: "Artwork: Cantas Valley (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Elyos",
  },
  {
    id: "artwork-ellun-river-marsh",
    category: "Artwork",
    name: "Artwork: Ellun River Marsh (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Elyos",
  },
  {
    id: "artwork-tolbas-forest",
    category: "Artwork",
    name: "Artwork: Tolbas Forest (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Elyos",
  },
  {
    id: "artwork-ellun-river-midstream",
    category: "Artwork",
    name: "Artwork: Ellun River Midstream (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Elyos",
  },
  {
    id: "artwork-dawn-legion-base",
    category: "Artwork",
    name: "Artwork: Dawn Legion Base (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Elyos",
  },
  {
    id: "artwork-pilgrims-ridge",
    category: "Artwork",
    name: "Artwork: Pilgrim's Ridge (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Elyos",
  },
  {
    id: "artwork-verteron-fortress-ruins",
    category: "Artwork",
    name: "Artwork: Verteron Fortress Ruins (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Elyos",
  },
  {
    id: "artwork-zumion-stone-gate",
    category: "Artwork",
    name: "Artwork: Zumion Stone Gate (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Elyos",
  },
  {
    id: "artwork-shugo-alchemist",
    category: "Artwork",
    name: "Artwork: Shugo Alchemist (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Both factions",
  },
  {
    id: "artwork-dredgion-crash-site",
    category: "Artwork",
    name: "Artwork: Dredgion Crash Site (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Asmodian",
  },
  {
    id: "artwork-nameless-cemetery",
    category: "Artwork",
    name: "Artwork: Nameless Cemetery (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Asmodian",
  },
  {
    id: "artwork-sanctum-outpost",
    category: "Artwork",
    name: "Artwork: Sanctum Outpost (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Asmodian",
  },
  {
    id: "artwork-moslan-forest",
    category: "Artwork",
    name: "Artwork: Moslan Forest (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Asmodian",
  },
  {
    id: "artwork-quai-campsite",
    category: "Artwork",
    name: "Artwork: Quai Campsite (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Asmodian",
  },
  {
    id: "artwork-calderon-canyon",
    category: "Artwork",
    name: "Artwork: Calderon Canyon (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Asmodian",
  },
  {
    id: "artwork-archon-underground-fortress-door",
    category: "Artwork",
    name: "Artwork: Archon Underground Fortress Door (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Asmodian",
  },
  {
    id: "artwork-safe-haven",
    category: "Artwork",
    name: "Artwork: Safe Haven (Bound)",
    price: 2000,
    limit: "1 per character",
    faction: "Asmodian",
  },
  {
    id: "wandering-merchant-lugi",
    category: "Pet",
    name: "Pet: Wandering Merchant Lugi",
    price: 3600,
    limit: "1 per character",
    faction: "Both factions",
  },
  {
    id: "artwork-ardus-shrine",
    category: "Artwork",
    name: "Artwork: Ardus Shrine (Bound)",
    price: 10000,
    limit: "1 per character",
    faction: "Elyos",
  },
  {
    id: "artwork-impetusium",
    category: "Artwork",
    name: "Artwork: Impetusium (Bound)",
    price: 10000,
    limit: "1 per character",
    faction: "Asmodian",
  },
];

export type FestivalGame = {
  id: string;
  name: string;
  players: { min: number; max: number };
  duration: string;
  objective: string;
};

export const festivalGames: FestivalGame[] = [
  {
    id: "jump-jump",
    name: "Jump Jump",
    players: { min: 1, max: 4 },
    duration: "2:55",
    objective:
      "Collect Festival balloons and dodge lasers. Laser hits cost points.",
  },
  {
    id: "wraith-evasion",
    name: "Wraith Evasion",
    players: { min: 1, max: 6 },
    duration: "5:00",
    objective:
      "Collect Odyle Drops and avoid wraiths. Caught players become wraiths and recover by turning another Daeva into one.",
  },
  {
    id: "mysterious-track",
    name: "Mysterious Track",
    players: { min: 1, max: 8 },
    duration: "5:00",
    objective: "Race on pets through obstacles and collect boost items.",
  },
  {
    id: "hidden-lugi",
    name: "Hidden Lugi",
    players: { min: 2, max: 9 },
    duration: "3:30",
    objective:
      "Disguised Lugis collect Odyle Drops; Shugos identify them for points.",
  },
  {
    id: "odyle-flight-frenzy",
    name: "Odyle Flight Frenzy",
    players: { min: 1, max: 8 },
    duration: "3:30",
    objective:
      "Collect Odyle Drops while flying. Acceleration rings boost speed and restore Flight Power.",
  },
  {
    id: "goldrins-treasure",
    name: "Goldrin's Treasure",
    players: { min: 1, max: 8 },
    duration: "3:50",
    objective: "Locate treasure chests using nearby light beams.",
  },
  {
    id: "defend-shugo-merchants",
    name: "Defend Shugo Merchants",
    players: { min: 1, max: 8 },
    duration: "5:00",
    objective:
      "Protect merchants from enemy waves. Petrification works on ordinary enemies, not exploding insectoids.",
  },
  {
    id: "up-up-up",
    name: "Up! Up! Up!",
    players: { min: 1, max: 8 },
    duration: "5:00",
    objective:
      "Climb moving platforms as a Gravi. Reach the first checkpoint for reward eligibility.",
  },
  {
    id: "not-this-tile",
    name: "Not This Tile?",
    players: { min: 1, max: 6 },
    duration: "3:15",
    objective:
      "Memorize tile colors and paths across eight rounds. Total score determines rank.",
  },
];
