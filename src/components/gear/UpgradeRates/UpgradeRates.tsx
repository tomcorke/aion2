import {
  amplificationRates,
  enhancementGrades,
  enhancementRates,
} from "../../../data/gearUpgrades.ts";

type Props = {
  track: "enhancement" | "amplification";
};

function GradeTable() {
  return (
    <table>
      <caption>Enhancement caps by gear grade</caption>
      <thead>
        <tr>
          <th scope="col">Grade</th>
          <th scope="col">Always succeeds through</th>
          <th scope="col">Maximum</th>
        </tr>
      </thead>
      <tbody>
        {enhancementGrades.map(({ grade, cap, safeCap }) => (
          <tr key={grade}>
            <th scope="row">{grade}</th>
            <td>+{safeCap}</td>
            <td>+{cap}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RateTable({
  caption,
  step,
  rates,
}: {
  caption: string;
  step: string;
  rates: { level: number; successPercent: number }[];
}) {
  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{step}</th>
          <th scope="col">Base success</th>
        </tr>
      </thead>
      <tbody>
        {rates.map(({ level, successPercent }) => (
          <tr key={level}>
            <th scope="row">+{level}</th>
            <td>{successPercent}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Caps and success rates for ordinary enhancement or the separate Amplified track. */
export function UpgradeRates({ track }: Props) {
  if (track === "amplification")
    return (
      <RateTable
        caption="Amplified Enhancement success rates"
        step="Amplified level"
        rates={amplificationRates}
      />
    );

  return (
    <>
      <GradeTable />
      <RateTable
        caption="Unique enhancement success rates above the safe cap"
        step="Enhancement level"
        rates={enhancementRates}
      />
    </>
  );
}
