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
  expect(rows.at(-1)?.textContent).toMatch(
    /^4,500.*Chalice of Muspel Advanced/,
  );
});

test("warns that skipping a cube locks the whole server", () => {
  renderPage();

  const section = screen.getByRole("region", {
    name: "Odyle Energy and reward counts",
  });

  expect(
    within(section).getByText(/At 0, no character on that server can enter/),
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

test("names its sources and reviewed date in the footer", () => {
  renderPage();

  const footer = screen.getByRole("contentinfo");

  for (const id of progressionSourceIds)
    expect(footer.textContent).toContain(sources[id].name);

  expect(footer.textContent).toContain("My own checks");
  expect(footer.textContent).toMatch(/Reviewed 14 Oct/);
});
