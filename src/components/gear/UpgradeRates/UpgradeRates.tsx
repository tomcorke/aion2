import {
  amplificationRates,
  amplificationCraftedCaps,
  amplificationTracks,
  enhancementGrades,
  enhancementRates,
} from "../../../data/gearUpgrades.ts";

type Props = {
  track: "enhancement" | "amplification";
};

type Rate = {
  level: number;
  successPercent: number;
  failureBonusPercent: number;
  maxAttempts: number;
  kina: number;
  stones: number;
};

type RateTableProps = {
  caption: string;
  firstColumn: string;
  formatLevel: (level: number) => string;
  rates: Rate[];
};

const formatEnhancementStep = (level: number) =>
  "+" + (level - 1) + " → +" + level;
const formatAmplificationLevel = (level: number) => "+" + level;

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
  firstColumn,
  formatLevel,
  rates,
}: RateTableProps) {
  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{firstColumn}</th>
          <th scope="col">Base success</th>
          <th scope="col">Bonus per failure</th>
          <th scope="col">Maximum attempts</th>
          <th scope="col">Kina + stones</th>
        </tr>
      </thead>
      <tbody>
        {rates.map(
          ({
            level,
            successPercent,
            failureBonusPercent,
            maxAttempts,
            kina,
            stones,
          }) => (
            <tr key={level}>
              <th scope="row">{formatLevel(level)}</th>
              <td>{successPercent}%</td>
              <td>+{failureBonusPercent}%</td>
              <td>{maxAttempts}</td>
              <td>
                {kina.toLocaleString("en-US")} +{" "}
                {stones.toLocaleString("en-US")}
              </td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
}

function AmplificationTracks() {
  return (
    <>
      <table>
        <caption>Amplified track checkpoints by item level</caption>
        <thead>
          <tr>
            <th scope="col">Item level</th>
            <th scope="col">Maximum Amplified level</th>
          </tr>
        </thead>
        <tbody>
          {amplificationTracks.map(({ itemLevel, cap }) => (
            <tr key={itemLevel}>
              <th scope="row">{itemLevel}</th>
              <td>{cap}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <caption>28 October crafted gear cap changes</caption>
        <thead>
          <tr>
            <th scope="col">Crafted gear</th>
            <th scope="col">Maximum Amplified level</th>
          </tr>
        </thead>
        <tbody>
          {amplificationCraftedCaps.map(({ gear, cap }) => (
            <tr key={gear}>
              <th scope="row">{gear}</th>
              <td>{cap}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        These crafted caps take precedence over the item-level checkpoints:
        item-level 62 True/Star Dragon Lord gear caps at +3, and item-level 78
        White/Dark Dragon Lord gear caps at +5.
      </p>
    </>
  );
}

/** Caps and success rates for ordinary enhancement or the separate Amplified track. */
export function UpgradeRates({ track }: Props) {
  if (track === "amplification")
    return (
      <>
        <AmplificationTracks />
        <RateTable
          caption="Amplified Enhancement rates and per-attempt costs"
          firstColumn="Amplified level"
          formatLevel={formatAmplificationLevel}
          rates={amplificationRates}
        />
        <p>Costs list Kina + Amplify Stones per attempt.</p>
      </>
    );

  return (
    <>
      <GradeTable />
      <RateTable
        caption="Unique +10 to +15 rates and costs (item level 102 example)"
        firstColumn="Enhancement step"
        formatLevel={formatEnhancementStep}
        rates={enhancementRates}
      />
      <p>
        Costs list Kina + Enhance Stones per attempt. Costs vary by item level;
        the success rates do not.
      </p>
    </>
  );
}
