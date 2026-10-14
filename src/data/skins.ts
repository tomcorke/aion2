import { festivalPurchases, type FestivalPurchase } from "./festival.ts";
import type { SourceId } from "./sources.ts";

// Curated from aion2-knowledge: events/shugo-festival/skin-prices.md and basics/alts.md.
// The newest of those notes was reviewed 2026-10-12; copying them is not a new live check.
export const skinsReviewed = "2026-10-12";

export type SkinSource = "festival";

export const skinSourceLabels: Record<SkinSource, string> = {
  festival: "Shugo Festival shop",
};

export type SkinEntry = FestivalPurchase & { sources: SkinSource[] };

// Festival entries are the shared purchase records, so the IDs and prices match the Festival page.
export const skinEntries: SkinEntry[] = festivalPurchases.map((purchase) => ({
  ...purchase,
  sources: ["festival"],
}));

export const skinPieceIds = new Set(
  skinEntries.flatMap(({ pieces }) => pieces.map(({ id }) => id)),
);

export const skinCategories: {
  category: SkinEntry["category"];
  label: string;
}[] = [
  { category: "outfit", label: "Outfits" },
  { category: "accessory", label: "Accessories" },
  { category: "wing", label: "Wings" },
];

export const skinSharing = {
  closet:
    "Closet appearances are available to every character on the same server. That does not show whether a skin's owned stats also reach alts.",
  wings:
    "Unlocked wings stay with the character that unlocked them; they are not shared like Closet appearances.",
};

export const skinsSources: SourceId[] = [
  ...new Set(festivalPurchases.flatMap(({ sourceIds }) => sourceIds)),
  "gameTruthAlts",
  "gamerBlurbShared",
  "ownChecks",
];
