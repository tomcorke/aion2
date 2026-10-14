import type { Faction } from "../preferences/preferences.ts";
import type { SourceId } from "./sources.ts";

// Global Season 1. Curated from knowledge/topics/gear/level-45-progression.md
// and exploration/field-bosses.md in E:/working/aion2-knowledge.
// This preserves the notes' review date; no external source was rechecked here.
export const gearReviewed = "2026-10-13";

export const gearSources: SourceId[] = [
  "metabotGear",
  "metabotDungeons",
  "metabotChecklist",
  "metabotArcana",
  "metabotAbyss",
  "metabotMonsters",
  "ownChecks",
];

export type GearTierId = "starter" | "54" | "70" | "86" | "102";
export type GearName = string | Record<Faction, string>;

export type GearTier = {
  id: GearTierId;
  label: string;
  // A piece level, never a total entry requirement. Starter spans several levels.
  pieceItemLevel?: number;
  entryActivityIds: string[];
  nextTierId?: GearTierId;
};

export type GearSlot =
  "Weapons" | "Guards" | "Armor" | "Accessories" | "Breastplate" | "Mixed";

export type GearDrop = {
  id: string;
  tierId: GearTierId;
  name: GearName;
  // Ranges and upper bounds preserve what the notes know, not guessed per-piece levels.
  pieceItemLevel: number | { min: number; max: number } | { max: number };
  slots: GearSlot[];
  condition?: string;
};

export type GearPity = {
  id: string;
  requiredRuns: number;
  // Only Exploration's membership counting was recorded.
  memberRunCredit?: number;
};

export type GearRewardCondition = {
  id: string;
  notes: string[];
};

export type GearMode = {
  name: string;
  // Omitted means not recorded, not unrestricted entry.
  totalItemLevel?: number;
  dropIds: string[];
  materials?: string[];
  rewardConditionId?: string;
  pityId?: string;
  cubeOdyleEnergy?: number;
  condition?: string;
};

export type GearActivity = {
  id: string;
  name: GearName;
  kind:
    | "Field"
    | "Quest"
    | "Lower Reshanta"
    | "Expedition"
    | "Crafting"
    | "Raid"
    | "Growth"
    | "Ascension Trial"
    | "Transcendence";
  modes: GearMode[];
};

export const gearTiers: GearTier[] = [
  {
    id: "starter",
    label: "Starter",
    entryActivityIds: ["ordinary-monsters", "diverging-paths"],
    nextTierId: "54",
  },
  {
    id: "54",
    label: "54",
    pieceItemLevel: 54,
    entryActivityIds: ["krao-cave", "draupnir"],
    nextTierId: "70",
  },
  {
    id: "70",
    label: "70",
    pieceItemLevel: 70,
    entryActivityIds: ["urugugu-canyon", "vakron-sky-island"],
    nextTierId: "86",
  },
  {
    id: "86",
    label: "86",
    pieceItemLevel: 86,
    entryActivityIds: ["fire-temple", "ferocious-horn-den"],
    nextTierId: "102",
  },
  {
    id: "102",
    label: "102",
    pieceItemLevel: 102,
    entryActivityIds: ["ludra"],
  },
];

// Set/slot coverage: S73; field and Lower Reshanta bosses: S104.
export const gearDrops: GearDrop[] = [
  {
    id: "spectral-fantasy",
    tierId: "starter",
    name: "Spectral and Fantasy",
    pieceItemLevel: 41,
    slots: ["Weapons", "Guards", "Armor"],
    condition:
      "Ordinary level 45 monsters can drop these sets; a drop is not guaranteed.",
  },
  {
    id: "wisdom-holy-spirit",
    tierId: "starter",
    name: "Wisdom and Holy Spirit lines",
    pieceItemLevel: { min: 36, max: 41 },
    slots: ["Weapons", "Guards", "Armor"],
  },
  {
    id: "spiritforged",
    tierId: "starter",
    name: "Spiritforged",
    pieceItemLevel: 45,
    slots: ["Weapons"],
  },
  {
    id: "named-elites",
    tierId: "starter",
    name: "Named level 45 elite gear",
    pieceItemLevel: 46,
    slots: ["Mixed"],
  },
  {
    id: "courage",
    tierId: "starter",
    name: "Courage",
    pieceItemLevel: 41,
    slots: ["Armor"],
    condition:
      "The same piece level as ordinary level 45 monster drops, not a higher tier.",
  },
  {
    id: "fallen-ancient-god",
    tierId: "starter",
    name: "Fallen Ancient God",
    pieceItemLevel: 46,
    slots: ["Mixed"],
  },
  {
    id: "fallen-ancient-god-weapons",
    tierId: "starter",
    name: "Fallen Ancient God weapons",
    pieceItemLevel: 46,
    slots: ["Weapons"],
  },
  {
    id: "dartan",
    tierId: "starter",
    name: "Dartan",
    pieceItemLevel: 46,
    slots: ["Armor", "Accessories"],
  },
  {
    id: "kashapa",
    tierId: "starter",
    name: "Kashapa",
    pieceItemLevel: 46,
    slots: ["Armor", "Accessories"],
  },
  {
    id: "lagta",
    tierId: "starter",
    name: "High Commander Lagta",
    pieceItemLevel: 46,
    slots: ["Armor", "Accessories"],
  },
  {
    id: "rupture",
    tierId: "54",
    name: "Rupture",
    pieceItemLevel: 54,
    slots: ["Weapons"],
  },
  {
    id: "berk",
    tierId: "54",
    name: "Berk",
    pieceItemLevel: 54,
    slots: ["Accessories"],
  },
  {
    id: "bakarma",
    tierId: "54",
    name: "Bakarma",
    pieceItemLevel: 54,
    slots: ["Armor", "Guards"],
  },
  {
    id: "kaira",
    tierId: "54",
    name: "Kaira",
    pieceItemLevel: 56,
    slots: ["Armor", "Accessories"],
  },
  {
    id: "kaira-breastplate",
    tierId: "54",
    name: "Kaira Breastplate",
    pieceItemLevel: 62,
    slots: ["Breastplate"],
  },
  {
    id: "aulamus",
    tierId: "70",
    name: "Aulamus",
    pieceItemLevel: 70,
    slots: ["Weapons", "Accessories"],
  },
  {
    id: "vakron",
    tierId: "70",
    name: "Vakron Sky Island armor",
    pieceItemLevel: 70,
    slots: ["Armor"],
  },
  {
    id: "gartua",
    tierId: "70",
    name: "Gartua",
    pieceItemLevel: 70,
    slots: ["Armor", "Accessories"],
  },
  {
    id: "argo",
    tierId: "70",
    name: "Argo",
    pieceItemLevel: 70,
    slots: ["Mixed"],
  },
  {
    id: "true-dragon-lord",
    tierId: "70",
    name: { elyos: "True Dragon Lord", asmodians: "Star line" },
    pieceItemLevel: 62,
    slots: ["Armor", "Accessories"],
  },
  {
    id: "splendent-true-dragon-lord",
    tierId: "70",
    name: {
      elyos: "Splendent True Dragon Lord",
      asmodians: "Splendent Star line",
    },
    pieceItemLevel: 70,
    slots: ["Armor", "Accessories"],
    condition: "25% great success on the True Dragon Lord / Star craft.",
  },
  {
    id: "enraged-kromede",
    tierId: "86",
    name: "Enraged Kromede",
    pieceItemLevel: 86,
    slots: ["Weapons"],
  },
  {
    id: "nuakum",
    tierId: "86",
    name: "Nuakum",
    pieceItemLevel: 86,
    slots: ["Armor"],
  },
  {
    id: "nahma",
    tierId: "86",
    name: "Nahma",
    pieceItemLevel: 86,
    slots: ["Mixed"],
  },
  {
    id: "abyssal",
    tierId: "86",
    name: "Abyssal",
    pieceItemLevel: 86,
    slots: ["Mixed"],
  },
  {
    id: "white-dragon-lord",
    tierId: "86",
    name: { elyos: "White Dragon Lord", asmodians: "Dark line" },
    pieceItemLevel: 78,
    slots: ["Armor", "Accessories"],
  },
  {
    id: "splendent-white-dragon-lord",
    tierId: "86",
    name: {
      elyos: "Splendent White Dragon Lord",
      asmodians: "Splendent Dark line",
    },
    pieceItemLevel: 86,
    slots: ["Armor", "Accessories"],
  },
  {
    id: "wise-dragon-lord",
    tierId: "102",
    name: { elyos: "Wise Dragon Lord", asmodians: "Ebony line" },
    pieceItemLevel: 94,
    slots: ["Mixed"],
  },
  {
    id: "splendent-wise-dragon-lord",
    tierId: "102",
    name: {
      elyos: "Splendent Wise Dragon Lord",
      asmodians: "Splendent Ebony line",
    },
    pieceItemLevel: 102,
    slots: ["Mixed"],
  },
  {
    id: "ludra",
    tierId: "102",
    name: "Ludra weapons and guard",
    pieceItemLevel: { max: 102 },
    slots: ["Weapons", "Guards"],
    condition:
      "The raid reaches piece item level 102; exact weapon and guard levels were not recorded separately.",
  },
];

// EU owner checks, 2026-10-12; no guessed chest contents or Conquest member bonus.
export const gearPity: GearPity[] = [
  { id: "exploration", requiredRuns: 3, memberRunCredit: 2 },
  { id: "conquest-54", requiredRuns: 14 },
  { id: "conquest-70", requiredRuns: 21 },
  { id: "conquest-86", requiredRuns: 28 },
];

export const gearPityLimitations = [
  "The contents of each pity reward were not recorded.",
  "Whether skipping the cube advances pity is unknown.",
  "The membership counting difference is recorded for Exploration only.",
];

const CUBE_SKIP_WARNING =
  "Clearing and exiting without taking the Odyle Energy Cube lowers the server's weekly unobtained-cube count from 10. At 0, Conquest and Transcendence entry locks for every character on that server until the weekly reset.";

// S76/S98 counters; cube warning confirmed in the EU client on 2026-10-12.
export const gearRewardConditions: GearRewardCondition[] = [
  {
    id: "field-boss",
    notes: ["The loot chest is guaranteed; an individual set piece is not."],
  },
  {
    id: "exploration",
    notes: [
      "7 rewards per Expedition dungeon each week, per character.",
      "A listed loot entry does not establish its drop chance or a guaranteed quantity.",
    ],
  },
  {
    id: "conquest",
    notes: [
      "The per-character Conquest reward count refills by 1 every 8 hours, capped at 21.",
      CUBE_SKIP_WARNING,
    ],
  },
  {
    id: "transcendence",
    notes: [
      "The per-character Transcendence reward count refills by 1 every 12 hours, capped at 14.",
      CUBE_SKIP_WARNING,
    ],
  },
  { id: "raid", notes: ["4 attempts per raid each week, per character."] },
  {
    id: "ascension-trial",
    notes: [
      "3 entries each week, per character.",
      "Reward amounts rise with difficulty and final score.",
      "An Ascension Binding Chest yields a Manastone or Soulstone.",
    ],
  },
  {
    id: "growth",
    notes: [
      "7 hours per Growth dungeon each week, per character.",
      "Shulak Loot Bundles contain leather, spiritstone, meat, or fruit.",
    ],
  },
];

const ASCENSION_MATERIALS = [
  "Enhance Stones",
  "Unique Amplify Stone Fragment",
  "Growth Pet Chest",
  "Ascension Binding Chest",
];

// Entry totals: S74/S79 and EU checks on 2026-10-12. Modes without a total are unknown.
export const gearActivities: GearActivity[] = [
  {
    id: "ordinary-monsters",
    name: "Ordinary level 45 monsters",
    kind: "Field",
    modes: [{ name: "World drops", dropIds: ["spectral-fantasy"] }],
  },
  {
    id: "named-monsters",
    name: "Named monsters in Verteron and Altgard",
    kind: "Field",
    modes: [{ name: "World drops", dropIds: ["wisdom-holy-spirit"] }],
  },
  {
    id: "diverging-paths",
    name: "Diverging Paths",
    kind: "Quest",
    modes: [{ name: "Quest reward", dropIds: ["spiritforged"] }],
  },
  {
    id: "named-elites",
    name: "Named level 45 elites in home maps",
    kind: "Field",
    modes: [{ name: "World drops", dropIds: ["named-elites"] }],
  },
  {
    id: "reshanta-monsters",
    name: "Lower Reshanta monsters and named elites",
    kind: "Lower Reshanta",
    modes: [
      {
        name: "World drops",
        totalItemLevel: 1000,
        dropIds: ["courage", "fallen-ancient-god"],
      },
    ],
  },
  {
    id: "dartan",
    name: "Silent Dartan",
    kind: "Field",
    modes: [
      {
        name: "Boss loot",
        dropIds: ["dartan"],
        rewardConditionId: "field-boss",
      },
    ],
  },
  {
    id: "kashapa",
    name: "Soul Ruler Kashapa",
    kind: "Field",
    modes: [
      {
        name: "Boss loot",
        dropIds: ["kashapa"],
        rewardConditionId: "field-boss",
      },
    ],
  },
  {
    id: "lagta",
    name: "High Commander Lagta",
    kind: "Field",
    modes: [
      {
        name: "Boss loot",
        dropIds: ["lagta"],
        rewardConditionId: "field-boss",
      },
    ],
  },
  {
    id: "krao-cave",
    name: "Krao Cave",
    kind: "Expedition",
    modes: [
      {
        name: "Conquest",
        totalItemLevel: 700,
        dropIds: ["rupture", "berk"],
        rewardConditionId: "conquest",
        pityId: "conquest-54",
      },
      {
        name: "Exploration",
        dropIds: [],
        materials: ["Enhance Stones"],
        cubeOdyleEnergy: 20,
        rewardConditionId: "exploration",
        pityId: "exploration",
      },
    ],
  },
  {
    id: "draupnir",
    name: "Draupnir",
    kind: "Expedition",
    modes: [
      {
        name: "Conquest",
        totalItemLevel: 700,
        dropIds: ["bakarma"],
        rewardConditionId: "conquest",
        pityId: "conquest-54",
      },
      {
        name: "Exploration",
        dropIds: ["bakarma"],
        rewardConditionId: "exploration",
        pityId: "exploration",
      },
    ],
  },
  {
    id: "watcher-kaira",
    name: "Watcher Kaira",
    kind: "Lower Reshanta",
    modes: [
      {
        name: "Boss loot",
        totalItemLevel: 1000,
        dropIds: ["kaira", "kaira-breastplate", "fallen-ancient-god-weapons"],
      },
    ],
  },
  {
    id: "executor-kaira",
    name: "Executor Kaira",
    kind: "Lower Reshanta",
    modes: [
      {
        name: "Boss loot",
        totalItemLevel: 1000,
        dropIds: ["kaira", "kaira-breastplate"],
      },
    ],
  },
  {
    id: "executor-tamasa",
    name: "Executor Tamasa",
    kind: "Lower Reshanta",
    modes: [
      {
        name: "Boss loot",
        totalItemLevel: 1000,
        dropIds: ["fallen-ancient-god"],
      },
    ],
  },
  {
    id: "urugugu-canyon",
    name: "Urugugu Canyon",
    kind: "Expedition",
    modes: [
      {
        name: "Conquest",
        totalItemLevel: 1400,
        dropIds: ["aulamus"],
        rewardConditionId: "conquest",
        pityId: "conquest-70",
      },
      {
        name: "Exploration",
        dropIds: [],
        materials: ["Enhance Stones"],
        cubeOdyleEnergy: 20,
        rewardConditionId: "exploration",
        pityId: "exploration",
      },
    ],
  },
  {
    id: "vakron-sky-island",
    name: "Vakron Sky Island",
    kind: "Expedition",
    modes: [
      {
        name: "Conquest",
        totalItemLevel: 1400,
        dropIds: ["vakron"],
        rewardConditionId: "conquest",
        pityId: "conquest-70",
      },
      {
        name: "Exploration",
        totalItemLevel: 1400,
        dropIds: ["vakron"],
        rewardConditionId: "exploration",
        pityId: "exploration",
      },
    ],
  },
  {
    id: "gartua",
    name: { elyos: "Eternal Gartua", asmodians: "Immortal Gartua" },
    kind: "Field",
    modes: [
      {
        name: "Boss loot",
        dropIds: ["gartua"],
        rewardConditionId: "field-boss",
      },
    ],
  },
  {
    id: "argo",
    name: "Executor Argo; Argo, the Spirit King",
    kind: "Lower Reshanta",
    modes: [{ name: "Boss loot", totalItemLevel: 1000, dropIds: ["argo"] }],
  },
  {
    id: "true-dragon-lord",
    name: {
      elyos: "True Dragon Lord crafting",
      asmodians: "Star line crafting",
    },
    kind: "Crafting",
    modes: [
      {
        name: "Crafting",
        dropIds: ["true-dragon-lord", "splendent-true-dragon-lord"],
      },
    ],
  },
  {
    id: "fire-temple",
    name: "Fire Temple",
    kind: "Expedition",
    modes: [
      {
        name: "Conquest",
        totalItemLevel: 2100,
        dropIds: ["enraged-kromede"],
        rewardConditionId: "conquest",
        pityId: "conquest-86",
      },
      {
        name: "Exploration",
        dropIds: [],
        rewardConditionId: "exploration",
        pityId: "exploration",
      },
    ],
  },
  {
    id: "ferocious-horn-den",
    name: "Ferocious Horn Den",
    kind: "Expedition",
    modes: [
      {
        name: "Conquest",
        totalItemLevel: 2100,
        dropIds: ["nuakum"],
        rewardConditionId: "conquest",
        pityId: "conquest-86",
      },
      {
        name: "Exploration",
        totalItemLevel: 2100,
        dropIds: ["nuakum"],
        rewardConditionId: "exploration",
        pityId: "exploration",
      },
    ],
  },
  {
    id: "nahma",
    name: "Guardian Lord Nahma",
    kind: "Lower Reshanta",
    modes: [{ name: "Boss loot", totalItemLevel: 1000, dropIds: ["nahma"] }],
  },
  {
    id: "white-dragon-lord",
    name: {
      elyos: "White Dragon Lord crafting",
      asmodians: "Dark line crafting",
    },
    kind: "Crafting",
    modes: [
      {
        name: "Crafting",
        dropIds: ["white-dragon-lord", "splendent-white-dragon-lord"],
      },
    ],
  },
  {
    id: "wise-dragon-lord",
    name: {
      elyos: "Wise Dragon Lord crafting",
      asmodians: "Ebony line crafting",
    },
    kind: "Crafting",
    modes: [
      {
        name: "Crafting",
        dropIds: ["wise-dragon-lord", "splendent-wise-dragon-lord"],
      },
    ],
  },
  {
    id: "ludra",
    name: "Abyssal Forge: Ludra",
    kind: "Raid",
    modes: [
      {
        name: "Raid",
        totalItemLevel: 2800,
        dropIds: ["abyssal", "ludra"],
        rewardConditionId: "raid",
      },
    ],
  },
  {
    id: "growth",
    name: "Silent Graveyard; Fafnite Amphitheater",
    kind: "Growth",
    modes: [
      {
        name: "Growth",
        dropIds: [],
        materials: ["Soul Crystals", "Enhance Stones", "Shulak Loot Bundles"],
        rewardConditionId: "growth",
      },
    ],
  },
  {
    id: "ascension-trial",
    name: "Ascension Trial",
    kind: "Ascension Trial",
    modes: [
      {
        name: "Easy",
        totalItemLevel: 1000,
        dropIds: [],
        materials: ASCENSION_MATERIALS,
        rewardConditionId: "ascension-trial",
      },
      {
        name: "Normal",
        totalItemLevel: 1500,
        dropIds: [],
        materials: ASCENSION_MATERIALS,
        rewardConditionId: "ascension-trial",
      },
      {
        name: "Hard",
        totalItemLevel: 2000,
        dropIds: [],
        materials: ASCENSION_MATERIALS,
        rewardConditionId: "ascension-trial",
      },
      {
        name: "Extreme",
        totalItemLevel: 2500,
        dropIds: [],
        materials: ASCENSION_MATERIALS,
        rewardConditionId: "ascension-trial",
      },
    ],
  },
  {
    id: "transcendence",
    name: "Deus Research Base; Shattered Arkanis",
    kind: "Transcendence",
    modes: [
      {
        name: "Tier 1",
        totalItemLevel: 1600,
        dropIds: [],
        materials: ["Arcana"],
        rewardConditionId: "transcendence",
      },
      {
        name: "Tier 2",
        totalItemLevel: 1900,
        dropIds: [],
        materials: ["Arcana"],
        rewardConditionId: "transcendence",
      },
      {
        name: "Tier 3",
        totalItemLevel: 2200,
        dropIds: [],
        materials: ["Arcana"],
        rewardConditionId: "transcendence",
      },
      {
        name: "Tier 4",
        totalItemLevel: 2500,
        dropIds: [],
        materials: ["Arcana"],
        rewardConditionId: "transcendence",
        condition: "Unique Chalice drops only in tier 4.",
      },
    ],
  },
];
