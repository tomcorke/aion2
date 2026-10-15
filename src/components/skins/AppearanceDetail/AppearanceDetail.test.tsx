import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { nonFestivalSkinEntries } from "../../../data/skinAcquisitions.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { AppearanceDetail } from "./AppearanceDetail.tsx";

const entry = (id: string) =>
  nonFestivalSkinEntries.find((skin) => skin.id === id)!;

test("ticking a piece reports that piece only", async () => {
  const onToggle = vi.fn();

  renderWithProviders(
    <AppearanceDetail
      entry={entry("archon-centurion-accessories")}
      owned={["archon-centurion-accessories-necklace"]}
      onToggle={onToggle}
    />,
  );

  expect(screen.getByText(/Accessory pair · 2 pieces/)).toBeDefined();
  expect(screen.getByText("1/2 owned")).toBeDefined();

  await userEvent.click(screen.getByRole("checkbox", { name: "Earrings" }));

  expect(onToggle).toHaveBeenCalledWith(
    "archon-centurion-accessories-earrings",
  );
});

test("each route gets its own section", () => {
  renderWithProviders(
    <AppearanceDetail
      entry={entry("skyfeather-guardian")}
      owned={[]}
      onToggle={vi.fn()}
    />,
  );

  expect(screen.getAllByRole("region")).toHaveLength(6);
});

test("outfits keep the Closet sharing limit and the Alts link", () => {
  renderWithProviders(
    <AppearanceDetail
      entry={entry("sky-feather")}
      owned={[]}
      onToggle={vi.fn()}
    />,
  );

  expect(
    screen.getByText(/does not show whether a skin's owned stats/),
  ).toBeDefined();
  expect(
    screen
      .getByRole("link", { name: "What carries over between characters" })
      .getAttribute("href"),
  ).toBe("/alts");
});
