import { expect, test } from "vitest";
import { festivalPurchases } from "./festival.ts";
import { skinEntries, skinPieceIds } from "./skins.ts";

test("Festival entries are the shared purchase records, not copies", () => {
  for (const purchase of festivalPurchases) {
    const entry = skinEntries.find(({ id }) => id === purchase.id);

    expect(entry?.pieces).toBe(purchase.pieces);
    expect(entry?.total).toBe(purchase.total);
    expect(entry?.sources).toEqual(["festival"]);
  }
});

test("set totals cover only their own pieces", () => {
  for (const { pieces, total } of skinEntries)
    expect(pieces.reduce((sum, piece) => sum + piece.price, 0)).toBe(total);
});

test("outfits have seven pieces, accessory pairs two, wings one", () => {
  const counts = { outfit: 7, accessory: 2, wing: 1 };

  for (const { category, pieces } of skinEntries)
    expect(pieces).toHaveLength(counts[category]);
});

test("piece IDs are unique across the catalogue", () => {
  expect(skinPieceIds.size).toBe(
    skinEntries.flatMap(({ pieces }) => pieces).length,
  );
});
