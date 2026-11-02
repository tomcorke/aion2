import { screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { altsSections, altsSources } from "../../data/alts.ts";
import { sources } from "../../data/sources.ts";
import { renderWithProviders } from "../../testing/render.tsx";
import { Alts } from "./Alts.tsx";

const renderPage = () => renderWithProviders(<Alts />, { path: "/alts" });

test("orders the headings: title, ledger, cube warning, limits, then advice", () => {
  renderPage();

  expect(screen.getByRole("heading", { level: 1, name: "Alts" })).toBeDefined();
  expect(
    screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
  ).toEqual([
    "What carries over",
    "Skipped cubes can lock the main out",
    "Limits and refills",
    ...altsSections.map(({ title }) => title),
  ]);
});

test("warns prominently that an alt skipping cubes can lock the main out", () => {
  renderPage();

  const warning = screen.getByRole("region", {
    name: "Skipped cubes can lock the main out",
  });

  expect(
    within(warning).getByText(/An alt skipping cubes can lock the main out/),
  ).toBeDefined();
  expect(
    within(warning).getByText(/no character on that server can enter/),
  ).toBeDefined();
  expect(within(warning).getByText(/10 each week/)).toBeDefined();
});

test("keeps Kina scopes apart and corrects shared-progress claims", () => {
  renderPage();

  const shared = screen.getByRole("region", {
    name: "Shared on the same server",
  });
  const own = screen.getByRole("region", { name: "Each character" });

  expect(
    within(shared).getByText(/Deposit it in Server Storage/),
  ).toBeDefined();
  expect(within(own).getByText(/cannot be stored or sold/)).toBeDefined();
  expect(
    within(own).getByText(/Pantheon and titles are character-specific/),
  ).toBeDefined();
  expect(
    within(own).getByText(/Abyss Points belong to each character/),
  ).toBeDefined();
});

test("keeps both Daily Dungeons and both ticket effects on the shared counter", () => {
  renderPage();

  const dailyDungeon = screen.getByRole("row", { name: /Daily Dungeon/ });

  expect(dailyDungeon.textContent).toContain("Daeva Bio-Research Base");
  expect(dailyDungeon.textContent).toContain("Odylium Repository");
  expect(dailyDungeon.textContent).toContain("14 entries each week");
  expect(dailyDungeon.textContent).toContain(
    "unused entries are lost at the Wednesday reset",
  );
  expect(dailyDungeon.textContent).toContain(
    "Unknown Fissure Challenge Ticket adds 1 entry",
  );
  expect(dailyDungeon.textContent).toContain(
    "Instant Clear Ticket repeats its reward and still spends an attempt",
  );
  expect(dailyDungeon.textContent).toContain("30,000 Kina");
  expect(dailyDungeon.textContent).toContain(
    "current shop location is unconfirmed",
  );
});

test("keeps existing server-wide pool claims with the Daily Dungeon update", () => {
  renderPage();

  const sharedPools = screen.getByRole("listitem", {
    name: "Shared resource pools",
  });

  expect(sharedPools.textContent).toContain("Duty Missions");
  expect(sharedPools.textContent).toContain("unobtained-cube allowance");
  expect(sharedPools.textContent).toContain(
    "Festival and Dimensional Invasion keys",
  );
  expect(sharedPools.textContent).toContain("not been confirmed in play");
  expect(sharedPools.textContent).toContain(
    "Daeva Bio-Research Base and Odylium Repository",
  );
});

test("gives alt-count advice without a Korean profit gate", () => {
  renderPage();

  const advice = screen.getByRole("region", { name: "Start with one alt" });

  expect(
    within(advice).getByText(/As advice, start with one alt/),
  ).toBeDefined();
  expect(
    within(advice).getByText(/Do not use the Korean creator estimate/),
  ).toBeDefined();
});

test("cross-links Gear, Growth, Routine and Skins", () => {
  renderPage();

  const targets = screen
    .getAllByRole("link")
    .map((link) => link.getAttribute("href"));

  for (const to of ["/gear", "/growth", "/routine", "/skins"])
    expect(targets).toContain(to);
});

test("ends with the page's sources and reviewed date", () => {
  renderPage();

  const footer = screen.getByRole("contentinfo");

  expect(footer.textContent).toContain("Reviewed 2 November 2026");

  for (const id of altsSources)
    expect(footer.textContent).toContain(sources[id].name);
});
