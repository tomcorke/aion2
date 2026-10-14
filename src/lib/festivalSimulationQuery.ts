import {
  defaultFestivalSimulationInputs,
  validateFestivalSimulationInputs,
  type FestivalSimulationInputs,
  type FestivalSimulationErrors,
  type FestivalSimulationValidation,
} from "./festivalSimulationInputs.ts";

function queryValue(field: keyof FestivalSimulationInputs, value: string) {
  if (field === "targetId") return value;

  if (field === "participation") {
    if (value === "true") return true;

    return value === "false" ? false : value;
  }

  return /^\d+$/.test(value) ? Number(value) : NaN;
}

/** Known query fields are singular. Missing fields use defaults; malformed fields never do. */
export function parseFestivalSimulationInputs(
  query: URLSearchParams,
): FestivalSimulationValidation {
  const raw: Record<keyof FestivalSimulationInputs, unknown> = {
    ...defaultFestivalSimulationInputs,
  };
  const errors: FestivalSimulationErrors = {};

  for (const field of [
    "openings",
    "startTokens",
    "customTarget",
    "targetId",
    "participation",
  ] as const) {
    const key = field === "targetId" ? "target" : field;
    const values = query.getAll(key);

    if (values.length === 0) continue;

    if (values.length > 1) {
      errors[field] = `${key} must appear only once in the URL.`;
      continue;
    }

    const value = values[0];

    raw[field] = queryValue(field, value);
  }

  const validation = validateFestivalSimulationInputs(raw);

  if (!validation.ok) Object.assign(errors, validation.errors);

  return Object.keys(errors).length ? { ok: false, errors } : validation;
}
