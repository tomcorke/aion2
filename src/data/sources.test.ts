import { expect, test } from "vitest";
import { imageCredits, sourceList, sources } from "./sources.ts";

test("every source has a name, what it covers, and an https link when it has one", () => {
  for (const { name, covers, url } of sourceList) {
    expect(name).not.toBe("");
    expect(covers).not.toBe("");

    if (url) expect(url).toMatch(/^https:\/\//);
  }
});

test("registers the catalogue indexes and exact additional shop pages", () => {
  expect(sources).toMatchObject({
    metabotSkinInventory: { url: "https://metabot.gg/en/aion-2/skins" },
    metabotWingInventory: { url: "https://metabot.gg/en/aion-2/wings" },
    metabotNightmareShop: {
      url: "https://metabot.gg/en/aion-2/shops/trade-shop-phantasmal-fragment",
    },
    metabotSeasonShop: {
      url: "https://metabot.gg/en/aion-2/shops/season-shop-oath-coin",
    },
    metabotDaevaPassShop: {
      url: "https://metabot.gg/en/aion-2/shops/pass-shop-daeva-pass-shop-coin",
    },
  });
});

test("source names are unique", () => {
  const names = sourceList.map(({ name }) => name);

  expect(new Set(names).size).toBe(names.length);
});

test("image credits link to their source", () => {
  for (const { url } of imageCredits) expect(url).toMatch(/^https:\/\//);
});
