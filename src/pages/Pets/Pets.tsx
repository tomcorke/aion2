import { useMemo, useState } from "react";
import { PetChecklist } from "../../components/pets/PetChecklist/PetChecklist.tsx";
import { PetControls } from "../../components/pets/PetControls/PetControls.tsx";
import { PetMap } from "../../components/pets/PetMap/PetMap.tsx";
import { PetWorldMap } from "../../components/pets/PetWorldMap/PetWorldMap.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import {
  petAreas,
  petShopOffers,
  petRegions,
  pets,
  petsAttribution,
  petsLimits,
  petsReviewed,
  petsSources,
  type PetRegion,
  type PetType,
} from "../../data/pets.ts";
import { useStoredState } from "../../hooks/useStoredState.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import {
  areasOf,
  bestArea,
  countByArea,
  filterPets,
  isMaxed,
  toggleLevel,
  toggleMax,
  validLevels,
} from "../../lib/petCollection.ts";
import STYLES from "./Pets.module.css";

const knownIds = new Set(pets.map(({ id }) => id));
const areaOrder = petAreas.map(({ id }) => id);
const areaName = (id: string) => {
  const area = petAreas.find((candidate) => candidate.id === id);
  const region = petRegions.find(
    ({ id: regionId }) => regionId === area?.region,
  );

  return area && region ? `${area.name} (${region.title})` : undefined;
};

function bestAccessWarning(region?: PetRegion) {
  if (region?.access === "guide-not-global")
    return "Guides report this as KR/TW content; it is not a confirmed Global stop.";

  if (region?.access === "unknown")
    return "Global access is unverified; this is not a confirmed Global stop.";

  return undefined;
}

function toggled<T>(set: ReadonlySet<T>, value: T) {
  const next = new Set(set);

  if (!next.delete(value)) next.add(value);

  return next;
}

export function Pets() {
  useTitle("Pets");

  const [stored, setStored] = useStoredState<Record<string, number>>(
    "pet-levels",
    {},
  );
  const levels = useMemo(() => validLevels(stored, knownIds), [stored]);
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<ReadonlySet<PetType>>(new Set());
  const [hideMaxed, setHideMaxed] = useState(false);
  const [maxOnly, setMaxOnly] = useStoredState("pet-max-only", false);
  const [mapOptions, setMapOptions] = useState<ReadonlySet<"best" | "heat">>(
    new Set(),
  );
  const [area, setArea] = useState<string>();
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [hovered, setHovered] = useState<string>();

  const counts = useMemo(() => countByArea(pets, levels), [levels]);
  const best = mapOptions.has("best") ? bestArea(counts, areaOrder) : undefined;
  const bestRegionId = petAreas.find(({ id }) => id === best)?.region;
  const bestRegion = petRegions.find(({ id }) => id === bestRegionId);
  const bestWarning = bestAccessWarning(bestRegion);
  const shown = filterPets(pets, levels, { query, types, hideMaxed, area });
  // A row removed by a filter fires no mouse-leave, so ignore it once hidden.
  const hoveredShown = shown.some(({ id }) => id === hovered)
    ? hovered
    : undefined;
  const lit = areasOf(
    pets,
    hoveredShown ? new Set([...selected, hoveredShown]) : selected,
  );
  const owned = pets.filter(({ id }) => (levels[id] ?? 0) > 0).length;
  const maxed = pets.filter(({ id }) => isMaxed(levels, id)).length;

  const pickArea = (id: string) =>
    setArea((current) => (current === id ? undefined : id));

  return (
    <>
      <PageHero
        title="Pets"
        lede="Every pet with a recorded source, with a checklist for levels 1 to 3, the stats each level gives and where to farm its souls."
      />
      <div className={STYLES.body}>
        <p className={STYLES.note}>
          Level 1 unlocks the pet; level 3 is the maximum and gives the full
          stats. Ticks are saved only in this browser. Tick a pet&apos;s box on
          the left to mark its farming areas on the map; hovering a pet marks
          them too.
        </p>
        <section className={STYLES.uses} aria-labelledby="pet-uses-title">
          <h2 id="pet-uses-title">Why collect pets?</h2>
          <p>
            Pets also serve as mounts. Levelling pets adds Genus Insight to
            their Genus board, and collection milestones award Soul Crystals and
            Empathy Candy.
          </p>
          <p>
            Use Empathy Candy to transform into a pet you have equipped after it
            reaches level 3. The transformation lasts five minutes. Whether
            bonuses from multiple pets of the same type stack is still
            unconfirmed.
          </p>
        </section>
        <section className={STYLES.shop} aria-labelledby="pet-shop-title">
          <h2 id="pet-shop-title">Current Global shop offers</h2>
          <p>
            NC&apos;s notices list these temporary offers but do not identify
            their matching entries in the 209-pet client roster. Keep them
            separate from the 204-pet checklist; they are not counted there.
          </p>
          <ul className={STYLES.offerList}>
            {petShopOffers.map((offer) => (
              <li key={offer.name} className={STYLES.offer}>
                <h3>{offer.name}</h3>
                <dl>
                  <div>
                    <dt>Price</dt>
                    <dd>{offer.price}</dd>
                  </div>
                  <div>
                    <dt>Limit</dt>
                    <dd>{offer.purchaseLimit}</dd>
                  </div>
                  <div>
                    <dt>Sale ends</dt>
                    <dd>{offer.saleEnds}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
          <p className={STYLES.hint}>
            Prices are PURPLE Store references and may vary by storefront. The
            notices are not a live shop check; recheck this list after each sale
            window ends and refresh or remove expired offers.
          </p>
        </section>
        <details className={STYLES.limits}>
          <summary>What this list does not cover</summary>
          <ul>
            {petsLimits.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </details>

        <PetControls
          query={query}
          onQuery={setQuery}
          types={types}
          onToggleType={(type) => setTypes((current) => toggled(current, type))}
          hideMaxed={hideMaxed}
          onToggleHideMaxed={() => setHideMaxed((current) => !current)}
          maxOnly={maxOnly}
          onToggleMaxOnly={() => setMaxOnly((current) => !current)}
          mapOptions={mapOptions}
          onToggleMapOption={(option) =>
            setMapOptions((current) => toggled(current, option))
          }
          shown={shown.length}
          selected={selected.size}
          onSelectAll={() =>
            setSelected(
              (current) => new Set([...current, ...shown.map(({ id }) => id)]),
            )
          }
          onSelectNone={() => setSelected(new Set())}
        />

        <div className={STYLES.layout}>
          <section aria-label="Farming map" className={STYLES.map}>
            <h2>Where to farm</h2>
            <p className={STYLES.hint}>
              Best next area counts pets below level 3 in each area. Ties favor
              more unowned pets, then map order. It does not rank the fastest or
              easiest routes, and it ignores region access, monster level, route
              effort, competition and respawn time.
            </p>
            <p className={STYLES.access}>
              Global access is guide-reported, not checked live. Guides report
              Verteron, Altgard and Chaotic Lower Reshanta as Global areas, and
              Chaotic Middle Reshanta, Morheim and Eltnen as KR/TW content. Krao
              Cave and Draupnir are listed as pet sources, but their access is
              unverified. Treat unverified areas as map references, not
              confirmed Global farming stops.
            </p>
            {best && (
              <p role="status">
                Best next area by pet count: <strong>{areaName(best)}</strong>,
                with {counts.get(best)?.unfinished} pets below level 3{" ("}
                {counts.get(best)?.unowned} not yet owned).
                {bestWarning && ` ${bestWarning}`}
              </p>
            )}
            {mapOptions.has("best") && !best && (
              <p role="status">
                Every pet that drops from monsters is at level 3.
              </p>
            )}
            {area && (
              <p role="status">
                Listing pets that drop in <strong>{areaName(area)}</strong>.{" "}
                <button
                  type="button"
                  className={STYLES.clear}
                  onClick={() => setArea(undefined)}
                >
                  Show all pets
                </button>
              </p>
            )}
            <PetWorldMap
              areas={petAreas}
              counts={counts}
              lit={lit}
              best={best}
              heat={mapOptions.has("heat")}
              active={area}
              onPick={pickArea}
            />
            <p className={STYLES.hint}>
              The map identifies zones only; it does not list target monsters,
              monster levels or drop chances. Coastlines and zone positions are
              approximate; diamonds are party dungeons.
            </p>
            <details className={STYLES.areas}>
              <summary>Areas as a list</summary>
              <PetMap
                areas={petAreas}
                counts={counts}
                lit={lit}
                best={best}
                heat={mapOptions.has("heat")}
                active={area}
                onPick={pickArea}
              />
            </details>
          </section>

          <section aria-label="Pet checklist" className={STYLES.list}>
            <h2>
              Checklist{" "}
              <span className={STYLES.progress}>
                {owned}/{pets.length} owned · {maxed} at level 3
              </span>
            </h2>
            <PetChecklist
              pets={shown}
              levels={levels}
              selected={selected}
              maxOnly={maxOnly}
              onToggleLevel={(id, level) =>
                setStored((current) => {
                  const valid = validLevels(current, knownIds);

                  return maxOnly
                    ? toggleMax(valid, id)
                    : toggleLevel(valid, id, level);
                })
              }
              onToggleSelected={(id) =>
                setSelected((current) => toggled(current, id))
              }
              onHover={setHovered}
            />
          </section>
        </div>
      </div>
      <SiteFooter
        sources={[...petsSources]}
        reviewed={petsReviewed}
        attribution={petsAttribution}
      />
    </>
  );
}
