import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { simulateFestival } from "../../../lib/festivalSimulation.ts";
import { renderWithProviders } from "../../../testing/render.tsx";
import { SimulationResults } from "./SimulationResults.tsx";

const result = (
  histogram: { tokens: number; count: number }[],
): ReturnType<typeof simulateFestival> => ({
  trials: 2000,
  targetTokens: 100,
  histogram,
  sampleMean: 95.5,
  expectedTotal: 100.5,
  hitCount: 500,
  targetProbability: 0.25,
});

const rows = () =>
  screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => row.textContent);

const renderResults = (
  histogram: { tokens: number; count: number }[],
  stale = false,
) =>
  renderWithProviders(
    <SimulationResults
      result={result(histogram)}
      openings={2}
      target="Spirit Wings"
      stale={stale}
      onResample={vi.fn()}
    />,
  );

test("one exact total stays one bin", () => {
  renderResults([{ tokens: 60, count: 2000 }]);

  expect(rows()).toEqual(["602,000"]);
});

test("bins keep every run, at most twelve equal ranges", () => {
  renderResults(
    Array.from({ length: 30 }, (_, i) => ({
      tokens: i * 10,
      count: i === 29 ? 2000 - 29 * 60 : 60,
    })),
  );

  const counts = rows();

  expect(counts.length).toBeLessThanOrEqual(12);
  expect(counts[0]).toMatch(/^0–24/);
  expect(counts.at(-1)).toMatch(/^275–290/);

  const total = screen
    .getAllByRole("row")
    .slice(1)
    .reduce(
      (sum, row) =>
        sum + Number(row.querySelector("td")!.textContent!.replace(",", "")),
      0,
    );

  expect(total).toBe(2000);
});

test("summarises the result in text without promising it", () => {
  renderResults([{ tokens: 100, count: 2000 }]);

  expect(
    screen.getByText(
      /500 of 2,000 sampled runs of 2 openings reached Spirit Wings \(100 tokens\).*not a guarantee/,
    ),
  ).toBeDefined();
  expect(
    screen.getByRole("definition", { name: "Expected total" }).textContent,
  ).toBe("100.5");
});

test("stale results say so and offer no resample", async () => {
  renderResults([{ tokens: 100, count: 2000 }], true);

  expect(screen.getByRole("status").textContent).toMatch(/previous inputs/);
  expect(screen.queryByRole("button", { name: "Sample again" })).toBeNull();
});

test("resampling asks for a fresh sample", async () => {
  const onResample = vi.fn();

  renderWithProviders(
    <SimulationResults
      result={result([{ tokens: 100, count: 2000 }])}
      openings={2}
      target="x"
      stale={false}
      onResample={onResample}
    />,
  );

  await userEvent.click(screen.getByRole("button", { name: "Sample again" }));

  expect(onResample).toHaveBeenCalledOnce();
});
