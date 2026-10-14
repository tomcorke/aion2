import { expect, test } from "vitest";
import {
  defaultFestivalSimulationInputs,
  validateFestivalSimulationInputs,
} from "./festivalSimulationInputs.ts";
import { simulateFestival } from "./festivalSimulation.ts";

const defaults = {
  openings: 100,
  startTokens: 0,
  targetId: "lightpath-trace",
  customTarget: 0,
  participation: false,
};

test("defaults use the retained Lightpath Trace purchase and no participation", () => {
  expect(defaultFestivalSimulationInputs).toEqual(defaults);
  expect(validateFestivalSimulationInputs(defaults)).toEqual({
    ok: true,
    inputs: defaults,
    targetTokens: 5000,
  });
});

test.each([
  NaN,
  Infinity,
  -Infinity,
  -1,
  1.5,
  Number.MAX_SAFE_INTEGER + 1,
  "100",
  null,
  undefined,
])("rejects invalid token input %s at the shared trust boundary", (value) => {
  for (const field of ["startTokens", "customTarget"]) {
    const input = { ...defaults, [field]: value };
    const result = validateFestivalSimulationInputs(input);

    expect(result.ok).toBe(false);

    if (!result.ok)
      expect(result.errors[field as "startTokens" | "customTarget"]).toMatch(
        /nonnegative safe integer/,
      );

    expect(() => simulateFestival(input as typeof defaults)).toThrow(
      /nonnegative safe integer/,
    );
  }
});

test("rejects maximum totals that could exceed safe integer precision", () => {
  const result = validateFestivalSimulationInputs({
    ...defaults,
    openings: 1,
    startTokens: Number.MAX_SAFE_INTEGER - 99,
  });

  expect(result).toEqual({
    ok: false,
    errors: {
      startTokens:
        "Starting tokens plus the maximum modeled reward must not exceed 9007199254740991.",
    },
  });
  expect(() =>
    simulateFestival({
      ...defaults,
      openings: 1,
      startTokens: Number.MAX_SAFE_INTEGER - 99,
    }),
  ).toThrow(/maximum modeled reward/);
});

test.each([-1, 0.5, NaN, Infinity, 1001, Number.MAX_SAFE_INTEGER])(
  "rejects invalid opening count %s before sampling",
  (openings) => {
    expect(() =>
      simulateFestival({ ...defaults, openings }, () => {
        throw new Error("Must reject before sampling");
      }),
    ).toThrow(/Openings|openings/);
  },
);

test("safe-integer edges accept exact maximum totals and reject participation overflow", () => {
  const maximum = Number.MAX_SAFE_INTEGER;
  const input = {
    ...defaults,
    openings: 1,
    startTokens: maximum - 100,
    targetId: "custom",
    customTarget: maximum,
  };

  expect(validateFestivalSimulationInputs(input).ok).toBe(true);
  expect(simulateFestival(input, () => 0.99)).toMatchObject({
    sampleMean: maximum,
    histogram: [{ tokens: maximum, count: 2000 }],
    hitCount: 2000,
  });
  expect(
    validateFestivalSimulationInputs({ ...input, participation: true }).ok,
  ).toBe(false);
  expect(
    validateFestivalSimulationInputs({
      ...input,
      startTokens: maximum - 150,
      participation: true,
    }).ok,
  ).toBe(true);
  expect(
    simulateFestival({ ...input, openings: 0, startTokens: maximum }),
  ).toMatchObject({
    sampleMean: maximum,
    expectedTotal: maximum,
    hitCount: 2000,
  });
});

test.each([
  { targetId: "missing" },
  { targetId: "" },
  { participation: "false" },
  { participation: 1 },
])("rejects malformed model selection %j", (change) => {
  expect(validateFestivalSimulationInputs({ ...defaults, ...change }).ok).toBe(
    false,
  );
});
