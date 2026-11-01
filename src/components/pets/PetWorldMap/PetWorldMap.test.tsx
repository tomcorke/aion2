import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { petAreas } from "../../../data/pets.ts";
import { PetWorldMap } from "./PetWorldMap.tsx";

const [first, second, third] = petAreas;
const dungeon = petAreas.find(({ region }) => region === "dungeons")!;
const counts = new Map([
  [first.id, { unfinished: 8, unowned: 2 }],
  [second.id, { unfinished: 2, unowned: 2 }],
]);

const renderMap = (props: Partial<Parameters<typeof PetWorldMap>[0]> = {}) => {
  const onPick = vi.fn();
  const { container } = render(
    <PetWorldMap
      areas={petAreas}
      counts={counts}
      lit={new Set()}
      heat={false}
      onPick={onPick}
      {...props}
    />,
  );
  const zone = (name: string) =>
    [...container.querySelectorAll("g[data-lit]")].find((node) =>
      node.querySelector("title")?.textContent?.startsWith(`${name},`),
    )!;

  return { container, onPick, zone };
};

test("draws a dot for every area and a diamond for each dungeon", () => {
  const { container } = renderMap();

  expect(container.querySelectorAll("g[data-lit]")).toHaveLength(
    petAreas.length,
  );
  expect(container.querySelectorAll("rect")).toHaveLength(
    petAreas.filter(({ region }) => region === "dungeons").length,
  );
  expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
    "true",
  );
});

test("marks lit, best and picked areas, naming the best and picked ones", () => {
  const { zone, container } = renderMap({
    lit: new Set([first.id]),
    best: second.id,
    active: third.id,
  });

  expect(zone(first.name).getAttribute("data-lit")).toBe("true");
  expect(zone(second.name).getAttribute("data-best")).toBe("true");
  expect(zone(third.name).getAttribute("data-active")).toBe("true");
  expect(container.querySelectorAll("text[class*='name']")).toHaveLength(2);
});

test("scales heat by the busiest area, and only when asked", () => {
  const { zone, container } = renderMap({ heat: true });

  expect(zone(first.name).getAttribute("data-heat")).toBe("4");
  expect(zone(second.name).getAttribute("data-heat")).toBe("1");
  expect(zone(third.name).getAttribute("data-heat")).toBe("0");

  container.remove();
  expect(renderMap().zone(first.name).hasAttribute("data-heat")).toBe(false);
});

test("clicking a dot reports its area", async () => {
  const { zone, onPick } = renderMap();

  await userEvent.click(zone(dungeon.name));

  expect(onPick).toHaveBeenCalledWith(dungeon.id);
});
