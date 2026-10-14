import { useState } from "react";
import { useMatch } from "react-router";
import { FilterChips } from "../../components/controls/FilterChips/FilterChips.tsx";
import { SearchField } from "../../components/controls/SearchField/SearchField.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { SkinDetail } from "../../components/skins/SkinDetail/SkinDetail.tsx";
import { SkinList } from "../../components/skins/SkinList/SkinList.tsx";
import {
  skinEntries,
  skinPieceIds,
  skinSourceLabels,
  skinsReviewed,
  skinsSources,
  type SkinEntry,
  type SkinSource,
} from "../../data/skins.ts";
import { useStoredState } from "../../hooks/useStoredState.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import { toggleOwned, validOwned } from "../../lib/skinOwnership.ts";
import STYLES from "./Skins.module.css";

type SourceFilter = SkinSource | "all";

const sourceChips: { value: SourceFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...Object.entries(skinSourceLabels).map(([value, label]) => ({
    value: value as SkinSource,
    label,
  })),
];

function matches(entry: SkinEntry, query: string, source: SourceFilter) {
  const text = query.trim().toLowerCase();
  const names = [entry.name, ...entry.pieces.map(({ name }) => name)];

  return (
    (source === "all" || entry.sources.includes(source)) &&
    names.some((name) => name.toLowerCase().includes(text))
  );
}

export function Skins() {
  useTitle("Skins");

  const setId = useMatch("/skins/:set")?.params.set;
  const selected = skinEntries.find(({ id }) => id === setId);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<SourceFilter>("all");
  const [stored, setStored] = useStoredState<string[]>("skin-owned", []);
  const owned = validOwned(stored, skinPieceIds);
  const visible = skinEntries.filter((entry) => matches(entry, query, source));
  const filtered = query !== "" || source !== "all";

  const clear = () => {
    setQuery("");
    setSource("all");
  };

  const clearButton = (
    <button type="button" className={STYLES.clear} onClick={clear}>
      Clear filters
    </button>
  );

  const toggle = (pieceId: string) =>
    setStored((current) =>
      toggleOwned(validOwned(current, skinPieceIds), pieceId),
    );

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

    return <SkinDetail entry={selected} owned={owned} onToggle={toggle} />;
  }

  return (
    <>
      <PageHero
        title="Skins"
        lede="Shugo Festival outfits, accessories and wings, with piece prices and your own checklist."
      />

      <div className={STYLES.body}>
        <p className={STYLES.note}>
          Ticks are saved only in this browser. They are your own notes, not a
          synced account, character or Closet inventory.
        </p>

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
          {visible.length > 0 ? (
            <SkinList entries={visible} owned={owned} selected={selected?.id} />
          ) : (
            <p className={STYLES.message}>
              No sets match this search and source.
            </p>
          )}

          <section aria-label="Selected set">{details()}</section>
        </div>
      </div>

      <SiteFooter sources={skinsSources} reviewed={skinsReviewed} />
    </>
  );
}
