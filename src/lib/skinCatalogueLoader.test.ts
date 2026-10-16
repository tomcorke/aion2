// @vitest-environment node
import { expect, test } from "vitest";
import { loadSkinCatalogue } from "./skinCatalogueLoader.ts";

test("loads the complete catalogue only on request and reuses the module", async () => {
  const catalogue = await loadSkinCatalogue();

  expect(catalogue.skinCatalogueEntries).toHaveLength(314);
  expect(catalogue.skinCataloguePieceIds.size).toBe(1008);
  expect(await loadSkinCatalogue()).toBe(catalogue);
});
