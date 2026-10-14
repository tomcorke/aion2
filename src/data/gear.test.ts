import { expect, test } from "vitest";
import { sources } from "./sources.ts";
import {
  gearActivities,
  gearDrops,
  gearPity,
  gearPityLimitations,
  gearReviewed,
  gearRewardConditions,
  gearSources,
  gearTiers,
} from "./gear.ts";

test("gear selections cover starter and the four supported piece-level tiers", () => {
  expect(
    gearTiers.map(({ id, pieceItemLevel }) => [id, pieceItemLevel]),
  ).toEqual([
    ["starter", undefined],
    ["54", 54],
    ["70", 70],
    ["86", 86],
    ["102", 102],
  ]);

  expect(gearTiers.map(({ nextTierId }) => nextTierId)).toEqual([
    "54",
    "70",
    "86",
    "102",
    undefined,
  ]);
});

test("local Conquest gates are totals, not the levels of their drops", () => {
  const rows = ["krao-cave", "urugugu-canyon", "fire-temple", "ludra"].map(
    (id) => gearActivities.find((activity) => activity.id === id),
  );

  expect(rows.map((activity) => activity?.modes[0].totalItemLevel)).toEqual([
    700, 1400, 2100, 2800,
  ]);
  expect(gearDrops.find(({ id }) => id === "rupture")?.pieceItemLevel).toBe(54);
  expect(gearDrops.find(({ id }) => id === "aulamus")?.pieceItemLevel).toBe(70);
  expect(
    gearDrops.find(({ id }) => id === "enraged-kromede")?.pieceItemLevel,
  ).toBe(86);
});

test("shared armor loot tables retain both modes and verified Exploration gates", () => {
  for (const [id, gate, dropId] of [
    ["draupnir", undefined, "bakarma"],
    ["vakron-sky-island", 1400, "vakron"],
    ["ferocious-horn-den", 2100, "nuakum"],
  ] as const) {
    const activity = gearActivities.find((row) => row.id === id);

    expect(activity?.modes.map(({ name, dropIds }) => [name, dropIds])).toEqual(
      [
        ["Conquest", [dropId]],
        ["Exploration", [dropId]],
      ],
    );
    expect(activity?.modes[1].totalItemLevel).toBe(gate);
  }

  expect(gearDrops.find(({ id }) => id === "bakarma")?.slots).toEqual([
    "Armor",
    "Guards",
  ]);
  expect(gearDrops.find(({ id }) => id === "berk")?.slots).toEqual([
    "Accessories",
  ]);
});

test("pity uses documented runs and only Exploration has a recorded membership multiplier", () => {
  expect(gearPity).toEqual([
    { id: "exploration", requiredRuns: 3, memberRunCredit: 2 },
    { id: "conquest-54", requiredRuns: 14 },
    { id: "conquest-70", requiredRuns: 21 },
    { id: "conquest-86", requiredRuns: 28 },
  ]);

  for (const [id, pityId] of [
    ["krao-cave", "conquest-54"],
    ["draupnir", "conquest-54"],
    ["urugugu-canyon", "conquest-70"],
    ["vakron-sky-island", "conquest-70"],
    ["fire-temple", "conquest-86"],
    ["ferocious-horn-den", "conquest-86"],
  ]) {
    const activity = gearActivities.find((row) => row.id === id);

    expect(activity?.modes.map((mode) => mode.pityId)).toEqual([
      pityId,
      "exploration",
    ]);
  }
});

test("reward conditions retain server-wide cube loss and distinguish known cube costs", () => {
  expect(
    gearRewardConditions.find(({ id }) => id === "conquest")?.notes.join(" "),
  ).toContain(
    "At 0, Conquest and Transcendence entry locks for every character on that server",
  );

  const cubes = gearActivities.flatMap(({ id, modes }) =>
    modes.flatMap(({ name, cubeOdyleEnergy }) =>
      cubeOdyleEnergy === undefined ? [] : [[id, name, cubeOdyleEnergy]],
    ),
  );

  expect(cubes).toEqual([
    ["krao-cave", "Exploration", 20],
    ["urugugu-canyon", "Exploration", 20],
  ]);
});

test("intermediate field, Lower Reshanta and crafted alternatives do not become entry tiers", () => {
  expect(gearActivities.find(({ id }) => id === "gartua")?.name).toEqual({
    elyos: "Eternal Gartua",
    asmodians: "Immortal Gartua",
  });
  expect(
    gearActivities.find(({ id }) => id === "watcher-kaira")?.modes[0],
  ).toMatchObject({
    totalItemLevel: 1000,
    dropIds: ["kaira", "kaira-breastplate", "fallen-ancient-god-weapons"],
  });
  expect(
    gearActivities.find(({ id }) => id === "nahma")?.modes[0],
  ).toMatchObject({
    totalItemLevel: 1000,
    dropIds: ["nahma"],
  });

  for (const [id, level, factionNames] of [
    [
      "true-dragon-lord",
      62,
      { elyos: "True Dragon Lord", asmodians: "Star line" },
    ],
    [
      "white-dragon-lord",
      78,
      { elyos: "White Dragon Lord", asmodians: "Dark line" },
    ],
    [
      "wise-dragon-lord",
      94,
      { elyos: "Wise Dragon Lord", asmodians: "Ebony line" },
    ],
  ]) {
    expect(gearDrops.find((drop) => drop.id === id)).toMatchObject({
      name: factionNames,
      pieceItemLevel: level,
    });
    expect(
      gearActivities.find((activity) => activity.id === id)?.modes[0]
        .totalItemLevel,
    ).toBeUndefined();
  }

  expect(gearDrops.find(({ id }) => id === "ludra")?.pieceItemLevel).toEqual({
    max: 102,
  });
  expect(gearPityLimitations.join(" ")).toContain(
    "Whether skipping the cube advances pity is unknown",
  );
});

test("field boss sources retain confirmed breastplates and their piece levels", () => {
  for (const [id, level] of [
    ["dartan", 46],
    ["kashapa", 46],
    ["lagta", 46],
    ["gartua", 70],
  ] as const) {
    const activity = gearActivities.find((row) => row.id === id);

    expect(activity?.modes[0].dropIds).toEqual([id]);
    expect(gearDrops.find((drop) => drop.id === id)).toMatchObject({
      pieceItemLevel: level,
      slots: ["Armor", "Accessories", "Breastplate"],
    });
  }
});

test("supporting activities expose only documented materials and difficulty gates", () => {
  expect(
    gearActivities.find(({ id }) => id === "growth")?.modes[0].materials,
  ).toEqual(["Soul Crystals", "Enhance Stones", "Shulak Loot Bundles"]);
  expect(
    gearActivities
      .find(({ id }) => id === "ascension-trial")
      ?.modes.map(({ name, totalItemLevel }) => [name, totalItemLevel]),
  ).toEqual([
    ["Easy", 1000],
    ["Normal", 1500],
    ["Hard", 2000],
    ["Extreme", 2500],
  ]);
  expect(
    gearActivities
      .find(({ id }) => id === "transcendence")
      ?.modes.map(({ totalItemLevel }) => totalItemLevel),
  ).toEqual([1600, 1900, 2200, 2500]);
});

test("curated IDs and references resolve without duplicate definitions", () => {
  for (const collection of [
    gearTiers,
    gearActivities,
    gearDrops,
    gearPity,
    gearRewardConditions,
  ]) {
    const ids = collection.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
  }

  for (const tier of gearTiers) {
    for (const id of tier.entryActivityIds)
      expect(gearActivities.some((activity) => activity.id === id)).toBe(true);
  }

  for (const mode of gearActivities.flatMap(({ modes }) => modes)) {
    for (const id of mode.dropIds)
      expect(gearDrops.some((drop) => drop.id === id)).toBe(true);
    if (mode.pityId)
      expect(gearPity.some(({ id }) => id === mode.pityId)).toBe(true);
    if (mode.rewardConditionId)
      expect(
        gearRewardConditions.some(({ id }) => id === mode.rewardConditionId),
      ).toBe(true);
  }

  for (const drop of gearDrops) {
    expect(gearTiers.some(({ id }) => id === drop.tierId)).toBe(true);
    expect(
      gearActivities.some(({ modes }) =>
        modes.some(({ dropIds }) => dropIds.includes(drop.id)),
      ),
    ).toBe(true);
  }

  expect(gearSources).toEqual([
    "metabotGear",
    "metabotDungeons",
    "metabotChecklist",
    "metabotArcana",
    "metabotAbyss",
    "metabotMonsters",
    "ownChecks",
  ]);
  for (const id of gearSources) expect(sources).toHaveProperty(id);

  expect(gearReviewed).toBe("2026-10-13");
});
