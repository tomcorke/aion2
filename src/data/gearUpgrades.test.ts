import { expect, test } from "vitest";
import {
  enhancementGrades,
  enhancementRates,
  gearUpgradeSections,
  amplificationRates,
  amplificationCraftedCaps,
  amplificationTracks,
  stoneEngraving,
  stoneTiers,
  engravingGrades,
  gearUpgradesSources,
  gearUpgradeSourceAdditions,
} from "./gearUpgrades.ts";

test("ordinary enhancement costs and failure uncertainty are explicit", () => {
  expect(enhancementGrades).toEqual([
    { grade: "Common", cap: 5, safeCap: 5 },
    { grade: "Rare", cap: 5, safeCap: 5 },
    { grade: "Epic", cap: 10, safeCap: 10 },
    { grade: "Unique", cap: 15, safeCap: 10 },
  ]);
  expect(
    enhancementRates.map(({ level, successPercent, maxAttempts }) => [
      level,
      successPercent,
      maxAttempts,
    ]),
  ).toEqual([
    [11, 65, 8],
    [12, 50, 11],
    [13, 35, 14],
    [14, 25, 16],
    [15, 20, 17],
  ]);
  expect(
    gearUpgradeSections.find(({ id }) => id === "enhancement")?.items.join(" "),
  ).toContain("never loses levels");
  expect(
    gearUpgradeSections.find(({ id }) => id === "clash-runes")?.warning,
  ).toContain("Do not assume either destruction or a one-level drop");
  expect(
    gearUpgradeSections.find(({ id }) => id === "enhancement")?.items.join(" "),
  ).toContain("raises the item's base stats and adds one item level");
});

test("Potential and Soul Binding distinguish stat values, rerolls and the extra effect", () => {
  expect(
    gearUpgradeSections.find(({ id }) => id === "potential")?.items.join(" "),
  ).toContain("400,000 AP and 10 Potential Stones");
  expect(
    gearUpgradeSections.find(({ id }) => id === "potential")?.items.join(" "),
  ).toContain("550,000 AP, for a full 950,000 AP budget");
  expect(
    gearUpgradeSections.find(({ id }) => id === "bind")?.items.join(" "),
  ).toMatch(
    /raises four existing extra stats.*10 Bind steps.*2,130,000 Kina.*408 Soul Codex/,
  );
  expect(
    gearUpgradeSections.find(({ id }) => id === "sync")?.items.join(" "),
  ).toContain("same effect again");
  expect(
    gearUpgradeSections.find(({ id }) => id === "sync")?.warning,
  ).toContain("replaces donor gear");
  expect(
    gearUpgradeSections.find(({ id }) => id === "reset")?.items.join(" "),
  ).toMatch(
    /all four.*Global client data lists Rebind at 300,000 Kina.*3 Soul Codex: Reset/,
  );
  expect(
    gearUpgradeSections.find(({ id }) => id === "soul-fuse")?.items.join(" "),
  ).toMatch(/100%.*2 Philosopher's Stone: Revelation.*1,000,000 Kina/);
  expect(
    gearUpgradeSections.find(({ id }) => id === "soul-fuse")?.warning,
  ).toContain("not a live UI check");
  expect(
    gearUpgradeSections.find(({ id }) => id === "reset")?.warning,
  ).toContain("same action as the four-stat Reset is unverified");
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
  expect(amplificationRates.map(({ maxAttempts }) => maxAttempts)).toEqual([
    8, 14, 24, 39, 81,
  ]);
  expect(amplificationTracks).toEqual([
    { itemLevel: "36–51", cap: "None" },
    { itemLevel: "54", cap: "+1" },
    { itemLevel: "70", cap: "+3" },
    { itemLevel: "86", cap: "+5" },
  ]);
  expect(amplificationCraftedCaps).toEqual([
    {
      gear: "True and Star Dragon Lord, including Splendent versions",
      cap: "+3",
    },
    {
      gear: "White and Dark Dragon Lord, including Splendent versions",
      cap: "+5",
    },
  ]);
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
  expect(
    gearUpgradeSections.find(({ id }) => id === "transfer")?.items.join(" "),
  ).toMatch(
    /Tier 3 Expedition → Tier 2 Crafted.*Tier 2 Expedition → Tier 1 Crafted/,
  );
  expect(gearUpgradesSources).toContain("ncGlobal28Oct");
});
