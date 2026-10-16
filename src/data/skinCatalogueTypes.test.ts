// @vitest-environment node
import { expectTypeOf, test } from "vitest";
import type {
  SkinAcquisition,
  SkinAppearancePiece,
} from "./skinAcquisitions.ts";
import type { SkinEntry } from "./skins.ts";
import type {
  SkinCatalogueAcquisition,
  SkinCatalogueEntry,
} from "./skinCatalogueTypes.ts";

test("existing acquisitions and piece interfaces remain compatible", () => {
  expectTypeOf<SkinAcquisition>().toExtend<SkinCatalogueAcquisition>();
  expectTypeOf<
    SkinCatalogueEntry["pieces"][number]
  >().toEqualTypeOf<SkinAppearancePiece>();
  expectTypeOf<
    NonNullable<SkinCatalogueEntry["festivalPurchase"]>
  >().toEqualTypeOf<SkinEntry>();
});
