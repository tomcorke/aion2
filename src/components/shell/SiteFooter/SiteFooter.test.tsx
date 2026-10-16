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

test("leaves out the questions link where none apply", () => {
  renderWithProviders(<SiteFooter />, { path: "/daevanion" });

  expect(screen.queryByRole("link", { name: /open question/ })).toBeNull();
});
