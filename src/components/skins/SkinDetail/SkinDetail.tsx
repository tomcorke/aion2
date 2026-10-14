import { Link } from "react-router";
import {
  skinSharing,
  skinSourceLabels,
  type SkinEntry,
} from "../../../data/skins.ts";
import { ownedCount } from "../../../lib/skinOwnership.ts";
import { Diamond } from "../../trim/Diamond/Diamond.tsx";
import STYLES from "./SkinDetail.module.css";

type Props = {
  entry: SkinEntry;
  owned: string[];
  onToggle: (pieceId: string) => void;
};

const number = new Intl.NumberFormat("en-GB");

const kinds: Record<SkinEntry["category"], string> = {
  outfit: "Outfit",
  accessory: "Accessory pair",
  wing: "Wings",
};

/** One set's pieces with ownership ticks, prices and purchase conditions. */
export function SkinDetail({ entry, owned, onToggle }: Props) {
  const { name, category, pieces, total, currency, limit, condition } = entry;
  const count = ownedCount(pieces, owned);
  const sources = entry.sources.map((source) => skinSourceLabels[source]);

  return (
    <div className={STYLES.detail}>
      <h2>{name}</h2>

      <p className={STYLES.meta}>
        <span>
          {kinds[category]} · {pieces.length}{" "}
          {pieces.length === 1 ? "piece" : "pieces"}
        </span>
        <span className={STYLES.owned}>
          {count}/{pieces.length} owned
        </span>
      </p>

      <p>
        From the {sources.join(", ")}, priced in {currency}: one of each piece
        per {limit.scope}.
      </p>

      <table className={STYLES.table}>
        <caption>Pieces</caption>
        <thead>
          <tr>
            <th scope="col">Owned piece</th>
            <th scope="col">Tokens</th>
          </tr>
        </thead>
        <tbody>
          {pieces.map((piece) => (
            <tr key={piece.id}>
              <th scope="row">
                <label className={STYLES.tick}>
                  <input
                    type="checkbox"
                    checked={owned.includes(piece.id)}
                    onChange={() => onToggle(piece.id)}
                  />
                  {piece.name}
                </label>
              </th>
              <td className={STYLES.figure}>{number.format(piece.price)}</td>
            </tr>
          ))}
          {pieces.length > 1 && (
            <tr className={STYLES.total}>
              <th scope="row">Total</th>
              <td className={STYLES.figure}>{number.format(total)}</td>
            </tr>
          )}
        </tbody>
      </table>

      <ul className={STYLES.notes}>
        {[
          condition,
          category === "wing" ? skinSharing.wings : skinSharing.closet,
        ].map((note) => (
          <li key={note}>
            <Diamond />
            <span>{note}</span>
          </li>
        ))}
      </ul>

      <p>
        <Link to="/festival" className={STYLES.link}>
          Shugo Festival games, keys and shop prices
        </Link>
      </p>
    </div>
  );
}
