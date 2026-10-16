import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { skinCatalogueSourceLabels } from "../../../data/skinCatalogueMetadata.ts";
import type {
  SkinCatalogueEntry,
  SkinCatalogueSource,
} from "../../../data/skinCatalogueTypes.ts";
import { useStoredState } from "../../../hooks/useStoredState.ts";
import { toggleOwned, validOwned } from "../../../lib/skinOwnership.ts";
import { ClearFilters } from "../../controls/ClearFilters/ClearFilters.tsx";
import { FilterChips } from "../../controls/FilterChips/FilterChips.tsx";
import { SearchField } from "../../controls/SearchField/SearchField.tsx";
import { AppearanceDetail } from "../AppearanceDetail/AppearanceDetail.tsx";
import { SkinDetail } from "../SkinDetail/SkinDetail.tsx";
import { SkinList } from "../SkinList/SkinList.tsx";
import STYLES from "./SkinCatalogue.module.css";

type SourceFilter = SkinCatalogueSource | "all";

type Props = {
  entries: SkinCatalogueEntry[];
  pieceIds: ReadonlySet<string>;
  setId?: string;
};

const sourceChips = [
  { value: "all" as SourceFilter, label: "All" },
  ...Object.entries(skinCatalogueSourceLabels).map(([value, label]) => ({
    value: value as SourceFilter,
    label,
  })),
];

function matches(
  entry: SkinCatalogueEntry,
  query: string,
  source: SourceFilter,
) {
  const text = query.trim().toLowerCase();
  const names = [
    entry.name,
    ...entry.aliases,
    ...entry.pieces.flatMap(({ name, aliases = [] }) => [name, ...aliases]),
  ];

  return (
    (source === "all" || entry.sources.includes(source)) &&
    names.some((name) => name.toLowerCase().includes(text))
  );
}

/** Search, source chips, the grouped list and the selected entry; the selection leads the reading order. */
export function SkinCatalogue({ entries, pieceIds, setId }: Props) {
  const selected = entries.find(({ id }) => id === setId);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<SourceFilter>("all");
  const [filterSetId, setFilterSetId] = useState(setId);
  const [stored, setStored] = useStoredState<string[]>("skin-owned", []);
  const detailRef = useRef<HTMLElement>(null);
  const picked = useRef(false);

  if (filterSetId !== setId) {
    setFilterSetId(setId);
    setQuery("");
    setSource("all");
  }

  // On phones the details sit above the list, out of view of the row just picked.
  useEffect(() => {
    const section = detailRef.current;

    if (!picked.current || !section) return;

    picked.current = false;

    if (section.getBoundingClientRect().top >= 0) return;

    section.focus({ preventScroll: true });
    section.scrollIntoView?.({ block: "start" });
  }, [setId]);

  const owned = validOwned(stored, pieceIds);
  const visible = entries.filter((entry) => matches(entry, query, source));
  const filtered = query !== "" || source !== "all";

  const clear = () => {
    setQuery("");
    setSource("all");
  };

  const clearButton = <ClearFilters onClear={clear} />;

  const toggle = (pieceId: string) =>
    setStored((current) => toggleOwned(validOwned(current, pieceIds), pieceId));

  function details() {
    if (setId === undefined)
      return <p className={STYLES.message}>Pick a set to see its pieces.</p>;

    if (!selected)
      return (
        <p className={STYLES.message}>
          There is no “{setId}” skin set. Pick one from the list.
        </p>
      );

    if (!visible.includes(selected))
      return (
        <p className={STYLES.message}>
          {selected.name} is hidden by your search or source filter.{" "}
          {clearButton}
        </p>
      );

    return selected.festivalPurchase ? (
      <SkinDetail
        entry={selected.festivalPurchase}
        owned={owned}
        onToggle={toggle}
      />
    ) : (
      <AppearanceDetail entry={selected} owned={owned} onToggle={toggle} />
    );
  }

  const parts = [
    <div key="list" className={STYLES.list}>
      {visible.length > 0 ? (
        <SkinList
          entries={visible}
          owned={owned}
          selected={selected?.id}
          selectedKind={selected?.kind}
          filtered={filtered}
          onPick={() => (picked.current = true)}
        />
      ) : (
        <p className={STYLES.message}>No sets match this search and source.</p>
      )}
    </div>,
    <section
      key="detail"
      ref={detailRef}
      tabIndex={-1}
      aria-label="Selected set"
      className={STYLES.detail}
    >
      {details()}
      {setId !== undefined && (
        <p className={STYLES.back}>
          <Link to="/skins">Back to all sets</Link>
        </p>
      )}
    </section>,
  ];

  return (
    <>
      <div className={STYLES.toolbar}>
        <SearchField
          label="Search sets and pieces"
          value={query}
          onChange={setQuery}
        />
        <FilterChips
          label="Source"
          chips={sourceChips.map(({ value, label }) => ({
            value,
            label,
            pressed: source === value,
          }))}
          onToggle={setSource}
        />
        {filtered && clearButton}
      </div>
      <div className={STYLES.catalogue}>
        {setId === undefined ? parts : parts.reverse()}
      </div>
    </>
  );
}
