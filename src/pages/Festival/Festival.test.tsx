import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation, useNavigate } from "react-router";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
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

function Where() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <output aria-label="location">{pathname + search}</output>
      <button type="button" onClick={() => navigate(-1)}>
        History back
      </button>
    </>
  );
}

const renderAt = (path: string) =>
  renderWithProviders(
    <>
      <Festival />
      <Where />
    </>,
    { path },
  );

const location = () =>
  screen.getByRole("status", { name: "location" }).textContent;

const figure = (name: RegExp) =>
  within(screen.getByRole("region", { name: /^Results/ })).getByRole(
    "definition",
    { name },
  ).textContent;

describe("simulator", () => {
  // Every draw lands in the first band: 30 tokens per opening.
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("defaults to 100 openings, no tokens, Lightpath Trace and no participation", () => {
    renderAt("/festival/simulator");

    expect(
      screen
        .getByRole("tab", { name: "Token simulator" })
        .getAttribute("aria-selected"),
    ).toBe("true");
    expect(screen.getByRole("textbox", { name: "Openings" })).toHaveProperty(
      "value",
      "100",
    );
    expect(
      screen.getByRole("textbox", { name: "Starting tokens" }),
    ).toHaveProperty("value", "0");
    expect(screen.getByRole("combobox", { name: "Target" })).toHaveProperty(
      "value",
      "lightpath-trace",
    );
    expect(screen.getByRole("checkbox")).toHaveProperty("checked", false);

    expect(figure(/Chance to reach 5,000/)).toBe("0%");
    expect(figure(/Sample mean/)).toBe("3,000");
    expect(figure(/Expected total/)).toBe("4,020");
    expect(screen.getByRole("row", { name: /^3,000 2,000/ })).toBeDefined();
  });

  test("restores inputs from the URL, including explicit participation", () => {
    renderAt(
      "/festival/simulator?openings=200&startTokens=10&target=spirit-wings&participation=true",
    );

    expect(screen.getByRole("combobox", { name: "Target" })).toHaveProperty(
      "value",
      "spirit-wings",
    );
    expect(screen.getByRole("checkbox")).toHaveProperty("checked", true);
    expect(figure(/Chance to reach 4,200/)).toBe("100%");
    expect(figure(/Sample mean/)).toBe("16,010");
    expect(figure(/Expected total/)).toBe("18,050");
    expect(
      screen.getByText(
        /2,000 of 2,000 sampled runs of 200 openings reached Spirit Wings/,
      ),
    ).toBeDefined();
  });

  test.each([
    ["openings=1001", /Openings must be a whole number from 0 to 1,000/],
    ["openings=1.5", /Openings must be a whole number from 0 to 1,000/],
    ["startTokens=-5", /Starting tokens must be a nonnegative safe integer/],
    [
      "openings=1&startTokens=9007199254740991",
      /Starting tokens plus the maximum modeled reward/,
    ],
    ["target=nope", /Choose a supported purchase/],
    ["openings=1&openings=2", /appear only once/],
  ])("explains invalid URL input %s without results", (query, message) => {
    renderAt(`/festival/simulator?${query}`);

    expect(screen.getByText(message)).toBeDefined();
    expect(screen.getByRole("alert").textContent).toMatch(/No results/);
    expect(screen.queryByRole("region", { name: /^Results/ })).toBeNull();
  });

  test("labels results stale while inputs change, then runs into history", async () => {
    renderAt("/festival/simulator");

    const openings = screen.getByRole("textbox", { name: "Openings" });

    await userEvent.clear(openings);
    await userEvent.type(openings, "200");

    expect(
      screen.getByRole("heading", { name: "Results for the previous inputs" }),
    ).toBeDefined();
    expect(figure(/Sample mean/)).toBe("3,000");

    await userEvent.click(
      screen.getByRole("button", { name: "Run simulation" }),
    );

    expect(location()).toBe(
      "/festival/simulator?openings=200&startTokens=0&target=lightpath-trace&participation=false",
    );
    expect(screen.getByRole("heading", { name: "Results" })).toBeDefined();
    expect(figure(/Sample mean/)).toBe("6,000");

    await userEvent.click(screen.getByRole("button", { name: "History back" }));

    expect(location()).toBe("/festival/simulator");
    expect(screen.getByRole("textbox", { name: "Openings" })).toHaveProperty(
      "value",
      "100",
    );
    expect(figure(/Sample mean/)).toBe("3,000");
  });

  test("a custom target goes into the URL and is reachable", async () => {
    renderAt("/festival/simulator");

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Target" }),
      "custom",
    );
    const custom = screen.getByRole("textbox", {
      name: "Custom target tokens",
    });

    await userEvent.clear(custom);
    await userEvent.type(custom, "3000");
    await userEvent.click(
      screen.getByRole("button", { name: "Run simulation" }),
    );

    expect(location()).toContain("target=custom");
    expect(location()).toContain("customTarget=3000");
    expect(figure(/Chance to reach 3,000/)).toBe("100%");
  });

  test("a bad custom amount beside a named target is shown and run drops it", async () => {
    renderAt("/festival/simulator?target=lightpath-trace&customTarget=-1");

    const custom = screen.getByRole("textbox", {
      name: "Custom target tokens",
    });

    expect(custom.getAttribute("aria-invalid")).toBe("true");
    expect(custom.getAttribute("aria-describedby")).toContain("error");
    expect(
      screen.getByText(/Custom target tokens must be a nonnegative/),
    ).toBeDefined();
    expect(
      screen.getByText(/Only used with a custom target\. Run the simulation/),
    ).toBeDefined();

    await userEvent.click(
      screen.getByRole("button", { name: "Run simulation" }),
    );

    expect(location()).not.toContain("customTarget");
    expect(figure(/Chance to reach 5,000/)).toBe("0%");
    expect(
      screen.queryByRole("textbox", { name: "Custom target tokens" }),
    ).toBeNull();
  });

  test("sampling again draws a fresh sample for the same inputs", async () => {
    renderAt("/festival/simulator?openings=1");

    const draws = vi.mocked(Math.random).mock.calls.length;

    await userEvent.click(screen.getByRole("button", { name: "Sample again" }));

    expect(vi.mocked(Math.random).mock.calls).toHaveLength(draws + 2000);
    expect(location()).toBe("/festival/simulator?openings=1");
  });

  test("keeps the model assumptions beside the inputs", () => {
    renderAt("/festival/simulator");

    const assumptions = screen.getByRole("list", { name: "Model assumptions" });

    expect(within(assumptions).getByText(/independent draw/)).toBeDefined();
    expect(
      within(assumptions).getByText(festivalOpeningModel.condition),
    ).toBeDefined();
    expect(
      within(assumptions).getByText(
        /modeling assumption, not a claim about keys/,
      ),
    ).toBeDefined();
    expect(screen.queryByText(/keys needed|days to/i)).toBeNull();
  });
});

test("shop purchases open the simulator with that target, and the tab returns", async () => {
  renderAt("/festival");

  await userEvent.click(screen.getByRole("link", { name: "Skilled Expert →" }));

  expect(location()).toBe("/festival/simulator?target=skilled-expert");
  expect(screen.getByRole("combobox", { name: "Target" })).toHaveProperty(
    "value",
    "skilled-expert",
  );
  expect(
    screen.getByRole("definition", { name: /Chance to reach 24,900/ }),
  ).toBeDefined();

  await userEvent.click(screen.getByRole("tab", { name: "Reference" }));

  expect(location()).toBe("/festival");
  expect(screen.getByRole("region", { name: "Shop prices" })).toBeDefined();
});
