import { expect, test } from "vitest";
import { growthMaterials } from "../data/growth.ts";
import { growthLimitsOf } from "./growthLimits.ts";

test("includes the rendered counter limit and reward notes", () => {
  const enhanceStones = growthMaterials.find(
    ({ id }) => id === "enhance-stones",
  )!;
  const dailyDungeon = enhanceStones.acquisition.find(
    ({ counterId }) => counterId === "daily-dungeon",
  )!;
  const exploration = enhanceStones.acquisition.find(
    ({ rewardConditionId }) => rewardConditionId === "exploration",
  )!;

  expect(growthLimitsOf(dailyDungeon)).toContain(
    "Daily Dungeon (Daeva Bio-Research Base): 14 entries each week, shared on the server.",
  );
  expect(growthLimitsOf(exploration)).toContain(
    "7 rewards per Expedition dungeon each week, per character.",
  );
});
