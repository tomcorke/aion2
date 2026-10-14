import { expect, test } from "vitest";

// Expected totals and roles come from the maintained class and Spiritmaster notes.
import {
  daevanionClasses,
  daevanionBoards,
  daevanionVariants,
  daevanionCaveats,
  azphelOverview,
  daevanionPools,
  daevanionReviewed,
  daevanionSources,
} from "./daevanion.ts";
import { sources } from "./sources.ts";

test("all eight classes expose the maintained three PvE totals", () => {
  expect(
    daevanionClasses.map(({ id, routes }) => [
      id,
      routes.damage.total,
      routes.utility.total,
      routes.defense.total,
    ]),
  ).toEqual([
    ["gladiator", 409, 446, 458],
    ["templar", 397, 446, 464],
    ["assassin", 422, 446, 464],
    ["ranger", 409, 446, 454],
    ["sorcerer", 411, 446, 454],
    ["spiritmaster", 409, 446, 453],
    ["cleric", 363, 446, 426],
    ["chanter", 400, 446, 456],
  ]);
});

test("Azphel has shared phases and a separate crystal pool, not PvE variants", () => {
  expect(azphelOverview).toMatchObject({
    boardId: "azphel",
    classSpecific: false,
    variantId: "hp-mp-first",
    phases: [
      { id: "hp-mp", cost: 36, cumulativeCost: 36, hp: 400, mp: 200 },
      { id: "status-effects", cost: 78, cumulativeCost: 114 },
    ],
    alternativeAllTargetsCost: 110,
  });
  expect(azphelOverview.statusEffectCaveat).toContain("not confirmed");
  expect(azphelOverview.alternativeCaveat).toContain("44 points");
  expect(daevanionPools.pve.boardIds).toEqual([
    "nezekan",
    "zikel",
    "vaizel",
    "triniel",
  ]);
  expect(daevanionPools.azphel.boardIds).toEqual(["azphel"]);
  expect(daevanionPools.azphel.description).toContain("never spends");
  expect(
    azphelOverview.phases.reduce((sum, phase) => sum + phase.cost, 0),
  ).toBe(114);
});

test("overview assumptions and source freshness remain available to the page", () => {
  expect(daevanionReviewed).toBe("2026-10-10");
  expect(daevanionCaveats.emptyBoard).toContain("empty board");
  expect(daevanionCaveats.estimates).toContain("not proven minimal");
  expect(daevanionCaveats.estimates).toContain("not a damage simulation");
  expect(daevanionCaveats.cleric).toContain("healing build");
  expect(daevanionCaveats.missingCosts).toContain("not recorded");

  for (const id of daevanionSources) expect(sources).toHaveProperty(id);

  for (const collection of [
    daevanionClasses,
    daevanionBoards,
    daevanionVariants,
  ]) {
    expect(new Set(collection.map(({ id }) => id)).size).toBe(
      collection.length,
    );
  }

  for (const entry of daevanionClasses) {
    expect(Object.keys(entry.routes)).toEqual(["damage", "utility", "defense"]);

    for (const route of Object.values(entry.routes)) {
      for (const [id, cost] of Object.entries(route.boardCosts)) {
        const board = daevanionBoards.find((entry) => entry.id === id);

        expect(board?.pool).toBe("pve");
        expect(Number.isInteger(cost)).toBe(true);
        expect(cost).toBeGreaterThan(0);
        expect(cost).toBeLessThanOrEqual(board!.fullCost);
      }
    }
  }
});

test("skill groups retain the corrected Spiritmaster roles and Cleric healing skills", () => {
  expect(daevanionClasses.map(({ skills }) => skills.core)).toEqual([
    ["Attack Preparation"],
    ["Fury"],
    ["Assault Stance", "Rear Smite"],
    ["Focused Eye", "Hunter's Resolve"],
    ["Robe of Flame", "Grace of Enhancement"],
    ["Spirit Strike"],
    ["Earth's Grace", "Empyrean Lord's Grace"],
    ["Attack Preparation", "Earth's Promise", "Wind's Promise"],
  ]);
  const spiritmaster = daevanionClasses.find(({ id }) => id === "spiritmaster");
  const cleric = daevanionClasses.find(({ id }) => id === "cleric");

  expect(spiritmaster?.skills.damage).toContain("Spirit Revitalization");
  expect(spiritmaster?.skills.utility).toEqual([
    "Spirit Communion",
    "Revitalization Contract",
    "Defiance",
    "Summon: Earth Spirit",
  ]);
  expect(spiritmaster?.skills.defensive).toEqual(["Spirit Protection"]);
  expect(Object.values(spiritmaster!.skills).flat()).toHaveLength(22);
  expect(cleric?.skills.utility).toEqual([
    "Defiance",
    "Survival Willpower",
    "Heal Block",
    "Prayer of Concentration",
    "Healing Enhancement",
    "Healing Light",
    "Light of Regeneration",
    "Radiant Benediction",
    "Radiant Recovery",
  ]);

  for (const entry of daevanionClasses) {
    const namedSkills = Object.values(entry.skills).flat();

    expect(new Set(namedSkills).size).toBe(namedSkills.length);
    expect(entry.damageNote).toContain("other skills");
  }
});

test("PvE comparisons retain known board costs without inventing missing defensive costs", () => {
  expect(daevanionBoards.map(({ id }) => id)).toEqual([
    "nezekan",
    "zikel",
    "vaizel",
    "triniel",
    "azphel",
  ]);
  expect(daevanionVariants.map(({ id }) => id)).toEqual([
    "damage",
    "utility",
    "defense",
  ]);
  expect(
    daevanionClasses.map(({ routes }) =>
      Object.values(routes.damage.boardCosts),
    ),
  ).toEqual([
    [100, 100, 93, 116],
    [98, 96, 89, 114],
    [107, 100, 97, 118],
    [103, 98, 93, 115],
    [109, 95, 93, 114],
    [107, 95, 92, 115],
    [90, 85, 83, 105],
    [97, 98, 90, 115],
  ]);

  for (const entry of daevanionClasses) {
    expect(entry.routes.utility.boardCosts).toEqual({
      nezekan: 113,
      zikel: 106,
      vaizel: 103,
      triniel: 124,
    });
    expect(entry.routes.defense.boardCosts).toEqual(
      entry.id === "spiritmaster"
        ? { nezekan: 115, zikel: 102, vaizel: 103, triniel: 133 }
        : {},
    );

    for (const route of Object.values(entry.routes)) {
      const costs = Object.values(route.boardCosts);

      if (costs.length === 4)
        expect(costs.reduce((sum, cost) => sum + cost, 0)).toBe(route.total);
    }
  }
});
