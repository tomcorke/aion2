import { expect, test } from "vitest";
import {
  altsSections,
  cubeWarning,
  resourceCounters,
  sharingLedger,
} from "./alts.ts";
import { sections } from "./sections.ts";

test("characters gain their own replenishing rewards but share the skipped-cube pool", () => {
  expect(resourceCounters["odyle-energy"]).toMatchObject({
    scope: "character",
    kind: "continuous",
    cap: 560,
    membershipCap: 840,
    limit: "15 every 3 hours",
  });
  expect(resourceCounters["conquest-rewards"]).toMatchObject({
    scope: "character",
    kind: "continuous",
    cap: 21,
    limit: "1 every 8 hours",
  });
  expect(resourceCounters["transcendence-rewards"]).toMatchObject({
    scope: "character",
    cap: 14,
    limit: "1 every 12 hours",
  });
  expect(resourceCounters["unobtained-cubes"]).toMatchObject({
    scope: "server",
    kind: "weekly",
    cap: 10,
  });
});

test("daily grants bank while weekly entries and time remain separate allowances", () => {
  expect(resourceCounters["duty-missions"]).toMatchObject({
    scope: "server",
    kind: "daily",
    cap: 20,
    limit: "5 completions per day",
  });
  expect(resourceCounters.nightmare).toMatchObject({
    scope: "character",
    kind: "daily",
    cap: 14,
    limit: "2 per day",
  });
  expect(resourceCounters["daily-dungeon"]).toMatchObject({
    scope: "server",
    kind: "weekly",
    cap: 14,
  });
  expect(resourceCounters["abyss-lower"]).toMatchObject({
    scope: "character",
    kind: "time-budget",
    cap: 7,
    membershipCap: 14,
  });
  expect(resourceCounters["abyss-upper"]).not.toHaveProperty("membershipCap");
  expect(resourceCounters["festival-keys"].notes).toMatch(
    /conflict|unverified/i,
  );
  expect(resourceCounters["festival-keys"]).toMatchObject({
    cap: 12,
    membershipCap: 21,
  });
});

test("weekly shop and recipe limits distinguish character and server counters", () => {
  expect(resourceCounters["morph-energy-character"]).toMatchObject({
    scope: "character",
    cap: 4,
  });
  expect(resourceCounters["morph-energy-server"]).toMatchObject({
    scope: "server",
    cap: 16,
  });
  expect(resourceCounters["silver-medals"]).toMatchObject({
    scope: "character",
    cap: 10,
  });
  expect(resourceCounters["lesser-abyssal-manastones"]).toMatchObject({
    scope: "character",
    cap: 50,
  });
  expect(resourceCounters["resurrection-server"]).toMatchObject({
    scope: "server",
    cap: 10,
  });
  expect(resourceCounters["resurrection-character"]).toMatchObject({
    scope: "character",
    cap: 10,
  });
});

test("the ledger keeps corrected character ownership apart from shared appearances", () => {
  const entry = (id: string) => sharingLedger.find((row) => row.id === id);

  for (const id of [
    "wings",
    "pantheon-titles",
    "abyss-points",
    "level-class",
    "gear",
    "stigmas",
    "daevanion",
    "quests",
    "bound-kina",
  ])
    expect(entry(id)?.scope).toBe("character");

  expect(entry("closet")?.scope).toBe("same-server");
  expect(entry("closet")?.details).toMatch(/owned effects.*unverified/i);
  expect(entry("monolith")?.details).toMatch(/not the feathers/i);
  expect(entry("server-storage")?.details).toMatch(/items.*forbid/i);
  expect(entry("unbound-kina")?.details).toMatch(/Conquest.*Server Storage/i);
  expect(entry("pets-genus")?.details).toMatch(/Korean.*Global/i);
  expect(entry("another-server")?.scope).toBe("another-server");
  expect(cubeWarning).toMatch(/At 0.*no character.*Wednesday/i);
});

test("Middle and Upper Abyss guides use the delivered Timers route until the Abyss view lands", () => {
  expect(resourceCounters["abyss-lower"].guide.to).toBe("/timers/abyss");
  expect(resourceCounters["abyss-middle"].guide.to).toBe("/timers");
  expect(resourceCounters["abyss-upper"].guide.to).toBe("/timers");
});

test("curated rows and sections have unique IDs and real guide paths", () => {
  const rows = [...sharingLedger, ...altsSections];

  expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length);

  const paths = sections.map((section) => `/${section.path}`);
  const counters = Object.values(resourceCounters);
  const links = [
    ...counters.map((counter) => counter.guide),
    ...altsSections.flatMap((section) => section.links ?? []),
  ];

  for (const { to } of links) expect(paths).toContain(`/${to.split("/")[1]}`);

  for (const counter of counters) {
    expect(counter.limit).not.toBe("");
    expect(counter.cap).toBeGreaterThan(0);
  }
});
