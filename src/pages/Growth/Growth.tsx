import { useState } from "react";
import { ClearFilters } from "../../components/controls/ClearFilters/ClearFilters.tsx";
import { FilterChips } from "../../components/controls/FilterChips/FilterChips.tsx";
import { SearchField } from "../../components/controls/SearchField/SearchField.tsx";
import { GrowthAdvice } from "../../components/growth/GrowthAdvice/GrowthAdvice.tsx";
import { GrowthTable } from "../../components/growth/GrowthTable/GrowthTable.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import {
  growthMaterials,
  growthReviewed,
  growthSources,
  growthTargets,
  type GrowthMaterial,
  type GrowthTarget,
} from "../../data/growth.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import STYLES from "./Growth.module.css";

type TargetFilter = GrowthTarget | "all";

const targetChips = [{ id: "all" as const, label: "All" }, ...growthTargets];

// Names, aliases, use and acquisition routes are searchable.
function matches(
  material: GrowthMaterial,
  query: string,
  target: TargetFilter,
) {
  const text = query.trim().toLowerCase();

  const haystack = [
    material.name,
    ...material.aliases,
    material.use,
    ...material.acquisition.flatMap(({ name, detail = "" }) => [name, detail]),
  ];

  return (
    (target === "all" || material.targets.includes(target)) &&
    haystack.some((value) => value.toLowerCase().includes(text))
  );
}

export function Growth() {
  useTitle("Growth");

  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<TargetFilter>("all");
  const visible = growthMaterials.filter((m) => matches(m, query, target));
  const filtered = query !== "" || target !== "all";

  const clear = () => {
    setQuery("");
    setTarget("all");
  };

  const clearButton = <ClearFilters onClear={clear} />;

  return (
    <>
      <PageHero
        title="Growth"
        lede="What each material grows, where more comes from, and the limits on that supply."
      />

      <div className={STYLES.body}>
        <div className={STYLES.toolbar}>
          <SearchField
            label="Search materials"
            value={query}
            onChange={setQuery}
          />
          <FilterChips
            label="What it grows"
            chips={targetChips.map(({ id, label }) => ({
              value: id,
              label,
              pressed: target === id,
            }))}
            onToggle={setTarget}
          />
          {filtered && clearButton}
        </div>

        <div className={STYLES.layout}>
          {visible.length > 0 ? (
            <GrowthTable materials={visible} />
          ) : (
            <p className={STYLES.message}>
              No materials match this search and target. {clearButton}
            </p>
          )}

          <GrowthAdvice />
        </div>
      </div>

      <SiteFooter sources={growthSources} reviewed={growthReviewed} />
    </>
  );
}
