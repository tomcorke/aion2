import type { GuideLink } from "./progression.ts";
import type { CounterId } from "./alts.ts";
import type { Source } from "./sources.ts";
import {
  stoneEngraving,
  stoneTiers,
  type GearUpgradeSourceId,
} from "./gearUpgrades.ts";

// Global Season 1. Uses maintained gear, stones, currency, wing and pet notes.
// Preserve the oldest included topic review (Centuryroot Tokens: 2026-10-05).
export const growthReviewed = "2026-10-05";

export const growthSourceAdditions = {
  allThingsDailyDungeon: {
    name: "All Things How Daily Dungeon guide",
    covers: "Daeva Bio-Research Base score-dependent Enhance Stone rewards",
    url: "https://allthings.how/?p=264760",
  },
  game8RiftQuests: {
    name: "Game8 Spacetime Rift quest walkthrough",
    covers: "Faction-specific quest chains and first-quest material rewards",
    url: "https://game8.co/games/Aion-2/archives/629056",
  },
  metabotSubstanceMorph: {
    name: "MetaBot Substance Morph recipes",
    covers: "Global recipe inputs, limits and wing conversion",
    url: "https://metabot.gg/en/aion-2/conversion",
  },
} satisfies Record<string, Source>;

export type GrowthSourceId =
  GearUpgradeSourceId | keyof typeof growthSourceAdditions;

export const growthLimitations = [
  "Pure Odyle is a supported wing-recipe ingredient, but its acquisition is not recorded. It has no standalone farming entry here.",
  "Soul Codex's exact use, Philosopher's Stone acquisition, brew effects, and Transfer/Sync Stone acquisition are unverified; these are not actionable Growth entries.",
  "Intermediate and Superior Abyssal variants exist, but variant-specific acquisition was not established. Only the sourced Lesser Abyssal shop offers are listed.",
  "An omitted limit is unrecorded, not zero or unlimited. Client recipe and shop values must be checked in the current Global preview.",
];

export type GrowthTarget =
  | "enhancement"
  | "amplification"
  | "potential"
  | "engraving"
  | "daevanion"
  | "stigma"
  | "pets"
  | "arcana"
  | "wings"
  | "appearance";

export const growthTargets: { id: GrowthTarget; label: string }[] = [
  { id: "enhancement", label: "Enhancement" },
  { id: "amplification", label: "Amplification" },
  { id: "potential", label: "Potential" },
  { id: "engraving", label: "Engraving" },
  { id: "daevanion", label: "Daevanion" },
  { id: "stigma", label: "Stigma" },
  { id: "pets", label: "Pets / Genus" },
  { id: "arcana", label: "Arcana" },
  { id: "wings", label: "Wings" },
  { id: "appearance", label: "Appearance" },
];

export const growthSpendGuidance = [
  {
    id: "kept-gear",
    title: "Spend on gear you will keep",
    items: [
      "Enhance weapons before armor. Intermediate stones suit early gear; save Superior stones and Potential for item levels 86 and 102 that you will keep.",
      "Ordinary stones are the better PvE choice than Abyssal stones. An unknown source or limit is not an unlimited supply.",
    ],
    links: [
      { to: "/gear/enhancement", label: "Upgrade rules and loss warnings" },
    ],
  },
  {
    id: "ap-priority",
    title: "AP priorities",
    items: [
      "Consider Stigma Shards before ordinary consumables. Potential is a PvP stat investment, not a general PvE requirement.",
    ],
    links: [{ to: "/gear/enhancement", label: "Potential mechanics" }],
  },
  {
    id: "finite-wings",
    title: "Finite wing materials",
    items: [
      "Both Featherdown wings require all 140 home-faction Featherdown. Clear all 61 Sealed Dungeons, including Roah; rewards do not repeat and there is no spare supply.",
      "Both wings also need 20 Pure Odyle in total. Its acquisition was not recorded in the maintained notes; confirm a source in game before planning the crafts.",
    ],
    links: [{ to: "/gear/enhancement", label: "Wing effects and recipes" }],
  },
];

export type GrowthAcquisition = {
  name: string;
  detail?: string;
  // Missing means unrecorded, never unlimited. Limits belong to this source route.
  limit?: string;
  gearActivityId?: string;
  gearMode?: string;
  rewardConditionId?: string;
  counterId?: CounterId;
  to?: string;
};

export type GrowthMaterial = {
  id: string;
  name: string;
  aliases: string[];
  kind: "material" | "currency" | "equipment";
  targets: GrowthTarget[];
  use: string;
  acquisition: GrowthAcquisition[];
  slots?: string[];
  tier?: string;
  variant?: "ordinary" | "abyssal";
  condition?: string;
  links: GuideLink[];
  sourceIds: GrowthSourceId[];
};

const ordinaryStoneSources: Record<string, GrowthAcquisition[]> = {
  lesser: [
    { name: "Named level-45+ monsters in Verteron/Altgard and Abyss monsters" },
    {
      name: "Quests, Hard dungeon stages, raids, achievements and battle pass",
      detail: "These routes give bound copies.",
    },
  ],
  intermediate: [
    { name: "Hard dungeon stages and achievements" },
    {
      name: "Alchemy",
      detail:
        "5 Lesser + 3 Spiritstone Powder + 2 Professional Ink; a 20% great success yields Superior instead.",
    },
  ],
  superior: [
    { name: "Achievements and battle pass" },
    { name: "Alchemy", detail: "30 Intermediate stones make one Superior." },
  ],
};

const ordinaryStones: GrowthMaterial[] = stoneEngraving
  .filter(({ id }) => id !== "theostone")
  .flatMap((stone) =>
    stoneTiers.map((tier) => ({
      id: `${tier.id}-${stone.id}`,
      name: `${tier.name} ${stone.name}`,
      aliases: [],
      kind: "material" as const,
      targets: ["engraving" as const],
      tier: tier.name,
      variant: "ordinary" as const,
      slots: stone.slots,
      use: `${stone.use} ${tier.name} rolls ${tier.lineGrades.join(" / ")} lines.`,
      acquisition: [
        ...ordinaryStoneSources[tier.id],
        ...(stone.id === "manastone" && tier.id === "superior"
          ? [
              {
                name: "Growth Manastone Chest",
                detail: "10% chance of Superior.",
              },
            ]
          : []),
      ],
      condition: [
        stone.warning,
        "Check the exact variant's bound/tradable status. Engraving overwrites lines with no undo; dismantling refunds no stones.",
      ]
        .filter(Boolean)
        .join(" "),
      links: [{ to: "/gear/enhancement", label: "Engraving mechanics" }],
      sourceIds: [
        "metabotManastones",
        "game8Manastones",
        "corpusManastones",
      ] as GrowthSourceId[],
    })),
  );

const abyssalStones: GrowthMaterial[] = stoneEngraving
  .filter(({ id }) => id !== "theostone")
  .map((stone) => ({
    id: `lesser-abyssal-${stone.id}`,
    name: `Lesser Abyssal ${stone.name}`,
    aliases: [],
    kind: "material",
    targets: ["engraving"],
    tier: "Lesser",
    variant: "abyssal",
    slots: stone.slots,
    use: `${stone.use} Abyssal rolls spend about a third of the pool on PvP stats; ordinary stones are the better PvE choice.`,
    acquisition: [
      {
        name: "Abyss Trade Shop",
        detail: stone.id === "manastone" ? "1,000 AP each." : "2,000 AP each.",
        limit: "50 per character per week.",
      },
    ],
    condition: stone.warning,
    links: [{ to: "/gear/enhancement", label: "Engraving mechanics" }],
    sourceIds: ["metabotManastones"],
  }));

export const growthMaterials: GrowthMaterial[] = [
  ...ordinaryStones,
  ...abyssalStones,
  {
    id: "rare-theostone",
    name: "Rare Theostone",
    aliases: [],
    kind: "material",
    targets: ["engraving"],
    tier: "Rare",
    slots: ["Weapon", "Guard"],
    use: "A proc effect in a dedicated slot. Example: Aulak's Roar (Bound) has a 3% chance on attack to Stun for 1 second, with a 5-second cooldown. Identical stones do not stack.",
    acquisition: [
      {
        name: "Regional Rare Theostone Chests",
        detail:
          "Quests include A Traitor Within, Restless Spirit(s) and Regular Altar Maintenance; the opposite faction has its own quests.",
      },
      {
        name: "Abyss Trade Shop",
        detail:
          "Rare Theostone Chest: 35,000 AP. Stock limit was not verified.",
      },
      {
        name: "Hidden Cubes, Transcendence and Season Shop",
        gearActivityId: "transcendence",
        rewardConditionId: "transcendence",
        to: "/gear",
      },
    ],
    condition:
      "Rare stones are reported tradable, but Bound variants are not tradable. Drops are random; a Rare Theostone Selection Chest lets you choose. Removal destroys the engraved stone.",
    links: [{ to: "/gear/enhancement", label: "Theostone mechanics" }],
    sourceIds: [
      "xboxPlayTheostones",
      "showGamerTheostones",
      "metabotAulakTheostone",
    ],
  },
  {
    id: "epic-theostone",
    name: "Epic Theostone",
    aliases: [],
    kind: "material",
    targets: ["engraving"],
    tier: "Epic",
    slots: ["Weapon", "Guard"],
    use: "Stronger proc effect than Rare, not a higher proc chance.",
    acquisition: [
      {
        name: "Transcendence",
        gearActivityId: "transcendence",
        rewardConditionId: "transcendence",
        to: "/gear",
      },
      {
        name: "Theostone combination",
        detail:
          "Four Rare stones; 11.1% reported chance to upgrade grade, not a guarantee.",
      },
    ],
    condition:
      "Reported account-bound; Bound variants are not tradable. Removal destroys the stone. Combination odds lack official confirmation.",
    links: [{ to: "/gear/enhancement", label: "Theostone mechanics" }],
    sourceIds: ["xboxPlayTheostones", "showGamerTheostones"],
  },
  {
    id: "unique-theostone",
    name: "Unique Theostone",
    aliases: [],
    kind: "material",
    targets: ["engraving"],
    tier: "Unique",
    slots: ["Weapon", "Guard"],
    use: "Stronger proc effect than Epic, not a higher proc chance.",
    acquisition: [
      {
        name: "Theostone combination",
        detail:
          "Four Epic stones; 9.1% reported chance to upgrade grade, not a guarantee.",
      },
    ],
    condition:
      "Reported account-bound; Bound variants are not tradable. Removal destroys the stone. Combination odds lack official confirmation.",
    links: [{ to: "/gear/enhancement", label: "Theostone mechanics" }],
    sourceIds: ["xboxPlayTheostones", "showGamerTheostones"],
  },
  {
    id: "clash-rune-chest",
    name: "Clash Rune Chest (Bound)",
    aliases: ["Clash Rune Chest"],
    kind: "material",
    targets: ["enhancement"],
    use: "Obtain a Clash Rune. The +1 upgrade is guaranteed; later failure destroys the rune. Stop at +1 unless you can afford to lose it.",
    acquisition: [
      {
        name: "Regional quests",
        detail:
          "Each listed quest gives one chest. Elyos quests are in Aullaeu Village and Western/Southern Altamia Highland; Asmodian quests are in Uruthumheim, Dranactus, Nornir Assembly and Southern Gribade Highland.",
      },
      {
        name: "Nightmare Trade Shop",
        detail:
          "Spend Phantasmal Fragments from Nightmare, unlocked at total item level 1,000. Price and stock limit were not verified.",
      },
    ],
    condition:
      "Regional quest supplies are finite. Do not apply ordinary gear's non-destructive failure rule to Clash Runes.",
    links: [
      { to: "/gear/enhancement", label: "Destructive Clash Rune warning" },
    ],
    sourceIds: ["destructoidClashRunes", "gamerBlurbClashRunes", "ownChecks"],
  },
  {
    id: "enhance-stones",
    name: "Enhance Stones",
    aliases: ["Enhance Stone"],
    kind: "material",
    targets: ["enhancement"],
    use: "Ordinary gear enhancement alongside Kina. See Gear for safe ranges, failure rules and extraction.",
    acquisition: [
      {
        name: "Sealed Dungeons",
        detail:
          "First-clear rewards; home- and enemy-faction reward amounts differ.",
        limit: "Clear rewards do not repeat.",
      },
      {
        name: "Daily Dungeon",
        detail:
          "Daeva Bio-Research Base (Unknown Fissure in client data): solo timed score challenge, unlocked at level 30. A final score of 10,000 or more gives 10,000 Enhance Stones; lower reward tiers were not checked.",
        limit:
          "Shared server-wide weekly entry pool, spent on entry. See Alts for its counter.",
        counterId: "daily-dungeon",
        to: "/alts",
      },
      {
        name: "Krao Cave and Urugugu Canyon Exploration cubes",
        detail:
          "Use the Gear browser for cube costs, gates and reward conditions.",
        gearActivityId: "krao-cave",
        gearMode: "Exploration",
        rewardConditionId: "exploration",
        to: "/gear",
      },
      {
        name: "Ascension Trial",
        gearActivityId: "ascension-trial",
        rewardConditionId: "ascension-trial",
        to: "/gear",
      },
      {
        name: "Growth dungeons",
        gearActivityId: "growth",
        rewardConditionId: "growth",
        to: "/gear",
      },
      {
        name: "Dimensional Invasion",
        detail: "700 in the free package or 1,200 in the keyed package.",
      },
    ],
    links: [{ to: "/gear/enhancement", label: "Enhancement mechanics" }],
    sourceIds: [
      "metabotDungeons",
      "metabotChecklist",
      "metabotEvents",
      "ownChecks",
      "allThingsDailyDungeon",
    ],
  },
  {
    id: "amplify-stone-fragment",
    name: "Unique Amplify Stone Fragment",
    aliases: [],
    kind: "material",
    targets: ["amplification"],
    use: "Fragment reward associated with Amplify Stones for Amplified Enhancement on eligible maxed Unique gear.",
    acquisition: [
      {
        name: "Ascension Trial",
        gearActivityId: "ascension-trial",
        rewardConditionId: "ascension-trial",
        to: "/gear",
      },
    ],
    condition:
      "The fragment-to-stone recipe and quantities were not recorded. Check the live recipe rather than treating one fragment as one stone.",
    links: [{ to: "/gear/enhancement", label: "Amplified Enhancement" }],
    sourceIds: ["metabotDungeons", "metabotEnhancement"],
  },
  {
    id: "potential-stones",
    name: "Potential Stone: Abyss (Unique)",
    aliases: ["Potential Stones"],
    kind: "material",
    targets: ["potential"],
    use: "Potential adds PvP stats to Unique gear and spends these stones plus AP. Save it for item levels 86 and 102 that you will keep.",
    acquisition: [
      {
        name: "Abyss Trade Shop",
        detail:
          "Potential Stones cost 25,000–100,000 AP across four weekly tiers.",
        limit:
          "Weekly tiers; exact quantities and shared-counter behavior were not recorded.",
      },
    ],
    links: [{ to: "/gear/enhancement", label: "Potential steps and AP cost" }],
    sourceIds: ["metabotAbyss", "metabotEnhancement"],
  },
  {
    id: "daevanion-crystals",
    name: "Daevanion Crystals",
    aliases: ["Daevanion Crystal"],
    kind: "material",
    targets: ["daevanion"],
    use: "Points for Nezekan, Zikel, Vaizel and Triniel; these do not pay for Azphel.",
    acquisition: [
      {
        name: "Home-faction Sealed Dungeons",
        detail: "2 each from 61 dungeons per faction.",
        limit: "One-time first-clear rewards.",
      },
      { name: "Regional quests", detail: "1 each from 58 quests per faction." },
      {
        name: "Shops and Substance Morph",
        detail: "Check the current offer or recipe for costs and caps.",
      },
    ],
    condition:
      "Home-faction Sealed Dungeon rewards include Daevanion Crystals; the checked enemy-faction reward tables do not. Do not apply the home-map reward bundle to a rift visit.",
    links: [{ to: "/daevanion", label: "Board routes" }],
    sourceIds: [
      "metabotDaevanion",
      "metabotBeginner",
      "metabotDungeonPages",
      "ownChecks",
    ],
  },
  {
    id: "azphel-crystals",
    name: "Daevanion Crystal: Azphel",
    aliases: ["Azphel crystals"],
    kind: "material",
    targets: ["daevanion"],
    use: "Azphel uses this separate currency, not points from the other four boards. Mostly PvP, but HP and MP nodes have no PvP label.",
    acquisition: [
      {
        name: "Abyss Trade Shop",
        detail: "AP purchase; exact current price and limit were not verified.",
      },
    ],
    links: [{ to: "/daevanion", label: "Azphel routes" }],
    sourceIds: [
      "metabotAbyss",
      "metabotDaevanion",
      "metabotSpiritmasterPlanner",
    ],
  },
  {
    id: "stigma-shards",
    name: "Stigma Shards",
    aliases: ["Stigma Shard"],
    kind: "material",
    targets: ["stigma"],
    use: "Stigma skill progression. Ranks above 20 require Superior Stigma Shards; exact quantities and their acquisition were not verified.",
    acquisition: [
      { name: "Abyss Trade Shop" },
      {
        name: "Spacetime Rift first quest",
        detail:
          "The first quest of either faction's chain rewards a Stigma Shard alongside other materials.",
      },
    ],
    condition:
      "Do not substitute ordinary shards for the separate Superior requirement. Purchase limits were not recorded.",
    links: [{ to: "/progression", label: "Stigma priorities" }],
    sourceIds: ["game8Abyss", "metabotStigma", "game8RiftQuests"],
  },
  {
    id: "soul-crystals",
    name: "Soul Crystals",
    aliases: ["Soul Crystal"],
    kind: "material",
    targets: ["pets"],
    use: "Genus Insight rerolls cost 4 Soul Crystals and 1,000 Kina each. Genus levels open Insight slots; ownership and Insight bonuses are shared within the server.",
    acquisition: [
      {
        name: "Growth dungeons",
        gearActivityId: "growth",
        rewardConditionId: "growth",
        to: "/gear",
      },
      {
        name: "Hidden Cubes",
        detail:
          "The compared tables list 100 without a key and 1,000 keyed. Eltnen and Morheim rewards scale with level by an unpublished amount.",
      },
    ],
    links: [{ to: "/alts", label: "Pet and Genus sharing" }],
    sourceIds: [
      "metabotDungeons",
      "metabotWings",
      "metabotHiddenCubes",
      "gamerBlurbShared",
    ],
  },
  {
    id: "growth-pet-chest",
    name: "Growth Pet Chest",
    aliases: [],
    kind: "material",
    targets: ["pets"],
    use: "Pet growth reward. Exact chest contents and quantities are not established by the loot-list entry.",
    acquisition: [
      {
        name: "Ascension Trial",
        gearActivityId: "ascension-trial",
        rewardConditionId: "ascension-trial",
        to: "/gear",
      },
    ],
    links: [{ to: "/alts", label: "Pet and Genus sharing" }],
    sourceIds: ["metabotDungeons"],
  },
  {
    id: "creature-souls",
    name: "Creature souls",
    aliases: [],
    kind: "material",
    targets: ["pets"],
    use: "Unlock creatures; collecting within a genus raises its shared stat bonus.",
    acquisition: [
      {
        name: "Creature farming",
        detail:
          "Target a missing creature. Enemy-territory pet farming is available through Spacetime Rifts; no optimal route or drop rate was verified.",
      },
    ],
    links: [{ to: "/alts", label: "Collection sharing" }],
    sourceIds: ["metabotBeginner", "space4GamesRifts"],
  },
  {
    id: "mysterious-crystals",
    name: "Mysterious Crystals",
    aliases: ["Mysterious Crystal"],
    kind: "material",
    targets: ["arcana"],
    use: "Arcana transmutation: 5 crystals plus 2,000,000 Kina build a chosen Unique card.",
    acquisition: [
      { name: "Arcana duplicate extraction" },
      {
        name: "Coin shop",
        detail:
          "Listed with Training Arcana; current prices and purchase caps were not recorded.",
      },
    ],
    links: [{ to: "/gear/enhancement", label: "Arcana slots and leveling" }],
    sourceIds: ["metabotArcana"],
  },
  {
    id: "arcana",
    name: "Arcana",
    aliases: [],
    kind: "equipment",
    targets: ["arcana"],
    use: "Five card slots at level 45. Card EXP leveling cannot fail; duplicates extract into Mysterious Crystals.",
    acquisition: [
      {
        name: "Transcendence",
        gearActivityId: "transcendence",
        rewardConditionId: "transcendence",
        to: "/gear",
      },
      { name: "Battle pass and attendance" },
      {
        name: "Coin shop",
        detail:
          "Lists Training Arcana and Mysterious Crystals; current prices and caps were not recorded.",
      },
    ],
    links: [{ to: "/gear/enhancement", label: "Arcana slots and grades" }],
    sourceIds: ["metabotArcana"],
  },
  {
    id: "sealed-wing-featherdown",
    name: "Sealed Wing Featherdown (Bound)",
    aliases: ["Sealed Wing Featherdown"],
    kind: "material",
    targets: ["wings"],
    use: "Substance Morph: each Sealing Wings or Glorious Wings recipe uses 70 Featherdown plus 10 Pure Odyle, once per character. Both pairs need 140 Featherdown and 20 Pure Odyle.",
    acquisition: [
      {
        name: "Home-faction Sealed Dungeons",
        detail:
          "60 give 2 each and Ruins of the Ancient City of Roah gives 20. Every one of the faction's 61 dungeons is required for both wings.",
        limit: "Finite 140 per character; first-clear rewards do not repeat.",
      },
    ],
    condition:
      "Bound and not tradable. Enemy-faction clears give no Featherdown; the client names no other source. Pure Odyle acquisition was not recorded in the maintained notes.",
    links: [{ to: "/gear/enhancement", label: "Wing effects" }],
    sourceIds: [
      "metabotDungeonPages",
      "metabotSubstanceMorph",
      "metabotWings",
      "ownChecks",
    ],
  },
  {
    id: "abyss-points",
    name: "Abyss Points",
    aliases: ["AP"],
    kind: "currency",
    targets: [
      "potential",
      "engraving",
      "daevanion",
      "stigma",
      "wings",
      "appearance",
    ],
    use: "Currency spent on Potential steps and Abyss Trade Shop purchases, including Stigma Shards, Azphel crystals, stones and wings. Consider Stigma Shards before ordinary consumables.",
    acquisition: [
      {
        name: "Monsters, quests, Sealed Dungeons, Festival and Dimensional Invasion",
      },
      {
        name: "Lower Reshanta",
        detail:
          "Duty scrolls give 1,000 AP each; field objectives also give AP.",
        to: "/gear",
      },
    ],
    condition:
      "AP is per character. Weekly earning-cap values are unresolved; an absent value does not mean unlimited earnings.",
    links: [
      { to: "/gear/enhancement", label: "Potential mechanics" },
      { to: "/skins", label: "AP appearances" },
    ],
    sourceIds: ["game8Abyss", "metabotAbyss", "ownChecks"],
  },
  {
    id: "kina",
    name: "Kina",
    aliases: ["Kina (Bound)", "Kina (unbound)", "Kina (All)"],
    kind: "currency",
    targets: ["enhancement", "engraving", "pets", "arcana"],
    use: "Currency for enhancement, engraving, Genus Insight and Arcana transmutation; it is not an applied upgrade stone.",
    acquisition: [
      {
        name: "Duty Missions",
        counterId: "duty-missions",
        detail:
          "50,000 bound Kina per mission; unlocks at level 45. See Alts for the shared counter.",
        to: "/alts",
      },
      {
        name: "Sealed Dungeons",
        detail: "15,000 bound Kina per first clear.",
        limit: "One-time clear rewards, not repeatable income.",
      },
      {
        name: "Conquest cubes",
        detail: "Unbound Kina; reward conditions remain in Gear.",
        rewardConditionId: "conquest",
        to: "/gear",
      },
    ],
    condition:
      "Progression prices spend bound Kina first from the combined total. Bound Kina stays on its character; only unbound Kina is used on the Market and can move through Server Storage. The Black Cloud Merchant was observed accepting bound Kina, not unbound Kina.",
    links: [{ to: "/alts", label: "Kina sharing" }],
    sourceIds: [
      "metabotCurrencies",
      "metabotChecklist",
      "metabotDungeonPages",
      "gameTruthAlts",
      "ownChecks",
    ],
  },
  {
    id: "centuryroot-tokens",
    name: "Centuryroot Tokens",
    aliases: ["Centuryroot Token"],
    kind: "currency",
    targets: ["appearance"],
    use: "Festival shop currency for outfits, accessories and wings. It is separate from AP; an appearance purchase is not an ordinary gear upgrade.",
    acquisition: [
      {
        name: "Shugo Festival",
        detail:
          "Use the existing Festival reward records; key-to-opening mapping is unresolved.",
        to: "/festival",
      },
      { name: "Dimensional Invasion, achievements and attendance" },
    ],
    condition:
      "Currency sharing scope is unresolved. Prices and per-piece purchase limits live on Festival, not in a second Growth table.",
    links: [
      { to: "/festival", label: "Festival rewards and prices" },
      { to: "/skins", label: "Appearance sources" },
    ],
    sourceIds: ["metabotEvents", "aion2GuideFestival", "metabotFestivalShop"],
  },
];

export const growthSources: GrowthSourceId[] = [
  ...new Set([
    ...growthMaterials.flatMap(({ sourceIds }) => sourceIds),
    "metabotEnhancement" as const,
  ]),
];
