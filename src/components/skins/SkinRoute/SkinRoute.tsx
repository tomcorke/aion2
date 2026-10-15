import {
  skinAcquisitionSourceLabels,
  type SkinAcquisition,
  type SkinAppearancePiece,
  type SkinCost,
} from "../../../data/skinAcquisitions.ts";
import STYLES from "./SkinRoute.module.css";

type Props = {
  route: SkinAcquisition;
  pieces: SkinAppearancePiece[];
};

const number = new Intl.NumberFormat("en-GB");

const formatCosts = (costs: SkinCost[]) =>
  costs
    .map(({ currency, amount }) => `${number.format(amount)} ${currency}`)
    .join(" + ");

/** One acquisition route: the pieces it covers, its exact costs, conditions and warnings. */
export function SkinRoute({ route, pieces }: Props) {
  const { id, name, source, pieceIds, prices, total, costs, limit } = route;
  const headingId = `route-${id}`;
  const pieceName = (pieceId: string) =>
    pieces.find((piece) => piece.id === pieceId)?.name ?? pieceId;

  const coverage =
    pieceIds.length === pieces.length
      ? `All ${pieces.length} pieces`
      : pieceIds.map(pieceName).join(", ");

  return (
    <section aria-labelledby={headingId} className={STYLES.route}>
      <h3 id={headingId}>{name}</h3>

      <p className={STYLES.meta}>
        <span>{skinAcquisitionSourceLabels[source]}</span>
        <span>{coverage}</span>
      </p>

      {route.warnings?.map((warning) => (
        <p key={warning} className={STYLES.warning}>
          <strong>Warning:</strong> {warning}
        </p>
      ))}

      {prices && (
        <table className={STYLES.table}>
          <caption>Shop prices</caption>
          <tbody>
            {prices.map((price) => (
              <tr key={price.pieceId}>
                <th scope="row">{pieceName(price.pieceId)}</th>
                <td className={STYLES.figure}>{formatCosts(price.costs)}</td>
              </tr>
            ))}
            {total && (
              <tr className={STYLES.total}>
                <th scope="row">Total</th>
                <td className={STYLES.figure}>{formatCosts(total)}</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {costs && (
        <p className={STYLES.figure}>{formatCosts(costs)} per attempt</p>
      )}

      {limit && <p>One of each piece per {limit.scope}.</p>}

      <p className={STYLES.condition}>{route.condition}</p>
    </section>
  );
}
