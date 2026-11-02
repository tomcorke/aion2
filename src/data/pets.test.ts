import { describe, expect, test } from "vitest";
import {
  petAreas,
  petsAttribution,
  petLevels,
  petRegions,
  petsSources,
  petStats,
  pets,
  petSourceAdditions,
  petTypes,
} from "./pets.ts";
import { sources } from "./sources.ts";

describe("pet catalogue", () => {
  test("lists each obtainable pet once, with a known type", () => {
    expect(pets).toHaveLength(204);
    expect(new Set(pets.map(({ id }) => id)).size).toBe(pets.length);

    for (const { type } of pets) expect(petTypes).toContain(type);
  });

  test("every pet has a way to get it", () => {
    for (const { name, areas, other } of pets)
      expect(areas.length + other.length, name).toBeGreaterThan(0);
  });

  test("pets point at real areas and every area is used", () => {
    const ids = new Set(petAreas.map(({ id }) => id));

    expect(ids.size).toBe(petAreas.length);

    for (const { areas } of pets)
      for (const id of areas) expect(ids).toContain(id);

    const used = new Set(pets.flatMap(({ areas }) => areas));

    for (const id of ids) expect(used).toContain(id);
  });

  test("areas belong to a listed region", () => {
    const regions = petRegions.map(({ id }) => id);

    for (const { region } of petAreas) expect(regions).toContain(region);
  });
});

describe("pet stats", () => {
  test("each stat type adds to the level before; Special has none", () => {
    for (const type of petTypes) {
      const [one, two, three] = petLevels.map((level) => petStats[type][level]);

      if (type === "Special") expect([one, two, three]).toEqual([[], [], []]);
      else {
        expect(one).toHaveLength(1);
        expect(two.length).toBeGreaterThan(one.length);
        expect(three.length).toBeGreaterThan(two.length);
      }
    }
  });

  test("keeps the confirmed Natura line", () => {
    expect(petStats.Natura[2]).toEqual([
      "Stamina +6",
      "Critical Hit Resist +1",
    ]);
    expect(petStats.Natura[3]).toEqual([
      "Stamina +9",
      "Critical Hit Resist +2",
      "Precision +1",
    ]);
  });
});

test("every source the pet page names is registered", () => {
  for (const id of petsSources) expect(sources).toHaveProperty(id);

  for (const id of Object.keys(petSourceAdditions))
    expect(sources).toHaveProperty(id);
});

test("attributes the mounts list, each pet page, and the exact guides", () => {
  expect(petsAttribution).toHaveLength(pets.length + 4);
  expect(petsAttribution[0]).toEqual({
    name: "MetaBot mounts list",
    url: "https://metabot.gg/en/aion-2/mounts",
  });
  expect(
    petsAttribution.slice(1, pets.length + 1).map(({ url }) => url),
  ).toEqual(pets.map(({ id }) => `https://metabot.gg/en/aion-2/mounts/${id}`));
  expect(petsAttribution.slice(-3)).toEqual([
    {
      name: "allthings.how pet souls guide",
      url: "https://allthings.how/aion-2-how-to-unlock-any-pet-by-farming-pet-souls/",
    },
    {
      name: "MetaBot mounts, pets and wings guide",
      url: "https://metabot.gg/en/aion-2/guides/mounts-wings-guide",
    },
    {
      name: "AION 2 Maps pets and mounts guide",
      url: "https://aion2maps.com/guides/pets/",
    },
  ]);
});
