import catalogue from "./petCatalogue.json";
import type { Source } from "./sources.ts";

// Curated from aion2-knowledge: collections/pets.md and its pet-catalogue.json.
// The pet note and map screenshots were reviewed on 2026-11-01.
export const petsReviewed = "2026-11-01";

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

const metabotMountsUrl = "https://metabot.gg/en/aion-2/mounts";
const allthingsPetsUrl =
  "https://allthings.how/aion-2-how-to-unlock-any-pet-by-farming-pet-souls/";
const metabotWingsGuideUrl =
  "https://metabot.gg/en/aion-2/guides/mounts-wings-guide";

export const petsAttribution = [
  { name: "MetaBot mounts list", url: metabotMountsUrl },
  ...pets.map(({ id, name }) => ({
    name: `MetaBot ${name}`,
    url: `${metabotMountsUrl}/${id}`,
  })),
  { name: "allthings.how pet souls guide", url: allthingsPetsUrl },
  { name: "MetaBot mounts, pets and wings guide", url: metabotWingsGuideUrl },
];

export const petRegions: { id: PetRegionId; title: string }[] = [
  { id: "verteron", title: "Verteron" },
  { id: "altgard", title: "Altgard" },
  { id: "lower-reshanta", title: "Chaotic Lower Reshanta" },
  { id: "middle-reshanta", title: "Chaotic Middle Reshanta" },
  { id: "dungeons", title: "Party dungeons" },
  { id: "other", title: "Morheim and Eltnen" },
];

export const petLevels = [1, 2, 3] as const;

export type PetLevelNumber = (typeof petLevels)[number];

// Souls to reach each level, from guides rather than the client data.
export const petLevelSouls: Record<PetLevelNumber, string> = {
  1: "5 souls",
  2: "+25 souls",
  3: "+75 souls",
};

// A pet's stats are its creature type's bonus; each level adds to the one before.
// Level-2 Fera and Cogni values, and the Varian sprint value, follow the pattern of the confirmed Natura line.
export const petStats: Record<PetType, Record<PetLevelNumber, string[]>> = {
  Fera: {
    1: ["Mount Ground Move Speed +1"],
    2: ["Mount Ground Move Speed +2", "Accuracy Bonus +1"],
    3: ["Mount Ground Move Speed +3", "Accuracy Bonus +2", "Dexterity +1"],
  },
  Natura: {
    1: ["Stamina +3"],
    2: ["Stamina +6", "Critical Hit Resist +1"],
    3: ["Stamina +9", "Critical Hit Resist +2", "Precision +1"],
  },
  Varian: {
    1: ["Mount Sprint Stamina Cost Reduction Rate +0.1%"],
    2: ["Mount Sprint Stamina Cost Reduction Rate +0.2%", "Evasion Bonus +1"],
    3: [
      "Mount Sprint Stamina Cost Reduction Rate +0.3%",
      "Evasion Bonus +2",
      "Constitution +1",
    ],
  },
  Cogni: {
    1: ["HP +10"],
    2: ["HP +20", "Critical Hit +1"],
    3: ["HP +30", "Critical Hit +2", "Might +1"],
  },
  Special: { 1: [], 2: [], 3: [] },
};

export const petSourceAdditions = {
  communityVerteronMap: {
    name: "AION 2 Verteron map screenshot in a PlayNC community post",
    covers: "In-game Verteron map screenshot used to trace the coastline",
    url: "https://aion2.plaync.com/ko-kr/board/free/view?articleId=69244e2370242475d98d79bc",
  },
  communityAltgardMap: {
    name: "AION 2 Altgard map screenshot in a PlayNC community post",
    covers: "In-game Altgard map screenshot used to trace the coastline",
    url: "https://aion2.plaync.com/ko-kr/board/free/view?articleId=692f28c74c9bde5d1e43d269",
  },
  communityLowerReshantaMap: {
    name: "AION 2 Lower Reshanta map screenshot in a PlayNC community post",
    covers:
      "In-game Lower Reshanta map screenshot used to trace the island layout",
    url: "https://aion2.plaync.com/ko-kr/board/qnanknowhow/view?articleId=6976c8396e34171f43667f70",
  },
  communityMiddleReshantaMap: {
    name: "AION 2 Middle Reshanta map screenshot in a PlayNC community post",
    covers:
      "In-game Middle Reshanta map screenshot used to trace the island layout",
    url: "https://aion2.plaync.com/ko-kr/board/free/view?articleId=697473ac45cf4961507b106b",
  },
  metabotPets: {
    name: "MetaBot mounts list and pet pages",
    covers:
      "The pet roster, creature-type bonuses, soul-dropping monsters and their zones, chest and shop sources",
    url: metabotMountsUrl,
  },
  allthingsPets: {
    name: "allthings.how pet souls guide",
    covers: "Souls for pet levels 2 and 3, and Natura and Varian level stats",
    url: allthingsPetsUrl,
  },
} satisfies Record<string, Source>;

export const petsSources = [
  "communityVerteronMap",
  "communityAltgardMap",
  "communityLowerReshantaMap",
  "communityMiddleReshantaMap",
  "metabotPets",
  "allthingsPets",
  "metabotWings",
] as const;

export const petsLimits = [
  "Verteron, Altgard and Reshanta coastlines are approximations traced from in-game map screenshots. Morheim and Eltnen outlines are schematic placeholders. Pet data has no zone coordinates, so area markers remain approximate. Many pets drop only on the other faction's map.",
  "Level 2 and 3 soul costs come from guides, not from the client data. The level-2 stats for Fera and Cogni, and the Varian sprint stat, follow the confirmed Natura pattern.",
  "Morheim and Eltnen are in the client data; whether they are open on Global was not checked. Quai Campsite and Sanctum Dumpsite are placed on Altgard by inference.",
  "How stats add up when you own several pets of one type is not settled, so the page does not total them.",
  "Five Special pets (Chonky Hamster, Little Ghost, Pumpkin Carriage, Two and White Bunny) list no way to get them and are left out.",
];
