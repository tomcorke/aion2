import {
  festivalPickModel,
  festivalPurchases,
  festivalRewards,
} from "../data/festival.ts";

export type FestivalSimulationInputs = {
  finishes: number;
  picks: number;
  startTokens: number;
  targetId: string;
  customTarget: number;
  participation: boolean;
};

export const defaultFestivalSimulationInputs: Readonly<FestivalSimulationInputs> =
  {
    finishes: 100,
    picks: 100,
    startTokens: 0,
    targetId: "lightpath-trace",
    customTarget: 0,
    participation: false,
  };

export type FestivalSimulationErrors = Partial<
  Record<keyof FestivalSimulationInputs, string>
>;
export type FestivalSimulationValidation =
  | { ok: true; inputs: FestivalSimulationInputs; targetTokens: number }
  | { ok: false; errors: FestivalSimulationErrors };

type RawInputs = Record<keyof FestivalSimulationInputs, unknown>;

/** Counts are bounded to 0–1,000; token totals must remain safe integers. */
export function validateFestivalSimulationInputs(
  raw: RawInputs,
): FestivalSimulationValidation {
  const errors: FestivalSimulationErrors = {};

  for (const field of [
    "finishes",
    "picks",
    "startTokens",
    "customTarget",
  ] as const) {
    if (
      typeof raw[field] !== "number" ||
      !Number.isSafeInteger(raw[field]) ||
      raw[field] < 0
    ) {
      errors[field] =
        `${field} must be a nonnegative safe integer (0–9007199254740991).`;
    }
  }

  for (const field of ["finishes", "picks"] as const) {
    if (typeof raw[field] === "number" && raw[field] > 1000) {
      errors[field] = `${field} must be a whole number from 0 to 1,000.`;
    }
  }

  if (typeof raw.participation !== "boolean")
    errors.participation = "Participation must be on or off.";

  const purchase = festivalPurchases.find(({ id }) => id === raw.targetId);

  if (raw.targetId !== "custom" && !purchase)
    errors.targetId = "Choose a supported purchase or a custom token target.";

  if (Object.keys(errors).length) return { ok: false, errors };

  const inputs = raw as FestivalSimulationInputs;
  const maximumReward =
    inputs.picks *
      Math.max(...festivalPickModel.outcomes.map(({ tokens }) => tokens)) +
    inputs.finishes *
      (inputs.participation ? festivalRewards.participation.tokens : 0);

  if (inputs.startTokens > Number.MAX_SAFE_INTEGER - maximumReward) {
    return {
      ok: false,
      errors: {
        startTokens:
          "Starting tokens plus the maximum modeled reward must not exceed 9007199254740991.",
      },
    };
  }

  return {
    ok: true,
    inputs: { ...inputs },
    targetTokens: purchase?.total ?? inputs.customTarget,
  };
}
