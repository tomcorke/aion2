import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { SiteFooter } from "./SiteFooter.tsx";

test("names the page's sources and when it was reviewed", () => {
  renderWithProviders(
    <SiteFooter sources={["couga54", "wikily"]} reviewed="2026-10-14" />,
  );

  const text = screen.getByRole("contentinfo").textContent;

  expect(text).toContain(
    "Sources: couga54's Global boss guide, Wikily boss spawn times.",
  );
  expect(text).toContain("Reviewed 14 October 2026.");
});

test("leaves out the sources sentence when there are none", () => {
  renderWithProviders(<SiteFooter />);

  expect(screen.getByRole("contentinfo").textContent).not.toContain("Sources:");
});

test("links to the full source list", () => {
  renderWithProviders(<SiteFooter />);

  expect(
    screen.getByRole("link", { name: "All sources" }).getAttribute("href"),
  ).toBe("/sources");
});

test("links to the open questions that affect the current page", () => {
  renderWithProviders(<SiteFooter />, { path: "/festival/simulator" });

  const link = screen.getByRole("link", {
    name: /open questions? for this section/,
  });

  expect(link.getAttribute("href")).toBe("/sources?topic=festival");
});

test("links the Daevanion section to its three open questions", () => {
  renderWithProviders(<SiteFooter />, {
    path: "/daevanion/spiritmaster/nezekan/damage?points=30",
  });

  expect(
    screen
      .getByRole("link", { name: "3 open questions for this section" })
      .getAttribute("href"),
  ).toBe("/sources?topic=daevanion");
});

test.each(["/sources", "/unknown", "/"])(
  "leaves out the questions link where none apply: %s",
  (path) => {
    renderWithProviders(<SiteFooter />, { path });

    expect(screen.queryByRole("link", { name: /open question/ })).toBeNull();
  },
);

test("links each attributed data page directly, once, without rel hints", () => {
  const page = { name: "Inventory", url: "https://example.com/skins" };

  renderWithProviders(
    <SiteFooter
      sources={["couga54"]}
      reviewed="2026-10-14"
      attribution={[
        page,
        { name: "Shop", url: "https://example.com/shop" },
        page,
      ]}
    />,
  );

  const links = screen.getAllByRole("link", { name: /Inventory|Shop/ });

  expect(links.map((link) => link.getAttribute("href"))).toEqual([
    "https://example.com/skins",
    "https://example.com/shop",
  ]);
  expect(links.every((link) => !link.hasAttribute("rel"))).toBe(true);
  expect(screen.getByRole("contentinfo").textContent).toContain(
    "Data from Inventory, Shop.",
  );
  expect(screen.getByRole("contentinfo").textContent).toContain(
    "Reviewed 14 October 2026.",
  );
});
