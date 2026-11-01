import { petRegions, type PetArea } from "../../../data/pets.ts";
import {
  worldLand,
  worldMapSize,
  worldPoints,
} from "../../../data/petWorldMap.ts";
import { heatStep, type AreaCount } from "../../../lib/petCollection.ts";
import STYLES from "./PetWorldMap.module.css";

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

const regionTitle = (id: string) =>
  petRegions.find((region) => region.id === id)?.title ?? id;

/**
 * A drawn map of the world with a dot per farming area. The list of areas
 * beside it is the accessible version, so the drawing is hidden from readers.
 */
export function PetWorldMap({
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
    <svg
      className={STYLES.map}
      viewBox={`0 0 ${worldMapSize.width} ${worldMapSize.height}`}
      aria-hidden="true"
    >
      {worldLand.map(({ id, path, label: [x, y] }) => (
        <g key={id}>
          <path className={STYLES.land} d={path} />
          <text className={STYLES.region} x={x} y={y} textAnchor="middle">
            {regionTitle(id)}
          </text>
        </g>
      ))}

      {areas.map((area) => {
        const spot = worldPoints.get(area.id);

        if (!spot) return null;

        const left = counts.get(area.id)?.unfinished ?? 0;
        const [x, y] = spot;
        const named = area.id === best || area.id === active;

        return (
          <g
            key={area.id}
            className={STYLES.zone}
            data-dungeon={area.region === "dungeons"}
            data-lit={lit.has(area.id)}
            data-best={area.id === best}
            data-active={area.id === active}
            data-heat={heat ? heatStep(left, busiest) : undefined}
            onClick={() => onPick(area.id)}
          >
            <title>{`${area.name}, ${left} to finish`}</title>
            <circle className={STYLES.halo} cx={x} cy={y} r={14} />
            {area.region === "dungeons" ? (
              <rect
                className={STYLES.dot}
                x={x - 6}
                y={y - 6}
                width={12}
                height={12}
                transform={`rotate(45 ${x} ${y})`}
              />
            ) : (
              <circle className={STYLES.dot} cx={x} cy={y} r={7} />
            )}
            {named && (
              <text
                className={STYLES.name}
                x={x}
                y={y - 16}
                textAnchor="middle"
              >
                {area.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
