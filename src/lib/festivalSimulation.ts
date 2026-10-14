import { festivalOpeningModel, festivalRewards } from "../data/festival.ts";
import {
  validateFestivalSimulationInputs,
  type FestivalSimulationInputs,
} from "./festivalSimulationInputs.ts";

function drawTokens(random: () => number) {
  const draw = random();
  let boundary = 0;

  if (!Number.isFinite(draw) || draw < 0 || draw >= 1) {
    throw new RangeError(
      "Random draws must be finite numbers from 0 inclusive to 1 exclusive.",
    );
  }

  for (const outcome of festivalOpeningModel.outcomes) {
    boundary += outcome.probability * 100;

    if (draw < boundary / 100) return outcome.tokens;
  }

  throw new RangeError(
    "Random draws must be finite numbers from 0 inclusive to 1 exclusive.",
  );
}

export function simulateFestival(
  rawInputs: FestivalSimulationInputs,
  random: () => number = Math.random,
) {
  const validation = validateFestivalSimulationInputs(rawInputs);

  if (!validation.ok)
    throw new RangeError(Object.values(validation.errors).join(" "));

  const { inputs, targetTokens } = validation;
  const participationTokens = inputs.participation
    ? festivalRewards.participation.tokens
    : 0;
  const counts = new Map<number, number>();
  let rewardSum = 0;
  let hitCount = 0;

  for (let trial = 0; trial < 2000; trial++) {
    let reward = 0;

    for (let opening = 0; opening < inputs.openings; opening++) {
      reward += drawTokens(random) + participationTokens;
    }

    const tokens = inputs.startTokens + reward;

    rewardSum += reward;
    counts.set(tokens, (counts.get(tokens) ?? 0) + 1);

    if (tokens >= targetTokens) hitCount++;
  }

  return {
    trials: 2000,
    targetTokens,
    histogram: [...counts]
      .sort(([a], [b]) => a - b)
      .map(([tokens, count]) => ({ tokens, count })),
    sampleMean: inputs.startTokens + rewardSum / 2000,
    expectedTotal:
      inputs.startTokens +
      Number(
        (
          inputs.openings *
          (festivalOpeningModel.meanTokens + participationTokens)
        ).toFixed(1),
      ),
    hitCount,
    targetProbability: hitCount / 2000,
  };
}
