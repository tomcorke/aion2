import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../testing/render.tsx";
import { SectionPage } from "./SectionPage.tsx";

test("stands in for an unbuilt section", () => {
  renderWithProviders(
    <SectionPage
      section={{ path: "gear", title: "Gear", summary: "Drops and upgrades." }}
    />,
  );

  expect(screen.getByRole("heading", { level: 1, name: "Gear" })).toBeDefined();
  expect(screen.getByText("Drops and upgrades.")).toBeDefined();
  expect(screen.getByText("This page is not written yet.")).toBeDefined();
  expect(document.title).toBe("Gear · AION 2 Notes");
});
