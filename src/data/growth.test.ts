import { expect, test } from "vitest";
import {
  growthMaterials,
  growthTargets,
  growthSpendGuidance,
  growthSources,
  growthSourceAdditions,
  growthLimitations,
} from "./growth.ts";
import { gearUpgradeSourceAdditions } from "./gearUpgrades.ts";
import { gearActivities, gearRewardConditions } from "./gear.ts";
import { sources } from "./sources.ts";

test("boards, Stigma, pets, Arcana and wings retain distinct use and finite supplies", () => {
  expect(growthTargets.map(({ id }) => id)).toEqual([
    "enhancement",
    "amplification",
    "potential",
    "engraving",
    "daevanion",
    "stigma",
    "pets",
    "arcana",
    "wings",
    "appearance",
  ]);
  expect(
    growthMaterials.find(({ id }) => id === "daevanion-crystals")?.condition,
  ).toContain("Home-faction");
  expect(
    growthMaterials.find(({ id }) => id === "azphel-crystals")?.use,
  ).toContain("separate");
  expect(
    growthMaterials.find(({ id }) => id === "stigma-shards")?.use,
  ).toContain("Stigma");
  expect(
    growthMaterials.find(({ id }) => id === "soul-crystals")?.use,
  ).toContain("4 Soul Crystals and 1,000 Kina");
  expect(
    growthMaterials.find(({ id }) => id === "mysterious-crystals")?.use,
  ).toContain("5 crystals plus 2,000,000 Kina");
  const featherdown = growthMaterials.find(
    ({ id }) => id === "sealed-wing-featherdown",
  );

  expect(featherdown?.acquisition[0].limit).toContain("140 per character");
  expect(featherdown?.condition).toContain("not tradable");
  expect(featherdown?.use).toContain("10 Pure Odyle");
  expect(
    growthSpendGuidance.some(({ items }) =>
      items.some((item) => item.includes("Superior")),
    ),
  ).toBe(true);
});

test("stones preserve tier, slots, ordinary versus Abyssal, prices and variant restrictions", () => {
  expect(
    growthMaterials.find(({ id }) => id === "superior-manastone"),
  ).toMatchObject({
    tier: "Superior",
    variant: "ordinary",
    slots: [
      "Weapon",
      "Guard",
      "Helm",
      "Top",
      "Pauldrons",
      "Legs",
      "Shoes",
      "Cloak",
    ],
  });
  expect(
    growthMaterials.find(({ id }) => id === "intermediate-soulstone")?.slots,
  ).toEqual(["Necklace", "Earrings", "Rings"]);
  const abyssal = growthMaterials.find(
    ({ id }) => id === "lesser-abyssal-soulstone",
  );

  expect(abyssal?.variant).toBe("abyssal");
  expect(abyssal?.acquisition[0]).toMatchObject({
    detail: "2,000 AP each.",
    limit: "50 per character per week.",
  });
  expect(
    growthMaterials.find(({ id }) => id === "rare-theostone")?.condition,
  ).toContain("not tradable");
  expect(
    growthMaterials.find(({ id }) => id === "unique-theostone")?.acquisition[0]
      .detail,
  ).toContain("9.1%");
  expect(
    growthMaterials.find(({ id }) => id === "clash-rune-chest")?.condition,
  ).toContain("finite");
});

test("material IDs and canonical source/activity references resolve without invented gap entries", () => {
  const ids = growthMaterials.map(({ id }) => id);
  const catalog = {
    ...sources,
    ...gearUpgradeSourceAdditions,
    ...growthSourceAdditions,
  };

  expect(new Set(ids).size).toBe(ids.length);
  expect(ids).not.toContain("soul-codex");
  expect(ids).not.toContain("philosophers-stone");
  expect(ids).not.toContain("pure-odyle");
  expect(growthLimitations.join(" ")).toContain("Pure Odyle");

  for (const material of growthMaterials) {
    expect(material.acquisition.length, material.id).toBeGreaterThan(0);
    expect(material.use, material.id).not.toBe("");

    for (const target of material.targets)
      expect(
        growthTargets.some(({ id }) => id === target),
        material.id,
      ).toBe(true);

    for (const id of material.sourceIds) {
      expect(catalog, material.id).toHaveProperty(id);
      expect(growthSources, material.id).toContain(id);
    }

    for (const route of material.acquisition) {
      if (route.gearActivityId)
        expect(
          gearActivities.some(({ id }) => id === route.gearActivityId),
        ).toBe(true);
      if (route.rewardConditionId)
        expect(
          gearRewardConditions.some(({ id }) => id === route.rewardConditionId),
        ).toBe(true);
    }
  }
});

test("growth separates progression and cosmetic currencies from consumable materials", () => {
  expect(
    growthMaterials
      .filter(({ kind }) => kind === "currency")
      .map(({ id }) => id),
  ).toEqual(["abyss-points", "kina", "centuryroot-tokens"]);
  expect(
    growthMaterials.find(({ id }) => id === "abyss-points")?.aliases,
  ).toContain("AP");
  expect(
    growthMaterials.find(({ id }) => id === "centuryroot-tokens")?.links,
  ).toContainEqual({ to: "/festival", label: "Festival rewards and prices" });
  expect(
    growthMaterials
      .find(({ id }) => id === "enhance-stones")
      ?.acquisition.find(({ name }) => name === "Daily Dungeon")?.detail,
  ).toContain("10,000 or more");
  expect(
    growthMaterials.find(({ id }) => id === "potential-stones")?.use,
  ).toContain("PvP");
});
