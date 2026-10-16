/** Native dynamic import keeps the reference inventory out of the initial site bundle. */
export function loadSkinCatalogue() {
  return import("../data/skinCatalogue.ts");
}
