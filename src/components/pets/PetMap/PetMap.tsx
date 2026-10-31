import { petRegions, type PetArea } from "../../../data/pets.ts";
import { heatStep, type AreaCount } from "../../../lib/petCollection.ts";
import STYLES from "./PetMap.module.css";

type Props = {
  areas: PetArea[];
  counts: Map<string, AreaCount>;
  // Areas to mark for the pets being hovered or selected.
  lit: ReadonlySet<string>;
  // The next best area to farm, when that option is on.
  best?: string;
  heat: boolean;
  active?: string;
  onPick: (areaId: string) => void;
};

function tileLabel(area: PetArea, left: number, best: boolean, lit: boolean) {
  const parts = [area.name, `${left} to finish`];

  if (best) parts.push("best area to farm next");
  if (lit) parts.push("marked for your pets");
  if (area.entrance) parts.push(`entrance ${area.entrance}`);

  return parts.join(", ");
}

/** A layout of the named farming zones, grouped by map. Not a scaled drawing. */
export function PetMap({
  areas,
  counts,
  lit,
  best,
  heat,
  active,
  onPick,
}: Props) {
  const busiest = Math.max(0, ...[...counts.values()].map((c) => c.unfinished));

  return (
    <div className={STYLES.map}>
      {petRegions.map(({ id, title }) => {
        const inRegion = areas.filter(({ region }) => region === id);

        if (inRegion.length === 0) return null;

        return (
          <section key={id} aria-label={title} className={STYLES.region}>
            <h3>{title}</h3>

            <ul>
              {inRegion.map((area) => {
                const left = counts.get(area.id)?.unfinished ?? 0;
                const isBest = area.id === best;

                return (
                  <li key={area.id}>
                    <button
                      type="button"
                      className={STYLES.tile}
                      aria-pressed={active === area.id}
                      aria-label={tileLabel(
                        area,
                        left,
                        isBest,
                        lit.has(area.id),
                      )}
                      title={
                        area.entrance ? `Entrance: ${area.entrance}` : undefined
                      }
                      data-lit={lit.has(area.id)}
                      data-best={isBest}
                      data-heat={heat ? heatStep(left, busiest) : undefined}
                      onClick={() => onPick(area.id)}
                    >
                      <span className={STYLES.name}>{area.name}</span>
                      <span className={STYLES.count} aria-hidden="true">
                        {isBest ? "Best · " : ""}
                        {left}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
