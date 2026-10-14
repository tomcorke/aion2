import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { beforeEach, expect, test, vi } from "vitest";
import {
  gearUpgradeSections,
  gearUpgradesSources,
} from "../../data/gearUpgrades.ts";
import { sources } from "../../data/sources.ts";
import { renderWithProviders } from "../../testing/render.tsx";
import { Gear } from "../Gear/Gear.tsx";
import { Enhancement } from "./Enhancement.tsx";

function Where() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <output aria-label="location">{pathname}</output>
      <button type="button" onClick={() => navigate(-1)}>
        History back
      </button>
    </>
  );
}

// Mirrors main.tsx: the explicit route wins over gear/:tier.
const renderAt = (path: string) =>
  renderWithProviders(
    <>
      <Routes>
        <Route path="/gear" element={<Gear />} />
        <Route path="/gear/enhancement" element={<Enhancement />} />
        <Route path="/gear/:tier" element={<Gear />} />
      </Routes>
      <Where />
    </>,
    { path },
  );

const location = () =>
  screen.getByRole("status", { name: "location" }).textContent;

const section = (name: string) => screen.getByRole("region", { name });

beforeEach(() => {
  localStorage.clear();
  Element.prototype.scrollIntoView = vi.fn();
});

test("a direct URL opens upgrade guidance, not a missing tier", () => {
  renderAt("/gear/enhancement");

  expect(
    screen.getByRole("heading", { level: 1, name: "Gear upgrades" }),
  ).toBeDefined();
  expect(screen.queryByText(/There is no “enhancement” gear tier/)).toBeNull();

  for (const { title } of gearUpgradeSections)
    expect(section(title)).toBeDefined();
});

test("links both ways between tiers and upgrades, and history returns", async () => {
  renderAt("/gear/70");

  await userEvent.click(
    screen.getByRole("link", { name: /Enhancement and upgrades/ }),
  );

  expect(location()).toBe("/gear/enhancement");

  await userEvent.click(screen.getByRole("button", { name: "History back" }));

  expect(location()).toBe("/gear/70");
  expect(
    screen.getByRole("tab", { name: "70" }).getAttribute("aria-selected"),
  ).toBe("true");

  await userEvent.click(
    screen.getByRole("link", { name: /Enhancement and upgrades/ }),
  );
  await userEvent.click(
    screen.getByRole("link", { name: /Gear tiers and drops/ }),
  );

  expect(location()).toBe("/gear");
});

test("ordinary enhancement shows caps, safe range, rates and pity", () => {
  renderAt("/gear/enhancement");

  const ordinary = within(section("Ordinary enhancement"));

  expect(ordinary.getByRole("row", { name: /^Unique/ }).textContent).toMatch(
    /\+10.*\+15/,
  );
  expect(ordinary.getByRole("row", { name: /^\+11/ }).textContent).toContain(
    "65%",
  );
  expect(ordinary.getByText(/adds 5 percentage points/)).toBeDefined();
  expect(ordinary.getByText(/never loses levels/)).toBeDefined();
});

test("Amplified Enhancement keeps its own rate table", () => {
  renderAt("/gear/enhancement");

  const amplified = within(section("Amplified Enhancement"));

  expect(
    amplified.getByRole("table", { name: /Amplified Enhancement/ }),
  ).toBeDefined();
  expect(amplified.getByRole("row", { name: /^\+1 / }).textContent).toContain(
    "66%",
  );
  expect(
    within(section("Ordinary enhancement")).queryByRole("table", {
      name: /Amplified/,
    }),
  ).toBeNull();
});

test("loss warnings sit beside their advice", () => {
  renderAt("/gear/enhancement");

  expect(
    within(section("Clash Runes are different")).getByRole("note").textContent,
  ).toMatch(/destroys the rune/);
  expect(
    within(section("Ordinary enhancement")).queryByRole("note"),
  ).toBeNull();
  expect(within(section("Extraction")).getByRole("note").textContent).toMatch(
    /not Kina/,
  );
});

test("recipes and Transfer are separate, with Transfer's losses", () => {
  renderAt("/gear/enhancement");

  expect(
    within(section("Crafting and upgrade recipes")).getByText(
      /This is not Enhancement Transfer/,
    ),
  ).toBeDefined();
  expect(
    within(section("Enhancement Transfer")).getByRole("note").textContent,
  ).toMatch(
    /Potential, Manastones, Theostones.*do not carry over.*live preview/,
  );
});

test("Soul Binding steps stay distinct and unknowns stay qualified", () => {
  renderAt("/gear/enhancement");

  for (const name of [
    "Potential",
    "Soul Binding: Bind",
    "Soul Binding: Sync",
    "Soul Binding: Reset",
    "Soul Binding: Soul Fuse",
  ])
    expect(section(name)).toBeDefined();

  expect(
    within(section("Soul Binding: Sync")).getByRole("note").textContent,
  ).toMatch(/live preview/);
});

test("engraving explains stone kinds, slots and removal loss, and links Growth", () => {
  renderAt("/gear/enhancement");

  const engraving = within(section("Engraving"));

  expect(
    engraving.getByRole("row", { name: /^Theostone/ }).textContent,
  ).toMatch(/Weapon, Guard.*destroys it/);
  expect(engraving.getByRole("row", { name: /^Unique/ }).textContent).toMatch(
    /^Unique42,000$/,
  );
  expect(
    engraving.getByRole("row", { name: /^Superior/ }).textContent,
  ).toContain("Unique 15%");
  expect(
    engraving
      .getByRole("link", { name: /Stone acquisition/ })
      .getAttribute("href"),
  ).toBe("/growth");
});

test("power outside gear links to Daevanion and Growth", () => {
  renderAt("/gear/enhancement");

  expect(
    within(section("Daevanion boards"))
      .getByRole("link", { name: /Board routes/ })
      .getAttribute("href"),
  ).toBe("/daevanion");
  expect(within(section("Wings")).getByRole("note").textContent).toMatch(
    /140 Featherdown/,
  );
  expect(
    within(section("Arcana"))
      .getByRole("link", { name: /Arcana materials/ })
      .getAttribute("href"),
  ).toBe("/growth");
});

test("adds no calculators or saved loadouts", () => {
  renderAt("/gear/enhancement");

  expect(screen.queryByRole("spinbutton")).toBeNull();
  expect(screen.queryByRole("checkbox")).toBeNull();
  expect(screen.queryByRole("textbox")).toBeNull();
});

test("names its sources and reviewed date in the footer", () => {
  renderAt("/gear/enhancement");

  const footer = screen.getByRole("contentinfo");

  for (const id of gearUpgradesSources)
    expect(footer.textContent).toContain(sources[id].name);

  expect(footer.textContent).toMatch(/Reviewed 13 Oct/);
});
