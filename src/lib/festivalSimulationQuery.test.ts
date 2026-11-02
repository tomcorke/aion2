import { expect, test } from "vitest";
import { parseFestivalSimulationInputs } from "./festivalSimulationQuery.ts";
import { defaultFestivalSimulationInputs as defaults } from "./festivalSimulationInputs.ts";

test("URL inputs restore separate finishes and picks, targets and participation", () => {
  expect(parseFestivalSimulationInputs(new URLSearchParams())).toEqual({
    ok: true,
    inputs: defaults,
    targetTokens: 5000,
  });
  expect(
    parseFestivalSimulationInputs(
      new URLSearchParams(
        "finishes=1&picks=2&startTokens=10&target=custom&customTarget=170&participation=true",
      ),
    ),
  ).toEqual({
    ok: true,
    inputs: {
      finishes: 1,
      picks: 2,
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

test("legacy opening links map to equal finish and pick counts", () => {
  expect(
    parseFestivalSimulationInputs(new URLSearchParams("openings=2")),
  ).toMatchObject({
    ok: true,
    inputs: { finishes: 2, picks: 2 },
  });
  expect(
    parseFestivalSimulationInputs(new URLSearchParams("openings=2&picks=3")).ok,
  ).toBe(false);
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
  for (const field of ["finishes", "picks", "startTokens", "customTarget"]) {
    expect(
      parseFestivalSimulationInputs(new URLSearchParams({ [field]: value })).ok,
    ).toBe(false);
  }
});

test.each([
  "finishes=1001",
  "picks=1001",
  "finishes=1&finishes=2",
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
