import { Link } from "react-router";
import type { SkinCatalogueEntry } from "../../../data/skinCatalogueTypes.ts";
import { skinSharing } from "../../../data/skins.ts";
import { ownedCount } from "../../../lib/skinOwnership.ts";
import { SkinRoute } from "../SkinRoute/SkinRoute.tsx";
import STYLES from "./AppearanceDetail.module.css";

type Props = {
  entry: SkinCatalogueEntry;
  owned: string[];
  onToggle: (pieceId: string) => void;
};

const list = new Intl.ListFormat("en-GB");

function kindLabel({ kind, pieces }: SkinCatalogueEntry) {
  if (kind === "accessory")
    return pieces.length > 1 ? "Accessory pair" : "Accessory";

  return {
    costume: "Outfit",
    armor: "Armour piece",
    vanity: "Vanity piece",
    wing: "Wings",
  }[kind];
}

/** A non-Festival appearance: piece ticks, each recorded route on its own terms, and any pieces without one. */
export function AppearanceDetail({ entry, owned, onToggle }: Props) {
  const { name, category, pieces, acquisitions, unknownPieceIds } = entry;
  const count = ownedCount(pieces, owned);
  const unknown = pieces.filter(({ id }) => unknownPieceIds.includes(id));
  const partial = unknown.length > 0 && unknown.length < pieces.length;

  return (
    <div className={STYLES.detail}>
      <h2>{name}</h2>
      <p className={STYLES.meta}>
        <span>
          {kindLabel(entry)} · {pieces.length}{" "}
          {pieces.length === 1 ? "piece" : "pieces"}
        </span>
        <span className={STYLES.owned}>
          {count}/{pieces.length} owned
        </span>
      </p>
      <ul className={STYLES.pieces} aria-label="Pieces">
        {pieces.map((piece) => (
          <li key={piece.id}>
            <label className={STYLES.tick}>
              <input
                type="checkbox"
                checked={owned.includes(piece.id)}
                onChange={() => onToggle(piece.id)}
              />
              {piece.name}
              {partial && unknown.includes(piece) && (
                <span className={STYLES.note}> (source not recorded)</span>
              )}
            </label>
          </li>
        ))}
      </ul>
      {unknown.length > 0 && (
        <p className={STYLES.note}>
          How to get{" "}
          {partial ? list.format(unknown.map((piece) => piece.name)) : "this"}{" "}
          is not recorded yet. It exists in the game files, which doesn't mean
          it can be obtained now.{" "}
          <Link
            to={{ pathname: "/sources", search: "?topic=skins" }}
            className={STYLES.link}
          >
            Open acquisition questions
          </Link>
        </p>
      )}
      {acquisitions.length > 0 && (
        <div>
          {acquisitions.map((route) => (
            <SkinRoute key={route.id} route={route} pieces={pieces} />
          ))}
        </div>
      )}
      <p className={STYLES.note}>
        {category === "wing" ? skinSharing.wings : skinSharing.closet}
      </p>
      <p>
        <Link to="/alts" className={STYLES.link}>
          What carries over between characters
        </Link>
      </p>
    </div>
  );
}
