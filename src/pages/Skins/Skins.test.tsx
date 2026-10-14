import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation, useNavigate } from "react-router";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { sources } from "../../data/sources.ts";
import { skinsSources } from "../../data/skins.ts";
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

const renderPage = (path = "/skins") =>
  renderWithProviders(
    <>
      <Skins />
      <Where />
    </>,
    { path },
  );

const location = () =>
  screen.getByRole("status", { name: "location" }).textContent;

const catalogue = () => screen.getByRole("navigation", { name: "Skin sets" });

const detail = () => screen.getByRole("region", { name: "Selected set" });

const setLink = (name: string) =>
  within(catalogue()).getByRole("link", { name: new RegExp(name) });

const search = (text: string) =>
  userEvent.type(
    screen.getByRole("searchbox", { name: "Search sets and pieces" }),
    text,
  );

beforeEach(() => localStorage.clear());

afterEach(() => vi.restoreAllMocks());

test("lists outfits, accessory pairs and wings separately", () => {
  renderPage();

  for (const heading of ["Outfits", "Accessories", "Wings"])
    expect(
      within(catalogue()).getByRole("heading", { name: heading }),
    ).toBeDefined();

  expect(setLink("Lightpath Trace").textContent).toContain("0/7");
  expect(setLink("Twilight Loop").textContent).toContain("0/2");
  expect(setLink("Spirit Wings").textContent).toContain("0/1");
  expect(within(detail()).getByText(/Pick a set/)).toBeDefined();
});

test("a direct set URL shows its pieces, prices and limits", () => {
  renderPage("/skins/skilled-expert");

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
  ).toBe("/festival");
});

test("accessory and wing totals stay out of outfits", () => {
  renderPage("/skins/starry-starry-night");

  expect(within(detail()).getAllByRole("checkbox")).toHaveLength(2);
  expect(
    within(detail()).getByRole("row", { name: /Total.*6,050/ }),
  ).toBeDefined();
});

test("wing entries explain their character scope", () => {
  renderPage("/skins/spirit-wings");

  expect(within(detail()).getByText(/stay with the character/)).toBeDefined();
});

test("an unknown set says so and keeps the catalogue", () => {
  renderPage("/skins/nope");

  expect(within(detail()).getByText(/no “nope” skin set/)).toBeDefined();
  expect(setLink("Lightpath Trace")).toBeDefined();
});

test("choosing a set changes the route, and history restores it", async () => {
  renderPage();

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

test("search matches set names and piece aliases", async () => {
  renderPage();

  await search("shoulders");

  expect(within(catalogue()).getAllByRole("link")).toHaveLength(2);

  await userEvent.clear(screen.getByRole("searchbox"));
  await search("butterfly");

  expect(
    within(catalogue())
      .getAllByRole("link")
      .map((link) => link.textContent),
  ).toEqual([
    expect.stringContaining("Violet Butterfly Wings"),
    expect.stringContaining("Springflower Butterfly Wings"),
  ]);
});

test("search combines with the source chip, with an empty state and clear", async () => {
  renderPage();

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

  expect(within(catalogue()).getAllByRole("link")).toHaveLength(7);
  expect(
    within(chips)
      .getByRole("button", { name: "All" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
});

test("filtering out the selected set hides its details", async () => {
  renderPage("/skins/lightpath-trace");

  await search("wings");

  expect(within(detail()).queryByRole("checkbox")).toBeNull();
  expect(within(detail()).getByText(/hidden by your search/)).toBeDefined();
});

test("ticks are per piece, update progress, and survive a remount", async () => {
  const { unmount } = renderPage("/skins/lightpath-trace");

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
  renderPage("/skins/lightpath-trace");

  expect(
    (
      within(detail()).getByRole("checkbox", {
        name: "Boots",
      }) as HTMLInputElement
    ).checked,
  ).toBe(true);
});

test("malformed and unknown stored ticks are ignored", () => {
  localStorage.setItem(
    KEY,
    JSON.stringify(["retired", "spirit-wings-appearance", 4]),
  );
  renderPage();

  expect(setLink("Spirit Wings").textContent).toContain("1/1");

  localStorage.setItem(KEY, "{not json");
  renderPage();

  expect(
    screen.getAllByRole("link", { name: /Spirit Wings/ })[1]!.textContent,
  ).toContain("0/1");
});

test("blocked storage still allows ticking for this visit", async () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  renderPage("/skins/spirit-wings");

  await userEvent.click(within(detail()).getByRole("checkbox"));

  expect(setLink("Spirit Wings").textContent).toContain("1/1");
});

test("ownership is explained as browser-local", () => {
  renderPage();

  expect(screen.getByText(/only in this browser/)).toBeDefined();
});

test("the footer names the page's sources", () => {
  renderPage();

  const footer = screen.getByRole("contentinfo");

  for (const id of skinsSources)
    expect(footer.textContent).toContain(sources[id].name);
});
