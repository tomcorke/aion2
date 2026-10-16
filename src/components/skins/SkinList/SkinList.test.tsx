import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { skinCatalogueEntries } from "../../../data/skinCatalogue.ts";
import type { SkinCatalogueEntry } from "../../../data/skinCatalogueTypes.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { SkinList } from "./SkinList.tsx";

const entry = (id: string) =>
  skinCatalogueEntries.find((skin) => skin.id === id)!;

const group = (name: string) =>
  screen.getByRole("heading", { name }).closest("details")!;

const partial: SkinCatalogueEntry = {
  ...entry("awakened"),
  id: "partial",
  name: "Partial",
  sources: ["nightmare-shop", "unknown"],
  unknownPieceIds: ["awakened-helm", "awakened-cloak"],
};

test("only groups with entries get a heading, with their row count", () => {
  renderWithProviders(
    <SkinList
      entries={skinCatalogueEntries.filter(({ kind }) => kind === "wing")}
      owned={[]}
      filtered={false}
    />,
  );

  expect(group("Wings").textContent).toContain("28");
  expect(screen.queryByRole("heading", { name: "Outfits" })).toBeNull();
});

test("Outfits and the selected entry's group start open; others closed", () => {
  renderWithProviders(
    <SkinList
      entries={skinCatalogueEntries}
      owned={[]}
      selected="blazing-sun-wings"
      selectedKind="wing"
      filtered={false}
    />,
  );

  expect(group("Outfits").open).toBe(true);
  expect(group("Wings").open).toBe(true);
  expect(group("Armour").open).toBe(false);
  expect(group("Accessories").open).toBe(false);
  expect(group("Vanity").open).toBe(false);
});

test("an active search or filter opens every group with matches", () => {
  renderWithProviders(
    <SkinList entries={skinCatalogueEntries} owned={[]} filtered />,
  );

  for (const name of ["Outfits", "Armour", "Accessories", "Vanity", "Wings"])
    expect(group(name).open).toBe(true);
});

test("a group the reader opens stays open", async () => {
  renderWithProviders(
    <SkinList entries={skinCatalogueEntries} owned={[]} filtered={false} />,
  );

  await userEvent.click(screen.getByRole("heading", { name: "Vanity" }));

  expect(group("Vanity").open).toBe(true);
});

test("rows name their recorded sources and any unrecorded pieces", () => {
  renderWithProviders(
    <SkinList
      entries={[
        entry("awakened"),
        entry("ascended-daeva"),
        partial,
        entry("archon-centurion"),
      ]}
      owned={[]}
      filtered={false}
    />,
  );

  const row = (name: string) =>
    screen.getByRole("link", { name: new RegExp(`^${name}`) }).textContent;

  expect(row("Awakened")).toContain("Nightmare Shop");
  expect(row("Ascended Daeva")).toContain("Source not recorded");
  expect(row("Partial")).toContain("Nightmare Shop · 2 of 7 not recorded");
  expect(row("Archon Centurion")).not.toContain("not recorded");
});

test("progress counts only the entry's own owned pieces", () => {
  renderWithProviders(
    <SkinList
      entries={skinCatalogueEntries}
      owned={["twilight-loop-necklace", "spirit-wings-appearance"]}
      selected="twilight-loop"
      filtered={false}
    />,
  );

  const link = screen.getByRole("link", { name: /Twilight Loop/ });

  expect(link.textContent).toContain("1/2");
  expect(link.getAttribute("aria-current")).toBe("page");
});

test("picking reports only rows other than the current one", async () => {
  const onPick = vi.fn();

  renderWithProviders(
    <SkinList
      entries={[entry("awakened"), partial]}
      owned={[]}
      selected="awakened"
      selectedKind="costume"
      filtered={false}
      onPick={onPick}
    />,
  );
  await userEvent.click(screen.getByRole("link", { name: /^Awakened/ }));

  expect(onPick).not.toHaveBeenCalled();

  await userEvent.click(screen.getByRole("link", { name: /^Partial/ }));

  expect(onPick).toHaveBeenCalledOnce();
});
