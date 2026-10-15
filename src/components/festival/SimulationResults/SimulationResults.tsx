import { useId } from "react";
import type { simulateFestival } from "../../../lib/festivalSimulation.ts";
import STYLES from "./SimulationResults.module.css";

type Result = ReturnType<typeof simulateFestival>;

type Props = {
  result: Result;
  openings: number;
  // Purchase name, or a description of the custom target.
  target: string;
  // The form holds inputs these results were not sampled for.
  stale: boolean;
  onResample: () => void;
};

const BIN_COUNT = 12;

const number = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });

const percent = new Intl.NumberFormat("en-GB", {
  style: "percent",
  maximumFractionDigits: 1,
});

/** Groups exact totals into at most BIN_COUNT equal-width token ranges. */
function bins(histogram: Result["histogram"]) {
  const min = histogram[0]!.tokens;
  const max = histogram.at(-1)!.tokens;
  const width = Math.max(1, Math.ceil((max - min + 1) / BIN_COUNT));
  const out: { from: number; to: number; count: number }[] = [];

  for (let from = min; from <= max; from += width)
    out.push({ from, to: Math.min(from + width - 1, max), count: 0 });

  for (const { tokens, count } of histogram)
    out[Math.floor((tokens - min) / width)]!.count += count;

  return out;
}

function Histogram({ result }: { result: Result }) {
  const rows = bins(result.histogram);
  const tallest = Math.max(...rows.map(({ count }) => count));

  // Large valid totals make wide ranges; scroll the table, not the page.
  return (
    <div className={STYLES.scroll}>
      <table className={STYLES.histogram}>
        <caption>
          Token totals across {number.format(result.trials)} runs
        </caption>
        <thead>
          <tr>
            <th scope="col">Tokens</th>
            <th scope="col">Runs</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ from, to, count }) => (
            <tr key={from}>
              <th scope="row">
                {from === to
                  ? number.format(from)
                  : `${number.format(from)}–${number.format(to)}`}
              </th>
              <td>{number.format(count)}</td>
              <td className={STYLES.barCell}>
                <span
                  aria-hidden="true"
                  className={STYLES.bar}
                  style={{ width: `${(count / tallest) * 100}%` }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Figure({ term, value }: { term: string; value: string }) {
  const id = useId();

  return (
    <div>
      <dt id={id}>{term}</dt>
      <dd aria-labelledby={id}>{value}</dd>
    </div>
  );
}

/** Sampled totals as figures, a text summary and a histogram table. */
export function SimulationResults({
  result,
  openings,
  target,
  stale,
  onResample,
}: Props) {
  const { trials, sampleMean, expectedTotal, hitCount, targetTokens } = result;

  return (
    <section aria-labelledby="festival-results" className={STYLES.results}>
      <h3 id="festival-results">
        {stale ? "Results for the previous inputs" : "Results"}
      </h3>

      {stale && (
        <p role="status" className={STYLES.notice}>
          Inputs changed. These results are for the previous inputs; run the
          simulation to update them.
        </p>
      )}

      <dl className={STYLES.figures}>
        <Figure
          term={`Chance to reach ${number.format(targetTokens)} tokens`}
          value={percent.format(result.targetProbability)}
        />
        <Figure term="Sample mean" value={number.format(sampleMean)} />
        <Figure term="Expected total" value={number.format(expectedTotal)} />
      </dl>

      <p>
        {number.format(hitCount)} of {number.format(trials)} sampled runs of{" "}
        {number.format(openings)} openings reached {target} (
        {number.format(targetTokens)} tokens). The sample mean was{" "}
        {number.format(sampleMean)} tokens against an expected{" "}
        {number.format(expectedTotal)}. Another sample will differ slightly;
        this is an estimate from the model, not a guarantee.
      </p>

      <Histogram result={result} />

      {!stale && (
        <button type="button" className={STYLES.resample} onClick={onResample}>
          Sample again
        </button>
      )}
    </section>
  );
}
