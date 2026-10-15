import { Link } from "react-router";
import type { SkinAcquisitionEntry } from "../../../data/skinAcquisitions.ts";
import { skinSharing } from "../../../data/skins.ts";
import { ownedCount } from "../../../lib/skinOwnership.ts";
import { SkinRoute } from "../SkinRoute/SkinRoute.tsx";
import STYLES from "./AppearanceDetail.module.css";

type Props = {
  entry: SkinAcquisitionEntry;
  owned: string[];
  onToggle: (pieceId: string) => void;
};

const kinds: Record<SkinAcquisitionEntry["category"], string> = {
  outfit: "Outfit",
  accessory: "Accessory pair",
  wing: "Wings",
};

/** A non-Festival appearance: piece ticks, then each acquisition route on its own terms. */
export function AppearanceDetail({ entry, owned, onToggle }: Props) {
  const { name, category, pieces, acquisitions } = entry;
  const count = ownedCount(pieces, owned);

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
            </label>
          </li>
        ))}
      </ul>

      <div>
        {acquisitions.map((route) => (
          <SkinRoute key={route.id} route={route} pieces={pieces} />
        ))}
      </div>

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
