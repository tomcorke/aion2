import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test } from "vitest";
import {
  skinCatalogueEntries,
  skinCataloguePieceIds,
} from "../../../data/skinCatalogue.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { SkinCatalogue } from "./SkinCatalogue.tsx";

const renderCatalogue = (setId?: string) =>
  renderWithProviders(
    <SkinCatalogue
      entries={skinCatalogueEntries}
      pieceIds={skinCataloguePieceIds}
      setId={setId}
    />,
    { path: setId ? `/skins/${setId}` : "/skins" },
  );

const nav = () => screen.getByRole("navigation", { name: "Skin sets" });

const detail = () => screen.getByRole("region", { name: "Selected set" });

const precedes = (first: Element, second: Element) =>
  (first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING) !==
  0;

beforeEach(() => localStorage.clear());

test("the list comes first until an entry is selected", () => {
  renderCatalogue();

  expect(precedes(nav(), detail())).toBe(true);
  expect(screen.queryByRole("link", { name: "Back to all sets" })).toBeNull();
});

test("a selected entry's details come before the list in reading order", () => {
  renderCatalogue("blazing-sun-wings");

  const back = screen.getByRole("link", { name: "Back to all sets" });

  expect(precedes(detail(), nav())).toBe(true);
  expect(precedes(back, nav())).toBe(true);
  expect(back.getAttribute("href")).toBe("/skins");
  expect(
    within(detail()).getByRole("heading", { name: "Blazing Sun Wings" }),
  ).toBeDefined();
});

test("all 314 entries are listed, covering 1,008 pieces", () => {
  renderCatalogue();

  const links = within(nav()).getAllByRole("link");

  expect(links).toHaveLength(314);
  expect(
    links.reduce(
      (sum, link) => sum + Number(link.children[2]!.textContent.split("/")[1]),
      0,
    ),
  ).toBe(1008);
});

test("the Source not recorded chip combines with search", async () => {
  renderCatalogue();

  await userEvent.click(
    screen.getByRole("button", { name: "Source not recorded" }),
  );

  const unknown = within(nav()).getAllByRole("link");

  expect(unknown.length).toBeGreaterThan(0);
  expect(
    unknown.every((link) => link.textContent.includes("not recorded")),
  ).toBe(true);
  expect(
    within(nav()).queryByRole("link", { name: /Lightpath Trace/ }),
  ).toBeNull();

  await userEvent.type(screen.getByRole("searchbox"), "black mask");

  expect(
    within(nav())
      .getAllByRole("link")
      .every((link) => /Black Mask/i.test(link.textContent)),
  ).toBe(true);
});

test("Festival entries keep their canonical prices and simulator link", () => {
  renderCatalogue("spirit-wings");

  expect(
    within(detail()).getByRole("row", { name: /Spirit Wings.*4,200/ }),
  ).toBeDefined();
  expect(
    within(detail()).getByRole("link", { name: /Simulate Festival tokens/ }),
  ).toBeDefined();
});

test("ticking a new catalogue piece keeps existing ticks", async () => {
  localStorage.setItem(
    "skin-owned",
    JSON.stringify(["lightpath-trace-helm", "retired"]),
  );
  renderCatalogue("blazing-sun-wings");

  await userEvent.click(within(detail()).getByRole("checkbox"));

  expect(JSON.parse(localStorage.getItem("skin-owned")!)).toEqual([
    "lightpath-trace-helm",
    "blazing-sun-wings-appearance",
  ]);
});
