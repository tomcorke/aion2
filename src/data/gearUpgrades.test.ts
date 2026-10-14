import { expect, test } from "vitest";
import {
  enhancementGrades,
  enhancementRates,
  gearUpgradeSections,
  amplificationRates,
  stoneEngraving,
  stoneTiers,
  engravingGrades,
  gearUpgradesSources,
  gearUpgradeSourceAdditions,
} from "./gearUpgrades.ts";

test("ordinary enhancement preserves levels while Clash Rune failure destroys the rune", () => {
  expect(enhancementGrades).toEqual([
    { grade: "Common", cap: 5, safeCap: 5 },
    { grade: "Rare", cap: 5, safeCap: 5 },
    { grade: "Epic", cap: 10, safeCap: 10 },
    { grade: "Unique", cap: 15, safeCap: 10 },
  ]);
  expect(
    enhancementRates.map(({ level, successPercent }) => [
      level,
      successPercent,
    ]),
  ).toEqual([
    [11, 65],
    [12, 50],
    [13, 35],
    [14, 25],
    [15, 20],
  ]);
  expect(
    gearUpgradeSections.find(({ id }) => id === "enhancement")?.items.join(" "),
  ).toContain("never loses levels");
  expect(
    gearUpgradeSections.find(({ id }) => id === "clash-runes")?.warning,
  ).toContain("destroys the rune");
});

test("Potential and Soul Binding distinguish stat values, rerolls and the extra effect", () => {
  expect(
    gearUpgradeSections.find(({ id }) => id === "potential")?.items.join(" "),
  ).toContain("400,000 AP and 10 Potential Stones");
  expect(
    gearUpgradeSections.find(({ id }) => id === "bind")?.items.join(" "),
  ).toContain("raises four existing extra stats");
  expect(
    gearUpgradeSections.find(({ id }) => id === "sync")?.items.join(" "),
  ).toContain("same effect again");
  expect(
    gearUpgradeSections.find(({ id }) => id === "sync")?.warning,
  ).toContain("replaces donor gear");
  expect(
    gearUpgradeSections.find(({ id }) => id === "reset")?.items.join(" "),
  ).toContain("all four");
  expect(
    gearUpgradeSections.find(({ id }) => id === "soul-fuse")?.items.join(" "),
  ).toContain("100%");
  expect(
    gearUpgradeSections.find(({ id }) => id === "soul-fuse")?.warning,
  ).toContain("acquisition");
});

test("engraving has separate slot families, tier pools and live-UI caveats", () => {
  expect(stoneEngraving.map(({ id, slots }) => [id, slots])).toEqual([
    [
      "manastone",
      ["Weapon", "Guard", "Helm", "Top", "Pauldrons", "Legs", "Shoes", "Cloak"],
    ],
    ["soulstone", ["Necklace", "Earrings", "Rings"]],
    ["theostone", ["Weapon", "Guard"]],
  ]);
  expect(stoneTiers.map(({ id, lineGrades }) => [id, lineGrades])).toEqual([
    ["lesser", ["Common", "Rare"]],
    ["intermediate", ["Common", "Rare", "Epic"]],
    ["superior", ["Rare", "Epic", "Unique"]],
  ]);
  expect(engravingGrades.map(({ slots, kina }) => [slots, kina])).toEqual([
    [1, 500],
    [2, 1000],
    [3, 1500],
    [4, 2000],
  ]);
  expect(
    stoneEngraving.find(({ id }) => id === "soulstone")?.warning,
  ).toContain("Bracelet eligibility");
  expect(
    gearUpgradeSections.find(({ id }) => id === "engraving")?.warning,
  ).toContain("ticked slots");
  expect(gearUpgradesSources).toContain("metabotManastones");
  expect(gearUpgradeSourceAdditions.metabotManastones.url).toBe(
    "https://metabot.gg/en/aion-2/guides/manastone-guide",
  );
});

test("outside power links to boards and finite wing materials without declaring Azphel PvP-only", () => {
  expect(
    gearUpgradeSections.find(({ id }) => id === "arcana")?.items.join(" "),
  ).toContain("cannot fail");
  expect(
    gearUpgradeSections.find(({ id }) => id === "daevanion")?.links,
  ).toContainEqual({ to: "/daevanion", label: "Board routes" });
  expect(
    gearUpgradeSections.find(({ id }) => id === "daevanion")?.items.join(" "),
  ).toContain("HP and MP");
  expect(
    gearUpgradeSections.find(({ id }) => id === "wings")?.warning,
  ).toContain("140 Featherdown");
});

test("amplification, extraction, recipes and Transfer keep their distinct conditions", () => {
  expect(
    amplificationRates.map(({ successPercent }) => successPercent),
  ).toEqual([66, 50, 33, 25, 20]);
  expect(
    gearUpgradeSections
      .find(({ id }) => id === "amplification")
      ?.items.join(" "),
  ).toContain("36–51");
  expect(
    gearUpgradeSections.find(({ id }) => id === "extraction")?.warning,
  ).toContain("not Kina");
  expect(
    gearUpgradeSections.find(({ id }) => id === "recipes")?.items.join(" "),
  ).toContain("enhancement, amplification and Soul Binding");
  expect(
    gearUpgradeSections.find(({ id }) => id === "transfer")?.warning,
  ).toContain(
    "Potential, Manastones, Theostones and the extra Soul Fuse effect",
  );
  expect(
    gearUpgradeSections.find(({ id }) => id === "transfer")?.warning,
  ).toContain("source item's fate");
});
