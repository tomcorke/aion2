import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { Tabs } from "./Tabs.tsx";

const tabs = [
  { id: "a", label: "Alpha", to: "/x" },
  { id: "b", label: "Beta", to: "/x/b" },
  { id: "c", label: "Gamma", to: "/x/c" },
];

function Where() {
  return <output aria-label="location">{useLocation().pathname}</output>;
}

const renderTabs = (selected?: string, path = "/x") =>
  renderWithProviders(
    <>
      <Tabs label="Letters" tabs={tabs} selected={selected}>
        <p>Panel</p>
      </Tabs>
      <Where />
    </>,
    { path },
  );

test("marks the selected tab and labels the panel with it", () => {
  renderTabs("b", "/x/b");

  expect(screen.getByRole("tablist", { name: "Letters" })).toBeDefined();
  expect(
    screen.getByRole("tab", { name: "Beta" }).getAttribute("aria-selected"),
  ).toBe("true");
  expect(
    screen.getByRole("tab", { name: "Alpha" }).getAttribute("aria-selected"),
  ).toBe("false");
  expect(screen.getByRole("tabpanel", { name: "Beta" }).textContent).toBe(
    "Panel",
  );
});

test("only the selected tab is in the tab order", () => {
  renderTabs("b", "/x/b");

  expect(screen.getAllByRole("tab").map((tab) => tab.tabIndex)).toEqual([
    -1, 0, -1,
  ]);
});

test("arrow keys, Home and End move focus and the route", async () => {
  renderTabs("a");

  screen.getByRole("tab", { name: "Alpha" }).focus();
  await userEvent.keyboard("{ArrowRight}");

  expect(document.activeElement?.textContent).toBe("Beta");
  expect(screen.getByRole("status", { name: "location" }).textContent).toBe(
    "/x/b",
  );

  await userEvent.keyboard("{End}");

  expect(document.activeElement?.textContent).toBe("Gamma");

  await userEvent.keyboard("{ArrowRight}");

  expect(document.activeElement?.textContent).toBe("Alpha");

  await userEvent.keyboard("{ArrowLeft}");

  expect(document.activeElement?.textContent).toBe("Gamma");

  await userEvent.keyboard("{Home}");

  expect(screen.getByRole("status", { name: "location" }).textContent).toBe(
    "/x",
  );
});

test("with no selection the panel content shows without a tabpanel", () => {
  renderTabs(undefined);

  expect(screen.queryByRole("tabpanel")).toBeNull();
  expect(screen.getByText("Panel")).toBeDefined();
  expect(screen.getByRole("tab", { name: "Alpha" }).tabIndex).toBe(0);
});
