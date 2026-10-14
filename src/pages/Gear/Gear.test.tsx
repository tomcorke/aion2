import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation, useNavigate } from "react-router";
import { beforeEach, expect, test } from "vitest";
import { gearSources } from "../../data/gear.ts";
import { sources } from "../../data/sources.ts";
import { renderWithProviders } from "../../testing/render.tsx";
import { Gear } from "./Gear.tsx";

function Where() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <output aria-label="location">{pathname}</output>
      <button type="button" onClick={() => navigate(-1)}>
        History back
      </button>
      <button type="button" onClick={() => navigate(1)}>
        History forward
      </button>
    </>
  );
}

const renderPage = (path = "/gear") =>
  renderWithProviders(
    <>
      <Gear />
      <Where />
    </>,
    { path },
  );

const location = () =>
  screen.getByRole("status", { name: "location" }).textContent;

const tierPanel = () => screen.getByRole("tabpanel");

beforeEach(() => localStorage.clear());

test("the root selects starter gear", () => {
  renderPage();

  expect(
    screen.getByRole("tab", { name: "Starter" }).getAttribute("aria-selected"),
  ).toBe("true");
  expect(
    within(tierPanel()).getByRole("cell", { name: "Spectral and Fantasy" }),
  ).toBeDefined();
});

test("a direct tier URL selects that tier", () => {
  renderPage("/gear/86");

  expect(
    screen.getByRole("tab", { name: "86" }).getAttribute("aria-selected"),
  ).toBe("true");
  expect(
    within(tierPanel()).getByRole("cell", { name: "Enraged Kromede" }),
  ).toBeDefined();
  expect(
    within(tierPanel()).queryByRole("cell", { name: "Rupture" }),
  ).toBeNull();
});

test("choosing a tier changes the route, and history restores it", async () => {
  renderPage();

  await userEvent.click(screen.getByRole("tab", { name: "70" }));

  expect(location()).toBe("/gear/70");
  expect(
    within(tierPanel()).getByRole("cell", { name: "Aulamus" }),
  ).toBeDefined();

  await userEvent.click(screen.getByRole("button", { name: "History back" }));

  expect(location()).toBe("/gear");
  expect(
    screen.getByRole("tab", { name: "Starter" }).getAttribute("aria-selected"),
  ).toBe("true");

  await userEvent.click(
    screen.getByRole("button", { name: "History forward" }),
  );

  expect(
    screen.getByRole("tab", { name: "70" }).getAttribute("aria-selected"),
  ).toBe("true");
});

test("an unknown tier says so and offers the tiers", () => {
  renderPage("/gear/999");

  expect(screen.getByText(/There is no “999” gear tier/)).toBeDefined();
  expect(screen.queryByRole("tabpanel")).toBeNull();

  for (const tab of screen.getAllByRole("tab"))
    expect(tab.getAttribute("aria-selected")).toBe("false");

  expect(screen.getByRole("tab", { name: "Starter" }).tabIndex).toBe(0);
});

test("the gate track tells totals apart from piece levels", () => {
  renderPage("/gear/54");

  const track = within(screen.getByRole("region", { name: "Gate track" }));

  expect(
    track.getByText(/Total item level is the sum on your character/),
  ).toBeDefined();
  expect(
    track.getByRole("definition", { name: "Piece item level" }).textContent,
  ).toBe("54");
  expect(
    track.getByRole("definition", { name: "Opens at total item level" })
      .textContent,
  ).toMatch(/^700.*Krao Cave Conquest.*Draupnir Conquest/);
  expect(
    track.getByRole("definition", { name: "Next tier" }).textContent,
  ).toMatch(/70 pieces.*1,400/);
  expect(
    track.getByRole("link", { name: /Progression/ }).getAttribute("href"),
  ).toBe("/progression");
});

test("starter gear spans its piece levels without a made-up gate", () => {
  renderPage();

  const track = within(screen.getByRole("region", { name: "Gate track" }));

  expect(
    track.getByRole("definition", { name: "Piece item level" }).textContent,
  ).toBe("36–46");
  expect(
    track.queryByRole("definition", { name: "Opens at total item level" }),
  ).toBeNull();
});

test("tier rows show source, mode, slots, levels and conditions", () => {
  renderPage("/gear/54");

  const row = within(tierPanel()).getByRole("row", {
    name: /Kaira Breastplate.*Watcher Kaira/,
  });

  expect(row.textContent).toContain("Watcher Kaira");
  expect(row.textContent).toContain("Lower Reshanta");
  expect(row.textContent).toContain("Breastplate");
  expect(row.textContent).toContain("62");
  expect(row.textContent).toContain("1,000");

  const rules = within(screen.getByRole("region", { name: "Reward rules" }));

  expect(
    rules.getByText(/locks for every character on that server/),
  ).toBeDefined();
});

test("crafting names follow the faction preference", async () => {
  renderPage("/gear/70");

  expect(
    within(tierPanel()).getByRole("cell", { name: "True Dragon Lord" }),
  ).toBeDefined();

  await userEvent.click(screen.getByRole("button", { name: "Asmodians" }));

  expect(
    within(tierPanel()).getByRole("cell", { name: "Star line" }),
  ).toBeDefined();
  expect(
    within(tierPanel()).queryByRole("cell", { name: "True Dragon Lord" }),
  ).toBeNull();
  expect(
    screen
      .getByRole("button", { name: "Asmodians" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
});

test("the drop matrix finds activities for a missing slot", async () => {
  renderPage();

  const matrix = screen.getByRole("table", { name: /Activity drop matrix/ });

  expect(
    within(matrix).getByRole("row", { name: /Ascension Trial/ }).textContent,
  ).toContain("Unique Amplify Stone Fragment");

  await userEvent.click(screen.getByRole("button", { name: "Breastplate" }));

  const sources = within(matrix)
    .getAllByRole("rowheader")
    .map((cell) => cell.textContent);

  expect(sources).toEqual([
    expect.stringContaining("Silent Dartan"),
    expect.stringContaining("Soul Ruler Kashapa"),
    expect.stringContaining("High Commander Lagta"),
    expect.stringContaining("Watcher Kaira"),
    expect.stringContaining("Executor Kaira"),
    expect.stringContaining("Eternal Gartua"),
  ]);
});

test("material-only rows keep their reward conditions", () => {
  renderPage();

  const row = (name: RegExp) =>
    within(
      screen.getByRole("table", { name: /Activity drop matrix/ }),
    ).getByRole("row", { name }).textContent;

  expect(row(/^Deus Research Base/)).toMatch(
    /Tier 4.*Unique Chalice drops only in tier 4/,
  );
  expect(row(/^Deus Research Base/)).toContain("refills by 1 every 12 hours");
  expect(row(/^Deus Research Base/)).toContain(
    "locks for every character on that server",
  );
  expect(row(/^Ascension Trial/)).toContain(
    "Reward amounts rise with difficulty and final score.",
  );
  expect(row(/^Ascension Trial/)).toContain(
    "An Ascension Binding Chest yields a Manastone or Soulstone.",
  );
  expect(row(/^Silent Graveyard/)).toContain(
    "7 hours per Growth dungeon each week",
  );
});

test("pity shows run counts and membership counting, no counter", () => {
  renderPage();

  const pity = within(screen.getByRole("region", { name: "Pity" }));

  expect(
    pity.getByRole("row", { name: /^Conquest: Krao Cave, Draupnir/ })
      .textContent,
  ).toContain("14");
  expect(
    pity.getByRole("row", { name: /^Conquest: Fire Temple/ }).textContent,
  ).toContain("28");

  const exploration = pity.getByRole("row", { name: /^Exploration/ });

  expect(exploration.textContent).toContain("3");
  expect(exploration.textContent).toContain("Each run counts as 2");
  expect(
    pity.getByText(/contents of each pity reward were not recorded/),
  ).toBeDefined();
  expect(pity.queryByRole("spinbutton")).toBeNull();
  expect(pity.queryByRole("button")).toBeNull();
});

test("names its sources and reviewed date in the footer", () => {
  renderPage();

  const footer = screen.getByRole("contentinfo");

  for (const id of gearSources)
    expect(footer.textContent).toContain(sources[id].name);

  expect(footer.textContent).toMatch(/Reviewed 13 Oct/);
});
