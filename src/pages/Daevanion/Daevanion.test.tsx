import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation, useNavigate } from "react-router";
import { beforeEach, expect, test } from "vitest";
import { daevanionClasses, daevanionSources } from "../../data/daevanion.ts";
import { sources } from "../../data/sources.ts";
import { renderWithProviders } from "../../testing/render.tsx";
import { Daevanion } from "./Daevanion.tsx";

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

const renderPage = (path = "/daevanion") =>
  renderWithProviders(
    <>
      <Daevanion />
      <Where />
    </>,
    { path },
  );

const location = () =>
  screen.getByRole("status", { name: "location" }).textContent;

const selectedTab = () =>
  screen
    .getAllByRole("tab")
    .filter((tab) => tab.getAttribute("aria-selected") === "true")
    .map((tab) => tab.textContent);

const panel = () => within(screen.getByRole("tabpanel"));

const totals = () =>
  within(panel().getByRole("row", { name: /^All four boards/ }))
    .getAllByRole("cell")
    .map((cell) => cell.textContent);

beforeEach(() => localStorage.clear());

test("the root selects Spiritmaster and keeps the route assumptions visible", () => {
  renderPage();

  expect(selectedTab()).toEqual(["Spiritmaster"]);
  expect(totals()).toEqual(["409", "446", "453"]);
  expect(screen.getByText(/start from an empty board/)).toBeDefined();
  expect(screen.getByText(/not a damage simulation/)).toBeDefined();
  expect(screen.queryByText(/healing build/)).toBeNull();
});

test.each(daevanionClasses)(
  "a direct link shows $name's totals and skills",
  (entry) => {
    renderPage(`/daevanion/${entry.id}`);

    expect(selectedTab()).toEqual([entry.name]);
    expect(totals()).toEqual(
      ["damage", "utility", "defense"].map((variant) =>
        String(entry.routes[variant as "damage"].total),
      ),
    );

    const core = within(
      panel().getByRole("region", { name: "Core multipliers" }),
    );

    expect(
      core.getAllByRole("listitem").map((item) => item.textContent),
    ).toEqual(entry.skills.core);
  },
);

test("Cleric shows its damage-versus-healing caveat", () => {
  renderPage("/daevanion/cleric");

  expect(panel().getByText(/target damage, not a healing build/)).toBeDefined();
});

test("choosing a class changes the route, and history restores it", async () => {
  renderPage();

  await userEvent.click(screen.getByRole("tab", { name: "Chanter" }));

  expect(location()).toBe("/daevanion/chanter");
  expect(totals()).toEqual(["400", "446", "456"]);

  await userEvent.click(screen.getByRole("button", { name: "History back" }));

  expect(location()).toBe("/daevanion");
  expect(selectedTab()).toEqual(["Spiritmaster"]);

  await userEvent.click(
    screen.getByRole("button", { name: "History forward" }),
  );

  expect(selectedTab()).toEqual(["Chanter"]);
});

test("arrow keys move between class tabs", async () => {
  renderPage("/daevanion/gladiator");

  screen.getByRole("tab", { name: "Gladiator" }).focus();
  await userEvent.keyboard("{ArrowRight}");

  expect(location()).toBe("/daevanion/templar");
  expect(document.activeElement?.textContent).toBe("Templar");
});

test("an unknown class says so and leaves the tabs usable", () => {
  renderPage("/daevanion/healer");

  expect(screen.getByText(/There is no “healer” class/)).toBeDefined();
  expect(screen.queryByRole("tabpanel")).toBeNull();
  expect(selectedTab()).toEqual([]);
  expect(screen.getByRole("tab", { name: "Gladiator" }).tabIndex).toBe(0);
  expect(screen.getByText(/never spends points/)).toBeDefined();
});

test("Azphel stays outside the class panel", () => {
  renderPage("/daevanion/ranger");

  expect(panel().queryByText(/Azphel crystals/)).toBeNull();
  expect(
    screen.getByRole("region", { name: "Azphel, shared by every class" }),
  ).toBeDefined();
});

test("names its sources and reviewed date in the footer", () => {
  renderPage();

  const footer = screen.getByRole("contentinfo");

  for (const id of daevanionSources)
    expect(footer.textContent).toContain(sources[id].name);

  expect(footer.textContent).toMatch(/Reviewed 10 Oct/);
});
