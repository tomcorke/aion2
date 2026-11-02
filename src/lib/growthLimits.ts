import { resourceCounters } from "../data/alts.ts";
import { gearRewardConditions } from "../data/gear.ts";
import type { GrowthAcquisition } from "../data/growth.ts";
import { counterLimit } from "./counterLimit.ts";

const scopeLabels = {
  character: "per character",
  server: "shared on the server",
};

export function growthLimitsOf(route: GrowthAcquisition) {
  const counter = route.counterId && resourceCounters[route.counterId];
  const rules =
    gearRewardConditions.find(({ id }) => id === route.rewardConditionId)
      ?.notes ?? [];

  return [
    ...(route.limit ? [route.limit] : []),
    ...(counter
      ? [
          `${counter.name}: ${counterLimit(counter)}, ${scopeLabels[counter.scope]}.`,
        ]
      : []),
    ...rules,
  ];
}
