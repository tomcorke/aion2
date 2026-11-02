import { expect, test } from "vitest";
import { currentGlobalSkinOfferEntries } from "./currentGlobalSkinOffers.ts";
import {
  skinCatalogueEntries,
  skinCataloguePieceIds,
} from "./skinCatalogue.ts";

const offer = (id: string) =>
  currentGlobalSkinOfferEntries.find((entry) => entry.id === id)!;

test("retains all 55 notice-named pieces separately from the client snapshot", () => {
  expect(currentGlobalSkinOfferEntries).toHaveLength(33);
  expect(
    currentGlobalSkinOfferEntries.flatMap(({ pieces }) => pieces),
  ).toHaveLength(55);
  expect(skinCatalogueEntries).toHaveLength(347);
  expect(skinCataloguePieceIds.size).toBe(1063);
  expect(offer("monarch-of-blood").pieces.map(({ name }) => name)).toEqual([
    "Breastplate",
    "Greaves",
    "Helm",
    "Gloves",
    "Boots",
    "Cloak",
  ]);
  expect(offer("vulpine-sunshower").pieces).toHaveLength(6);
  expect(offer("no-nonsense-maid").pieces).toHaveLength(5);
  expect(offer("monarch-of-blood").attribution[0]?.url).toContain(
    "lounge.plaync.com/feed/83799",
  );
  expect(offer("vulpine-sunshower").attribution[0]?.url).toContain(
    "steamcommunity.com/app/3393110/allnews",
  );
});

test("records published set and piece prices, dates, and only stated limits", () => {
  const monarch = offer("monarch-of-blood").acquisitions[0]!;
  const spider = offer("spider-wings-offer").acquisitions[0]!;
  const maidWings = offer("maid-ribbon-wings").acquisitions[0]!;
  const decor = offer("tears-of-blood").acquisitions[0]!;
  const outfit = offer("no-nonsense-maid").acquisitions[0]!;

  expect(monarch.listedPrice).toEqual({
    amount: 29.99,
    currency: "USD",
    unit: "set",
  });
  expect(decor.listedPrice).toEqual({
    amount: 300,
    currency: "Quna",
    unit: "piece",
  });
  expect(outfit.condition).toContain("11 November CET");
  expect(offer("midnight-witch").acquisitions[0]?.condition).toContain(
    "25 November CET",
  );
  expect(maidWings.limit).toEqual({
    quantity: 1,
    scope: "character",
    appliesTo: "piece",
  });
  expect(spider.limit).toBeUndefined();
  expect(spider.condition).toContain("once per character");
  expect(spider.condition).toContain("once per server and level 10+");
  expect(spider.condition).toContain("cap is unresolved");

  for (const entry of currentGlobalSkinOfferEntries) {
    expect(entry.sources).toEqual(["global-offer"]);
    expect(entry.unknownPieceIds).toEqual([]);

    for (const route of entry.acquisitions) {
      expect(route.pieceIds).toEqual(entry.pieces.map(({ id }) => id));
      expect(route.sourceIds).toHaveLength(1);
    }
  }
});

test("keeps old ownership IDs unchanged and adds unique offer ticks", () => {
  const oldIds = [
    "lightpath-trace-helm",
    "spirit-wings-appearance",
    "sky-feather-cloak",
    "archon-centurion-breastplate",
  ];
  const newIds = currentGlobalSkinOfferEntries.flatMap(({ pieces }) =>
    pieces.map(({ id }) => id),
  );

  expect(new Set(newIds).size).toBe(55);
  expect(newIds.some((id) => oldIds.includes(id))).toBe(false);
  expect(oldIds.every((id) => skinCataloguePieceIds.has(id))).toBe(true);
});
