import { expect, test } from "vitest";
import { sections } from "./sections.ts";
import { gates, progressionSections } from "./progression.ts";

test("gates climb in total item level from 700 to 4,500", () => {
  const levels = gates.map((gate) => gate.itemLevel);

  expect(levels[0]).toBe(700);
  expect(levels.at(-1)).toBe(4500);

  levels
    .slice(1)
    .forEach((level, i) => expect(level).toBeGreaterThan(levels[i]));
});

test("the milestones open at their checked gates", () => {
  const gateFor = (name: string) =>
    gates.find((gate) => gate.unlocks.some((unlock) => unlock.includes(name)))
      ?.itemLevel;

  expect(gateFor("Krao Cave")).toBe(700);
  expect(gateFor("Lower Reshanta")).toBe(1000);
  expect(gateFor("Urugugu Canyon")).toBe(1400);
  expect(gateFor("Transcendence tier 1")).toBe(1600);
  expect(gateFor("Fire Temple")).toBe(2100);
  expect(gateFor("Ludra")).toBe(2800);
  expect(gateFor("Subjugation (Conquest mode)")).toBe(1500);
  expect(gateFor("Subjugation (Transcendence mode)")).toBe(2000);
});

test("each section has a unique id and links only to real pages", () => {
  const ids = progressionSections.map((section) => section.id);
  const paths = sections.map((section) => `/${section.path}`);

  expect(new Set(ids).size).toBe(ids.length);

  const links = progressionSections.flatMap((section) => section.links ?? []);

  expect(links.length).toBeGreaterThan(0);

  for (const { to } of links) expect(paths).toContain(to);
});
