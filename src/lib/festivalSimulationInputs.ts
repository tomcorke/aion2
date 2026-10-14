import {
  festivalOpeningModel,
  festivalPurchases,
  festivalRewards,
} from "../data/festival.ts";

export type FestivalSimulationInputs = {
  openings: number;
  startTokens: number;
  targetId: string;
  customTarget: number;
  participation: boolean;
};

export const defaultFestivalSimulationInputs: Readonly<FestivalSimulationInputs> =
  {
    openings: 100,
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

/** Tokens must be safe integers; openings are bounded to 0–1,000. */
export function validateFestivalSimulationInputs(
  raw: RawInputs,
): FestivalSimulationValidation {
  const errors: FestivalSimulationErrors = {};

  for (const field of ["openings", "startTokens", "customTarget"] as const) {
    if (
      typeof raw[field] !== "number" ||
      !Number.isSafeInteger(raw[field]) ||
      raw[field] < 0
    ) {
      errors[field] =
        `${field} must be a nonnegative safe integer (0–9007199254740991).`;
    }
  }

  if (typeof raw.openings === "number" && raw.openings > 1000) {
    errors.openings = "Openings must be a whole number from 0 to 1,000.";
  }

  if (typeof raw.participation !== "boolean")
    errors.participation = "Participation must be on or off.";

  const purchase = festivalPurchases.find(({ id }) => id === raw.targetId);

  if (raw.targetId !== "custom" && !purchase)
    errors.targetId = "Choose a supported purchase or a custom token target.";

  if (Object.keys(errors).length) return { ok: false, errors };

  const inputs = raw as FestivalSimulationInputs;
  const maximumReward =
    inputs.openings *
    (Math.max(...festivalOpeningModel.outcomes.map(({ tokens }) => tokens)) +
      (inputs.participation ? festivalRewards.participation.tokens : 0));

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
