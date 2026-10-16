// @vitest-environment node
import { expect, test } from "vitest";
import {
  skinCatalogueAttribution,
  skinCatalogueBuild,
  skinCatalogueKindLabels,
  skinCatalogueLimitations,
  skinCatalogueReviewed,
  skinCatalogueSourceAdditions,
  skinCatalogueSourceChecked,
  skinCatalogueSourceLabels,
} from "./skinCatalogueMetadata.ts";

test("records the actual reference build, review and source-check dates separately", () => {
  expect(skinCatalogueBuild).toContain("Global 0.0.4387.0");
  expect(skinCatalogueReviewed).toBe("2026-10-16");
  expect(skinCatalogueSourceChecked).toBe("2026-10-16");
  expect(skinCatalogueLimitations.join(" ")).toMatch(/not proof.*obtained now/);
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
  expect(Object.keys(skinCatalogueSourceAdditions)).toHaveLength(5);
  expect(skinCatalogueAttribution.map(({ url }) => url)).toEqual([
    "https://metabot.gg/en/aion-2/skins",
    "https://metabot.gg/en/aion-2/wings",
    "https://metabot.gg/en/aion-2/methodology",
  ]);
  expect(JSON.stringify(skinCatalogueSourceAdditions)).not.toMatch(
    /web\/aion2|\.webp|\.glb|sha256|rawInventory/,
  );
});
