import type { SkinEntry, SkinSource } from "./skins.ts";
import type { Source, SourceId } from "./sources.ts";

// Opt-in catalogue from canonical gear/skin-sources.md; Festival's API stays unchanged.
export const skinAcquisitionsReviewed = "2026-10-14";

export const skinAcquisitionSourceAdditions = {
  metabotSkyfeatherGuardian: {
    name: "MetaBot Skyfeather Guardian set",
    covers: "All seven appearance pieces and the listed random-shop source",
    url: "https://metabot.gg/en/aion-2/skins/sets/skyfeather-guardian",
  },
  metabotSkyFeather: {
    name: "MetaBot Sky Feather set",
    covers:
      "The distinct seven-piece Sky Feather appearance and random-shop source",
    url: "https://metabot.gg/en/aion-2/skins/sets/sky-feather",
  },
  metabotAbyssTradeShop: {
    name: "MetaBot Abyss Trade Shop",
    covers:
      "Complete Centurion and Decanus skin prices, currencies and per-character piece limits",
    url: "https://metabot.gg/en/aion-2/shops/trade-shop",
  },
  metabotDivineCanyon: {
    name: "MetaBot Divine Canyon armor",
    covers:
      "Divine Canyon gear sources and the model shared with Skyfeather Guardian",
    url: "https://metabot.gg/en/aion-2/items/divine-canyon-breastplate",
  },
  fextralifeSkyfeatherGuardianCloak: {
    name: "Fextralife Skyfeather Guardian Cloak",
    covers: "Cloak Skin Combine route, attempt costs and grade-result chances",
    url: "https://aion2.wiki.fextralife.com/Skyfeather_Guardian_Cloak",
  },
  gamerBlurbBlackCloud: {
    name: "GamerBlurb Black Cloud Merchant guide",
    covers: "Hourly per-character stock rotation",
    url: "https://gamerblurb.com/guides/aion-2-black-cloud-merchant-guide",
  },
} satisfies Record<string, Source>;

export type SkinAcquisitionSourceId =
  SourceId | keyof typeof skinAcquisitionSourceAdditions;

// Source checks, not build dates. S128/S38/S129/S130 were rechecked on 14 October;
// the gear-model and random-shop-rotation checks remain S139's 12th and S132's 11th.
export const skinAcquisitionSourceDetails = {
  metabotSkyfeatherGuardian: { checkedDate: "2026-10-14" },
  metabotSkyFeather: { checkedDate: "2026-10-14" },
  metabotAbyssTradeShop: {
    checkedDate: "2026-10-14",
    accessNote:
      "Complete client shop table read; not a live purchase or rank-gate audit.",
  },
  wikilySkyfeatherGuardian: {
    checkedDate: "2026-10-14",
    accessNote:
      "Region unstated. Helm listing rechecked; the bound chest's origin remains unresolved.",
  },
  fextralifeSkyfeatherGuardianCloak: {
    checkedDate: "2026-10-14",
    accessNote:
      "Grade-result odds are not odds of the specific Cloak; region unstated.",
  },
  metabotDivineCanyon: {
    checkedDate: "2026-10-12",
    accessNote:
      "Matching gear model does not independently verify extraction panels for all seven pieces.",
  },
  gamerBlurbBlackCloud: { checkedDate: "2026-10-11" },
} satisfies Partial<
  Record<SkinAcquisitionSourceId, { checkedDate: string; accessNote?: string }>
>;

export type SkinAcquisitionSource =
  "random-shop" | "skin-combine" | "extraction" | "chest" | "abyss-shop";

export const skinAcquisitionSourceLabels: Record<
  SkinAcquisitionSource,
  string
> = {
  "random-shop": "Black Cloud random shop",
  "skin-combine": "Skin Combine",
  extraction: "Extract Skin",
  chest: "Skin chests",
  "abyss-shop": "Abyss Trade Shop",
};

export type SkinCost = {
  currency:
    "Abyss Points" | "Silver Medals of Merit" | "Kina" | "Centuryroot Tokens";
  amount: number;
};

export type SkinPiecePrice = { pieceId: string; costs: SkinCost[] };

export type SkinAcquisition = {
  id: string;
  source: SkinAcquisitionSource;
  name: string;
  pieceIds: string[];
  condition: string;
  // Prices are exact per-piece offers; costs are per attempt, not a guaranteed skin.
  prices?: SkinPiecePrice[];
  total?: SkinCost[];
  costs?: SkinCost[];
  limit?: SkinEntry["limit"];
  warnings?: string[];
  sourceIds: SkinAcquisitionSourceId[];
};

export type SkinAppearancePiece = {
  id: string;
  name: string;
  aliases?: string[];
};

export type SkinAcquisitionEntry = {
  id: string;
  name: string;
  category: SkinEntry["category"];
  aliases: string[];
  pieces: SkinAppearancePiece[];
  sources: SkinAcquisitionSource[];
  acquisitions: SkinAcquisition[];
};

type SearchableSkin = {
  name: string;
  aliases?: string[];
  pieces: { name: string; aliases?: string[] }[];
  sources: (SkinSource | SkinAcquisitionSource)[];
};

// The existing Festival entries also satisfy this public search boundary unchanged.
export function matchesSkin(
  entry: SearchableSkin,
  query: string,
  source: SkinSource | SkinAcquisitionSource | "all" = "all",
) {
  const text = query.trim().toLowerCase();
  const names = [
    entry.name,
    ...(entry.aliases ?? []),
    ...entry.pieces.flatMap(({ name, aliases = [] }) => [name, ...aliases]),
  ];

  return (
    (source === "all" || entry.sources.includes(source)) &&
    names.some((name) => name.toLowerCase().includes(text))
  );
}

const armorSlots = [
  { name: "Helm" },
  { name: "Pauldrons" },
  { name: "Breastplate", aliases: ["Top"] },
  { name: "Gloves" },
  { name: "Greaves", aliases: ["Legs"] },
  { name: "Boots", aliases: ["Shoes"] },
  { name: "Cloak" },
];

function appearancePieces(
  id: string,
  slots = armorSlots,
): SkinAppearancePiece[] {
  return slots.map((slot) => ({
    ...slot,
    id: `${id}-${slot.name.toLowerCase()}`,
  }));
}

const guardianPieces = appearancePieces("skyfeather-guardian");
const skyFeatherPieces = appearancePieces("sky-feather");

function abyssEntry(
  appearance: "Centurion" | "Decanus",
  category: "outfit" | "accessory",
  costs: SkinCost[],
): SkinAcquisitionEntry {
  const suffix = category === "accessory" ? "-accessories" : "";
  const id = `archon-${appearance.toLowerCase()}${suffix}`;
  const slots =
    category === "outfit"
      ? armorSlots
      : [{ name: "Necklace" }, { name: "Earrings" }];
  const pieces = appearancePieces(id, slots);

  return {
    id,
    name: `Archon ${appearance}${category === "accessory" ? " accessories" : ""}`,
    category,
    aliases: [appearance, `Guardian ${appearance}`],
    pieces,
    sources: ["abyss-shop"],
    acquisitions: [
      {
        id: "abyss-shop",
        source: "abyss-shop",
        name: `Abyss → Trade Shop → Skins → Archon ${appearance}`,
        pieceIds: pieces.map(({ id }) => id),
        prices: pieces.map(({ id }) => ({ pieceId: id, costs })),
        total: costs.map(({ currency, amount }) => ({
          currency,
          amount: amount * pieces.length,
        })),
        limit: { quantity: 1, scope: "character", appliesTo: "piece" },
        condition: `Archon ${appearance} and Guardian ${appearance} are shop category labels, not rank requirements. Prices and piece limits are from Global client build 0.0.4387.0; recheck the live shop before spending. Earrings prices were not visible in the owner's screenshots. Totals exclude acquiring medals and other costs.`,
        sourceIds: ["metabotAbyssTradeShop", "metabotMethodology", "ownChecks"],
      },
    ],
  };
}

export const nonFestivalSkinEntries: SkinAcquisitionEntry[] = [
  {
    id: "skyfeather-guardian",
    name: "Skyfeather Guardian",
    category: "outfit",
    aliases: [],
    pieces: guardianPieces,
    sources: ["random-shop", "extraction", "chest", "skin-combine"],
    acquisitions: [
      {
        id: "random-shop",
        source: "random-shop",
        name: "Black Cloud Merchants",
        pieceIds: guardianPieces.map(({ id }) => id),
        condition:
          "The random shop lists all seven pieces in Global client build 0.0.4387.0. Stock rotates hourly per character. Item prices and purchase currency are not recorded; check the live stock before spending.",
        sourceIds: [
          "metabotSkyfeatherGuardian",
          "metabotMethodology",
          "gamerBlurbBlackCloud",
        ],
      },
      {
        id: "extraction",
        source: "extraction",
        name: "Extract Skin from Divine Canyon armor",
        pieceIds: guardianPieces.map(({ id }) => id),
        condition:
          "Divine Canyon gear drops in the Urugugu Canyon party dungeon. The Breastplate's Source Information names Extract Skin from Divine Canyon Breastplate; the other six pieces are inferred from their matching models, not individually checked extraction panels.",
        warnings: [
          "Extract Skin costs Kina and always destroys the gear item. The exact Kina cost is not recorded.",
        ],
        sourceIds: ["metabotDivineCanyon", "metabotMethodology", "ownChecks"],
      },
      {
        id: "bound-skin-chest",
        source: "chest",
        name: "Skin Chest (10 times) (Bound)",
        pieceIds: [
          "skyfeather-guardian-helm",
          "skyfeather-guardian-breastplate",
        ],
        condition:
          "Listed for Helm and Breastplate; the chest's origin is unresolved. This does not establish chest sources for the other five pieces.",
        sourceIds: ["wikilySkyfeatherGuardian", "ownChecks"],
      },
      {
        id: "reward-chest",
        source: "chest",
        name: "Reward Chest",
        pieceIds: ["skyfeather-guardian-breastplate"],
        condition:
          "The Breastplate's Source Information lists Reward Chest, but its identity and origin are unresolved. No other piece contents are established here.",
        sourceIds: ["ownChecks"],
      },
      {
        id: "rare-skin-combine",
        source: "skin-combine",
        name: "Skin Combine: Rare skins",
        pieceIds: ["skyfeather-guardian-cloak"],
        costs: [{ currency: "Kina", amount: 1000 }],
        condition:
          "The Cloak is listed in Skin Combine. Combining Rare skins has a 20% Epic result chance, not the chance of this particular Cloak. The Kina cost is per attempt, not a guaranteed purchase price.",
        sourceIds: ["fextralifeSkyfeatherGuardianCloak"],
      },
      {
        id: "epic-skin-combine",
        source: "skin-combine",
        name: "Skin Combine: Epic skins",
        pieceIds: ["skyfeather-guardian-cloak"],
        costs: [{ currency: "Kina", amount: 6000 }],
        condition:
          "The Cloak is listed in Skin Combine. Combining Epic skins has an 85% Epic result chance, not the chance of this particular Cloak. The Kina cost is per attempt, not a guaranteed purchase price.",
        sourceIds: ["fextralifeSkyfeatherGuardianCloak"],
      },
    ],
  },
  {
    id: "sky-feather",
    name: "Sky Feather",
    category: "outfit",
    aliases: ["◆Sky Feather"],
    pieces: skyFeatherPieces,
    sources: ["random-shop"],
    acquisitions: [
      {
        id: "random-shop",
        source: "random-shop",
        name: "Black Cloud Merchants",
        pieceIds: skyFeatherPieces.map(({ id }) => id),
        condition:
          "This is the separate ◆Sky Feather appearance, not Skyfeather Guardian. The random shop lists all seven pieces in Global client build 0.0.4387.0. Stock rotates hourly per character. Item prices and purchase currency are not recorded; check the live stock before spending.",
        sourceIds: [
          "metabotSkyFeather",
          "metabotMethodology",
          "gamerBlurbBlackCloud",
        ],
      },
    ],
  },
  abyssEntry("Centurion", "outfit", [
    { currency: "Abyss Points", amount: 147100 },
    { currency: "Silver Medals of Merit", amount: 40 },
  ]),
  abyssEntry("Centurion", "accessory", [
    { currency: "Abyss Points", amount: 294300 },
    { currency: "Silver Medals of Merit", amount: 80 },
  ]),
  abyssEntry("Decanus", "outfit", [
    { currency: "Abyss Points", amount: 45300 },
  ]),
  abyssEntry("Decanus", "accessory", [
    { currency: "Abyss Points", amount: 90600 },
  ]),
];

export const nonFestivalSkinPieceIds = new Set(
  nonFestivalSkinEntries.flatMap(({ pieces }) => pieces.map(({ id }) => id)),
);

export const skinAcquisitionSources: SkinAcquisitionSourceId[] = [
  ...new Set(
    nonFestivalSkinEntries.flatMap(({ acquisitions }) =>
      acquisitions.flatMap(({ sourceIds }) => sourceIds),
    ),
  ),
];
