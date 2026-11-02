import { petTypes, type PetType } from "../../../data/pets.ts";
import { FilterChips } from "../../controls/FilterChips/FilterChips.tsx";
import { SearchField } from "../../controls/SearchField/SearchField.tsx";
import STYLES from "./PetControls.module.css";

type MapOption = "best" | "heat";

type Props = {
  query: string;
  onQuery: (query: string) => void;
  types: ReadonlySet<PetType>;
  onToggleType: (type: PetType) => void;
  hideMaxed: boolean;
  onToggleHideMaxed: () => void;
  maxOnly: boolean;
  onToggleMaxOnly: () => void;
  mapOptions: ReadonlySet<MapOption>;
  onToggleMapOption: (option: MapOption) => void;
  shown: number;
  selected: number;
  onSelectAll: () => void;
  onSelectNone: () => void;
};

/** Filters for the checklist, selection buttons, and the two map overlays. */
export function PetControls({
  query,
  onQuery,
  types,
  onToggleType,
  hideMaxed,
  onToggleHideMaxed,
  maxOnly,
  onToggleMaxOnly,
  mapOptions,
  onToggleMapOption,
  shown,
  selected,
  onSelectAll,
  onSelectNone,
}: Props) {
  return (
    <div className={STYLES.controls}>
      <SearchField label="Search pets" value={query} onChange={onQuery} />

      <FilterChips
        label="Creature type"
        chips={petTypes.map((type) => ({
          value: type,
          label: type,
          pressed: types.has(type),
        }))}
        onToggle={onToggleType}
      />

      <FilterChips
        label="List"
        chips={[
          {
            value: "hideMaxed",
            label: "Hide level 3 pets",
            pressed: hideMaxed,
          },
          {
            value: "maxOnly",
            label: "Level 3 box only",
            pressed: maxOnly,
          },
        ]}
        onToggle={(value) =>
          value === "maxOnly" ? onToggleMaxOnly() : onToggleHideMaxed()
        }
      />

      <FilterChips
        label="Map overlays"
        chips={[
          {
            value: "best",
            label: "Highlight best next area",
            pressed: mapOptions.has("best"),
          },
          {
            value: "heat",
            label: "Heatmap of pets left",
            pressed: mapOptions.has("heat"),
          },
        ]}
        onToggle={onToggleMapOption}
      />

      <div className={STYLES.select}>
        <button type="button" onClick={onSelectAll}>
          Select all shown ({shown})
        </button>
        <button type="button" onClick={onSelectNone}>
          Select none
        </button>
        <span role="status">{selected} selected</span>
      </div>
    </div>
  );
}
