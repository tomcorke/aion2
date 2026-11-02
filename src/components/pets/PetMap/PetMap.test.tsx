import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import type { PetArea } from "../../../data/pets.ts";
import { PetMap } from "./PetMap.tsx";

const areas: PetArea[] = [
  { id: "verteron-a", name: "Alpha Fields", region: "verteron" },
  { id: "verteron-b", name: "Beta Hill", region: "verteron" },
  { id: "altgard-c", name: "Gamma Pass", region: "altgard" },
  {
    id: "dungeons-d",
    name: "Delta Cave",
    region: "dungeons",
    entrance: "Beta Hill, Verteron",
  },
];

const counts = new Map([
  ["verteron-a", { unfinished: 8, unowned: 2 }],
  ["verteron-b", { unfinished: 2, unowned: 2 }],
]);

const renderMap = (props: Partial<Parameters<typeof PetMap>[0]> = {}) => {
  const onPick = vi.fn();

  render(
    <PetMap
      areas={areas}
      counts={counts}
      lit={new Set()}
      heat={false}
      onPick={onPick}
      {...props}
    />,
  );

  return onPick;
};

const tile = (name: RegExp) => screen.getByRole("button", { name });

test("groups areas under their map and skips empty maps", () => {
  renderMap();

  expect(
    within(screen.getByRole("region", { name: "Verteron" })).getAllByRole(
      "button",
    ),
  ).toHaveLength(2);
  expect(screen.getByRole("region", { name: "Altgard" })).toBeTruthy();
  expect(screen.queryByRole("region", { name: "Lower Reshanta" })).toBeNull();
  expect(
    within(screen.getByRole("region", { name: "Verteron" })).getByText(
      /guide-reported Global region/i,
    ),
  ).toBeTruthy();
  expect(
    screen.getByText(/guide lists pet sources in Krao Cave and Draupnir/i),
  ).toBeTruthy();
});

test("names each area with the pets left to finish", () => {
  renderMap();

  expect(tile(/^Alpha Fields, 8 to finish$/)).toBeTruthy();
  expect(tile(/^Gamma Pass, 0 to finish$/)).toBeTruthy();
});

test("marks lit areas, the best next area and the picked area", () => {
  renderMap({
    lit: new Set(["verteron-b"]),
    best: "verteron-a",
    active: "altgard-c",
  });

  expect(tile(/^Beta Hill,/).getAttribute("data-lit")).toBe("true");
  expect(tile(/Alpha Fields/).getAttribute("data-lit")).toBe("false");
  expect(
    tile(/Alpha Fields.*highest pet count below level 3/).getAttribute(
      "data-best",
    ),
  ).toBe("true");
  expect(tile(/Gamma Pass/).getAttribute("aria-pressed")).toBe("true");
});

test("scales the heat by the busiest area, and only when asked", () => {
  const { unmount } = render(
    <PetMap
      areas={areas}
      counts={counts}
      lit={new Set()}
      heat
      onPick={() => {}}
    />,
  );

  expect(tile(/Alpha Fields/).getAttribute("data-heat")).toBe("4");
  expect(tile(/^Beta Hill,/).getAttribute("data-heat")).toBe("1");
  expect(tile(/Gamma Pass/).getAttribute("data-heat")).toBe("0");

  unmount();
  renderMap();

  expect(tile(/Alpha Fields/).hasAttribute("data-heat")).toBe(false);
});

test("picking a tile reports its area; dungeons show their entrance", async () => {
  const onPick = renderMap();

  await userEvent.click(tile(/Delta Cave/));

  expect(onPick).toHaveBeenCalledWith("dungeons-d");
  expect(tile(/Delta Cave/).getAttribute("title")).toBe(
    "Entrance: Beta Hill, Verteron",
  );
});

test("labels marked areas and dungeon entrances for screen readers", () => {
  renderMap({ lit: new Set(["dungeons-d"]) });

  expect(
    tile(
      /^Delta Cave, 0 to finish, marked for your pets, entrance Beta Hill, Verteron$/,
    ),
  ).toBeTruthy();
});
