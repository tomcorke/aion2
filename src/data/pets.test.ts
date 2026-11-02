import { describe, expect, test } from "vitest";
import {
  petAreas,
  petsAttribution,
  petLevels,
  petShopOffers,
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

  test("labels every region with guide-based or unknown Global access", () => {
    for (const { access, accessNote } of petRegions) {
      expect(["guide-global", "guide-not-global", "unknown"]).toContain(access);
      expect(accessNote.length).toBeGreaterThan(20);
    }

    expect(
      petRegions
        .filter(({ access }) => access === "guide-not-global")
        .map(({ id }) => id),
    ).toEqual(["middle-reshanta", "other"]);
    expect(petRegions.find(({ id }) => id === "dungeons")?.access).toBe(
      "unknown",
    );
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

test("keeps temporary shop offers separate from the sourced checklist", () => {
  expect(petShopOffers.map(({ name }) => name)).toEqual([
    "Little Ghost",
    "Pumpkin Carriage",
    "Azure Flame Kumiho",
    "Glossy Pink Puppy",
  ]);
  expect(
    petShopOffers.every(({ name }) => !pets.some((pet) => pet.name === name)),
  ).toBe(true);
  expect(petShopOffers.map(({ notice }) => notice)).toEqual([
    "ncPetOffers13Oct",
    "ncPetOffers13Oct",
    "ncPetOffers28Oct",
    "ncPetOffers28Oct",
  ]);
});

test("attributes the mounts list, each pet page, and the exact guides", () => {
  expect(petsAttribution).toHaveLength(pets.length + 6);
  expect(petsAttribution[0]).toEqual({
    name: "MetaBot mounts list",
    url: "https://metabot.gg/en/aion-2/mounts",
  });
  expect(
    petsAttribution.slice(1, pets.length + 1).map(({ url }) => url),
  ).toEqual(pets.map(({ id }) => `https://metabot.gg/en/aion-2/mounts/${id}`));
  expect(petsAttribution.slice(-5)).toEqual([
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
    {
      name: "NC Global skin and pet offers, 13 October 2026",
      url: "https://lounge.plaync.com/feed/83799?country=US&locale=en-US",
    },
    {
      name: "NC Global skin and pet offers, 28 October 2026",
      url: "https://steamcommunity.com/app/3393110/allnews/",
    },
  ]);
});
