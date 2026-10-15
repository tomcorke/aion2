import { useState } from "react";
import { useSearchParams } from "react-router";
import { festivalPurchases } from "../../../data/festival.ts";
import { defaultFestivalSimulationInputs as defaults } from "../../../lib/festivalSimulationInputs.ts";
import { parseFestivalSimulationInputs } from "../../../lib/festivalSimulationQuery.ts";
import { simulateFestival } from "../../../lib/festivalSimulation.ts";
import {
  SimulatorForm,
  type Draft,
  type DraftErrors,
} from "../SimulatorForm/SimulatorForm.tsx";
import { SimulationResults } from "../SimulationResults/SimulationResults.tsx";
import STYLES from "./FestivalSimulator.module.css";

const defaultDraft: Draft = {
  openings: String(defaults.openings),
  startTokens: String(defaults.startTokens),
  target: defaults.targetId,
  customTarget: String(defaults.customTarget),
  participation: String(defaults.participation),
};

const draftFrom = (params: URLSearchParams) =>
  Object.fromEntries(
    Object.entries(defaultDraft).map(([key, value]) => [
      key,
      params.get(key) ?? value,
    ]),
  ) as Draft;

// The custom amount only means something with a custom target.
function queryFrom(draft: Draft) {
  const { customTarget, ...rest } = draft;

  return new URLSearchParams(
    draft.target === "custom" ? { ...rest, customTarget } : rest,
  );
}

const targetName = (id: string) =>
  festivalPurchases.find((purchase) => purchase.id === id)?.name ??
  "the custom target";

/** The URL holds the model inputs; results are sampled for exactly those inputs. */
export function FestivalSimulator() {
  const [params, setParams] = useSearchParams();
  const search = params.toString();

  return (
    <Simulator
      key={search}
      params={params}
      onRun={(draft) => setParams(queryFrom(draft))}
    />
  );
}

function Simulator({
  params,
  onRun,
}: {
  params: URLSearchParams;
  onRun: (draft: Draft) => void;
}) {
  const applied = draftFrom(params);
  const [draft, setDraft] = useState(applied);
  const parsed = parseFestivalSimulationInputs(params);
  const sample = () =>
    parsed.ok ? simulateFestival(parsed.inputs) : undefined;
  // A URL change remounts this component, so results always match the URL.
  const [result, setResult] = useState(sample);
  const stale = queryFrom(draft).toString() !== queryFrom(applied).toString();
  const changed = queryFrom(draft).toString() !== params.toString();

  const errors: DraftErrors = parsed.ok
    ? {}
    : {
        openings: parsed.errors.openings,
        startTokens: parsed.errors.startTokens,
        target: parsed.errors.targetId,
        customTarget: parsed.errors.customTarget,
        participation: parsed.errors.participation,
      };

  return (
    <div className={STYLES.simulator}>
      <SimulatorForm
        draft={draft}
        errors={errors}
        onChange={(key, value) => setDraft({ ...draft, [key]: value })}
        onSubmit={() => (changed ? onRun(draft) : setResult(sample()))}
      />

      {parsed.ok && result ? (
        <SimulationResults
          result={result}
          openings={parsed.inputs.openings}
          target={targetName(parsed.inputs.targetId)}
          stale={stale}
          onResample={() => setResult(sample())}
        />
      ) : (
        <p role="alert" className={STYLES.invalid}>
          No results: fix the inputs marked above, then run the simulation.
        </p>
      )}
    </div>
  );
}
