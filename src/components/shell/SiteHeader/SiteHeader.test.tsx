import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { sections } from "../../../data/sections.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { SiteHeader } from "./SiteHeader.tsx";

const nav = () => screen.getByRole("navigation", { name: "Sections" });

test("links every section and marks the current one", () => {
  renderWithProviders(<SiteHeader />, { path: "/timers" });

  expect(within(nav()).getAllByRole("link")).toHaveLength(sections.length);
  expect(
    within(nav())
      .getByRole("link", { name: "Timers" })
      .getAttribute("aria-current"),
  ).toBe("page");
});

test("links the wordmark home", () => {
  renderWithProviders(<SiteHeader />);

  expect(
    screen.getByRole("link", { name: "AION 2" }).getAttribute("href"),
  ).toBe("/");
});

test("the menu button opens the nav and a link closes it", async () => {
  renderWithProviders(<SiteHeader />);

  const menu = screen.getByRole("button", { name: "Menu" });

  await userEvent.click(menu);
  expect(menu.getAttribute("aria-expanded")).toBe("true");

  await userEvent.click(within(nav()).getByRole("link", { name: "Gear" }));
  expect(menu.getAttribute("aria-expanded")).toBe("false");
});
