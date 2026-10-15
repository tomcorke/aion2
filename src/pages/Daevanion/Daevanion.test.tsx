import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation, useNavigate } from "react-router";
import { beforeEach, expect, test } from "vitest";
import {
  daevanionClasses,
  daevanionSources,
  daevanionVariants,
} from "../../data/daevanion.ts";
import { sources } from "../../data/sources.ts";
import { renderWithProviders } from "../../testing/render.tsx";
import { Daevanion } from "./Daevanion.tsx";

function Where() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <output aria-label="location">{pathname + search}</output>
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

const selectedTabs = () =>
  screen.getAllByRole("tab", { selected: true }).map((tab) => tab.textContent);

const classPanel = () => within(screen.getAllByRole("tabpanel")[0]);

const totals = () =>
  within(classPanel().getByRole("row", { name: /^All four boards/ }))
    .getAllByRole("cell")
    .map((cell) => cell.textContent);

const diagram = (board = "Nezekan") =>
  screen.findByRole("group", { name: `${board} board diagram` });

const summary = () => screen.getByText(/^Buys the first/).textContent;

const back = () =>
  userEvent.click(screen.getByRole("button", { name: "History back" }));

const spiritmaster = daevanionClasses.find(({ id }) => id === "spiritmaster")!;

beforeEach(() => localStorage.clear());

test("the root selects Spiritmaster, Nezekan, Damage and no points", async () => {
  renderPage();

  await diagram();

  expect(selectedTabs()).toEqual(["Spiritmaster", "Nezekan", "Damage"]);
  expect(totals()).toEqual(["409", "446", "453"]);
  expect(screen.getByRole("slider", { name: "Point budget" })).toHaveProperty(
    "value",
    "0",
  );
  expect(summary()).toMatch(/^Buys the first 0 purchases of 65 for 0 points/);
  expect(screen.getAllByText(/start from an empty board/)).toHaveLength(2);
  expect(screen.getByText(/not a damage simulation/)).toBeDefined();
  expect(screen.queryByText(/healing build/)).toBeNull();
});

test.each(daevanionClasses)(
  "a direct link shows $name's totals and skills",
  (entry) => {
    renderPage(`/daevanion/${entry.id}`);

    expect(selectedTabs()[0]).toBe(entry.name);
    expect(totals()).toEqual(
      daevanionVariants.map(({ id }) => String(entry.routes[id].total)),
    );

    const core = within(
      classPanel().getByRole("region", { name: "Core multipliers" }),
    );

    expect(
      core.getAllByRole("listitem").map((item) => item.textContent),
    ).toEqual(entry.skills.core);
  },
);

test("other classes keep the overview without a guessed diagram", () => {
  renderPage("/daevanion/cleric/zikel/damage");

  expect(
    classPanel().getByText(/target damage, not a healing build/),
  ).toBeDefined();
  expect(screen.getByText(/cover Spiritmaster for now/)).toBeDefined();
  expect(screen.queryByRole("group", { name: /board diagram/ })).toBeNull();
  expect(
    screen.getByRole("link", { name: "The Azphel route" }).getAttribute("href"),
  ).toBe("/daevanion/spiritmaster/azphel");
});

test.each(
  (["nezekan", "zikel", "vaizel", "triniel"] as const).flatMap((board) =>
    daevanionVariants.map((variant) => ({ board, variant })),
  ),
)(
  "a direct link opens $board with the $variant.id route in full",
  async ({ board, variant }) => {
    const total = spiritmaster.routes[variant.id].boardCosts[board];
    const name = board[0].toUpperCase() + board.slice(1);

    renderPage(`/daevanion/spiritmaster/${board}/${variant.id}?points=999`);

    await diagram(name);

    expect(selectedTabs()).toEqual(["Spiritmaster", name, variant.label]);
    expect(screen.getByText(`${total} of ${total} points`)).toBeDefined();
    expect(
      screen.getByText(
        `Budget adjusted to ${total} whole points (0–${total}).`,
      ),
    ).toBeDefined();
    expect(summary()).toMatch(/The whole route fits this budget\.$/);
    expect(location()).toBe(
      `/daevanion/spiritmaster/${board}/${variant.id}?points=999`,
    );
  },
);

test("Azphel shows its shared phases and limits, not the PvE routes", async () => {
  renderPage("/daevanion/spiritmaster/azphel?points=36");

  await diagram("Azphel");

  expect(selectedTabs()).toEqual(["Spiritmaster", "Azphel"]);
  expect(screen.queryByRole("tablist", { name: "Route" })).toBeNull();

  const order = within(screen.getByRole("region", { name: "Purchase order" }));

  expect(
    order.getAllByRole("heading", { level: 4 }).map((h) => h.textContent),
  ).toEqual([
    "HP and MP: 36 points, 36 in total",
    "Status Effect nodes: 78 points, 114 in total",
  ]);
  expect(summary()).toBe(
    "Buys the first 30 purchases of 74 for 36 points, with 0 left over. Next: Status Effect Chance +1% (row 5, column 8) costs 3 points, 3 more than you have left.",
  );
  expect(screen.getAllByText(/own Azphel crystals/).length).toBeGreaterThan(0);
  expect(
    screen.getAllByText(
      /value against PvE monsters and bosses is not confirmed/,
    ),
  ).toHaveLength(2);
  expect(screen.getAllByText(/24 non-PvP targets for 110 points/)).toHaveLength(
    2,
  );
});

test("an Azphel link with a PvE route explains that only one route exists", async () => {
  renderPage("/daevanion/spiritmaster/azphel/damage");

  await diagram("Azphel");

  expect(
    screen.getByText(
      /one shared route for every class; “damage” does not apply/,
    ),
  ).toBeDefined();
});

const linksWithoutNaN = () =>
  screen
    .getAllByRole("tab")
    .every((tab) => !tab.getAttribute("href")!.includes("NaN"));

test("unknown boards and routes say so and keep the tabs usable", async () => {
  const { unmount } = renderPage("/daevanion/spiritmaster/abyss?points=50");

  expect(screen.getByText(/There is no “abyss” board/)).toBeDefined();
  expect(selectedTabs()).toEqual(["Spiritmaster"]);
  expect(screen.queryByRole("tablist", { name: "Route" })).toBeNull();
  expect(linksWithoutNaN()).toBe(true);
  expect(screen.getByRole("tab", { name: "Zikel" }).getAttribute("href")).toBe(
    "/daevanion/spiritmaster/zikel/damage?points=50",
  );
  unmount();

  renderPage("/daevanion/spiritmaster/zikel/healer?points=50");

  expect(screen.getByText(/There is no “healer” route/)).toBeDefined();
  expect(selectedTabs()).toEqual(["Spiritmaster", "Zikel"]);
  expect(screen.queryByRole("group", { name: /board diagram/ })).toBeNull();
  expect(linksWithoutNaN()).toBe(true);

  await userEvent.click(screen.getByRole("tab", { name: "Damage" }));

  expect(await diagram("Zikel")).toBeDefined();
});

test.each([
  [
    "0",
    null,
    "Buys the first 0 purchases of 65 for 0 points, with 0 left over. Next: Defense Bonus +30 (row 9, column 8) costs 1 point, 1 more than you have left.",
  ],
  [
    "10",
    null,
    "Buys the first 7 purchases of 65 for 8 points, with 2 left over. Next: Summon: Earth Spirit +1 rank (row 12, column 11) costs 3 points, 1 more than you have left.",
  ],
  [
    "11",
    null,
    "Buys the first 8 purchases of 65 for 11 points, with 0 left over.",
  ],
  [
    "-5",
    "Budget adjusted to 0 whole points (0–107).",
    "Buys the first 0 purchases",
  ],
  [
    "2.5",
    "Budget adjusted to 2 whole points (0–107).",
    "Buys the first 2 purchases of 65 for 2 points",
  ],
  [
    "abc",
    "Enter a finite, non-negative whole point budget.",
    "Buys the first 0 purchases",
  ],
  [
    "Infinity",
    "Enter a finite, non-negative whole point budget.",
    "Buys the first 0 purchases",
  ],
])(
  "a budget of %s buys only whole, connected purchases",
  async (points, message, text) => {
    renderPage(`/daevanion/spiritmaster/nezekan/damage?points=${points}`);

    await diagram();

    expect(summary().startsWith(text)).toBe(true);

    if (message) expect(screen.getByText(message)).toBeDefined();

    // Normalising is shown, not written back over the reader's history entry.
    expect(location()).toBe(
      `/daevanion/spiritmaster/nezekan/damage?points=${points}`,
    );
  },
);

test("board and route tabs push history, and Back restores each view", async () => {
  renderPage();

  await diagram();
  await userEvent.click(screen.getByRole("tab", { name: "Zikel" }));
  await userEvent.click(screen.getByRole("tab", { name: "Damage + utility" }));

  expect(location()).toBe("/daevanion/spiritmaster/zikel/utility");

  await diagram("Zikel");
  await back();

  expect(location()).toBe("/daevanion/spiritmaster/zikel/damage");
  expect(selectedTabs()).toEqual(["Spiritmaster", "Zikel", "Damage"]);

  await back();

  expect(selectedTabs()).toEqual(["Spiritmaster", "Nezekan", "Damage"]);
  expect(await diagram()).toBeDefined();
});

test("changing board or route clamps the budget to the new route", async () => {
  renderPage("/daevanion/spiritmaster/triniel/defense?points=133");

  await diagram("Triniel");
  await userEvent.click(screen.getByRole("tab", { name: "Nezekan" }));

  expect(location()).toBe("/daevanion/spiritmaster/nezekan/defense?points=115");

  await userEvent.click(screen.getByRole("tab", { name: "Damage" }));

  expect(location()).toBe("/daevanion/spiritmaster/nezekan/damage?points=107");

  await userEvent.click(screen.getByRole("tab", { name: "Azphel" }));

  expect(location()).toBe("/daevanion/spiritmaster/azphel?points=107");
});

test("switching class keeps the board, route and budget", async () => {
  renderPage("/daevanion/spiritmaster/vaizel/utility?points=20");

  await diagram("Vaizel");
  await userEvent.click(screen.getByRole("tab", { name: "Gladiator" }));

  expect(location()).toBe("/daevanion/gladiator/vaizel/utility?points=20");
  expect(screen.getByText(/cover Spiritmaster for now/)).toBeDefined();

  await userEvent.click(screen.getByRole("tab", { name: "Spiritmaster" }));

  expect(await diagram("Vaizel")).toBeDefined();
  expect(selectedTabs()).toEqual([
    "Spiritmaster",
    "Vaizel",
    "Damage + utility",
  ]);
});

test("the scrubber replaces the current entry instead of adding history", async () => {
  renderPage();

  await diagram();
  await userEvent.click(screen.getByRole("tab", { name: "Zikel" }));
  await diagram("Zikel");

  fireEvent.change(screen.getByRole("slider", { name: "Point budget" }), {
    target: { value: "11" },
  });

  expect(location()).toBe("/daevanion/spiritmaster/zikel/damage?points=11");

  fireEvent.change(screen.getByRole("slider", { name: "Point budget" }), {
    target: { value: "0" },
  });

  expect(location()).toBe("/daevanion/spiritmaster/zikel/damage");

  await back();

  expect(location()).toBe("/daevanion");
});

test("names its sources and reviewed date in the footer", () => {
  renderPage();

  const footer = screen.getByRole("contentinfo");

  for (const id of daevanionSources)
    expect(footer.textContent).toContain(sources[id].name);

  expect(footer.textContent).toMatch(/Reviewed 10 Oct/);
});
