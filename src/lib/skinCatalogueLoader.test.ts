// @vitest-environment node
import { expect, test } from "vitest";
import { loadSkinCatalogue } from "./skinCatalogueLoader.ts";

test("loads the complete catalogue only on request and reuses the module", async () => {
  const catalogue = await loadSkinCatalogue();

  expect(catalogue.skinCatalogueEntries).toHaveLength(347);
  expect(catalogue.skinCataloguePieceIds.size).toBe(1063);
  expect(await loadSkinCatalogue()).toBe(catalogue);
});
