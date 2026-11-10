import {
  nonFestivalSkinEntries,
  type SkinAppearancePiece,
} from "./skinAcquisitions.ts";
import { currentGlobalSkinOfferEntries } from "./currentGlobalSkinOffers.ts";
import clientRouteData from "./skinCatalogueClientRoutes.json";
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

type ClientRouteSource =
  | {
      type: "monster";
      id: number;
      name: string;
      level: number;
      subtype: string;
    }
  | {
      type: "dungeon";
      id: number;
      name: string;
      difficulty: string;
    };

type ClientRouteGroup = {
  id: string;
  sources: string[];
  regions: { map: string; subzone: string }[];
  summary: string;
};

type ClientRouteMapping = {
  entryId: string;
  pieceId: string;
  itemId: number;
  itemName: string;
  routeGroupId: string;
};

type ClientRouteData = {
  mappings: ClientRouteMapping[];
  routeGroups: ClientRouteGroup[];
  sources: Record<string, ClientRouteSource>;
};

const clientRoutes = clientRouteData as ClientRouteData;
const clientRouteGroups = new Map(
  clientRoutes.routeGroups.map((group) => [group.id, group]),
);

function clientSourceLabel(source: ClientRouteSource) {
  if (source.type === "monster")
    return `${source.name} (level ${source.level})`;

  return source.difficulty === "None"
    ? source.name
    : `${source.name} (${source.difficulty})`;
}

function clientRouteTitle(group: ClientRouteGroup) {
  const sources = group.sources.map((id) => clientRoutes.sources[id]);
  const monsters = sources.filter(
    (source): source is Extract<ClientRouteSource, { type: "monster" }> =>
      source.type === "monster",
  );
  const dungeons = sources.filter(
    (source): source is Extract<ClientRouteSource, { type: "dungeon" }> =>
      source.type === "dungeon",
  );
  const areas = [...new Set(group.regions.map(({ map }) => map))];
  let monsterTitle = monsters.map(({ name }) => name).join(", ");

  if (monsters.length > 10) {
    const areaLabel = areas.length > 0 ? ` in ${areas.join(", ")}` : "";

    monsterTitle = `${monsters.length} monsters${areaLabel}`;
  }

  const dungeonTitle = dungeons.map(clientSourceLabel).join(", ");

  return `Gear from ${[monsterTitle, dungeonTitle].filter(Boolean).join("; ")}`;
}

function clientRouteAcquisition(
  group: ClientRouteGroup,
  mappings: ClientRouteMapping[],
  pieces: SkinAppearancePiece[],
): SkinCatalogueAcquisition {
  const pieceNames = new Map(pieces.map(({ id, name }) => [id, name]));
  const mappingLabels = mappings.map(
    ({ itemName, pieceId }) =>
      `${itemName} → ${pieceNames.get(pieceId) ?? pieceId}`,
  );

  return {
    id: `client-item-extraction-${group.id}`,
    source: "extraction",
    name: clientRouteTitle(group),
    pieceIds: [...new Set(mappings.map(({ pieceId }) => pieceId))],
    condition: `Extract Skin maps these gear items to the matching appearances: ${mappingLabels.join("; ")}. Item routes list these sources: ${group.summary}.`,
    warnings: ["Extract Skin consumes the source gear and may fail."],
    sourceIds: ["globalClientSkinRoutes"],
  };
}

function clientExtractionAcquisitions(
  entry: Reference,
): SkinCatalogueAcquisition[] {
  const byGroup = new Map<string, ClientRouteMapping[]>();

  for (const mapping of clientRoutes.mappings) {
    if (mapping.entryId !== entry.id) continue;

    const group = byGroup.get(mapping.routeGroupId) ?? [];

    group.push(mapping);
    byGroup.set(mapping.routeGroupId, group);
  }

  return [...byGroup].flatMap(([groupId, mappings]) => {
    const group = clientRouteGroups.get(groupId);

    return group ? [clientRouteAcquisition(group, mappings, entry.pieces)] : [];
  });
}

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
  "meteors-benediction": {
    name: "Barthien armor pieces to Meteor's Benediction",
    sourceItems: armorItems("Barthien"),
    sourceNote:
      "All seven pieces are listed as drops from level 45 Executioner Barthien.",
    sourceIds: ["globalClientSkinRoutes"],
  },
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

const observedAcquisitions: Record<string, SkinCatalogueAcquisition[]> = {
  "meteors-benediction": [
    {
      id: "meteor-helm-random-shop",
      source: "random-shop",
      name: "Black Cloud Merchants",
      pieceIds: ["meteors-benediction-helm"],
      condition:
        "Listed in the in-game Source Information panel for the Helm. Price and stock details are not recorded.",
      sourceIds: ["ownChecks"],
    },
    {
      id: "meteor-helm-reward-chest",
      source: "chest",
      name: "Reward Chest",
      pieceIds: ["meteors-benediction-helm"],
      condition:
        "Listed in the in-game Source Information panel for the Helm; the chest identity and origin are unknown.",
      sourceIds: ["ownChecks"],
    },
    {
      id: "meteor-helm-skin-chest",
      source: "chest",
      name: "Skin Chest (10 times) (Bound)",
      pieceIds: ["meteors-benediction-helm"],
      condition:
        "Listed in the in-game Source Information panel for the Helm; the chest's origin and other piece contents are unknown.",
      sourceIds: ["ownChecks"],
    },
  ],
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
      condition: `Client records list these matching-slot Extract Skin mappings: ${mappings
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
  const extractions = [
    ...extractionAcquisitions(entry),
    ...clientExtractionAcquisitions(entry),
  ];
  const acquisitions = [
    ...shopAcquisitions(offers),
    ...(observedAcquisitions[id] ?? []),
    ...extractions,
  ];
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

// Hand-curated from the retained inventory, with no assets or set-source inference.
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
