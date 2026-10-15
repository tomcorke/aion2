import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { skinEntries } from "../../../data/skins.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { SkinDetail } from "./SkinDetail.tsx";

const entry = (id: string) => skinEntries.find((skin) => skin.id === id)!;

test("ticking a piece reports that piece only", async () => {
  const onToggle = vi.fn();

  renderWithProviders(
    <SkinDetail
      entry={entry("twilight-loop")}
      owned={["twilight-loop-earrings"]}
      onToggle={onToggle}
    />,
  );

  expect(screen.getByText("1/2 owned")).toBeDefined();
  expect(
    (screen.getByRole("checkbox", { name: "Earrings" }) as HTMLInputElement)
      .checked,
  ).toBe(true);

  await userEvent.click(screen.getByRole("checkbox", { name: "Necklace" }));

  expect(onToggle).toHaveBeenCalledWith("twilight-loop-necklace");
});

test("a single wing shows no separate total row", () => {
  renderWithProviders(
    <SkinDetail entry={entry("spirit-wings")} owned={[]} onToggle={vi.fn()} />,
  );

  expect(screen.getByText(/Wings · 1 piece$/)).toBeDefined();
  expect(screen.queryByRole("row", { name: /Total/ })).toBeNull();
  expect(
    screen.getByRole("row", { name: /Spirit Wings.*4,200/ }),
  ).toBeDefined();
});

test("outfits note the Closet rather than the wing scope", () => {
  renderWithProviders(
    <SkinDetail
      entry={entry("lightpath-trace")}
      owned={[]}
      onToggle={vi.fn()}
    />,
  );

  expect(screen.getByText(/Closet appearances are available/)).toBeDefined();
  expect(screen.queryByText(/stay with the character/)).toBeNull();
});

test("links to the simulator with this purchase as the target", () => {
  renderWithProviders(
    <SkinDetail entry={entry("spirit-wings")} owned={[]} onToggle={vi.fn()} />,
  );

  expect(
    screen
      .getByRole("link", { name: "Simulate Festival tokens for Spirit Wings" })
      .getAttribute("href"),
  ).toBe("/festival/simulator?target=spirit-wings");
});

test("links the sharing notes to Alts", () => {
  renderWithProviders(
    <SkinDetail entry={entry("spirit-wings")} owned={[]} onToggle={vi.fn()} />,
  );

  expect(
    screen
      .getByRole("link", { name: "What carries over between characters" })
      .getAttribute("href"),
  ).toBe("/alts");
});
