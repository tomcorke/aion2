import type { SkinAppearancePiece } from "../../../data/skinAcquisitions.ts";
import { skinCatalogueSourceLabels } from "../../../data/skinCatalogueMetadata.ts";
import type { SkinCatalogueAcquisition } from "../../../data/skinCatalogueTypes.ts";
import STYLES from "./SkinRoute.module.css";

type Props = {
  route: SkinCatalogueAcquisition;
  pieces: SkinAppearancePiece[];
};

const number = new Intl.NumberFormat("en-GB");
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatCosts = (costs: { currency: string; amount: number }[]) =>
  costs
    .map(({ currency, amount }) =>
      currency === "USD"
        ? usd.format(amount)
        : `${number.format(amount)} ${currency}`,
    )
    .join(" + ");

/** One acquisition route: the pieces it covers, its exact costs, conditions and warnings. */
export function SkinRoute({ route, pieces }: Props) {
  const {
    id,
    name,
    source,
    pieceIds,
    prices,
    total,
    costs,
    listedPrice,
    limit,
  } = route;
  const headingId = `route-${id}`;
  const pieceName = (pieceId: string) =>
    pieces.find((piece) => piece.id === pieceId)?.name ?? pieceId;

  const allPieces = `All ${pieces.length} ${pieces.length === 1 ? "piece" : "pieces"}`;
  const coverage =
    pieceIds.length === pieces.length
      ? allPieces
      : pieceIds.map(pieceName).join(", ");

  return (
    <section aria-labelledby={headingId} className={STYLES.route}>
      <h3 id={headingId}>{name}</h3>

      <p className={STYLES.meta}>
        <span>{skinCatalogueSourceLabels[source]}</span>
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

      {listedPrice && (
        <p className={STYLES.figure}>
          {formatCosts([listedPrice])} per {listedPrice.unit}
        </p>
      )}

      {limit && <p>One of each piece per {limit.scope}.</p>}

      <p className={STYLES.condition}>{route.condition}</p>
    </section>
  );
}
