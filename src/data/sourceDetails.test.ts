import { isMatch } from "date-fns";
import { expect, test } from "vitest";
import { sourceDetails } from "./sourceDetails.ts";
import { sources, type SourceId } from "./sources.ts";

test.each([
  ["game8Festival", "2026-10-05"],
  ["officialMembership", "2026-10-05"],
  ["metabotMethodology", "2026-11-02"],
  ["metabotFestival", "2026-11-01"],
  ["aion2ggFestival", "2026-11-01"],
  ["metabotFestivalShop", "2026-11-02"],
  ["metabotHiddenCubes", "2026-11-02"],
  ["metabotStigma", "2026-11-01"],
  ["officialServers", "2026-10-06"],
  ["metabotCurrencies", "2026-10-07"],
  ["metabotGear", "2026-11-01"],
  ["metabotAbyss", "2026-10-16"],
  ["game8Abyss", "2026-10-16"],
  ["game8Manastones", "2026-10-08"],
  ["metabotChecklist", "2026-11-02"],
  ["gameTruthAlts", "2026-10-09"],
  ["gamesFuzeSoulBinding", "2026-10-09"],
  ["metabotTransferStone", "2026-10-09"],
  ["metabotSubstanceMorph", "2026-10-10"],
  ["metabotDaevanion", "2026-11-01"],
  ["metabotDaevanionPlanner", "2026-11-01"],
  ["ncGlobal21Oct", "2026-11-01"],
  ["ncGlobal28Oct", "2026-11-02"],
  ["ncServerTransfers", "2026-11-02"],
  ["patchbotGlobal28Oct", "2026-11-02"],
  ["metabotOdyliumRepository", "2026-11-02"],
  ["aion2MapsDailyDungeon", "2026-11-02"],
  ["aion2mapsGlobalDifferences", "2026-11-01"],
  ["massivelyOverPoweredLaunchSlots", "2026-11-01"],
  ["aion2GlobalTicketDatabase", "2026-11-02"],
  ["aion2MapsPets", "2026-11-02"],
  ["aion2HelpGlobalRegions", "2026-11-02"],
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

test("retains catalog metadata without conflating source and client builds", () => {
  expect(sourceDetails.metabotGear).toMatchObject({
    region: "Global",
    clientBuild: "0.0.4387.0",
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-27",
    checkedDate: "2026-11-01",
    accessNote: expect.stringMatching(/not independently audited/),
  });

  expect(sourceDetails.metabotFestival).toMatchObject({
    region: "Global",
    clientBuild: "0.0.4387.0",
    checkedDate: "2026-11-01",
    accessNote: expect.stringMatching(/nine games.*without reward tables/i),
  });
  expect(sourceDetails.aion2ggFestival).toMatchObject({
    region: "EU/NA Global",
    clientBuild: ["2", "0", "9", "0"].join("."),
    checkedDate: "2026-11-01",
    accessNote: expect.stringMatching(/Steam build 26262663.*28 October 2026/),
  });
  expect(sourceDetails.metabotStigma).toMatchObject({
    region: "Global",
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-27",
    checkedDate: "2026-11-01",
    accessNote: expect.stringMatching(
      /guide-reported, client-derived.*not independently checked live/i,
    ),
  });
  expect(sourceDetails.metabotStigma?.clientBuild?.split(".")).toEqual([
    "2",
    "0",
    "3",
    "0",
  ]);
  expect(sourceDetails.metabotHiddenCubes).toMatchObject({
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-27",
  });
  expect(sourceDetails.metabotBeginner).toMatchObject({
    region: "Global",
    publishedDate: "2026-10-01",
  });
  expect(sourceDetails.metabotBeginner?.clientBuild).toBe(
    sourceDetails.metabotStigma?.clientBuild,
  );
  expect(sourceDetails.metabotMonsters).toMatchObject({
    region: "Global",
    clientBuild: "0.0.4387.0",
  });
  expect(sourceDetails.metabotDungeons).toMatchObject({
    region: "Global",
    publishedDate: "2026-10-01",
    updatedDate: "2026-10-07",
  });
  expect(sourceDetails.game8Manastones).toMatchObject({
    region: "Global-oriented",
    updatedDate: "2026-10-08",
  });
  expect(sourceDetails.shugoTimers).toMatchObject({
    region: "Global, Korea and Taiwan",
    updatedDate: "2026-10-09",
    checkedDate: "2026-10-14",
  });
  expect(sourceDetails.officialServers?.publishedDate).toBe("2026-10-04");
  expect(sourceDetails.metabotDaevanion?.checkedDate).toBe("2026-11-01");
  expect(sourceDetails.metabotDaevanionPlanner?.checkedDate).toBe("2026-11-01");
  expect(sourceDetails.metabotStigma?.accessNote).toMatch(
    /client-derived.*not independently checked live in game/i,
  );
  expect(sourceDetails.metabotWings?.accessNote).toContain("S85");
  expect(sourceDetails.metabotWings?.accessNote).toContain("S138");
  expect(sourceDetails.gamesFuzeAfter45?.updatedDate).toBe("2026-10-05");
});

test("only known public source IDs carry metadata; unknown dates remain omitted", () => {
  expect(sourceDetails.ownChecks?.checkedDate).toBeUndefined();

  for (const [id, detail] of Object.entries(sourceDetails)) {
    expect(id in sources).toBe(true);
    const source = sources[id as SourceId];

    if ("url" in source) expect(source.url).toMatch(/^https:\/\//);
    else expect(id).toBe("ownChecks");

    if (detail.checkedDate)
      expect(isMatch(detail.checkedDate, "yyyy-MM-dd")).toBe(true);
    if (detail.publishedDate)
      expect(isMatch(detail.publishedDate, "yyyy-MM-dd")).toBe(true);
    if (detail.updatedDate)
      expect(isMatch(detail.updatedDate, "yyyy-MM-dd")).toBe(true);
    if (detail.accessNote) expect(detail.accessNote.length).toBeGreaterThan(15);
  }

  expect(JSON.stringify(sourceDetails)).not.toMatch(
    /Ipsith|character-info|claude\.ai|artifact\//i,
  );
});

test("records the pet-offer notice dates and access limits", () => {
  expect(sourceDetails.ncPetOffers13Oct).toMatchObject({
    region: "Global",
    publishedDate: "2026-10-13",
    checkedDate: "2026-11-02",
    accessNote: expect.stringMatching(/cutoff in PST/),
  });
  expect(sourceDetails.ncPetOffers28Oct).toMatchObject({
    region: "Global",
    publishedDate: "2026-10-28",
    checkedDate: "2026-11-02",
    accessNote: expect.stringMatching(/cutoff in PST/),
  });
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
  expect(sourceDetails.metabotHiddenCubes?.accessNote).toContain(
    "Global build 0.0.4387.0",
  );
  expect(sourceDetails.metabotCurrencies).toMatchObject({
    region: "Global",
    clientBuild: "0.0.4387.0",
  });
  expect(sourceDetails.ownChecks?.accessNote).toMatch(
    /owner observations dated 5.*21 October 2026.*no per-check evidence log/i,
  );
  expect(sourceDetails.metabotEvents?.accessNote).toMatch(
    /schedules.*not.*live EU/i,
  );
  expect(sourceDetails.aion2MapsPets?.accessNote).toMatch(
    /does not identify all three pets or live-check each zone/i,
  );
  expect(sourceDetails.aion2HelpGlobalRegions?.accessNote).toMatch(
    /not an official notice or live check/i,
  );
});
