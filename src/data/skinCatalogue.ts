import {
  nonFestivalSkinEntries,
  type SkinAppearancePiece,
} from "./skinAcquisitions.ts";
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
  const acquisitions = shopAcquisitions(offers);
  const unknownPieceIds = pieces
    .filter((piece) => !offers.some(({ pieceId }) => pieceId === piece.id))
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
      ...attribution(offers.map(({ sourceId }) => sourceId)),
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
];

export const skinCataloguePieceIds = new Set(
  skinCatalogueEntries.flatMap(({ pieces }) => pieces.map(({ id }) => id)),
);
