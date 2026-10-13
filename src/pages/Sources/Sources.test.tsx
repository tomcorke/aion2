import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { imageCredits, sourceList } from "../../data/sources.ts";
import { renderWithProviders } from "../../testing/render.tsx";
import { Sources } from "./Sources.tsx";

test("lists every source, linked where it has a link", () => {
  renderWithProviders(<Sources />);

  for (const { name, url } of sourceList) {
    if (url)
      expect(screen.getByRole("link", { name }).getAttribute("href")).toBe(url);
    else expect(screen.getByText(name)).toBeDefined();
  }
});

test("credits the images", () => {
  renderWithProviders(<Sources />);

  for (const { name } of imageCredits)
    expect(screen.getByRole("link", { name })).toBeDefined();
});
