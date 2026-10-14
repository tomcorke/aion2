import { screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import {
  festivalEntry,
  festivalKeys,
  festivalOpeningModel,
  festivalRewards,
  festivalSources,
} from "../../data/festival.ts";
import { sources } from "../../data/sources.ts";
import { renderWithProviders } from "../../testing/render.tsx";
import { Festival } from "./Festival.tsx";

const renderPage = () =>
  renderWithProviders(<Festival />, { path: "/festival" });

const rowsOf = (name: string) =>
  [...screen.getByRole("table", { name }).querySelectorAll("tbody tr")].map(
    (row) =>
      [...row.querySelectorAll("th, td")].map((cell) => cell.textContent),
  );

test("lists the nine games with players and round limits", () => {
  renderPage();

  const rows = rowsOf("Games");

  expect(rows).toHaveLength(9);
  expect(rows[0]).toEqual([
    "Jump Jump",
    "1–4",
    "2:55",
    "Collect Festival balloons and dodge lasers. Laser hits cost points.",
  ]);
  expect(rows[3]?.slice(0, 3)).toEqual(["Hidden Lugi", "2–9", "3:30"]);
  expect(rows[8]?.slice(0, 3)).toEqual(["Not This Tile?", "1–6", "3:15"]);
});

test("explains entry separately from observed EU availability and level caveats", () => {
  renderPage();

  const section = screen.getByRole("region", { name: "Entering" });

  for (const text of [
    festivalEntry.instructions,
    festivalEntry.availability,
    festivalEntry.scheduleCondition,
    festivalEntry.levelCondition,
  ])
    expect(within(section).getByText(text)).toBeDefined();
});

test("keeps participation, card and mapping caveats in the rewards section", () => {
  renderPage();

  const section = screen.getByRole("region", { name: "Rewards and cards" });

  for (const text of [
    festivalRewards.cards.selections,
    festivalRewards.sharedTable,
    festivalRewards.packageCondition,
    festivalRewards.mappingCondition,
  ])
    expect(within(section).getByText(text)).toBeDefined();

  for (const reward of festivalRewards.otherRewards)
    expect(within(section).getByText(reward)).toBeDefined();
});

test("shows key storage caps apart from the unresolved refill and membership scope", () => {
  renderPage();

  const section = screen.getByRole("region", { name: "Keys and membership" });

  expect(rowsOf("Festival Key storage")).toEqual([
    ["Normal", "12"],
    ["Special Quairerk membership", "21"],
  ]);
  expect(
    within(section).getByText(/Special Quairerk costs US\$14\.99 for 30 days/),
  ).toBeDefined();

  for (const text of [
    festivalKeys.storageCondition,
    festivalKeys.membership.condition,
    festivalKeys.refillCondition,
    festivalKeys.claimingCondition,
  ])
    expect(within(section).getByText(text)).toBeDefined();
});

test("shows the level-50 additional token odds and the 40.2 mean", () => {
  renderPage();

  const section = screen.getByRole("region", { name: "Token odds" });

  expect(rowsOf("Additional tokens per opening")).toEqual([
    ["30", "50%"],
    ["40", "30%"],
    ["60", "17%"],
    ["100", "3%"],
  ]);
  expect(within(section).getByText("40.2")).toBeDefined();
  expect(
    within(section).getByText(festivalOpeningModel.condition),
  ).toBeDefined();
});

test("prices outfits, accessories and wings in separate tables with their own totals", () => {
  renderPage();

  expect(rowsOf("Outfits")).toEqual([
    ["Lightpath Trace"],
    ["Gloves", "530"],
    ["Cloak", "530"],
    ["Helm", "680"],
    ["Pauldrons / shoulders", "680"],
    ["Boots", "680"],
    ["Greaves / legs", "800"],
    ["Breastplate / chest", "1,100"],
    ["Total", "5,000"],
    ["Skilled Expert"],
    ["Gloves", "2,650"],
    ["Cloak", "2,650"],
    ["Helm", "3,400"],
    ["Pauldrons / shoulders", "3,400"],
    ["Boots", "3,400"],
    ["Greaves / legs", "4,000"],
    ["Breastplate / chest", "5,400"],
    ["Total", "24,900"],
  ]);
  expect(rowsOf("Accessories")).toEqual([
    ["Twilight Loop"],
    ["Earrings", "530"],
    ["Necklace", "680"],
    ["Total", "1,210"],
    ["Starry Starry Night"],
    ["Earrings", "2,650"],
    ["Necklace", "3,400"],
    ["Total", "6,050"],
  ]);
  expect(rowsOf("Wings")).toEqual([
    ["Violet Butterfly Wings", "2,100"],
    ["Spirit Wings", "4,200"],
    ["Springflower Butterfly Wings", "8,350"],
  ]);

  const shop = screen.getByRole("region", { name: "Shop prices" });

  expect(
    within(shop).getByText(
      /Centuryroot Tokens, one of each piece per character/,
    ),
  ).toBeDefined();
  expect(within(shop).getByText(/Recheck the live shop/)).toBeDefined();
});

test("adds no simulator inputs or key budgets to the reference", () => {
  renderPage();

  expect(screen.queryAllByRole("spinbutton")).toEqual([]);
  expect(screen.queryAllByRole("textbox")).toEqual([]);
  expect(screen.queryByText(/keys needed|days to/i)).toBeNull();
});

test("names its sources and reviewed date in the footer", () => {
  renderPage();

  const footer = screen.getByRole("contentinfo");

  for (const id of festivalSources)
    expect(footer.textContent).toContain(sources[id].name);

  expect(footer.textContent).toContain("Reviewed 5 October 2026");
});
