import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { nonFestivalSkinEntries } from "../../../data/skinAcquisitions.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { SkinRoute } from "./SkinRoute.tsx";

const entry = (id: string) =>
  nonFestivalSkinEntries.find((skin) => skin.id === id)!;

const renderRoute = (entryId: string, routeId: string) => {
  const { pieces, acquisitions } = entry(entryId);
  const route = acquisitions.find(({ id }) => id === routeId)!;

  renderWithProviders(<SkinRoute route={route} pieces={pieces} />);
};

test("a partial route names only the pieces it covers", () => {
  renderRoute("skyfeather-guardian", "reward-chest");

  expect(screen.getByRole("region", { name: "Reward Chest" })).toBeDefined();
  expect(screen.getByText("Breastplate")).toBeDefined();
  expect(screen.getByText("Skin chests")).toBeDefined();
});

test("a route without a recorded price shows no price", () => {
  renderRoute("sky-feather", "random-shop");

  expect(screen.getByText("All 7 pieces")).toBeDefined();
  expect(screen.queryByRole("table")).toBeNull();
  expect(screen.queryByText(/Kina|Points/)).toBeNull();
  expect(screen.getByText(/not Skyfeather Guardian/)).toBeDefined();
});

test("extraction leads with the destruction warning", () => {
  renderRoute("skyfeather-guardian", "extraction");

  expect(
    screen.getByText(/costs Kina and always destroys the gear item/),
  ).toBeDefined();
});

test("combine costs are per attempt, not a price table", () => {
  renderRoute("skyfeather-guardian", "epic-skin-combine");

  expect(screen.getByText("6,000 Kina per attempt")).toBeDefined();
  expect(screen.getByText("Cloak")).toBeDefined();
  expect(screen.queryByRole("table")).toBeNull();
});

test("a single-currency shop route totals the two accessories", () => {
  renderRoute("archon-decanus-accessories", "abyss-shop");

  expect(
    screen.getByRole("row", { name: /Earrings.*90,600 Abyss Points$/ }),
  ).toBeDefined();
  expect(
    screen.getByRole("row", { name: /Total.*181,200 Abyss Points$/ }),
  ).toBeDefined();
  expect(screen.getByText("One of each piece per character.")).toBeDefined();
});
