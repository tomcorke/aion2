import { useState } from "react";
import { Link } from "react-router";
import {
  skinCatalogueKindLabels,
  skinCatalogueSourceLabels,
} from "../../../data/skinCatalogueMetadata.ts";
import type {
  SkinCatalogueEntry,
  SkinCatalogueKind,
} from "../../../data/skinCatalogueTypes.ts";
import { ownedCount } from "../../../lib/skinOwnership.ts";
import STYLES from "./SkinList.module.css";

type Props = {
  entries: SkinCatalogueEntry[];
  owned: string[];
  selected?: string;
  selectedKind?: SkinCatalogueKind;
  // A search or source filter is on, so every group with matches opens.
  filtered: boolean;
  onPick?: () => void;
};

const kinds = Object.keys(skinCatalogueKindLabels) as SkinCatalogueKind[];

const groupLabel = (kind: SkinCatalogueKind) =>
  kind === "costume" ? "Outfits" : skinCatalogueKindLabels[kind];

/** Recorded routes, and how many pieces have none, so partial coverage is never read as complete. */
function sourceSummary({
  sources,
  unknownPieceIds,
  pieces,
}: SkinCatalogueEntry) {
  const known = sources
    .filter((source) => source !== "unknown")
    .map((source) => skinCatalogueSourceLabels[source])
    .join(", ");

  if (unknownPieceIds.length === 0) return known;

  if (known === "") return "Source not recorded";

  return `${known} · ${unknownPieceIds.length} of ${pieces.length} not recorded`;
}

/** Entries grouped by kind in native disclosures, each a link to its own route with owned/total progress. */
export function SkinList({
  entries,
  owned,
  selected,
  selectedKind,
  filtered,
  onPick,
}: Props) {
  const [opened, setOpened] = useState<
    Partial<Record<SkinCatalogueKind, boolean>>
  >({
    costume: true,
  });

  return (
    <nav aria-label="Skin sets" className={STYLES.list}>
      {kinds.map((kind) => {
        const group = entries.filter((entry) => entry.kind === kind);

        if (group.length === 0) return null;

        return (
          <details
            key={kind}
            className={STYLES.group}
            open={filtered || kind === selectedKind || opened[kind] === true}
            onToggle={(event) => {
              const { open } = event.currentTarget;

              // Remember the reader's choice, not the temporary filter's.
              if (!filtered)
                setOpened((current) => ({ ...current, [kind]: open }));
            }}
          >
            <summary>
              <h2>{groupLabel(kind)}</h2>
              <span className={STYLES.count}>{group.length}</span>
            </summary>
            <ul>
              {group.map((entry) => {
                const count = ownedCount(entry.pieces, owned);
                const total = entry.pieces.length;

                return (
                  <li key={entry.id}>
                    <Link
                      to={`/skins/${entry.id}`}
                      // Keep the reader's place in a long list (#30).
                      preventScrollReset
                      onClick={onPick}
                      aria-current={entry.id === selected ? "page" : undefined}
                      className={STYLES.entry}
                    >
                      <span>{entry.name}</span>
                      <progress value={count} max={total} aria-hidden="true" />
                      <span className={STYLES.count}>
                        {count}/{total}
                      </span>
                      <span className={STYLES.source}>
                        {sourceSummary(entry)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        );
      })}
    </nav>
  );
}
