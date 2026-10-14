import { screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { daevanionClasses } from "../../../data/daevanion.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { SkillGroups } from "./SkillGroups.tsx";

const entry = (id: string) => daevanionClasses.find((c) => c.id === id)!;

const group = (name: string) => within(screen.getByRole("region", { name }));

const skills = (name: string) =>
  group(name)
    .queryAllByRole("listitem")
    .map((item) => item.textContent);

test("Spiritmaster's corrected roles land in their groups", () => {
  renderWithProviders(<SkillGroups entry={entry("spiritmaster")} />);

  expect(skills("Core multipliers")).toEqual(["Spirit Strike"]);
  expect(skills("Damage")).toHaveLength(16);
  expect(skills("Damage")).toContain("Spirit Revitalization");
  expect(skills("Utility")).toContain("Summon: Earth Spirit");
  expect(skills("Defensive")).toEqual(["Spirit Protection"]);
  expect(group("Damage").getByText(/Spirit Strike is the core/)).toBeDefined();
});

test("retained Cleric damage skills remain separate from healing and defense", () => {
  renderWithProviders(<SkillGroups entry={entry("cleric")} />);

  expect(skills("Damage")).toHaveLength(8);
  expect(skills("Damage")).toEqual(
    expect.arrayContaining([
      "Chain of Torment",
      "Divine Aura",
      "Bolt",
      "Condemnation",
      "Debilitating Mark",
      "Earth's Retribution",
      "Judgment Thunder",
      "Lightning Strike Scattershot",
    ]),
  );
  expect(skills("Utility")).toContain("Radiant Recovery");
  expect(skills("Defensive")).toEqual([
    "Immortal Veil",
    "Warm Benediction",
    "Empyrean Lords' Benediction",
  ]);
});
