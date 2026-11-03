import {
  nonFestivalSkinEntries,
  type SkinAppearancePiece,
} from "./skinAcquisitions.ts";
import { currentGlobalSkinOfferEntries } from "./currentGlobalSkinOffers.ts";
import reference from "./skinCatalogueReference.json";
import { skinCatalogueAttribution } from "./skinCatalogueMetadata.ts";
import type {
  SkinCatalogueAcquisition,
  SkinCatalogueCost,
  SkinCatalogueEntry,
  SkinCatalogueKind,
  SkinCatalogueSource,
} from "./skinCatalogueTypes.ts";
import { skinEntries } from "./skins.ts";
import { sources, type SourceId } from "./sources.ts";

export { skinCatalogueAttribution } from "./skinCatalogueMetadata.ts";

type Offer = {
  pieceId: string;
  source: "nightmare-shop" | "season-shop" | "pass-shop" | "abyss-shop";
  sourceId: SourceId;
  name: string;
  costs: SkinCatalogueCost[];
  endDate?: string;
};

type Reference = {
  id: string;
  kind: SkinCatalogueKind;
  name: string;
  pieces: SkinAppearancePiece[];
  offers: Offer[];
};

function attribution(ids: SourceId[]) {
  return [...new Set(ids)].flatMap((id) => {
    const source = sources[id];

    return "url" in source && source.url
      ? [{ name: source.name, url: source.url }]
      : [];
  });
}

function totalCosts(offers: Offer[]) {
  const totals = new Map<SkinCatalogueCost["currency"], number>();

  for (const { costs } of offers) {
    for (const { currency, amount } of costs) {
      totals.set(currency, (totals.get(currency) ?? 0) + amount);
    }
  }

  return [...totals].map(([currency, amount]) => ({ currency, amount }));
}

const armorSlots = [
  "Breastplate",
  "Greaves",
  "Helm",
  "Pauldrons",
  "Gloves",
  "Boots",
  "Cloak",
];

type ExtractionDefinition = {
  name: string;
  sourceItems: Record<string, string>;
  sourceNote: string;
  sourceIds: SourceId[];
};

const armorItems = (setName: string) =>
  Object.fromEntries(armorSlots.map((slot) => [slot, `${setName} ${slot}`]));

const extractionDefinitions: Record<string, ExtractionDefinition> = {
  "hidden-escaper": {
    name: "K'nash armor pieces → Hidden Escaper",
    sourceItems: armorItems("K'nash"),
    sourceNote:
      "The item pages list all seven pieces as drops from level 45 Sentinel K'nash in Verteron.",
    sourceIds: ["aion2ggKnashSkinItems"],
  },
  "forest-guardian": {
    name: "Gartua armor pieces → Forest Guardian",
    sourceItems: armorItems("Gartua"),
    sourceNote:
      "The item pages list Eternal Gartua and Immortal Gartua, level 51, as the sources.",
    sourceIds: ["aion2ggFieldBossSkinItems"],
  },
  "anguished-darkness": {
    name: "Dartan armor pieces → Anguished Darkness",
    sourceItems: armorItems("Dartan"),
    sourceNote:
      "The item pages list Silent Dartan, level 48, at two places as the source.",
    sourceIds: ["aion2ggFieldBossSkinItems"],
  },
  "forgotten-recon-team": {
    name: "Kashapa armor pieces → Forgotten Recon Team",
    sourceItems: armorItems("Kashapa"),
    sourceNote:
      "The item pages list level 48 Soul Ruler Kashapa as the source.",
    sourceIds: ["aion2ggFieldBossSkinItems"],
  },
  "draconic-rage": {
    name: "High Commander Lagta armor pieces → Draconic Rage",
    sourceItems: armorItems("High Commander Lagta"),
    sourceNote:
      "The item pages list High Commander Lagta, level 48, at two places as the source.",
    sourceIds: ["aion2ggFieldBossSkinItems"],
  },
  "appearance-dewy-forest-earrings": {
    name: "Gartua Earrings → Dewy Forest",
    sourceItems: { Earrings: "Gartua Earrings" },
    sourceNote:
      "The item page lists Eternal Gartua and Immortal Gartua, level 51, as the sources.",
    sourceIds: ["aion2ggFieldBossSkinItems"],
  },
  "appearance-moon-circle-earrings": {
    name: "Dartan Earrings → Moon Circle",
    sourceItems: { Earrings: "Dartan Earrings" },
    sourceNote:
      "The item page lists Silent Dartan, level 48, at two places as the source. Dartan Necklace is not listed as an obtainable boss drop.",
    sourceIds: ["aion2ggFieldBossSkinItems"],
  },
  "appearance-wind-droplet-earrings": {
    name: "Kashapa Earrings → Wind Droplet",
    sourceItems: { Earrings: "Kashapa Earrings" },
    sourceNote:
      "The item page lists level 48 Soul Ruler Kashapa as the source.",
    sourceIds: ["aion2ggFieldBossSkinItems"],
  },
  "appearance-temple-guardian-earrings": {
    name: "High Commander Lagta Earrings → Temple Guardian",
    sourceItems: { Earrings: "High Commander Lagta Earrings" },
    sourceNote:
      "The item page lists High Commander Lagta, level 48, at two places as the source.",
    sourceIds: ["aion2ggFieldBossSkinItems"],
  },
  "appearance-auldor-s-feather-necklace": {
    name: "Divine Canyon Necklace → Auldor's Feather",
    sourceItems: { Necklace: "Divine Canyon Necklace" },
    sourceNote:
      "The Necklace is listed in Urugugu Canyon Conquest reward-cube rolls and its Accessory Selection Chest; the named sources are Divine Auldor, Guardian Captain Raur and Judge Urahum.",
    sourceIds: ["aion2ggUruguguSkinItems"],
  },
  "appearance-auldor-s-feather-earrings": {
    name: "Divine Canyon Earrings → Auldor's Feather",
    sourceItems: { Earrings: "Divine Canyon Earrings" },
    sourceNote:
      "The Earrings are listed in Urugugu Canyon Conquest reward-cube rolls and its Accessory Selection Chest; the named sources are Divine Auldor, Guardian Captain Raur and Judge Urahum.",
    sourceIds: ["aion2ggUruguguSkinItems"],
  },
  "appearance-dusk-grove-necklace": {
    name: "Aulamus Necklace → Dusk Grove",
    sourceItems: { Necklace: "Aulamus Necklace" },
    sourceNote:
      "The Necklace is listed in Urugugu Canyon Conquest reward-cube rolls and its Accessory Selection Chest. Later-marked sources are not established as open in EU/NA.",
    sourceIds: ["aion2ggUruguguSkinItems"],
  },
  "appearance-dusk-grove-earrings": {
    name: "Aulamus Earrings → Dusk Grove",
    sourceItems: { Earrings: "Aulamus Earrings" },
    sourceNote:
      "The Earrings are listed in Urugugu Canyon Conquest reward-cube rolls and its Accessory Selection Chest. Later-marked sources are not established as open in EU/NA.",
    sourceIds: ["aion2ggUruguguSkinItems"],
  },
  "ruinous-devourer": {
    name: "Vakron armor pieces → Ruinous Devourer",
    sourceItems: armorItems("Vakron"),
    sourceNote:
      "The item pages list Vakron Sky Island Exploration and Conquest reward-cube sources, with Vakron, Thamon and Tiere among the named sources. Later-marked Abyssal Forge: Ludra entries are not current EU/NA farming advice. Vakron Guard has no Extract Skin entry and is excluded.",
    sourceIds: ["aion2ggVakronSkinItems"],
  },
  "howling-dragon": {
    name: "Transcendent armor pieces → Howling Dragon",
    sourceItems: armorItems("Transcendent"),
    sourceNote:
      "The item pages name Transcendent Armor Selection Chest (Bound) as the source. MetaBot labels the chest a Battle Pass reward, but no current pass tier or live offer is identified.",
    sourceIds: ["aion2ggUruguguSkinItems", "metabotTranscendentChest"],
  },
};

function extractionAcquisitions(entry: Reference): SkinCatalogueAcquisition[] {
  const definition = extractionDefinitions[entry.id];

  if (!definition) return [];

  const mappings = entry.pieces.flatMap((piece) => {
    const slot = piece.aliases?.find(
      (alias) => alias in definition.sourceItems,
    );
    const item = slot ? definition.sourceItems[slot] : undefined;

    return item ? [{ piece, item }] : [];
  });

  if (!mappings.length) return [];

  return [
    {
      id: "item-extraction",
      source: "extraction",
      name: definition.name,
      pieceIds: mappings.map(({ piece }) => piece.id),
      condition: `Client-derived Global EU/NA item-use records list these matching-slot Extract Skin mappings: ${mappings
        .map(({ item, piece }) => `${item} → ${piece.name}`)
        .join("; ")}. ${definition.sourceNote}`,
      warnings: ["Extract Skin consumes the source gear and may fail."],
      sourceIds: definition.sourceIds,
    },
  ];
}

function shopAcquisitions(offers: Offer[]): SkinCatalogueAcquisition[] {
  return [...new Set(offers.map(({ source }) => source))].map((source) => {
    const group = offers.filter((offer) => offer.source === source);
    const { name, sourceId, endDate } = group[0];
    const expiry = endDate
      ? ` The table lists an end date of ${endDate}, without an hour or time zone. This is not a verified live deadline.`
      : "";

    return {
      id: source,
      source,
      name,
      pieceIds: group.map(({ pieceId }) => pieceId),
      prices: group.map(({ pieceId, costs }) => ({ pieceId, costs })),
      total: totalCosts(group),
      limit: { quantity: 1, scope: "character", appliesTo: "piece" },
      condition: `Prices and one-per-character piece limits come from reported Global client build 0.0.4387.0, not a live shop audit. Recheck the shop before spending. Totals cover only the listed pieces and exclude earning currencies and other costs.${expiry}`,
      sourceIds: [sourceId],
    };
  });
}

function referenceEntry(entry: Reference): SkinCatalogueEntry {
  const { id, kind, name, pieces, offers } = entry;
  const extractions = extractionAcquisitions(entry);
  const acquisitions = [...shopAcquisitions(offers), ...extractions];
  const unknownPieceIds = pieces
    .filter(
      (piece) =>
        !acquisitions.some((route) => route.pieceIds.includes(piece.id)),
    )
    .map(({ id }) => id);
  const category =
    kind === "accessory" || kind === "vanity" ? "accessory" : "outfit";
  const knownSources = acquisitions.map(({ source }) => source);
  const entrySources: SkinCatalogueSource[] = unknownPieceIds.length
    ? [...knownSources, "unknown"]
    : knownSources;

  return {
    id,
    kind,
    name,
    category: kind === "wing" ? "wing" : category,
    aliases: [],
    pieces,
    acquisitions,
    sources: entrySources,
    unknownPieceIds,
    attribution: [
      skinCatalogueAttribution[kind === "wing" ? 1 : 0],
      ...attribution([
        ...offers.map(({ sourceId }) => sourceId),
        ...extractions.flatMap(({ sourceIds }) => sourceIds),
      ]),
    ],
  };
}

// One-off projection of canonical e4b7db0, with no assets, set-source inference or runtime knowledge-repo dependency.
export const skinCatalogueEntries: SkinCatalogueEntry[] = [
  ...skinEntries.map((entry): SkinCatalogueEntry => ({
    ...entry,
    kind: entry.category === "outfit" ? "costume" : entry.category,
    aliases: [],
    acquisitions: [],
    unknownPieceIds: [],
    attribution: attribution(entry.sourceIds),
    festivalPurchase: entry,
  })),
  ...nonFestivalSkinEntries.map((entry): SkinCatalogueEntry => ({
    ...entry,
    kind: entry.category === "outfit" ? "costume" : entry.category,
    unknownPieceIds: [],
    attribution: attribution(
      entry.acquisitions.flatMap(({ sourceIds }) => sourceIds),
    ),
  })),
  ...(reference as Reference[]).map(referenceEntry),
  ...currentGlobalSkinOfferEntries,
];

export const skinCataloguePieceIds = new Set(
  skinCatalogueEntries.flatMap(({ pieces }) => pieces.map(({ id }) => id)),
);
