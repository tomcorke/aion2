// @vitest-environment node
import { expect, test } from "vitest";
import {
  skinCatalogueEntries,
  skinCataloguePieceIds,
} from "./skinCatalogue.ts";
import { nonFestivalSkinEntries } from "./skinAcquisitions.ts";
import { skinEntries } from "./skins.ts";
import { sources } from "./sources.ts";
import { validOwned } from "../lib/skinOwnership.ts";

const entryById = (id: string) =>
  skinCatalogueEntries.find((entry) => entry.id === id)!;

test("covers the complete non-weapon reference without duplicate ownership records", () => {
  expect(skinCatalogueEntries).toHaveLength(314);
  expect(skinCataloguePieceIds.size).toBe(1008);
  expect(new Set(skinCatalogueEntries.map(({ id }) => id)).size).toBe(314);
  expect(
    skinCatalogueEntries.reduce(
      (count, { pieces }) => count + pieces.length,
      0,
    ),
  ).toBe(1008);
  expect(
    Object.fromEntries(
      ["costume", "armor", "accessory", "vanity", "wing"].map((kind) => [
        kind,
        skinCatalogueEntries.filter((entry) => entry.kind === kind).length,
      ]),
    ),
  ).toEqual({ costume: 119, armor: 43, accessory: 115, vanity: 9, wing: 28 });
  expect(
    skinCatalogueEntries
      .filter(({ kind }) => kind === "costume")
      .reduce((count, { pieces }) => count + pieces.length, 0),
  ).toBe(809);
});

test("preserves every legacy entry, label, route and all 53 saved ownership IDs", () => {
  const legacy = [...skinEntries, ...nonFestivalSkinEntries];
  const ids = legacy.flatMap(({ pieces }) => pieces.map(({ id }) => id));

  expect(legacy).toHaveLength(13);
  expect(ids).toHaveLength(53);
  expect(validOwned(ids, skinCataloguePieceIds)).toEqual(ids);

  for (const entry of legacy) {
    const actual = entryById(entry.id);

    expect(actual.name).toBe(entry.name);
    expect(actual.category).toBe(entry.category);
    expect(actual.pieces).toBe(entry.pieces);
    expect(actual.unknownPieceIds).toEqual([]);

    if ("acquisitions" in entry)
      expect(actual.acquisitions).toBe(entry.acquisitions);
    else expect(actual.festivalPurchase).toBe(entry);
  }
});

test("reuses all 21 canonical Festival prices and retains all 80 known shop offers", () => {
  const festival = skinCatalogueEntries.flatMap(
    ({ festivalPurchase }) => festivalPurchase?.pieces ?? [],
  );
  const otherOffers = skinCatalogueEntries.flatMap(({ acquisitions }) =>
    acquisitions.flatMap(({ prices }) => prices ?? []),
  );

  expect(festival).toHaveLength(21);
  expect(otherOffers).toHaveLength(59);

  for (const entry of skinEntries) {
    expect(entryById(entry.id).festivalPurchase).toBe(entry);
    expect(entryById(entry.id).festivalPurchase?.total).toBe(entry.total);
  }
});

test("set summaries never become piece-level acquisition claims", () => {
  for (const id of [
    "kromedes-desire",
    "dreamy-day-uniform",
    "promise-legion",
    "leather-crop-fit",
  ]) {
    const entry = entryById(id);

    expect(entry.acquisitions).toEqual([]);
    expect(entry.unknownPieceIds).toEqual(entry.pieces.map(({ id }) => id));
    expect(entry.sources).toEqual(["unknown"]);
  }

  expect(entryById("dreamy-day-uniform").pieces).toHaveLength(3);
  expect(entryById("shadow-slayer").pieces).toHaveLength(5);
  expect(entryById("snowy-sheer").pieces).toHaveLength(6);
});

test.each([
  [
    "awakened",
    "Phantasmal Fragment",
    {
      Helm: 6750,
      Boots: 6750,
      Breastplate: 10800,
      Greaves: 8000,
      Gloves: 5300,
      Cloak: 5300,
      Pauldrons: 6750,
    },
  ],
  [
    "eternal-horn",
    "Phantasmal Fragment",
    {
      Helm: 6750,
      Boots: 6750,
      Breastplate: 10800,
      Greaves: 8000,
      Gloves: 5300,
      Cloak: 5300,
      Pauldrons: 6750,
    },
  ],
  [
    "shadow-slayer",
    "Oath Coin",
    {
      Boots: 50400,
      Breastplate: 80400,
      Greaves: 60000,
      Gloves: 39600,
      Cloak: 39600,
    },
  ],
  [
    "floofy-shugo-friend",
    "Daeva Pass Shop Coin",
    { Helm: 7000, Boots: 8000, Breastplate: 30000 },
  ],
  [
    "mischievous-shugo",
    "Daeva Pass Shop Coin",
    { Helm: 7000, Boots: 8000, Breastplate: 30000 },
  ],
  [
    "appearance-ancient-barrier-earrings",
    "Phantasmal Fragment",
    { Earrings: 5300 },
  ],
  [
    "appearance-ancient-barrier-necklace",
    "Phantasmal Fragment",
    { Necklace: 6750 },
  ],
  [
    "appearance-sky-recollection-earrings",
    "Phantasmal Fragment",
    { Earrings: 5300 },
  ],
  [
    "appearance-sky-recollection-necklace",
    "Phantasmal Fragment",
    { Necklace: 6750 },
  ],
  ["appearance-heart-of-the-sun-earrings", "Oath Coin", { Earrings: 39600 }],
  ["appearance-heart-of-the-sun-necklace", "Oath Coin", { Necklace: 50400 }],
  ["appearance-light-crystal-earrings", "Oath Coin", { Earrings: 39600 }],
  ["appearance-light-crystal-necklace", "Oath Coin", { Necklace: 50400 }],
  [
    "appearance-warm-sunlight-shugo-earrings",
    "Daeva Pass Shop Coin",
    { Earrings: 4000 },
  ],
  [
    "appearance-warm-sunlight-shugo-necklace",
    "Daeva Pass Shop Coin",
    { Necklace: 5000 },
  ],
  [
    "appearance-urd-s-squirrel-shoulder",
    "Daeva Pass Shop Coin",
    { "Shoulder Wear": 12000 },
  ],
  ["conqueror-wings", "Phantasmal Fragment", { Wings: 20000 }],
  ["nightmare-wings", "Phantasmal Fragment", { Wings: 160000 }],
  ["talisra-wings", "Oath Coin", { Wings: 210000 }],
  ["warrior-wings", "Abyss Points", { Wings: 200000 }],
  ["brawler-wings", "Abyss Points", { Wings: 800000 }],
] as const)(
  "keeps every new piece-specific price for %s",
  (id, currency, expected) => {
    const entry = entryById(id);
    const route = entry.acquisitions[0];
    const prices = Object.fromEntries(
      route.prices!.map(({ pieceId, costs }) => {
        const piece = entry.pieces.find(({ id }) => id === pieceId)!;

        expect(costs).toHaveLength(1);
        expect(costs[0].currency).toBe(currency);

        return [piece.aliases![0], costs[0].amount];
      }),
    );

    expect(prices).toEqual(expected);
    expect(route.limit).toEqual({
      quantity: 1,
      scope: "character",
      appliesTo: "piece",
    });
  },
);

test("seasonal extracted dates are qualified, not advertised as live deadlines", () => {
  const routes = skinCatalogueEntries
    .flatMap(({ acquisitions }) => acquisitions)
    .filter(({ source }) => source === "season-shop" || source === "pass-shop");

  expect(routes).toHaveLength(11);

  for (const route of routes) {
    expect(route.condition).toContain("2026-12-16");
    expect(route.condition).toContain("without an hour or time zone");
    expect(route.condition).toContain("not a verified live deadline");
  }
});

test("routes and public attribution refer only to their actual pieces and sources", () => {
  for (const entry of skinCatalogueEntries) {
    const ids = entry.pieces.map(({ id }) => id);

    expect(entry.attribution.length).toBeGreaterThan(0);

    for (const { url } of entry.attribution) expect(url).toMatch(/^https:\/\//);
    for (const id of entry.unknownPieceIds) expect(ids).toContain(id);

    for (const route of entry.acquisitions) {
      expect(route.condition.length).toBeGreaterThan(20);
      expect(route.sourceIds.every((id) => id in sources)).toBe(true);
      expect(route.pieceIds.every((id) => ids.includes(id))).toBe(true);

      for (const price of route.prices ?? []) {
        expect(route.pieceIds).toContain(price.pieceId);
        expect(
          price.costs.every(
            ({ amount }) => Number.isInteger(amount) && amount > 0,
          ),
        ).toBe(true);
      }
    }
  }

  expect(JSON.stringify(skinCatalogueEntries)).not.toMatch(
    /https?:[^\s"]+\.(?:webp|glb)|rawInventoryRow|sha256|E:\/working/,
  );
});
