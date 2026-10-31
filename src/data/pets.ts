import catalogue from "./petCatalogue.json";
import type { Source } from "./sources.ts";

// Curated from aion2-knowledge: collections/pets.md and its pet-catalogue.json.
// The note was reviewed 2026-10-31; the source pages were read the same day.
export const petsReviewed = "2026-10-31";

export const petTypes = [
  "Fera",
  "Natura",
  "Varian",
  "Cogni",
  "Special",
] as const;

export type PetType = (typeof petTypes)[number];

export type PetRegionId =
  | "verteron"
  | "altgard"
  | "lower-reshanta"
  | "middle-reshanta"
  | "dungeons"
  | "other";

export type Pet = {
  id: string;
  name: string;
  type: PetType;
  // IDs of the areas where monsters drop its souls.
  areas: string[];
  // Ways to get it that are not a map area, such as chests or shops.
  other: string[];
};

export type PetArea = {
  id: string;
  name: string;
  region: PetRegionId;
  entrance?: string;
};

export const pets = catalogue.pets as Pet[];

export const petAreas = catalogue.areas as PetArea[];

export const petRegions: { id: PetRegionId; title: string }[] = [
  { id: "verteron", title: "Verteron" },
  { id: "altgard", title: "Altgard" },
  { id: "lower-reshanta", title: "Lower Reshanta" },
  { id: "middle-reshanta", title: "Middle Reshanta" },
  { id: "dungeons", title: "Party dungeons" },
  { id: "other", title: "Morheim and Eltnen" },
];

export const petLevels = [1, 2, 3] as const;

export type PetLevelNumber = (typeof petLevels)[number];

export const petLevelLabels: Record<PetLevelNumber, string> = {
  1: "Level 1: pet unlocked, 5 souls",
  2: "Level 2: +25 souls",
  3: "Level 3: max, +75 souls",
};

// A pet's stats are its creature type's bonus; each level adds to the one before.
// Level-2 Fera, Cogni and Varian values follow the pattern of the confirmed Natura line.
export const petStats: Record<PetType, Record<PetLevelNumber, string[]>> = {
  Fera: {
    1: ["Ground speed +1"],
    2: ["Ground speed +2", "Accuracy +1"],
    3: ["Ground speed +3", "Accuracy +2", "Dexterity +1"],
  },
  Natura: {
    1: ["Stamina +3"],
    2: ["Stamina +6", "Critical Hit Resist +1"],
    3: ["Stamina +9", "Critical Hit Resist +2", "Precision +1"],
  },
  Varian: {
    1: ["Sprint stamina cost reduction +0.1%"],
    2: ["Sprint stamina cost reduction +0.2%", "Evasion +1"],
    3: ["Sprint stamina cost reduction +0.3%", "Evasion +2", "Constitution +1"],
  },
  Cogni: {
    1: ["HP +10"],
    2: ["HP +20", "Critical Hit +1"],
    3: ["HP +30", "Critical Hit +2", "Might +1"],
  },
  Special: { 1: [], 2: [], 3: [] },
};

export const petSourceAdditions = {
  metabotPets: {
    name: "MetaBot mounts list and pet pages",
    covers:
      "The pet roster, creature-type bonuses, soul-dropping monsters and their zones, chest and shop sources",
    url: "https://metabot.gg/en/aion-2/mounts",
  },
  allthingsPets: {
    name: "allthings.how pet souls guide",
    covers: "Souls for pet levels 2 and 3, and Natura and Varian level stats",
    url: "https://allthings.how/aion-2-how-to-unlock-any-pet-by-farming-pet-souls/",
  },
} satisfies Record<string, Source>;

export const petsSources = [
  "metabotPets",
  "allthingsPets",
  "metabotWings",
] as const;

export const petsLimits = [
  "The map is a layout of named zones, not a scaled drawing. Many pets drop only on the other faction's map.",
  "Level 2 and 3 soul costs come from guides, not from the client data. Fera, Cogni and Varian level-2 stats follow the confirmed Natura pattern.",
  "How stats add up when you own several pets of one type is not settled, so the page does not total them.",
  "Five Special pets (Chonky Hamster, Little Ghost, Pumpkin Carriage, Two and White Bunny) list no way to get them and are left out.",
];
