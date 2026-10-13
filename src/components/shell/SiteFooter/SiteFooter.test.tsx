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
