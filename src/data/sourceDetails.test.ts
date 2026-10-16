import { isMatch } from "date-fns";
import { expect, test } from "vitest";
import { sourceDetails } from "./sourceDetails.ts";
import { sources, type SourceId } from "./sources.ts";

test.each([
  ["game8Festival", "2026-10-05"],
  ["officialMembership", "2026-10-05"],
  ["metabotMethodology", "2026-10-05"],
  ["metabotFestivalShop", "2026-10-05"],
  ["metabotHiddenCubes", "2026-10-06"],
  ["officialServers", "2026-10-06"],
  ["metabotCurrencies", "2026-10-07"],
  ["metabotGear", "2026-10-08"],
  ["game8Manastones", "2026-10-08"],
  ["metabotChecklist", "2026-10-09"],
  ["gameTruthAlts", "2026-10-09"],
  ["gamesFuzeSoulBinding", "2026-10-09"],
  ["metabotTransferStone", "2026-10-09"],
  ["metabotSubstanceMorph", "2026-10-10"],
  ["metabotDaevanion", "2026-10-10"],
  ["game8RiftQuests", "2026-10-10"],
  ["space4GamesRifts", "2026-10-10"],
  ["metabotWings", "2026-10-11"],
  ["metabotContentUnlocks", "2026-10-11"],
  ["metabotDungeonPages", "2026-10-11"],
  ["wikilySkyfeatherGuardian", "2026-10-14"],
  ["destructoidClashRunes", "2026-10-12"],
  ["gamerBlurbClashRunes", "2026-10-12"],
  ["allThingsDailyDungeon", "2026-10-14"],
  ["metabotLowerAbyssRiftStone", "2026-10-14"],
  ["metabotEvents", "2026-10-14"],
  ["couga54", "2026-10-14"],
  ["metabotIntermediateSoulstone", "2026-10-15"],
  ["metabotSuperiorSoulstone", "2026-10-15"],
  ["metabotSkinInventory", "2026-10-16"],
  ["metabotWingInventory", "2026-10-16"],
  ["metabotNightmareShop", "2026-10-16"],
  ["metabotSeasonShop", "2026-10-16"],
  ["metabotDaevaPassShop", "2026-10-16"],
] satisfies [SourceId, string][])(
  "%s retains its actual catalogue check %s, not a note review date",
  (id, date) => {
    expect(sourceDetails[id]?.checkedDate).toBe(date);
  },
);

test("only known public source IDs carry metadata; missing checks are omitted", () => {
  expect(sourceDetails.ownChecks).toBeUndefined();

  for (const [id, detail] of Object.entries(sourceDetails)) {
    expect(id in sources).toBe(true);
    expect("url" in sources[id as SourceId]).toBe(true);

    if (detail.checkedDate)
      expect(isMatch(detail.checkedDate, "yyyy-MM-dd")).toBe(true);
    if (detail.accessNote) expect(detail.accessNote.length).toBeGreaterThan(15);
  }

  expect(JSON.stringify(sourceDetails)).not.toMatch(
    /Ipsith|character-info|claude\.ai|artifact\//i,
  );
});

test("recorded access limits remain readable and do not imply unseen material was checked", () => {
  expect(sourceDetails.officialMembership?.accessNote).toContain("Jina Reader");
  expect(sourceDetails.officialServers?.accessNote).toMatch(
    /JavaScript.*Steam/,
  );
  expect(sourceDetails.game8Manastones?.accessNote).toContain("18,000");
  expect(sourceDetails.wikilySkyfeatherGuardian?.accessNote).toContain(
    "Region unstated",
  );
  expect(sourceDetails.metabotMethodology?.accessNote).toMatch(
    /not.*independently.*audited/,
  );
  expect(sourceDetails.metabotEvents?.accessNote).toMatch(
    /schedules.*not.*live EU/i,
  );
});
