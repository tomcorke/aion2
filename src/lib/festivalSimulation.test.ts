import { expect, test } from "vitest";
import { simulateFestival } from "./festivalSimulation.ts";
import { festivalOpeningModel } from "../data/festival.ts";

const inputs = {
  openings: 0,
  startTokens: 0,
  targetId: "lightpath-trace",
  customTarget: 0,
  participation: false,
};

test("zero openings retain starting tokens with exact histogram and affordability", () => {
  const result = simulateFestival({ ...inputs, startTokens: 5000 }, () => {
    throw new Error("Zero openings must not draw");
  });

  expect(result).toEqual({
    trials: 2000,
    targetTokens: 5000,
    histogram: [{ tokens: 5000, count: 2000 }],
    sampleMean: 5000,
    expectedTotal: 5000,
    hitCount: 2000,
    targetProbability: 1,
  });
});

// Literal odds and expected mean retained in the maintained Festival reward note.
test("a weighted draw sequence reproduces the additional-opening mean and target hits", () => {
  let draw = 0;
  const result = simulateFestival(
    {
      ...inputs,
      openings: 1,
      startTokens: 7,
      targetId: "custom",
      customTarget: 67,
    },
    () => ((draw++ % 100) + 0.5) / 100,
  );

  expect(
    festivalOpeningModel.outcomes.reduce(
      (sum, outcome) => sum + outcome.probability,
      0,
    ),
  ).toBeCloseTo(1, 12);
  expect(result.histogram).toEqual([
    { tokens: 37, count: 1000 },
    { tokens: 47, count: 600 },
    { tokens: 67, count: 340 },
    { tokens: 107, count: 60 },
  ]);
  expect(result.sampleMean).toBeCloseTo(47.2, 12);
  expect(result.expectedTotal).toBeCloseTo(47.2, 12);
  expect(result.hitCount).toBe(400);
  expect(result.targetProbability).toBeCloseTo(0.2, 12);
});

test.each([
  [0, 30],
  [0.49999999999999994, 30],
  [0.5, 40],
  [0.7999999999999999, 40],
  [0.8, 60],
  [0.9699999999999999, 60],
  [0.97, 100],
  [0.9999999999999999, 100],
])("draw %s awards %s tokens at half-open boundaries", (draw, tokens) => {
  expect(
    simulateFestival({ ...inputs, openings: 1 }, () => draw).histogram,
  ).toEqual([{ tokens, count: 2000 }]);
});

test("participation adds one conditional package for EACH opening", () => {
  const result = simulateFestival(
    { ...inputs, openings: 2, startTokens: 10, participation: true },
    () => 0,
  );

  expect(result.histogram).toEqual([{ tokens: 170, count: 2000 }]);
  expect(result.sampleMean).toBe(170);
  expect(result.expectedTotal).toBeCloseTo(190.4, 12);
  expect(
    simulateFestival({ ...inputs, participation: true }).expectedTotal,
  ).toBe(0);
});

test("1,000 openings use exactly 2,000 bounded trials", () => {
  let draws = 0;
  const result = simulateFestival(
    { ...inputs, openings: 1000, participation: true },
    () => {
      draws++;

      return 0.99;
    },
  );

  expect(draws).toBe(2000000);
  expect(result.histogram).toEqual([{ tokens: 150000, count: 2000 }]);
  expect(result.sampleMean).toBe(150000);
  expect(result.expectedTotal).toBe(90200);
});

test("sampling uses the validated input snapshot even if the RNG changes the caller's object", () => {
  const mutableInputs = { ...inputs, openings: 1 };
  const result = simulateFestival(mutableInputs, () => {
    mutableInputs.openings = 0;
    mutableInputs.startTokens = Number.MAX_SAFE_INTEGER;

    return 0;
  });

  expect(result.histogram).toEqual([{ tokens: 30, count: 2000 }]);
  expect(result.sampleMean).toBe(30);
  expect(result.expectedTotal).toBeCloseTo(40.2, 12);
});

test("a zero target is affordable and a positive target can be unreachable", () => {
  expect(
    simulateFestival({ ...inputs, targetId: "custom", customTarget: 0 })
      .targetProbability,
  ).toBe(1);
  expect(simulateFestival(inputs).hitCount).toBe(0);
  expect(simulateFestival(inputs).targetProbability).toBe(0);
});

test.each([
  ["lightpath-trace", 5000],
  ["skilled-expert", 24900],
  ["twilight-loop", 1210],
  ["starry-starry-night", 6050],
  ["violet-butterfly-wings", 2100],
  ["spirit-wings", 4200],
  ["springflower-butterfly-wings", 8350],
])(
  "purchase target %s resolves to the retained %s-token total",
  (targetId, targetTokens) => {
    expect(simulateFestival({ ...inputs, targetId }).targetTokens).toBe(
      targetTokens,
    );
  },
);

test.each([NaN, Infinity, -Infinity, -0.01, 1, 2])(
  "rejects invalid random draw %s",
  (draw) => {
    expect(() =>
      simulateFestival({ ...inputs, openings: 1 }, () => draw),
    ).toThrow(/Random draws/);
  },
);
