import { expect, test } from "vitest";
import {
  festivalEntry,
  festivalGames,
  festivalKeys,
  festivalOpeningModel,
  festivalPurchases,
  festivalReviewed,
  festivalRewards,
  festivalSources,
} from "./festival.ts";
import { sources } from "./sources.ts";

// Authoritative literals: knowledge/topics/events/shugo-festival/games.md (S02).
test("the nine games retain their participant limits and individual round durations", () => {
  expect(
    festivalGames.map(({ id, name, players, duration }) => [
      id,
      name,
      players.min,
      players.max,
      duration,
    ]),
  ).toEqual([
    ["jump-jump", "Jump Jump", 1, 4, "2:55"],
    ["wraith-evasion", "Wraith Evasion", 1, 6, "5:00"],
    ["mysterious-track", "Mysterious Track", 1, 8, "5:00"],
    ["hidden-lugi", "Hidden Lugi", 2, 9, "3:30"],
    ["odyle-flight-frenzy", "Odyle Flight Frenzy", 1, 8, "3:30"],
    ["goldrins-treasure", "Goldrin's Treasure", 1, 8, "3:50"],
    ["defend-shugo-merchants", "Defend Shugo Merchants", 1, 8, "5:00"],
    ["up-up-up", "Up! Up! Up!", 1, 8, "5:00"],
    ["not-this-tile", "Not This Tile?", 1, 6, "3:15"],
  ]);

  expect(festivalGames.every(({ objective }) => objective.length > 0)).toBe(
    true,
  );
  expect(
    festivalGames.find(({ id }) => id === "up-up-up")?.objective,
  ).toContain("first checkpoint");
  expect(
    festivalGames.find(({ id }) => id === "defend-shugo-merchants")?.objective,
  ).toContain("not exploding insectoids");
});

// overview.md: S02 entry window, S03 level caveats, owner EU observation.
test("entry guidance separates observed EU availability from round rules and level uncertainty", () => {
  expect(festivalReviewed).toBe("2026-10-05");
  expect(festivalEntry.region).toBe("Global");
  expect(festivalEntry.windowMinutes).toBe(3);
  expect(festivalEntry.instructions).toContain("beside the map");
  expect(festivalEntry.instructions).toContain("choose an activity");
  expect(festivalEntry.availability).toContain("Global EU");
  expect(festivalEntry.availability).toContain(":00 every hour");
  expect(festivalEntry.availability).toContain("5 October 2026");
  expect(festivalEntry.scheduleCondition).toContain("Check the live timer");
  expect(festivalEntry.scheduleCondition).toContain("not the duration");
  expect(festivalEntry.levelCondition).toContain("level 13");
  expect(festivalEntry.levelCondition).toContain("level 45");
  expect(festivalEntry.levelCondition).toContain(
    "not independently verified live",
  );
});

// rewards.md: S02 cards; S07/S08 packages and level summary.
test("reward cards and participation packages do not establish a key-to-opening mapping", () => {
  expect(festivalRewards.cards.offered).toBe(5);
  expect(festivalRewards.cards.selections).toContain("placement");
  expect(festivalRewards.sharedTable).toMatch(/all nine/i);
  expect(festivalRewards.sharedTable).toContain(
    "does not establish equal practical earnings",
  );
  expect(festivalRewards.participation).toMatchObject({
    tokens: 50,
    levels: "45–50",
    lowerBracketTokens: 40,
  });
  expect(festivalRewards.packageCondition).toContain("separate");
  expect(festivalRewards.packageCondition).toContain(
    "without a key is unresolved",
  );
  expect(festivalRewards.mappingCondition).toContain("rank");
  expect(festivalRewards.mappingCondition).toContain("keys consumed");
  expect(festivalRewards.mappingCondition).toContain("unresolved");
  expect(festivalRewards.otherRewards).toEqual([
    "Gear",
    "Gathering materials",
    "Abyss Points",
    "Wisdom Stones",
    "Daevanion Crystals",
    "Growth and appearance currencies",
  ]);
});

// keys-and-membership.md: S01 storage and paid plan, disputed S03–S08 refill.
test("membership increases storage without inventing a refill allocation or faster regeneration", () => {
  expect(festivalKeys.storage).toEqual({ normal: 12, specialQuairerk: 21 });
  expect(festivalKeys.storageCondition).toContain("not daily allocations");
  expect(festivalKeys.membership).toMatchObject({ priceUsd: 14.99, days: 30 });
  expect(festivalKeys.membership.condition).toContain(
    "server where membership was purchased",
  );
  expect(festivalKeys.membership.condition).toContain(
    "local-currency prices may differ",
  );
  expect(festivalKeys.refillCondition).toContain("Daily quantity");
  expect(festivalKeys.refillCondition).toContain(
    "character/server/account sharing",
  );
  expect(festivalKeys.refillCondition).toContain("unresolved");
  expect(festivalKeys.refillCondition).toContain("does not establish faster");
  expect(festivalKeys.claimingCondition).toContain("reward claiming");
  expect(festivalKeys.claimingCondition).toContain(
    "without a key is unresolved",
  );
});

// rewards.md: S07/S08 level-50 table, independently retained literals and mean.
test("additional openings retain the conditional level-50 odds and 40.2 mean", () => {
  expect(festivalOpeningModel.level).toBe(50);
  expect(festivalOpeningModel.build).toBe("0.0.4387.0");
  expect(festivalOpeningModel.outcomes).toEqual([
    { tokens: 30, probability: 0.5 },
    { tokens: 40, probability: 0.3 },
    { tokens: 60, probability: 0.17 },
    { tokens: 100, probability: 0.03 },
  ]);
  expect(
    festivalOpeningModel.outcomes.reduce(
      (sum, { probability }) => sum + probability,
      0,
    ),
  ).toBeCloseTo(1, 12);
  expect(
    festivalOpeningModel.outcomes.reduce(
      (sum, { tokens, probability }) => sum + tokens * probability,
      0,
    ),
  ).toBeCloseTo(40.2, 12);
  expect(festivalOpeningModel.meanTokens).toBeCloseTo(40.2, 12);
  expect(festivalOpeningModel.condition).toContain("level 50");
  expect(festivalOpeningModel.condition).toContain("level 45 is an assumption");
  expect(festivalOpeningModel.condition).toContain("not tokens per key");
});

// skin-prices.md (S06/S08): independent prices/totals, no accessories in outfits.
const purchasePrices = [
  {
    id: "lightpath-trace",
    category: "outfit",
    total: 5000,
    pieces: [
      ["lightpath-trace-gloves", 530],
      ["lightpath-trace-cloak", 530],
      ["lightpath-trace-helm", 680],
      ["lightpath-trace-pauldrons", 680],
      ["lightpath-trace-boots", 680],
      ["lightpath-trace-greaves", 800],
      ["lightpath-trace-breastplate", 1100],
    ],
  },
  {
    id: "skilled-expert",
    category: "outfit",
    total: 24900,
    pieces: [
      ["skilled-expert-gloves", 2650],
      ["skilled-expert-cloak", 2650],
      ["skilled-expert-helm", 3400],
      ["skilled-expert-pauldrons", 3400],
      ["skilled-expert-boots", 3400],
      ["skilled-expert-greaves", 4000],
      ["skilled-expert-breastplate", 5400],
    ],
  },
  {
    id: "twilight-loop",
    category: "accessory",
    total: 1210,
    pieces: [
      ["twilight-loop-earrings", 530],
      ["twilight-loop-necklace", 680],
    ],
  },
  {
    id: "starry-starry-night",
    category: "accessory",
    total: 6050,
    pieces: [
      ["starry-starry-night-earrings", 2650],
      ["starry-starry-night-necklace", 3400],
    ],
  },
  {
    id: "violet-butterfly-wings",
    category: "wing",
    total: 2100,
    pieces: [["violet-butterfly-wings-appearance", 2100]],
  },
  {
    id: "spirit-wings",
    category: "wing",
    total: 4200,
    pieces: [["spirit-wings-appearance", 4200]],
  },
  {
    id: "springflower-butterfly-wings",
    category: "wing",
    total: 8350,
    pieces: [["springflower-butterfly-wings-appearance", 8350]],
  },
];

test.each(purchasePrices)(
  "$id keeps its own category, stable pieces and sourced total",
  ({ id, category, total, pieces }) => {
    const purchase = festivalPurchases.find((entry) => entry.id === id);

    expect(purchase).toMatchObject({
      id,
      category,
      total,
      currency: "Centuryroot Tokens",
    });
    expect(purchase?.pieces.map((piece) => [piece.id, piece.price])).toEqual(
      pieces,
    );
    expect(purchase?.pieces.reduce((sum, { price }) => sum + price, 0)).toBe(
      total,
    );
    expect(purchase?.limit).toEqual({
      quantity: 1,
      scope: "character",
      appliesTo: "piece",
    });
    expect(purchase?.condition).toContain("Global client build 0.0.4387.0");
    expect(purchase?.condition).toContain("Recheck the live shop");
  },
);

test("purchase and ownership IDs remain unique across the separate supported categories", () => {
  const pieceCounts = { outfit: 7, accessory: 2, wing: 1 };
  const ids = festivalPurchases.map(({ id }) => id);
  const pieceIds = festivalPurchases.flatMap(({ pieces }) =>
    pieces.map(({ id }) => id),
  );

  expect(ids).toEqual(purchasePrices.map(({ id }) => id));
  expect(new Set(ids).size).toBe(7);
  expect(new Set(pieceIds).size).toBe(21);
  expect(pieceIds).toHaveLength(21);

  for (const { category, pieces } of festivalPurchases) {
    expect(pieces).toHaveLength(pieceCounts[category]);
  }
});

// Public catalog registrations resolve S01/S02/S03/S06/S07/S08 and the EU observation.
test("Festival footer and purchase sources resolve to the registered public sources", () => {
  expect(festivalSources).toEqual([
    "game8Festival",
    "aion2GuideFestival",
    "officialMembership",
    "metabotEvents",
    "metabotMethodology",
    "metabotFestivalShop",
    "ownChecks",
  ]);

  for (const id of festivalSources) expect(sources).toHaveProperty(id);

  for (const { sourceIds } of festivalPurchases) {
    expect(sourceIds).toEqual(["metabotFestivalShop", "metabotMethodology"]);

    for (const id of sourceIds) {
      expect(festivalSources).toContain(id);
      expect(sources[id]).toHaveProperty(
        "url",
        expect.stringMatching(/^https:\/\//),
      );
    }
  }

  expect(sources.officialMembership.url).toBe(
    "https://aion2.plaync.com/fr-fr/board/notice/view?articleId=6a850010d97eae18cc40db25",
  );
  expect(sources.game8Festival.url).toBe(
    "https://game8.co/games/Aion-2/archives/612918",
  );
  expect(sources.aion2GuideFestival.url).toBe(
    "https://aion2.run/en/systemes?s=festival-shugo",
  );
  expect(sources.metabotFestivalShop.url).toBe(
    "https://metabot.gg/en/aion-2/shops/festival-shop-centuryroot-token",
  );
  expect(sources.metabotMethodology.url).toBe(
    "https://metabot.gg/en/aion-2/methodology",
  );
});
