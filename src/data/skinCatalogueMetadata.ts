import type { Source } from "./sources.ts";
import type {
  SkinCatalogueAttribution,
  SkinCatalogueKind,
  SkinCatalogueSource,
} from "./skinCatalogueTypes.ts";

// Canonical knowledge e4b7db0; inventory review and external checks are separate retained fields.
export const skinCatalogueReviewed = "2026-10-16";
export const skinCatalogueSourceChecked = "2026-10-16";
export const skinCatalogueBuild =
  "Global 0.0.4387.0, as reported by MetaBot.GG";

export const skinCatalogueKindLabels: Record<SkinCatalogueKind, string> = {
  costume: "Costume sets",
  armor: "Armour",
  accessory: "Accessories",
  vanity: "Vanity",
  wing: "Wings",
};

export const skinCatalogueSourceLabels: Record<SkinCatalogueSource, string> = {
  festival: "Shugo Festival shop",
  "random-shop": "Black Cloud random shop",
  "skin-combine": "Skin Combine",
  extraction: "Extract Skin",
  chest: "Skin chests",
  "abyss-shop": "Abyss Trade Shop",
  "nightmare-shop": "Nightmare Shop",
  "season-shop": "Season Shop",
  "pass-shop": "Daeva Pass Shop",
  unknown: "Source not recorded",
};

export const skinCatalogueSourceAdditions = {
  metabotSkinInventory: {
    name: "MetaBot.GG skin inventory",
    covers:
      "Global non-weapon names, slots and costume membership; not live availability or complete acquisition routes",
    url: "https://metabot.gg/en/aion-2/skins",
  },
  metabotWingInventory: {
    name: "MetaBot.GG wing inventory",
    covers:
      "All 28 indexed wings; source categories are not complete acquisition instructions",
    url: "https://metabot.gg/en/aion-2/wings",
  },
  metabotNightmareShop: {
    name: "MetaBot.GG Nightmare Shop",
    covers:
      "Piece-specific Phantasmal Fragment appearance prices and character limits",
    url: "https://metabot.gg/en/aion-2/shops/trade-shop-phantasmal-fragment",
  },
  metabotSeasonShop: {
    name: "MetaBot.GG Season Shop",
    covers:
      "Piece-specific Oath Coin appearance offers; extracted end date is not a verified live deadline",
    url: "https://metabot.gg/en/aion-2/shops/season-shop-oath-coin",
  },
  metabotDaevaPassShop: {
    name: "MetaBot.GG Daeva Pass Shop",
    covers:
      "Piece-specific Daeva Pass Shop Coin appearance offers and limits; not a live shop audit",
    url: "https://metabot.gg/en/aion-2/shops/pass-shop-daeva-pass-shop-coin",
  },
} satisfies Record<string, Source>;

export const skinCatalogueAttribution: SkinCatalogueAttribution[] = [
  skinCatalogueSourceAdditions.metabotSkinInventory,
  skinCatalogueSourceAdditions.metabotWingInventory,
  {
    name: "MetaBot.GG methodology",
    url: "https://metabot.gg/en/aion-2/methodology",
  },
];

export const skinCatalogueLimitations = [
  "This is a reference to 1,008 non-weapon appearances in reported Global client build 0.0.4387.0, not proof that each can be obtained now. Weapons are not listed.",
  "A set's source category does not verify every piece's route. Pieces without a recorded route remain listed with that gap.",
  "Random-shop prices, cube and ranking requirements, complete recipes and alternate extraction panels are not fully audited. Unknown costs are not zero.",
  "Shop prices and dates come from client tables, not a live availability check. Older acquisition notes retain their original source-check dates.",
];
