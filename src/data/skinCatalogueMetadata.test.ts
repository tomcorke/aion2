// @vitest-environment node
import { expect, test } from "vitest";
import {
  skinCatalogueAttribution,
  skinCatalogueBuild,
  skinCatalogueKindLabels,
  skinCatalogueLimitations,
  skinCatalogueReviewed,
  skinCatalogueScope,
  skinCatalogueSourceAdditions,
  skinCatalogueSourceChecked,
  skinCatalogueSourceLabels,
} from "./skinCatalogueMetadata.ts";

test("records the actual reference build, review and source-check dates separately", () => {
  expect(skinCatalogueBuild).toContain("Global 0.0.4387.0");
  expect(skinCatalogueReviewed).toBe("2026-11-02");
  expect(skinCatalogueSourceChecked).toBe("2026-11-01");
  expect(skinCatalogueScope).toContain("1,008 retained");
  expect(skinCatalogueScope).toContain("55 appearances");
  expect(skinCatalogueScope).toContain("1,012 non-weapon skin rows");
  expect(skinCatalogueScope).toContain("These counts do not reconcile");
  expect(skinCatalogueLimitations.join(" ")).toMatch(
    /does not establish client-file presence or live availability/,
  );
  expect(skinCatalogueLimitations.join(" ")).toContain(
    "Unknown costs are not zero",
  );
});

test("supplies small labels and specific source pages without images or raw provenance", () => {
  expect(Object.keys(skinCatalogueKindLabels)).toEqual([
    "costume",
    "armor",
    "accessory",
    "vanity",
    "wing",
  ]);
  expect(skinCatalogueSourceLabels.unknown).toBe("Source not recorded");
  expect(skinCatalogueSourceLabels["global-offer"]).toBe(
    "Current Global offers",
  );
  expect(Object.keys(skinCatalogueSourceAdditions)).toHaveLength(5);
  expect(skinCatalogueAttribution.map(({ url }) => url)).toEqual([
    "https://metabot.gg/en/aion-2/skins",
    "https://metabot.gg/en/aion-2/wings",
    "https://metabot.gg/en/aion-2/methodology",
    "https://lounge.plaync.com/feed/83799?country=US&locale=en-US",
    "https://steamcommunity.com/app/3393110/allnews/",
  ]);
  expect(JSON.stringify(skinCatalogueSourceAdditions)).not.toMatch(
    /web\/aion2|\.webp|\.glb|sha256|rawInventory/,
  );
});
