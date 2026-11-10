import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";
import { beforeEach, expect, test, vi } from "vitest";
import {
  progressionSections,
  progressionSourceIds,
} from "../../data/progression.ts";
import { sources } from "../../data/sources.ts";
import { renderWithProviders } from "../../testing/render.tsx";
import { Progression } from "./Progression.tsx";

function Where() {
  const { pathname, hash } = useLocation();

  return <output aria-label="location">{pathname + hash}</output>;
}

const renderPage = () =>
  renderWithProviders(
    <>
      <Progression />
      <Where />
    </>,
    { path: "/progression" },
  );

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

test("tells total item level apart from a piece's item level", () => {
  renderPage();

  const section = screen.getByRole("region", { name: "Item level" });

  expect(
    within(section).getByText(
      /Your total item level, shown on your character, is what opens content/,
    ),
  ).toBeDefined();
  expect(
    within(section).getByText(/Each gear piece also has its own item level/),
  ).toBeDefined();
  expect(
    within(section).getByText(/does not assume a starting number/),
  ).toBeDefined();
  expect(
    within(section).getByText(/Amulets and belts start at item level 13/),
  ).toBeDefined();
});

test("shows every guide section with a contents entry", () => {
  renderPage();

  const contents = screen.getByRole("navigation", { name: "Contents" });

  for (const { title } of progressionSections) {
    expect(screen.getByRole("region", { name: title })).toBeDefined();
    expect(within(contents).getByRole("button", { name: title })).toBeDefined();
  }
});

test("lists the gates in order of total item level", () => {
  renderPage();

  const rows = within(
    screen.getByRole("table", { name: /item-level gates/i }),
  ).getAllByRole("row");

  expect(rows[1].textContent).toMatch(/^700.*Krao Cave/);
  expect(
    rows.find((row) => row.textContent?.startsWith("2,600"))?.textContent,
  ).toContain("Krao Cave and Draupnir Hard");
  expect(
    rows.find((row) => row.textContent?.startsWith("2,700"))?.textContent,
  ).toContain("Urugugu Canyon and Vakron Sky Island Hard");
  expect(
    rows.find((row) => row.textContent?.startsWith("2,800"))?.textContent,
  ).toContain(
    "scheduled to return 4 November 2026; still upcoming when checked on 1 November",
  );
  expect(
    rows.find((row) => row.textContent?.startsWith("3,000"))?.textContent,
  ).toContain("Abyssal Forge: Ludra Hard");
  expect(rows.at(-1)?.textContent).toMatch(
    /^4,500.*Chalice of Muspel Advanced/,
  );
});

test("warns that skipping a cube locks out only that character", () => {
  renderPage();

  const section = screen.getByRole("region", {
    name: "Odyle Energy and reward counts",
  });

  expect(
    within(section).getByText(/At 0, only that character loses entry/),
  ).toBeDefined();
  expect(section.textContent).toContain("its own unobtained-cube count of 10");
  expect(section.textContent).toContain(
    "Other characters and players are unaffected",
  );
});

test("clarifies the 140 Featherdown split in the quest and Wings sections", () => {
  renderPage();

  const dungeons = screen.getByRole("region", {
    name: "Quests and Sealed Dungeons",
  });
  const wings = screen.getByRole("region", { name: "Wings" });

  expect(
    within(dungeons).getByText(
      /Of those 61, 60 give 2 Sealed Wing Featherdown on their first clear; Ruins of the Ancient City of Roah.*gives 20, for 140 total/,
    ),
  ).toBeDefined();
  expect(
    within(wings).getByText(
      /Of your faction's 61 Sealed Dungeons, 60 give 2 Featherdown each and Ruins of the Ancient City of Roah gives 20, for 140 total/,
    ),
  ).toBeDefined();
});

test("qualifies Global pet and Genus sharing as guide-reported", () => {
  renderPage();

  const section = screen.getByRole("region", { name: "Pets and Genus" });

  expect(
    within(section).getByText(
      /Global guides report that Pets and Genus Insight are shared by characters on the same server/,
    ),
  ).toBeDefined();
  expect(
    within(section).getByText(/not been confirmed in the Global client/),
  ).toBeDefined();
});

test("links detailed mechanics to their own pages", () => {
  renderPage();

  const linkTo = (section: string, name: RegExp) =>
    within(screen.getByRole("region", { name: section }))
      .getByRole("link", { name })
      .getAttribute("href");

  expect(linkTo("First gear at 45", /Gear/)).toBe("/gear");
  expect(linkTo("Daevanion boards", /Daevanion/)).toBe("/daevanion");
  expect(linkTo("Alts", /Alts/)).toBe("/alts");
  expect(linkTo("Routine", /checklist/)).toBe("/routine");
  expect(linkTo("Shops and Kina", /Materials/)).toBe("/growth");
  expect(linkTo("Closet and collections", /Skins/)).toBe("/skins");
  expect(linkTo("Stigmas", /Gear/)).toBe("/gear");
  expect(linkTo("Stigmas", /Growth/)).toBe("/growth");
  expect(linkTo("Pets and Genus", /Gear/)).toBe("/gear");
  expect(linkTo("Pets and Genus", /Growth/)).toBe("/growth");
});

test("summarizes Abyss Point sources and weekly limit behavior", () => {
  renderPage();

  const section = screen.getByRole("region", { name: "Abyss Points" });

  expect(
    within(section).getByText(
      /Middle Reshanta Duty scrolls give 2,000 AP each/,
    ),
  ).toBeDefined();
  expect(
    within(section).getByText(/Home-map Duty Missions give 1,000 AP each/),
  ).toBeDefined();
  expect(
    within(section).getByText(/shared 5-a-day Duty counter/),
  ).toBeDefined();
  expect(
    within(section).getByText(
      /Supply Requests are also outside the weekly AP limits/,
    ),
  ).toBeDefined();
  expect(
    within(section).getByText(/Abyss monster kills count toward the PvE limit/),
  ).toBeDefined();
  expect(
    within(section).getByText(
      /guide does not give the cap values or reduced rate/,
    ),
  ).toBeDefined();
  expect(
    within(section).getByText(/Arena of Tactics pays 1,000 AP per match/),
  ).toBeDefined();
  expect(
    within(section).getByText(/guide does not say whether Arena rewards count/),
  ).toBeDefined();
});

test("shows Stigma shard sources, purchase limits and guide wording", () => {
  renderPage();

  const section = screen.getByRole("region", { name: "Stigmas" });

  expect(within(section).getByText(/50 per step per character/)).toBeDefined();
  expect(
    within(section).getAllByText(
      /35 per character limit; no weekly reset is stated/,
    ),
  ).toHaveLength(2);
  expect(
    within(section).getByText(
      /Superior Stigma Shards from skill level 20 onward/,
    ),
  ).toBeDefined();
  expect(
    within(section).getByText(
      /Advice: consider Stigma Shards before ordinary consumables/,
    ),
  ).toBeDefined();
});

test("contents scroll to a section without touching the route", async () => {
  renderPage();

  await userEvent.click(
    within(screen.getByRole("navigation", { name: "Contents" })).getByRole(
      "button",
      {
        name: "Hidden Cubes",
      },
    ),
  );

  const heading = screen.getByRole("heading", { name: "Hidden Cubes" });

  expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  expect(document.activeElement).toBe(heading);
  expect(screen.getByRole("status", { name: "location" }).textContent).toBe(
    "/progression",
  );
  expect(window.location.hash).toBe("");
});

test("keeps the EU reset clock unresolved alongside the retained reports", () => {
  renderPage();

  const section = screen.getByRole("region", { name: "Routine" });

  expect(
    within(section).getByText(
      /Client data reports daily refills at 16:00 server time/,
    ),
  ).toBeDefined();
  expect(
    within(section).getByText(/EU reset clock is unresolved/),
  ).toBeDefined();
  expect(within(section).getByText(/07:00 UTC/)).toBeDefined();
});

test("distinguishes cube types by map and leaves unsupported scaling open", () => {
  renderPage();

  const section = screen.getByRole("region", { name: "Hidden Cubes" });
  const copy = section.textContent;

  expect(copy).toContain("Verteron and Altgard Hidden Cubes are all key-only");
  expect(copy).toContain(
    "Eltnen and Morheim can spawn free regular cubes or key-only cubes",
  );
  expect(copy).toContain("reward tables scale with your level");
  expect(copy).toContain(
    "The level-by-level amounts and formula are not listed",
  );
  expect(copy).toContain(
    "scaling for Verteron and Altgard key-only cubes is unconfirmed",
  );
});

test("names its sources and reviewed date in the footer", () => {
  renderPage();

  const footer = screen.getByRole("contentinfo");

  for (const id of progressionSourceIds)
    expect(footer.textContent).toContain(sources[id].name);

  expect(footer.textContent).toContain("My own gameplay checks");
  expect(footer.textContent).toMatch(/Reviewed 10 Nov/);
});
