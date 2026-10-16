import type {
  SkinAcquisition,
  SkinAcquisitionSource,
  SkinAppearancePiece,
  SkinCost,
} from "./skinAcquisitions.ts";
import type { SkinEntry } from "./skins.ts";
import type { SourceId } from "./sources.ts";

export type SkinCatalogueKind =
  "costume" | "armor" | "accessory" | "vanity" | "wing";

export type SkinCatalogueSource =
  | SkinAcquisitionSource
  | "festival"
  | "nightmare-shop"
  | "season-shop"
  | "pass-shop"
  | "unknown";

export type SkinCatalogueCost = {
  currency:
    | SkinCost["currency"]
    | "Phantasmal Fragment"
    | "Oath Coin"
    | "Daeva Pass Shop Coin";
  amount: number;
};

export type SkinCatalogueAttribution = { name: string; url: string };

export type SkinCatalogueAcquisition = Omit<
  SkinAcquisition,
  "source" | "prices" | "total" | "costs" | "sourceIds"
> & {
  source: Exclude<SkinCatalogueSource, "unknown">;
  prices?: { pieceId: string; costs: SkinCatalogueCost[] }[];
  total?: SkinCatalogueCost[];
  costs?: SkinCatalogueCost[];
  sourceIds: SourceId[];
};

export type SkinCatalogueEntry = {
  id: string;
  kind: SkinCatalogueKind;
  name: string;
  category: SkinEntry["category"];
  aliases: string[];
  pieces: SkinAppearancePiece[];
  sources: SkinCatalogueSource[];
  acquisitions: SkinCatalogueAcquisition[];
  unknownPieceIds: string[];
  attribution: SkinCatalogueAttribution[];
  festivalPurchase?: SkinEntry;
};
