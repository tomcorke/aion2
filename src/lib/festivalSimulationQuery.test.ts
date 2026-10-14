import { expect, test } from "vitest";
import { parseFestivalSimulationInputs } from "./festivalSimulationQuery.ts";
import { defaultFestivalSimulationInputs as defaults } from "./festivalSimulationInputs.ts";

test("URL inputs restore defaults, purchase IDs, custom targets and explicit participation", () => {
  expect(parseFestivalSimulationInputs(new URLSearchParams())).toEqual({
    ok: true,
    inputs: defaults,
    targetTokens: 5000,
  });
  expect(
    parseFestivalSimulationInputs(
      new URLSearchParams(
        "openings=2&startTokens=10&target=custom&customTarget=170&participation=true",
      ),
    ),
  ).toEqual({
    ok: true,
    inputs: {
      openings: 2,
      startTokens: 10,
      targetId: "custom",
      customTarget: 170,
      participation: true,
    },
    targetTokens: 170,
  });
  expect(
    parseFestivalSimulationInputs(new URLSearchParams("target=spirit-wings")),
  ).toMatchObject({ ok: true, targetTokens: 4200 });
});

test.each([
  "",
  "NaN",
  "Infinity",
  "-1",
  "1.5",
  "1e2",
  "0x10",
  "10junk",
  " 10",
  "9007199254740992",
  "1.0000000000000001",
])("URL rejects malformed integer %j rather than coercing it", (value) => {
  for (const field of ["openings", "startTokens", "customTarget"]) {
    expect(
      parseFestivalSimulationInputs(new URLSearchParams({ [field]: value })).ok,
    ).toBe(false);
  }
});

test.each([
  "openings=1001",
  "openings=1&openings=2",
  "target=missing",
  "target=",
  "target=custom&target=spirit-wings",
  "participation=1",
  "participation=",
  "participation=true&participation=false",
  "startTokens=9007199254740991",
])("rejects invalid URL %s with field errors", (query) => {
  const result = parseFestivalSimulationInputs(new URLSearchParams(query));

  expect(result.ok).toBe(false);

  if (!result.ok)
    expect(
      Object.values(result.errors).every((message) => message.length > 10),
    ).toBe(true);
});
