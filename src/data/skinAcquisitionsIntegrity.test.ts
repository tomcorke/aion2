import { expect, test } from "vitest";
import { nonFestivalSkinEntries } from "./skinAcquisitions.ts";

// Canonical gear/skin-sources.md retains these complete groups, not an exhaustive wardrobe.
test("the curated catalogue has complete supported pieces and no fabricated scalar prices", () => {
  expect(nonFestivalSkinEntries.map(({ id }) => id)).toEqual([
    "skyfeather-guardian",
    "sky-feather",
    "archon-centurion",
    "archon-centurion-accessories",
    "archon-decanus",
    "archon-decanus-accessories",
  ]);

  for (const entry of nonFestivalSkinEntries) {
    expect(entry.pieces.map(({ name }) => name)).toEqual(
      entry.category === "accessory"
        ? ["Necklace", "Earrings"]
        : [
            "Helm",
            "Pauldrons",
            "Breastplate",
            "Gloves",
            "Greaves",
            "Boots",
            "Cloak",
          ],
    );
    expect(entry).not.toHaveProperty("currency");
    expect(entry).not.toHaveProperty("total");
    expect(entry.sources).toEqual([
      ...new Set(entry.acquisitions.map(({ source }) => source)),
    ]);

    for (const piece of entry.pieces) {
      expect(piece).not.toHaveProperty("price");
      expect(
        entry.acquisitions.some(({ pieceIds }) => pieceIds.includes(piece.id)),
      ).toBe(true);
    }
  }
});

test.each(nonFestivalSkinEntries)(
  "$name routes reference their own pieces with valid exact costs",
  (entry) => {
    for (const route of entry.acquisitions) {
      expect(route.pieceIds.length).toBeGreaterThan(0);

      for (const id of route.pieceIds)
        expect(entry.pieces.some((piece) => piece.id === id)).toBe(true);

      if (route.prices) {
        expect(route.prices.map(({ pieceId }) => pieceId)).toEqual(
          route.pieceIds,
        );
      }

      for (const cost of [
        ...(route.costs ?? []),
        ...(route.prices?.flatMap(({ costs }) => costs) ?? []),
      ]) {
        expect(cost.amount).toBeGreaterThan(0);
        expect(Number.isFinite(cost.amount)).toBe(true);
      }
    }
  },
);
