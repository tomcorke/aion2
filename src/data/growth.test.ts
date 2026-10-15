import { expect, test } from "vitest";
import {
  growthMaterials,
  growthTargets,
  growthSpendGuidance,
  growthSources,
  growthSourceAdditions,
  growthLimitations,
  growthReviewed,
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

test.each([
  {
    id: "intermediate-soulstone",
    recipe:
      "5 Lesser Soulstones + 3 Spiritstone Powder + 2 Professional Ink (Bound)",
    mastery: 25,
    sourceId: "metabotIntermediateSoulstone",
    url: "https://metabot.gg/en/aion-2/items/intermediate-soulstone",
  },
  {
    id: "superior-soulstone",
    recipe:
      "30 Intermediate Soulstones + 10 Spiritstone Powder + 2 Exceptional Ink (Bound)",
    mastery: 90,
    sourceId: "metabotSuperiorSoulstone",
    url: "https://metabot.gg/en/aion-2/items/superior-soulstone",
  },
])(
  "$id has its complete tradable Alchemy recipe and source",
  ({ id, recipe, mastery, sourceId, url }) => {
    const material = growthMaterials.find((material) => material.id === id)!;
    const alchemy = material.acquisition.find(({ name }) => name === "Alchemy");

    expect(alchemy?.detail).toContain(recipe);
    expect(alchemy?.detail).toContain(`Alchemy mastery ${mastery}`);
    expect(alchemy?.detail).toContain(
      "Alchemy Tables in Verteron (Elyos) or Altgard (Asmodian)",
    );
    expect(alchemy?.detail).toContain("Tradable");
    expect(alchemy?.detail).not.toMatch(/great success|20%|Market/i);
    expect(alchemy?.limit).toBeUndefined();
    expect(material.condition).toContain(
      "only listed source for the tradable item",
    );
    expect(material.condition).toContain("other routes are not ruled out");
    expect(material.sourceIds).toContain(sourceId);
    expect(growthSourceAdditions).toHaveProperty(
      sourceId,
      expect.objectContaining({ url }),
    );
    expect(sources).toHaveProperty(sourceId, expect.objectContaining({ url }));
    expect(growthSources).toContain(sourceId);
  },
);

test.each([
  [
    "lesser-soulstone",
    "Quests, Hard dungeon stages, raids, achievements and battle pass",
  ],
  ["intermediate-soulstone", "Hard dungeon stages and achievements"],
  ["superior-soulstone", "Achievements and battle pass"],
])("%s keeps reward copies explicitly bound", (id, routeName) => {
  const material = growthMaterials.find((material) => material.id === id)!;
  const route = material.acquisition.find(({ name }) => name === routeName);

  expect(route?.detail).toContain("bound copies");
});

test("Soulstone corrections preserve Manastone recipes and the oldest topic review date", () => {
  const alchemy = (id: string) =>
    growthMaterials
      .find((material) => material.id === id)
      ?.acquisition.find(({ name }) => name === "Alchemy");

  expect(alchemy("intermediate-manastone")?.detail).toBe(
    "5 Lesser + 3 Spiritstone Powder + 2 Professional Ink; a 20% great success yields Superior instead.",
  );
  expect(alchemy("superior-manastone")?.detail).toBe(
    "30 Intermediate stones make one Superior.",
  );
  expect(growthReviewed).toBe("2026-10-05");
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
