import type { Source } from "./sources.ts";
import type {
  SkinCatalogueAttribution,
  SkinCatalogueKind,
  SkinCatalogueSource,
} from "./skinCatalogueTypes.ts";

// Canonical knowledge e4b7db0; inventory review and external checks are separate retained fields.
export const skinCatalogueReviewed = "2026-11-02";
export const skinCatalogueSourceChecked = "2026-11-01";
export const skinCatalogueBuild =
  "Global 0.0.4387.0, as reported by MetaBot.GG";

export const skinCatalogueScope =
  "This catalogue has 1,063 appearance pieces: 1,008 retained from MetaBot's 16 October Global inventory snapshot (980 non-weapon skin rows plus 28 separately indexed wings), and 55 appearances named in the 13 and 28 October Global shop notices. MetaBot's 1 November skin index reports 1,501 entries, including 489 weapons and 1,012 non-weapon skin rows, plus 123 costume sets; Wings are indexed separately. These counts do not reconcile. Shop notices document advertised offers, not current stock or client-file inclusion. Weapons are not listed.";

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
  "global-offer": "Current Global offers",
  unknown: "Source not recorded",
};

export const skinCatalogueSourceAdditions = {
  metabotSkinInventory: {
    name: "MetaBot.GG skin inventory",
    covers:
      "Global inventory names, slots, costume membership and the differing 1 November index totals; not live availability or complete acquisition routes",
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
  {
    name: "NC Global skin and pet offers, 13 October 2026",
    url: "https://lounge.plaync.com/feed/83799?country=US&locale=en-US",
  },
  {
    name: "NC Global skin and pet offers, 28 October 2026",
    url: "https://steamcommunity.com/app/3393110/allnews/",
  },
];

export const skinCatalogueLimitations = [
  "The 55 appearance records named by the official shop notices are kept separate from the 1,008 records retained from the older inventory snapshot. The notice does not establish client-file presence or live availability.",
  "A set's source category does not verify every piece's route. Pieces without a recorded route remain listed with that gap.",
  "Random-shop prices, cube and ranking requirements, complete recipes and alternate extraction panels are not fully audited. Unknown costs are not zero.",
  "Client shop tables and dated offer notices are not a live availability check. Older acquisition sources retain their original check dates.",
];
