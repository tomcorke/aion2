import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation, useNavigate } from "react-router";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { sources } from "../../data/sources.ts";
import { skinAcquisitionSources } from "../../data/skinAcquisitions.ts";
import { skinsSources } from "../../data/skins.ts";
import { loadSkinCatalogue } from "../../lib/skinCatalogueLoader.ts";
import { renderWithProviders } from "../../testing/render.tsx";
import { Skins } from "./Skins.tsx";

const KEY = "skin-owned";

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

vi.mock("../../lib/skinCatalogueLoader.ts", { spy: true });

async function renderPage(path = "/skins") {
  const result = renderWithProviders(
    <>
      <Skins />
      <Where />
    </>,
    { path },
  );

  await screen.findAllByRole("navigation", { name: "Skin sets" });

  return result;
}

const location = () =>
  screen.getByRole("status", { name: "location" }).textContent;

const catalogue = () => screen.getByRole("navigation", { name: "Skin sets" });

const detail = () => screen.getByRole("region", { name: "Selected set" });

const setLink = (name: string) =>
  within(catalogue()).getByRole("link", { name: new RegExp(`^${name}`) });

const search = (text: string) =>
  userEvent.type(
    screen.getByRole("searchbox", { name: "Search sets and pieces" }),
    text,
  );

beforeEach(() => localStorage.clear());

afterEach(() => vi.restoreAllMocks());

test("lists outfits, accessory pairs and wings separately", async () => {
  await renderPage();

  for (const heading of ["Outfits", "Armour", "Accessories", "Vanity", "Wings"])
    expect(
      within(catalogue()).getByRole("heading", { name: heading }),
    ).toBeDefined();

  expect(setLink("Lightpath Trace").textContent).toContain("0/7");
  expect(setLink("Twilight Loop").textContent).toContain("0/2");
  expect(setLink("Spirit Wings").textContent).toContain("0/1");
  expect(within(detail()).getByText(/Pick a set/)).toBeDefined();
});

test("a direct set URL shows its pieces, prices and limits", async () => {
  await renderPage("/skins/skilled-expert");

  expect(
    within(detail()).getByRole("heading", { name: "Skilled Expert" }),
  ).toBeDefined();
  expect(within(detail()).getAllByRole("checkbox")).toHaveLength(7);
  expect(
    within(detail()).getByRole("row", { name: /Breastplate \/ chest.*5,400/ }),
  ).toBeDefined();
  expect(
    within(detail()).getByRole("row", { name: /Total.*24,900/ }),
  ).toBeDefined();
  expect(
    within(detail()).getByText(/one of each piece per character/),
  ).toBeDefined();
  expect(setLink("Skilled Expert").getAttribute("aria-current")).toBe("page");
  expect(
    within(detail())
      .getByRole("link", { name: /Festival/ })
      .getAttribute("href"),
  ).toBe("/festival/simulator?target=skilled-expert");
});

test("accessory and wing totals stay out of outfits", async () => {
  await renderPage("/skins/starry-starry-night");

  expect(within(detail()).getAllByRole("checkbox")).toHaveLength(2);
  expect(
    within(detail()).getByRole("row", { name: /Total.*6,050/ }),
  ).toBeDefined();
});

test("wing entries explain their character scope", async () => {
  await renderPage("/skins/spirit-wings");

  expect(within(detail()).getByText(/stay with the character/)).toBeDefined();
});

test("an unknown set says so and keeps the catalogue", async () => {
  await renderPage("/skins/nope");

  expect(within(detail()).getByText(/no “nope” skin set/)).toBeDefined();
  expect(setLink("Lightpath Trace")).toBeDefined();
});

test("choosing a set changes the route, and history restores it", async () => {
  await renderPage();

  await userEvent.click(setLink("Spirit Wings"));

  expect(location()).toBe("/skins/spirit-wings");

  await userEvent.click(setLink("Twilight Loop"));
  await userEvent.click(screen.getByRole("button", { name: "History back" }));

  expect(location()).toBe("/skins/spirit-wings");
  expect(
    within(detail()).getByRole("heading", { name: "Spirit Wings" }),
  ).toBeDefined();

  await userEvent.click(
    screen.getByRole("button", { name: "History forward" }),
  );

  expect(
    within(detail()).getByRole("heading", { name: "Twilight Loop" }),
  ).toBeDefined();
});

test("history restores selected details despite temporary filters without changing ownership", async () => {
  await renderPage("/skins/lightpath-trace");

  await userEvent.click(
    within(detail()).getByRole("checkbox", { name: "Helm" }),
  );
  await userEvent.click(setLink("Spirit Wings"));
  await userEvent.click(within(detail()).getByRole("checkbox"));
  await userEvent.click(
    screen.getByRole("button", { name: "Shugo Festival shop" }),
  );
  await search("wings");

  const ownership = localStorage.getItem(KEY);

  await userEvent.click(screen.getByRole("button", { name: "History back" }));

  expect(location()).toBe("/skins/lightpath-trace");
  expect(within(detail()).getAllByRole("checkbox")).toHaveLength(7);
  expect(within(detail()).getByText("1/7 owned")).toBeDefined();
  expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
  expect(
    screen.getByRole("button", { name: "All" }).getAttribute("aria-pressed"),
  ).toBe("true");

  await search("lightpath");
  await userEvent.click(
    screen.getByRole("button", { name: "History forward" }),
  );

  expect(location()).toBe("/skins/spirit-wings");
  expect(within(detail()).getAllByRole("checkbox")).toHaveLength(1);
  expect(within(detail()).getByText("1/1 owned")).toBeDefined();
  expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
  expect(localStorage.getItem(KEY)).toBe(ownership);
});

test("search matches set names and piece aliases", async () => {
  await renderPage();

  await search("shoulders");

  expect(listed()).toEqual(["Lightpath Trace", "Skilled Expert"]);

  await userEvent.clear(screen.getByRole("searchbox"));
  await search("butterfly");

  expect(listed()).toEqual([
    "Violet Butterfly Wings",
    "Springflower Butterfly Wings",
    "Blue Butterfly Wings",
  ]);
});

test("search combines with the source chip, with an empty state and clear", async () => {
  await renderPage();

  const chips = screen.getByRole("group", { name: "Source" });

  await userEvent.click(
    within(chips).getByRole("button", { name: "Shugo Festival shop" }),
  );
  await search("lightpath");

  expect(within(catalogue()).getAllByRole("link")).toHaveLength(1);

  await search("zzz");

  expect(screen.getByText(/No sets match/)).toBeDefined();

  await userEvent.click(
    screen.getAllByRole("button", { name: "Clear filters" })[0]!,
  );

  expect(within(catalogue()).getAllByRole("link")).toHaveLength(314);
  expect(
    within(chips)
      .getByRole("button", { name: "All" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
});

test("filtering out the selected set hides its details", async () => {
  await renderPage("/skins/lightpath-trace");

  await search("wings");

  expect(within(detail()).queryByRole("checkbox")).toBeNull();
  expect(within(detail()).getByText(/hidden by your search/)).toBeDefined();
});

test("ticks are per piece, update progress, and survive a remount", async () => {
  const { unmount } = await renderPage("/skins/lightpath-trace");

  await userEvent.click(
    within(detail()).getByRole("checkbox", { name: "Helm" }),
  );
  await userEvent.click(
    within(detail()).getByRole("checkbox", { name: "Boots" }),
  );
  await userEvent.click(
    within(detail()).getByRole("checkbox", { name: "Helm" }),
  );

  expect(setLink("Lightpath Trace").textContent).toContain("1/7");
  expect(setLink("Skilled Expert").textContent).toContain("0/7");
  expect(within(detail()).getByText("1/7 owned")).toBeDefined();
  expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual([
    "lightpath-trace-boots",
  ]);

  unmount();
  await renderPage("/skins/lightpath-trace");

  expect(
    (
      within(detail()).getByRole("checkbox", {
        name: "Boots",
      }) as HTMLInputElement
    ).checked,
  ).toBe(true);
});

test("malformed and unknown stored ticks are ignored", async () => {
  localStorage.setItem(
    KEY,
    JSON.stringify(["retired", "spirit-wings-appearance", 4]),
  );
  await renderPage();

  expect(setLink("Spirit Wings").textContent).toContain("1/1");

  localStorage.setItem(KEY, "{not json");
  await renderPage();

  expect(
    screen.getAllByRole("link", { name: /^Spirit Wings/ })[1]!.textContent,
  ).toContain("0/1");
});

test("blocked storage keeps in-memory ownership through set navigation and history", async () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  await renderPage("/skins/spirit-wings");

  await userEvent.click(within(detail()).getByRole("checkbox"));

  expect(setLink("Spirit Wings").textContent).toContain("1/1");

  await userEvent.click(setLink("Lightpath Trace"));
  await userEvent.click(
    within(detail()).getByRole("checkbox", { name: "Helm" }),
  );
  await search("lightpath");
  await userEvent.click(screen.getByRole("button", { name: "History back" }));

  expect(location()).toBe("/skins/spirit-wings");
  expect(
    (within(detail()).getByRole("checkbox") as HTMLInputElement).checked,
  ).toBe(true);
  expect(setLink("Lightpath Trace").textContent).toContain("1/7");

  await search("wings");
  await userEvent.click(
    screen.getByRole("button", { name: "History forward" }),
  );

  expect(location()).toBe("/skins/lightpath-trace");
  expect(
    (
      within(detail()).getByRole("checkbox", {
        name: "Helm",
      }) as HTMLInputElement
    ).checked,
  ).toBe(true);
  expect(setLink("Spirit Wings").textContent).toContain("1/1");
});

test("ownership is explained as browser-local", async () => {
  await renderPage();

  expect(screen.getByText(/only in this browser/)).toBeDefined();
});

test("the footer names the sources and preserves the oldest content review", async () => {
  await renderPage();

  const footer = screen.getByRole("contentinfo");

  for (const id of [...skinsSources, ...skinAcquisitionSources])
    expect(footer.textContent).toContain(sources[id].name);

  expect(footer.textContent).toContain("Reviewed 12 October 2026");
});

test("the footer links each data page used, adding the selected entry's own pages", async () => {
  await renderPage("/skins/awakened");

  const footer = screen.getByRole("contentinfo");
  const href = (name: string) =>
    within(footer).getByRole("link", { name }).getAttribute("href");

  expect(href("MetaBot.GG skin inventory")).toBe(
    "https://metabot.gg/en/aion-2/skins",
  );
  expect(href("MetaBot.GG wing inventory")).toBe(
    "https://metabot.gg/en/aion-2/wings",
  );
  expect(href("MetaBot.GG methodology")).toBe(
    "https://metabot.gg/en/aion-2/methodology",
  );
  expect(href("MetaBot.GG Nightmare Shop")).toBe(
    "https://metabot.gg/en/aion-2/shops/trade-shop-phantasmal-fragment",
  );
  expect(
    within(footer).getAllByRole("link", { name: "MetaBot.GG skin inventory" }),
  ).toHaveLength(1);
  expect(
    within(footer).getByRole("link", { name: /open question/ }),
  ).toBeDefined();
});

test("the page says what the reference does not prove", async () => {
  await renderPage();

  expect(screen.getByText(/Weapons are not listed/)).toBeDefined();
  expect(
    screen.getByText(/not proof that each can be obtained now/),
  ).toBeDefined();
});

test("a failed load says so, keeps ticks and offers a reload", async () => {
  localStorage.setItem(KEY, JSON.stringify(["lightpath-trace-helm"]));
  vi.mocked(loadSkinCatalogue).mockRejectedValueOnce(new Error("offline"));
  renderWithProviders(<Skins />, { path: "/skins/lightpath-trace" });

  expect(screen.getByText(/Loading the appearance list/)).toBeDefined();
  expect(
    within(await screen.findByRole("alert")).getByRole("button", {
      name: "Reload the page",
    }),
  ).toBeDefined();
  expect(screen.queryByRole("navigation", { name: "Skin sets" })).toBeNull();
  expect(localStorage.getItem(KEY)).toBe('["lightpath-trace-helm"]');
});

const chip = (name: string) =>
  within(screen.getByRole("group", { name: "Source" })).getByRole("button", {
    name,
  });

const listed = () =>
  within(catalogue())
    .getAllByRole("link")
    .map((link) => link.firstElementChild?.textContent);

test("lists non-Festival appearances beside Festival ones", async () => {
  await renderPage();

  expect(setLink("Skyfeather Guardian").textContent).toContain("0/7");
  expect(setLink("Archon Decanus accessories").textContent).toContain("0/2");
  expect(listed()).toContain("Sky Feather");
});

test("a multi-route appearance appears under each of its sources", async () => {
  await renderPage();

  for (const name of [
    "Black Cloud random shop",
    "Extract Skin",
    "Skin chests",
    "Skin Combine",
  ]) {
    await userEvent.click(chip(name));

    expect(listed()).toContain("Skyfeather Guardian");
  }

  await userEvent.click(chip("Abyss Trade Shop"));

  expect(listed()).toEqual([
    "Archon Centurion",
    "Archon Decanus",
    "Archon Centurion accessories",
    "Archon Decanus accessories",
    "Brawler Wings",
    "Warrior Wings",
  ]);
});

test("search tells the similarly named Skyfeather sets apart", async () => {
  await renderPage();

  await search("skyfeather");

  expect(listed()).toEqual(["Skyfeather Guardian"]);

  await userEvent.clear(screen.getByRole("searchbox"));
  await search("◆Sky");

  expect(listed()).toEqual(["Sky Feather"]);

  await userEvent.clear(screen.getByRole("searchbox"));
  await search("guardian decanus");

  expect(listed()).toEqual(["Archon Decanus", "Archon Decanus accessories"]);
});

test("Guardian routes show their own piece coverage and the extraction warning", async () => {
  await renderPage("/skins/skyfeather-guardian");

  const route = (name: string) =>
    within(detail()).getByRole("region", { name });

  expect(within(detail()).getAllByRole("checkbox")).toHaveLength(7);
  expect(
    within(route("Black Cloud Merchants")).getByText(/All 7 pieces/),
  ).toBeDefined();
  expect(
    within(route("Skin Chest (10 times) (Bound)")).getByText(
      "Helm, Breastplate",
    ),
  ).toBeDefined();
  expect(
    within(route("Skin Combine: Rare skins")).getByText(
      /1,000 Kina per attempt/,
    ),
  ).toBeDefined();
  expect(
    within(route("Extract Skin from Divine Canyon armor")).getByText(
      /costs Kina and always destroys the gear item/,
    ),
  ).toBeDefined();
  expect(within(detail()).queryByRole("link", { name: /Festival/ })).toBeNull();
  expect(
    within(detail()).getByRole("link", { name: /carries over/ }),
  ).toBeDefined();
});

test("Abyss prices keep both currencies per piece and in the total", async () => {
  await renderPage("/skins/archon-centurion");

  expect(
    within(detail()).getByRole("row", {
      name: /Helm.*147,100 Abyss Points \+ 40 Silver Medals of Merit/,
    }),
  ).toBeDefined();
  expect(
    within(detail()).getByRole("row", {
      name: /Total.*1,029,700 Abyss Points \+ 280 Silver Medals of Merit/,
    }),
  ).toBeDefined();
  expect(
    within(detail()).getByText(/One of each piece per character/),
  ).toBeDefined();
});

test("new ticks persist beside existing Festival ticks", async () => {
  localStorage.setItem(KEY, JSON.stringify(["lightpath-trace-helm"]));
  await renderPage("/skins/sky-feather");

  await userEvent.click(
    within(detail()).getByRole("checkbox", { name: "Cloak" }),
  );

  expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual([
    "lightpath-trace-helm",
    "sky-feather-cloak",
  ]);
  expect(setLink("Lightpath Trace").textContent).toContain("1/7");
  expect(within(detail()).getByText("1/7 owned")).toBeDefined();
});
