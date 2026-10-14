import { screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithProviders } from "../../../testing/render.tsx";
import { SharingLedger } from "./SharingLedger.tsx";

const column = (name: string) => screen.getByRole("region", { name });

const entry = (name: RegExp) => screen.getByRole("listitem", { name });

test("puts same-server progress and each character's progress side by side", () => {
  renderWithProviders(<SharingLedger />);

  const shared = column("Shared on the same server");
  const own = column("Each character");

  expect(within(shared).getByText("Closet appearances")).toBeDefined();
  expect(within(shared).getByText("Unbound Kina")).toBeDefined();
  expect(within(shared).getByText(/Pets and Genus/)).toBeDefined();
  expect(within(own).getByText("Bound Kina")).toBeDefined();
  expect(within(own).getByText("Pantheon and titles")).toBeDefined();
  expect(within(own).getByText("Abyss Points")).toBeDefined();
  expect(within(own).getByText(/Wings/)).toBeDefined();
  expect(within(own).queryByText("Closet appearances")).toBeNull();
});

test("keeps server reward pools apart from shared progress, with their limits", () => {
  renderWithProviders(<SharingLedger />);

  const pools = column("Shared reward pools");

  expect(
    within(pools).getByText(/does not multiply these pools/),
  ).toBeDefined();
  expect(
    within(pools).getByText(/Duty Missions: 5 completions per day, cap 20/),
  ).toBeDefined();
  expect(
    within(pools).getByText(/Unobtained cubes.*10 each week/),
  ).toBeDefined();
  expect(within(pools).queryByText(/Odyle Energy:/)).toBeNull();
});

test("explains that another server shares nothing", () => {
  renderWithProviders(<SharingLedger />);

  expect(
    within(column("Another server")).getByText(/shares nothing with the main/),
  ).toBeDefined();
});

test("separates Monolith sync and wing ownership from transfers and the Closet", () => {
  renderWithProviders(<SharingLedger />);

  expect(
    within(entry(/Monolith/)).getByText(/not the feathers themselves/),
  ).toBeDefined();
  expect(
    within(entry(/Wings/)).getByText(/Unlocked wings are not shared/),
  ).toBeDefined();
  expect(
    within(entry(/Closet/)).getByText(
      /owned effects also apply to alts is unverified/,
    ),
  ).toBeDefined();
});
