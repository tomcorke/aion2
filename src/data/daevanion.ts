import type { SourceId } from "./sources.ts";

// Global client build 0.0.4387.0. Curated from combat/daevanion-class-routes.md,
// combat/spiritmaster-daevanion.md, combat/daevanion-retained-data.md and
// gear/azphel-board.md in aion2-knowledge main@4cf7488.
// Copying the notes does not advance their external source-check dates.
// Conservative common date for the Spiritmaster and Azphel notes; the class
// comparison was reviewed on 2026-10-11. No new external checks were made.
export const daevanionReviewed = "2026-10-10";

export const daevanionSources: SourceId[] = [
  "metabotGladiatorPlanner",
  "metabotTemplarPlanner",
  "metabotAssassinPlanner",
  "metabotRangerPlanner",
  "metabotSorcererPlanner",
  "metabotClericPlanner",
  "metabotChanterPlanner",
  "metabotSpiritmasterSkills",
  "metabotDaevanionClassSkills",
  "metabotDaevanion",
  "metabotSpiritmasterPlanner",
  "metabotMethodology",
];

export const daevanionCaveats = {
  emptyBoard:
    "These routes start from an empty board. They are not the cheapest continuation from nodes you already own.",
  estimates:
    "Skill priorities come from tooltips, not a damage simulation. PvE route costs are search estimates and are not proven minimal or optimal builds.",
  cleric:
    "Cleric routes target damage, not a healing build. Healing Enhancement, Healing Light, Light of Regeneration, Radiant Benediction and Radiant Recovery become priorities for healing; Damage + utility includes them.",
};

export const daevanionPools = {
  pve: {
    boardIds: ["nezekan", "zikel", "vaizel", "triniel"],
    description: "The four PvE boards share one Daevanion point pool.",
  },
  azphel: {
    boardIds: ["azphel"],
    description:
      "Azphel uses its own Azphel crystals. It never spends points from the four PvE boards.",
  },
} as const;

export const azphelOverview = {
  boardId: "azphel",
  classSpecific: false,
  variantId: "hp-mp-first",
  description:
    "Azphel has no skill nodes. All classes share the HP/MP-first route, followed by the Status Effect continuation; the three PvE variants do not apply.",
  phases: [
    {
      id: "hp-mp",
      label: "HP and MP first",
      cost: 36,
      cumulativeCost: 36,
      hp: 400,
      mp: 200,
      description:
        "Take all four HP +100 and four MP +50 nodes. The 36-point phase is an exact minimum from an empty board.",
    },
    {
      id: "status-effects",
      label: "Status Effect continuation",
      cost: 78,
      cumulativeCost: 114,
      description:
        "Continue to include all eight Status Effect Chance +1% and eight Status Effect Resist +1% targets. Some Status Effect nodes are already connectors in the first phase. The 114-point full route is the best found, not proven minimal.",
    },
  ],
  statusEffectCaveat:
    "Status Effect nodes have no PvP label, but their value against PvE monsters and bosses is not confirmed.",
  alternativeAllTargetsCost: 110,
  alternativeCaveat:
    "An alternative search found all 24 non-PvP targets for 110 points, not proven minimal. It spends 44 points before completing HP and MP, so it is not the HP/MP-first route.",
} as const;

export const daevanionBoards = [
  { id: "nezekan", name: "Nezekan", opensAt: 12, fullCost: 134, pool: "pve" },
  { id: "zikel", name: "Zikel", opensAt: 20, fullCost: 134, pool: "pve" },
  { id: "vaizel", name: "Vaizel", opensAt: 30, fullCost: 134, pool: "pve" },
  { id: "triniel", name: "Triniel", opensAt: 40, fullCost: 168, pool: "pve" },
  { id: "azphel", name: "Azphel", opensAt: 45, fullCost: 232, pool: "azphel" },
] as const;

export type DaevanionBoardId = (typeof daevanionBoards)[number]["id"];
export type PveBoardId = Exclude<DaevanionBoardId, "azphel">;

export const daevanionVariants = [
  {
    id: "damage",
    label: "Damage",
    description: "Every damage node, with connectors.",
  },
  {
    id: "utility",
    label: "Damage + utility",
    description: "Every skill node and every damage stat.",
  },
  {
    id: "defense",
    label: "Damage + HP/Defense/defensive skills",
    description: "Every damage node, HP and Defense node, and defensive skill.",
  },
] as const;

export type DaevanionVariantId = (typeof daevanionVariants)[number]["id"];
export type DaevanionRoute = {
  total: number;
  boardCosts: Record<PveBoardId, number>;
};

export type DaevanionClassId =
  | "gladiator"
  | "templar"
  | "assassin"
  | "ranger"
  | "sorcerer"
  | "spiritmaster"
  | "cleric"
  | "chanter";

export type DaevanionClass = {
  id: DaevanionClassId;
  name: string;
  routes: Record<DaevanionVariantId, DaevanionRoute>;
  skills: Record<"core" | "damage" | "utility" | "defensive", string[]>;
  damageNote: string;
};

// The notes explicitly say utility targets occupy the same positions for every
// class. Spiritmaster's recorded board breakdown therefore applies to all eight.
const utilityRoute: DaevanionRoute = {
  total: 446,
  boardCosts: { nezekan: 113, zikel: 106, vaizel: 103, triniel: 124 },
};

const otherDamage =
  "The damage group includes damage passives, core rotation skills and other damage skills. Their phase priorities are estimates from tooltips, not measured damage rankings.";

export const daevanionClasses: DaevanionClass[] = [
  {
    id: "gladiator",
    name: "Gladiator",
    skills: {
      core: ["Attack Preparation"],
      damage: [
        "Identify Weakness",
        "Impact Hit",
        "Murderous Burst",
        "Destructive Impulse",
        "Experienced Counterstrike",
        "Ruinous Blow",
        "Aerial Snare",
        "Ankle Slice",
        "Crushing Wave",
        "Keen Strike",
        "Leaping Slam",
        "Mocking Blade",
        "Overhead Slam",
        "Rending Blow",
        "Rush Strike",
        "Sword Aura Rampage",
      ],
      utility: ["Defiance", "Survival Willpower", "Blood Absorption"],
      defensive: ["Survival Stance", "Protection Armor"],
    },
    damageNote: otherDamage,
    routes: {
      damage: {
        total: 409,
        boardCosts: { nezekan: 100, zikel: 100, vaizel: 93, triniel: 116 },
      },
      utility: utilityRoute,
      defense: {
        total: 458,
        boardCosts: { nezekan: 114, zikel: 103, vaizel: 106, triniel: 135 },
      },
    },
  },
  {
    id: "templar",
    name: "Templar",
    skills: {
      core: ["Fury"],
      damage: [
        "Punishing Benediction",
        "Impact Hit",
        "Insulting Roar",
        "Punishment",
        "Judgment",
        "Annihilate",
        "Debilitating Smash",
        "Flash Rampage",
        "Pummel",
        "Shield Rush",
        "Shield Smite",
        "Vicious Strike",
        "Warding Strike",
        "Poach",
      ],
      utility: ["Defiance", "Survival Willpower"],
      defensive: [
        "Enhance Health",
        "Ironclad Defense",
        "Block Pain",
        "Guarding Seal",
        "Warding Shield",
      ],
    },
    damageNote: otherDamage,
    routes: {
      damage: {
        total: 397,
        boardCosts: { nezekan: 98, zikel: 96, vaizel: 89, triniel: 114 },
      },
      utility: utilityRoute,
      defense: {
        total: 464,
        boardCosts: { nezekan: 117, zikel: 103, vaizel: 108, triniel: 136 },
      },
    },
  },
  {
    id: "assassin",
    name: "Assassin",
    skills: {
      core: ["Assault Stance", "Rear Smite"],
      damage: [
        "Exploit Weakness",
        "Impact Hit",
        "Ambush Stance",
        "Apply Poison",
        "Defense Break",
        "Determination",
        "Insignia Explosion",
        "Heart Gore",
        "Ambush",
        "Flash Slice",
        "Infiltrate",
        "Quick Slice",
        "Savage Roar",
        "Shadow Fall",
        "Shadowstrike",
        "Storm Rampage",
        "Whirlwind Slice",
      ],
      utility: ["Defiance", "Revitalization Contract"],
      defensive: ["Heightened Sixth Sense"],
    },
    damageNote: otherDamage,
    routes: {
      damage: {
        total: 422,
        boardCosts: { nezekan: 107, zikel: 100, vaizel: 97, triniel: 118 },
      },
      utility: utilityRoute,
      defense: {
        total: 464,
        boardCosts: { nezekan: 117, zikel: 103, vaizel: 108, triniel: 136 },
      },
    },
  },
  {
    id: "ranger",
    name: "Ranger",
    skills: {
      core: ["Focused Eye", "Hunter's Resolve"],
      damage: [
        "Hunter's Soul",
        "Concentrated Fire",
        "Melee Fire",
        "Rooting Eye",
        "Deadshot",
        "Gale Arrow",
        "Marking Shot",
        "Arrow Scattershot",
        "Burst Arrow",
        "Drill Dart",
        "Explosion Trap",
        "Snare Shot",
        "Snipe",
        "Suppressing Arrow",
        "Tempest Shot",
      ],
      utility: [
        "Defiance",
        "Revitalization Contract",
        "Unyielding Resolve",
        "Wind Vigor",
      ],
      defensive: ["Vigilant Eye"],
    },
    damageNote: otherDamage,
    routes: {
      damage: {
        total: 409,
        boardCosts: { nezekan: 103, zikel: 98, vaizel: 93, triniel: 115 },
      },
      utility: utilityRoute,
      defense: {
        total: 454,
        boardCosts: { nezekan: 114, zikel: 102, vaizel: 105, triniel: 133 },
      },
    },
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    skills: {
      core: ["Robe of Flame", "Grace of Enhancement"],
      damage: [
        "Fire Mark",
        "Cold Snap",
        "Vitality Evaporation",
        "Robe of Earth",
        "Wish of Concentration",
        "Hellfire",
        "Bittercold Wind",
        "Blaze",
        "Firestorm",
        "Flame Arrow",
        "Flame Scattershot",
        "Frost",
        "Frost Burst",
        "Ice Chain",
        "Winter's Shackles",
      ],
      utility: [
        "Defiance",
        "Revitalization Contract",
        "Grace of Resistance",
        "Absorb Essence",
      ],
      defensive: ["Robe of Cold"],
    },
    damageNote: otherDamage,
    routes: {
      damage: {
        total: 411,
        boardCosts: { nezekan: 109, zikel: 95, vaizel: 93, triniel: 114 },
      },
      utility: utilityRoute,
      defense: {
        total: 454,
        boardCosts: { nezekan: 114, zikel: 102, vaizel: 105, triniel: 133 },
      },
    },
  },
  {
    id: "spiritmaster",
    name: "Spiritmaster",
    skills: {
      core: ["Spirit Strike"],
      damage: [
        "Spirit's Descent",
        "Corrode",
        "Consecutive Countercurrent",
        "Element Unification",
        "Mental Focus",
        "Spirit Revitalization",
        "Elemental Fusion",
        "Jointstrike: Curse",
        "Dimensional Control",
        "Cold Shock",
        "Combustion",
        "Rapid Scattershot",
        "Soul's Cry",
        "Summon: Fire Spirit",
        "Summon: Water Spirit",
        "Summon: Wind Spirit",
      ],
      utility: [
        "Spirit Communion",
        "Revitalization Contract",
        "Defiance",
        "Summon: Earth Spirit",
      ],
      defensive: ["Spirit Protection"],
    },
    damageNote:
      "Spirit Strike is the core multiplier; the other skills listed under damage include Spirit Revitalization because faster summons are valuable. Summon: Earth Spirit is utility, not damage; Spirit Protection is defensive.",
    routes: {
      damage: {
        total: 409,
        boardCosts: { nezekan: 107, zikel: 95, vaizel: 92, triniel: 115 },
      },
      utility: utilityRoute,
      defense: {
        total: 453,
        boardCosts: { nezekan: 115, zikel: 102, vaizel: 103, triniel: 133 },
      },
    },
  },
  {
    id: "cleric",
    name: "Cleric",
    skills: {
      core: ["Earth's Grace", "Empyrean Lord's Grace"],
      damage: [
        "Chain of Torment",
        "Divine Aura",
        "Bolt",
        "Condemnation",
        "Debilitating Mark",
        "Earth's Retribution",
        "Judgment Thunder",
        "Lightning Strike Scattershot",
      ],
      utility: [
        "Defiance",
        "Survival Willpower",
        "Heal Block",
        "Prayer of Concentration",
        "Healing Enhancement",
        "Healing Light",
        "Light of Regeneration",
        "Radiant Benediction",
        "Radiant Recovery",
      ],
      defensive: [
        "Immortal Veil",
        "Warm Benediction",
        "Empyrean Lords' Benediction",
      ],
    },
    damageNote: otherDamage,
    routes: {
      damage: {
        total: 363,
        boardCosts: { nezekan: 90, zikel: 85, vaizel: 83, triniel: 105 },
      },
      utility: utilityRoute,
      defense: {
        total: 426,
        boardCosts: { nezekan: 107, zikel: 96, vaizel: 97, triniel: 126 },
      },
    },
  },
  {
    id: "chanter",
    name: "Chanter",
    skills: {
      core: ["Attack Preparation", "Earth's Promise", "Wind's Promise"],
      damage: [
        "Inspiring Spell",
        "Impact Hit",
        "Raging Spell",
        "Spinning Strike",
        "Incandescent Blow",
        "Dark Crush",
        "Impactful Crush",
        "Gust Rampage",
        "Heat Wave Blow",
        "Onslaught",
        "Rushing Smash",
        "Tremor Crush",
        "Wave Blow",
      ],
      utility: ["Defiance", "Survival Willpower", "Recuperation"],
      defensive: ["Blessing of Life", "Crossguard", "Protection Circle"],
    },
    damageNote: otherDamage,
    routes: {
      damage: {
        total: 400,
        boardCosts: { nezekan: 97, zikel: 98, vaizel: 90, triniel: 115 },
      },
      utility: utilityRoute,
      defense: {
        total: 456,
        boardCosts: { nezekan: 115, zikel: 101, vaizel: 106, triniel: 134 },
      },
    },
  },
];
