import {
  petLevelSouls,
  petLevels,
  petStats,
  type Pet,
  type PetLevelNumber,
} from "../../../data/pets.ts";
import { levelOf, type Levels } from "../../../lib/petCollection.ts";
import STYLES from "./PetChecklist.module.css";

type Props = {
  pets: Pet[];
  levels: Levels;
  selected: ReadonlySet<string>;
  // Show one box for level 3 instead of one per level.
  maxOnly?: boolean;
  onToggleLevel: (id: string, level: PetLevelNumber) => void;
  onToggleSelected: (id: string) => void;
  onHover: (id: string | undefined) => void;
};

const statText = (pet: Pet, level: PetLevelNumber) =>
  petStats[pet.type][level].join(", ") || "No stat bonus";

function whereFrom(pet: Pet) {
  const count = pet.areas.length;
  const noun = count === 1 ? "area" : "areas";
  const parts = [
    ...(count > 0 ? [`${count} farming ${noun}`] : []),
    ...pet.other,
  ];

  return parts.join(" · ");
}

export function PetChecklist({
  pets,
  levels,
  selected,
  maxOnly = false,
  onToggleLevel,
  onToggleSelected,
  onHover,
}: Props) {
  if (pets.length === 0)
    return <p className={STYLES.empty}>No pets match these filters.</p>;

  return (
    <ul className={STYLES.list}>
      {pets.map((pet) => (
        <li
          key={pet.id}
          className={STYLES.row}
          data-selected={selected.has(pet.id)}
          data-level={levelOf(levels, pet.id)}
          data-max-only={maxOnly}
          onMouseEnter={() => onHover(pet.id)}
          onMouseLeave={() => onHover(undefined)}
          onFocus={() => onHover(pet.id)}
          onBlur={() => onHover(undefined)}
        >
          <label className={STYLES.pick}>
            <input
              type="checkbox"
              checked={selected.has(pet.id)}
              aria-label={`Show ${pet.name} on the map`}
              onChange={() => onToggleSelected(pet.id)}
            />
          </label>

          <div className={STYLES.name}>
            <strong>{pet.name}</strong>
            <span>
              {pet.type} · {whereFrom(pet)}
            </span>
          </div>

          {(maxOnly ? petLevels.slice(-1) : petLevels).map((level) => (
            <label
              key={level}
              className={STYLES.level}
              data-step={level}
              data-done={levelOf(levels, pet.id) >= level}
            >
              <input
                type="checkbox"
                checked={levelOf(levels, pet.id) >= level}
                aria-label={`${pet.name} level ${level}`}
                onChange={() => onToggleLevel(pet.id, level)}
              />
              <span>
                <span className={STYLES.levelName}>
                  Level {level} · {petLevelSouls[level]}
                </span>
                <span className={STYLES.stats}>{statText(pet, level)}</span>
              </span>
            </label>
          ))}
        </li>
      ))}
    </ul>
  );
}
