import { useState } from "react";
import { useMatch } from "react-router";
import { ClearFilters } from "../../components/controls/ClearFilters/ClearFilters.tsx";
import { FilterChips } from "../../components/controls/FilterChips/FilterChips.tsx";
import { SearchField } from "../../components/controls/SearchField/SearchField.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { AppearanceDetail } from "../../components/skins/AppearanceDetail/AppearanceDetail.tsx";
import { SkinDetail } from "../../components/skins/SkinDetail/SkinDetail.tsx";
import { SkinList } from "../../components/skins/SkinList/SkinList.tsx";
import {
  matchesSkin,
  nonFestivalSkinEntries,
  nonFestivalSkinPieceIds,
  skinAcquisitionSourceLabels,
  skinAcquisitionSources,
  skinAcquisitionsReviewed,
  type SkinAcquisitionSource,
} from "../../data/skinAcquisitions.ts";
import {
  skinEntries,
  skinPieceIds,
  skinSourceLabels,
  skinsReviewed,
  skinsSources,
  type SkinSource,
} from "../../data/skins.ts";
import { useStoredState } from "../../hooks/useStoredState.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import { toggleOwned, validOwned } from "../../lib/skinOwnership.ts";
import STYLES from "./Skins.module.css";

type SourceFilter = SkinSource | SkinAcquisitionSource | "all";

const entries = [...skinEntries, ...nonFestivalSkinEntries];

const knownPieceIds = new Set([...skinPieceIds, ...nonFestivalSkinPieceIds]);

const sourceChips: { value: SourceFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...Object.entries({
    ...skinSourceLabels,
    ...skinAcquisitionSourceLabels,
  }).map(([value, label]) => ({ value: value as SourceFilter, label })),
];

const footerSources = [
  ...new Set([...skinsSources, ...skinAcquisitionSources]),
];

const reviewed = [skinsReviewed, skinAcquisitionsReviewed].sort().at(-1);

export function Skins() {
  useTitle("Skins");

  const setId = useMatch("/skins/:set")?.params.set;
  const selected = entries.find(({ id }) => id === setId);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<SourceFilter>("all");
  const [filterSetId, setFilterSetId] = useState(setId);
  const [stored, setStored] = useStoredState<string[]>("skin-owned", []);

  if (filterSetId !== setId) {
    setFilterSetId(setId);
    setQuery("");
    setSource("all");
  }

  const owned = validOwned(stored, knownPieceIds);
  const visible = entries.filter((entry) => matchesSkin(entry, query, source));
  const filtered = query !== "" || source !== "all";

  const clear = () => {
    setQuery("");
    setSource("all");
  };

  const clearButton = <ClearFilters onClear={clear} />;

  const toggle = (pieceId: string) =>
    setStored((current) =>
      toggleOwned(validOwned(current, knownPieceIds), pieceId),
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

    return "acquisitions" in selected ? (
      <AppearanceDetail entry={selected} owned={owned} onToggle={toggle} />
    ) : (
      <SkinDetail entry={selected} owned={owned} onToggle={toggle} />
    );
  }

  return (
    <>
      <PageHero
        title="Skins"
        lede="Festival, Black Cloud and Abyss appearances, with their sources, prices and your own checklist."
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

      <SiteFooter sources={footerSources} reviewed={reviewed} />
    </>
  );
}
