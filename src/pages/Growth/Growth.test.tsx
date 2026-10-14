import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { resourceCounters } from "../../data/alts.ts";
import { gearRewardConditions } from "../../data/gear.ts";
import { growthMaterials, growthSources } from "../../data/growth.ts";
import { sources } from "../../data/sources.ts";
import { renderWithProviders } from "../../testing/render.tsx";
import { Growth } from "./Growth.tsx";

const renderPage = () => renderWithProviders(<Growth />, { path: "/growth" });

const table = () => screen.getByRole("table", { name: "Growth materials" });

const row = (name: string) =>
  within(table()).getByRole("rowheader", { name: new RegExp(`^${name}`) })
    .parentElement!;

const itemNames = () =>
  within(table())
    .queryAllByRole("rowheader")
    .map((cell) => cell.firstElementChild?.textContent);

const search = (text: string) =>
  userEvent.type(
    screen.getByRole("searchbox", { name: "Search materials" }),
    text,
  );

const chip = (name: string) =>
  within(screen.getByRole("group", { name: "What it grows" })).getByRole(
    "button",
    { name },
  );

test("lists every material in a labelled, focusable scroll region", () => {
  renderPage();

  expect(itemNames()).toHaveLength(growthMaterials.length);
  const region = screen.getByRole("region", { name: /scrolls sideways/ });

  expect(region.getAttribute("tabindex")).toBe("0");
  expect(region.contains(table())).toBe(true);
  expect(chip("All").getAttribute("aria-pressed")).toBe("true");
});

test("search matches names, aliases, uses and sources, ignoring case and spaces", async () => {
  renderPage();

  await search("  AP  ");
  expect(itemNames()).toContain("Abyss Points");

  await userEvent.clear(screen.getByRole("searchbox"));
  await search("GENUS INSIGHT");
  expect(itemNames()).toContain("Soul Crystals");

  await userEvent.clear(screen.getByRole("searchbox"));
  await search("roah");
  expect(itemNames()).toContain("Sealed Wing Featherdown (Bound)");
  expect(itemNames()).not.toContain("Kina");
});

test("one target chip combines with search", async () => {
  renderPage();

  await userEvent.click(chip("Engraving"));
  expect(chip("Engraving").getAttribute("aria-pressed")).toBe("true");
  expect(chip("All").getAttribute("aria-pressed")).toBe("false");
  expect(itemNames()).toContain("Lesser Manastone");
  expect(itemNames()).not.toContain("Soul Crystals");

  await search("lesser abyssal");
  expect(itemNames()).toEqual([
    "Lesser Abyssal Manastone",
    "Lesser Abyssal Soulstone",
  ]);

  await userEvent.click(chip("Wings"));
  expect(chip("Engraving").getAttribute("aria-pressed")).toBe("false");
  expect(screen.queryByRole("table")).toBeNull();
});

test("empty results offer a clear control that restores the table", async () => {
  renderPage();

  await userEvent.click(chip("Arcana"));
  await search("zzzz");
  expect(screen.queryByRole("table")).toBeNull();
  expect(screen.getByText(/No materials match/)).toBeDefined();

  const [clear] = screen.getAllByRole("button", { name: "Clear filters" });

  await userEvent.click(clear);
  expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
  expect(chip("All").getAttribute("aria-pressed")).toBe("true");
  expect(itemNames()).toHaveLength(growthMaterials.length);
  expect(screen.queryByRole("button", { name: "Clear filters" })).toBeNull();
});

test("currencies are labelled apart from upgrade materials", () => {
  renderPage();

  for (const name of ["Abyss Points", "Kina", "Centuryroot Tokens"])
    expect(within(row(name)).getByText("Currency")).toBeDefined();

  expect(
    within(row("Enhance Stones")).getByText("Upgrade material"),
  ).toBeDefined();
  expect(within(row("Abyss Points")).getByText("Also: AP")).toBeDefined();
});

test("stones show tier, pool and slots", () => {
  renderPage();

  const theostone = row("Rare Theostone");

  expect(within(theostone).getByText("Rare")).toBeDefined();
  expect(within(theostone).getByText("Slots: Weapon, Guard")).toBeDefined();

  expect(
    within(row("Lesser Abyssal Manastone")).getByText("Abyssal pool"),
  ).toBeDefined();
  expect(
    within(row("Superior Soulstone")).getByText("Ordinary pool"),
  ).toBeDefined();
});

test("limits come from shared counters and reward conditions, with conditions beside them", () => {
  renderPage();

  const stones = row("Enhance Stones");

  expect(
    within(stones).getByText(
      new RegExp(resourceCounters["daily-dungeon"].limit),
    ),
  ).toBeDefined();

  const exploration = gearRewardConditions.find(
    ({ id }) => id === "exploration",
  )!;

  expect(within(stones).getByText(exploration.notes[0])).toBeDefined();

  const featherdown = row("Sealed Wing Featherdown");

  expect(
    within(featherdown).getByText(/Finite 140 per character/),
  ).toBeDefined();
  expect(within(featherdown).getByText(/Bound and not tradable/)).toBeDefined();

  expect(
    within(row("Growth Pet Chest")).queryByText("No limit recorded."),
  ).toBeNull();
  expect(
    within(row("Creature souls")).getByText("No limit recorded."),
  ).toBeDefined();
});

test("spend guidance warns about finite wing supply and links with the router", async () => {
  renderPage();

  const advice = screen.getByRole("complementary", { name: "Spend guidance" });

  expect(
    within(advice).getByText(/all 140 home-faction Featherdown/),
  ).toBeDefined();
  expect(
    within(advice).getByText(
      /Pure Odyle acquisition|Pure Odyle is a supported/,
    ),
  ).toBeDefined();

  const link = within(advice).getAllByRole("link", {
    name: "Upgrade rules and loss warnings",
  })[0];

  expect(link.getAttribute("href")).toBe("/gear/enhancement");

  expect(
    within(row("Daevanion Crystals"))
      .getByRole("link", { name: "Board routes" })
      .getAttribute("href"),
  ).toBe("/daevanion");
  expect(
    within(row("Centuryroot Tokens"))
      .getByRole("link", { name: "Shugo Festival" })
      .getAttribute("href"),
  ).toBe("/festival");
});

test("the footer names the growth sources", () => {
  renderPage();

  const footer = screen.getByRole("contentinfo");

  for (const id of growthSources)
    expect(footer.textContent).toContain(sources[id].name);
});
