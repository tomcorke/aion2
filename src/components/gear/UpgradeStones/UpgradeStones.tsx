import {
  engravingGrades,
  stoneEngraving,
  stoneTiers,
} from "../../../data/gearUpgrades.ts";

const number = new Intl.NumberFormat("en-GB");

function SlotTable() {
  return (
    <table>
      <caption>Manastone and Soulstone slots by gear grade</caption>
      <thead>
        <tr>
          <th scope="col">Gear grade</th>
          <th scope="col">Slots</th>
          <th scope="col">Kina per engrave</th>
        </tr>
      </thead>
      <tbody>
        {engravingGrades.map(({ grade, slots, kina }) => (
          <tr key={grade}>
            <th scope="row">{grade}</th>
            <td>{slots}</td>
            <td>{number.format(kina)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TierTable() {
  return (
    <table>
      <caption>Stone tier line-grade odds</caption>
      <thead>
        <tr>
          <th scope="col">Stone tier</th>
          <th scope="col">Line grades</th>
        </tr>
      </thead>
      <tbody>
        {stoneTiers.map(({ id, name, lineGrades, qualityPercent }) => (
          <tr key={id}>
            <th scope="row">{name}</th>
            <td>
              {lineGrades
                .map((grade, i) => `${grade} ${qualityPercent[i]}%`)
                .join(", ")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function KindTable() {
  return (
    <table>
      <caption>Stone kinds</caption>
      <thead>
        <tr>
          <th scope="col">Stone</th>
          <th scope="col">Slots</th>
          <th scope="col">How it works</th>
        </tr>
      </thead>
      <tbody>
        {stoneEngraving.map(({ id, name, slots, use, warning }) => (
          <tr key={id}>
            <th scope="row">{name}</th>
            <td>{slots.join(", ")}</td>
            <td>
              <p>{use}</p>
              {warning && <p role="note">{warning}</p>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Stone kinds, slot counts by gear grade, and tier odds. Acquisition lives on Growth. */
export function UpgradeStones() {
  return (
    <>
      <KindTable />
      <SlotTable />
      <TierTable />
    </>
  );
}
