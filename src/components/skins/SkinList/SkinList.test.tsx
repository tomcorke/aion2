import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { skinEntries } from "../../../data/skins.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { SkinList } from "./SkinList.tsx";

test("only groups with entries get a heading", () => {
  renderWithProviders(
    <SkinList
      entries={skinEntries.filter(({ category }) => category === "wing")}
      owned={[]}
    />,
  );

  expect(screen.getByRole("heading", { name: "Wings" })).toBeDefined();
  expect(screen.queryByRole("heading", { name: "Outfits" })).toBeNull();
});

test("progress counts only the entry's own owned pieces", () => {
  renderWithProviders(
    <SkinList
      entries={skinEntries}
      owned={["twilight-loop-necklace", "spirit-wings-appearance"]}
      selected="twilight-loop"
    />,
  );

  const link = screen.getByRole("link", { name: /Twilight Loop/ });

  expect(link.textContent).toContain("1/2");
  expect(link.getAttribute("aria-current")).toBe("page");
});
