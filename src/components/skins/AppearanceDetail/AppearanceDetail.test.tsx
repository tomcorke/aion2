import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { skinCatalogueEntries } from "../../../data/skinCatalogue.ts";
import type { SkinCatalogueEntry } from "../../../data/skinCatalogueTypes.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { AppearanceDetail } from "./AppearanceDetail.tsx";

const entry = (id: string) =>
  skinCatalogueEntries.find((skin) => skin.id === id)!;

test("ticking a piece reports that piece only", async () => {
  const onToggle = vi.fn();

  renderWithProviders(
    <AppearanceDetail
      entry={entry("archon-centurion-accessories")}
      owned={["archon-centurion-accessories-necklace"]}
      onToggle={onToggle}
    />,
  );

  expect(screen.getByText(/Accessory pair · 2 pieces/)).toBeDefined();
  expect(screen.getByText("1/2 owned")).toBeDefined();

  await userEvent.click(screen.getByRole("checkbox", { name: "Earrings" }));

  expect(onToggle).toHaveBeenCalledWith(
    "archon-centurion-accessories-earrings",
  );
});

test("each route gets its own section", () => {
  renderWithProviders(
    <AppearanceDetail
      entry={entry("skyfeather-guardian")}
      owned={[]}
      onToggle={vi.fn()}
    />,
  );

  expect(screen.getAllByRole("region")).toHaveLength(6);
});

test("outfits keep the Closet sharing limit and the Alts link", () => {
  renderWithProviders(
    <AppearanceDetail
      entry={entry("sky-feather")}
      owned={[]}
      onToggle={vi.fn()}
    />,
  );

  expect(
    screen.getByText(/does not show whether a skin's owned stats/),
  ).toBeDefined();
  expect(
    screen
      .getByRole("link", { name: "What carries over between characters" })
      .getAttribute("href"),
  ).toBe("/alts");
});

test("an entry with no recorded route says so plainly and links the research list", () => {
  renderWithProviders(
    <AppearanceDetail
      entry={entry("appearance-black-mask-helm")}
      owned={[]}
      onToggle={vi.fn()}
    />,
  );

  expect(screen.getByText(/Armour piece · 1 piece/)).toBeDefined();
  expect(
    screen.getByText(
      /How to get this is not recorded yet\. It exists in the game files, which doesn't mean it can be obtained now\./,
    ),
  ).toBeDefined();
  expect(screen.queryByRole("region")).toBeNull();
  expect(
    screen
      .getByRole("link", { name: "Open acquisition questions" })
      .getAttribute("href"),
  ).toBe("/sources?topic=skins");
});

test("partly recorded entries mark exactly which pieces lack a route", () => {
  const partial: SkinCatalogueEntry = {
    ...entry("awakened"),
    unknownPieceIds: ["awakened-helm", "awakened-cloak"],
    sources: ["nightmare-shop", "unknown"],
  };

  renderWithProviders(
    <AppearanceDetail entry={partial} owned={[]} onToggle={vi.fn()} />,
  );

  expect(
    screen.getByText(
      /How to get Awakened \(Helm\) and Awakened \(Cloak\) is not recorded yet\./,
    ),
  ).toBeDefined();
  expect(
    screen.getByRole("checkbox", {
      name: /^Awakened \(Helm\).*source not recorded/,
    }),
  ).toBeDefined();
  expect(
    screen.getByRole("checkbox", { name: /^Awakened \(Gloves\)$/ }),
  ).toBeDefined();
  expect(screen.getByRole("region", { name: /Nightmare/ })).toBeDefined();
});
