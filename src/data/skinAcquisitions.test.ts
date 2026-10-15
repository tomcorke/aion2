import { expect, test } from "vitest";
import {
  matchesSkin,
  nonFestivalSkinEntries,
  nonFestivalSkinPieceIds,
  skinAcquisitionSourceAdditions,
  skinAcquisitionSourceDetails,
  skinAcquisitionSources,
  skinAcquisitionsReviewed,
} from "./skinAcquisitions.ts";
import { sources } from "./sources.ts";
import { ownedCount, toggleOwned, validOwned } from "../lib/skinOwnership.ts";
import { skinEntries, skinPieceIds } from "./skins.ts";

// Canonical gear/skin-sources.md: retained complete catalogue, S128.
test("Skyfeather Guardian retains all seven independent appearance pieces", () => {
  const guardian = nonFestivalSkinEntries.find(
    ({ id }) => id === "skyfeather-guardian",
  );

  expect(guardian?.pieces.map(({ id, name }) => [id, name])).toEqual([
    ["skyfeather-guardian-helm", "Helm"],
    ["skyfeather-guardian-pauldrons", "Pauldrons"],
    ["skyfeather-guardian-breastplate", "Breastplate"],
    ["skyfeather-guardian-gloves", "Gloves"],
    ["skyfeather-guardian-greaves", "Greaves"],
    ["skyfeather-guardian-boots", "Boots"],
    ["skyfeather-guardian-cloak", "Cloak"],
  ]);
  expect(guardian?.category).toBe("outfit");
  expect(guardian?.sources).toContain("random-shop");
});

test("Sky Feather is a distinct complete outfit with only its own documented route", () => {
  const skyFeather = nonFestivalSkinEntries.find(
    ({ id }) => id === "sky-feather",
  );

  expect(skyFeather?.name).toBe("Sky Feather");
  expect(skyFeather?.aliases).toContain("◆Sky Feather");
  expect(skyFeather?.pieces.map(({ id }) => id)).toEqual([
    "sky-feather-helm",
    "sky-feather-pauldrons",
    "sky-feather-breastplate",
    "sky-feather-gloves",
    "sky-feather-greaves",
    "sky-feather-boots",
    "sky-feather-cloak",
  ]);
  expect(skyFeather?.sources).toEqual(["random-shop"]);
  expect(skyFeather?.acquisitions.map(({ source }) => source)).toEqual([
    "random-shop",
  ]);
});

// S38 full shop table, checked 2026-10-14. Accessories never enter the outfit total.
test.each([
  {
    id: "archon-centurion",
    pieces: 7,
    perPiece: [
      { currency: "Abyss Points", amount: 147100 },
      { currency: "Silver Medals of Merit", amount: 40 },
    ],
    total: [
      { currency: "Abyss Points", amount: 1029700 },
      { currency: "Silver Medals of Merit", amount: 280 },
    ],
  },
  {
    id: "archon-centurion-accessories",
    pieces: 2,
    perPiece: [
      { currency: "Abyss Points", amount: 294300 },
      { currency: "Silver Medals of Merit", amount: 80 },
    ],
    total: [
      { currency: "Abyss Points", amount: 588600 },
      { currency: "Silver Medals of Merit", amount: 160 },
    ],
  },
  {
    id: "archon-decanus",
    pieces: 7,
    perPiece: [{ currency: "Abyss Points", amount: 45300 }],
    total: [{ currency: "Abyss Points", amount: 317100 }],
  },
  {
    id: "archon-decanus-accessories",
    pieces: 2,
    perPiece: [{ currency: "Abyss Points", amount: 90600 }],
    total: [{ currency: "Abyss Points", amount: 181200 }],
  },
])(
  "$id retains every documented currency without mixing categories",
  ({ id, pieces, perPiece, total }) => {
    const entry = nonFestivalSkinEntries.find((entry) => entry.id === id);
    const offer = entry?.acquisitions.find(
      ({ source }) => source === "abyss-shop",
    );

    expect(entry?.pieces).toHaveLength(pieces);
    expect(offer?.prices).toHaveLength(pieces);
    for (const { costs } of offer?.prices ?? [])
      expect(costs).toEqual(perPiece);
    expect(offer?.total).toEqual(total);
    expect(offer?.limit).toEqual({
      quantity: 1,
      scope: "character",
      appliesTo: "piece",
    });
    expect(offer?.condition).toContain("not rank requirements");
    expect(offer?.condition).toContain("0.0.4387.0");
  },
);

// S129/S130 alternate routes are piece-specific; the owner saw the Breastplate panel only.
test("Guardian routes retain their own piece coverage, costs and loss warnings", () => {
  const guardian = nonFestivalSkinEntries.find(
    ({ id }) => id === "skyfeather-guardian",
  )!;
  const route = (id: string) =>
    guardian.acquisitions.find((route) => route.id === id);

  expect(guardian.sources).toEqual([
    "random-shop",
    "extraction",
    "chest",
    "skin-combine",
  ]);
  expect(route("extraction")?.pieceIds).toHaveLength(7);
  expect(route("extraction")?.condition).toContain("Divine Canyon");
  expect(route("extraction")?.condition).toContain("Urugugu Canyon");
  expect(route("extraction")?.condition).toContain(
    "other six pieces are inferred",
  );
  expect(route("extraction")?.warnings?.join(" ")).toContain(
    "costs Kina and always destroys the gear item",
  );
  expect(route("extraction")?.warnings?.join(" ")).toContain(
    "exact Kina cost is not recorded",
  );
  expect(route("extraction")?.prices).toBeUndefined();
  expect(route("extraction")?.costs).toBeUndefined();
  expect(route("bound-skin-chest")?.pieceIds).toEqual([
    "skyfeather-guardian-helm",
    "skyfeather-guardian-breastplate",
  ]);
  expect(route("bound-skin-chest")?.condition).toContain(
    "origin is unresolved",
  );
  expect(route("reward-chest")?.pieceIds).toEqual([
    "skyfeather-guardian-breastplate",
  ]);
  expect(route("reward-chest")?.condition).toContain(
    "identity and origin are unresolved",
  );
  expect(route("rare-skin-combine")?.pieceIds).toEqual([
    "skyfeather-guardian-cloak",
  ]);
  expect(route("rare-skin-combine")?.costs).toEqual([
    { currency: "Kina", amount: 1000 },
  ]);
  expect(route("epic-skin-combine")?.costs).toEqual([
    { currency: "Kina", amount: 6000 },
  ]);
  expect(route("rare-skin-combine")?.condition).toContain("20%");
  expect(route("epic-skin-combine")?.condition).toContain("85%");
  expect(route("epic-skin-combine")?.condition).toContain(
    "not the chance of this particular Cloak",
  );
});

test("search and each source filter match aliases without merging the two Skyfeather names", () => {
  const results = (
    query: string,
    source: Parameters<typeof matchesSkin>[2] = "all",
  ) =>
    nonFestivalSkinEntries
      .filter((entry) => matchesSkin(entry, query, source))
      .map(({ id }) => id);

  expect(results("  SKYFEATHER  ")).toEqual(["skyfeather-guardian"]);
  expect(results("◆Sky Feather")).toEqual(["sky-feather"]);
  expect(results("sky feather", "extraction")).toEqual([]);
  expect(results("Guardian Centurion", "abyss-shop")).toEqual([
    "archon-centurion",
    "archon-centurion-accessories",
  ]);
  expect(results("top", "random-shop")).toEqual([
    "skyfeather-guardian",
    "sky-feather",
  ]);

  for (const source of [
    "random-shop",
    "extraction",
    "chest",
    "skin-combine",
  ] as const)
    expect(results("skyfeather", source)).toEqual(["skyfeather-guardian"]);

  expect(matchesSkin(skinEntries[0]!, "shoulders", "festival")).toBe(true);
  expect(matchesSkin(skinEntries[0]!, "lightpath", "chest")).toBe(false);
});

test("the opt-in source additions and metadata retain actual source checks", () => {
  const registry = { ...sources, ...skinAcquisitionSourceAdditions };

  expect(skinAcquisitionsReviewed).toBe("2026-10-14");
  expect(skinAcquisitionSourceDetails).toMatchObject({
    metabotSkyfeatherGuardian: { checkedDate: "2026-10-14" },
    metabotSkyFeather: { checkedDate: "2026-10-14" },
    metabotAbyssTradeShop: { checkedDate: "2026-10-14" },
    wikilySkyfeatherGuardian: {
      checkedDate: "2026-10-14",
      accessNote: expect.stringContaining("Region unstated"),
    },
    fextralifeSkyfeatherGuardianCloak: { checkedDate: "2026-10-14" },
    metabotDivineCanyon: { checkedDate: "2026-10-12" },
    gamerBlurbBlackCloud: { checkedDate: "2026-10-11" },
  });
  expect(skinAcquisitionSourceAdditions).not.toHaveProperty(
    "wikilySkyfeatherGuardian",
  );
  expect(skinAcquisitionSources).toContain("wikilySkyfeatherGuardian");
  expect(skinAcquisitionSources).toContain("ownChecks");

  for (const id of skinAcquisitionSources) expect(registry[id]).toBeDefined();

  for (const { acquisitions } of nonFestivalSkinEntries) {
    for (const route of acquisitions) {
      for (const id of route.sourceIds)
        expect(skinAcquisitionSources).toContain(id);
    }
  }
});

test("new stable IDs extend validation without retiring or resetting saved Festival ticks", () => {
  const known = new Set([...skinPieceIds, ...nonFestivalSkinPieceIds]);
  const stored = [
    "lightpath-trace-helm",
    "spirit-wings-appearance",
    "sky-feather-cloak",
    "archon-centurion-breastplate",
    "retired",
    4,
  ];
  const owned = validOwned(stored, known);

  expect(nonFestivalSkinPieceIds.size).toBe(32);
  expect(known.size).toBe(53);
  expect(owned).toEqual([
    "lightpath-trace-helm",
    "spirit-wings-appearance",
    "sky-feather-cloak",
    "archon-centurion-breastplate",
  ]);
  expect(toggleOwned(owned, "sky-feather-cloak")).toEqual([
    "lightpath-trace-helm",
    "spirit-wings-appearance",
    "archon-centurion-breastplate",
  ]);
  expect(ownedCount(skinEntries[0]!.pieces, owned)).toBe(1);
});
