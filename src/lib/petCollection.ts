import type { Pet } from "../data/pets.ts";

export type PetLevel = 0 | 1 | 2 | 3;

export type Levels = Record<string, PetLevel>;

const MAX: PetLevel = 3;

// Stored levels are untrusted: keep only known pets with a level from 1 to 3.
export function validLevels(value: unknown, known: ReadonlySet<string>) {
  const levels: Levels = {};

  if (typeof value !== "object" || value === null || Array.isArray(value))
    return levels;

  for (const [id, level] of Object.entries(value)) {
    if (known.has(id) && (level === 1 || level === 2 || level === 3))
      levels[id] = level;
  }

  return levels;
}

export const levelOf = (levels: Levels, id: string): PetLevel =>
  levels[id] ?? 0;

export const isMaxed = (levels: Levels, id: string) =>
  levelOf(levels, id) === MAX;

/** Ticking a level sets it; unticking drops back to the level below. */
export function toggleLevel(levels: Levels, id: string, level: 1 | 2 | 3) {
  const next = (levelOf(levels, id) >= level ? level - 1 : level) as PetLevel;
  const updated = { ...levels, [id]: next };

  if (next === 0) delete updated[id];

  return updated;
}

/** Ticking the only box sets level 3; unticking clears the pet. */
export function toggleMax(levels: Levels, id: string) {
  const updated = { ...levels, [id]: MAX };

  if (isMaxed(levels, id)) delete updated[id];

  return updated;
}

export type AreaCount = { unfinished: number; unowned: number };

/** For each area, the pets that drop there and are not yet at level 3. */
export function countByArea(pets: Pet[], levels: Levels) {
  const counts = new Map<string, AreaCount>();

  for (const pet of pets) {
    if (isMaxed(levels, pet.id)) continue;

    for (const area of pet.areas) {
      const count = counts.get(area) ?? { unfinished: 0, unowned: 0 };

      count.unfinished += 1;
      if (levelOf(levels, pet.id) === 0) count.unowned += 1;

      counts.set(area, count);
    }
  }

  return counts;
}

/** The area with the most unfinished pets; ties go to more unowned, then map order. */
export function bestArea(counts: Map<string, AreaCount>, order: string[]) {
  let best: string | undefined;

  for (const id of order) {
    const count = counts.get(id);
    const top = best === undefined ? undefined : counts.get(best);

    if (!count) continue;

    if (
      !top ||
      count.unfinished > top.unfinished ||
      (count.unfinished === top.unfinished && count.unowned > top.unowned)
    )
      best = id;
  }

  return best;
}

/** Heat from 0 (nothing left) to 4 (as many pets as the busiest area). */
export function heatStep(unfinished: number, busiest: number) {
  if (unfinished <= 0 || busiest <= 0) return 0;

  return Math.min(4, Math.ceil((unfinished / busiest) * 4));
}

export const areasOf = (pets: Pet[], ids: ReadonlySet<string>) =>
  new Set(pets.filter(({ id }) => ids.has(id)).flatMap(({ areas }) => areas));

export type PetFilters = {
  query: string;
  types: ReadonlySet<string>;
  hideMaxed: boolean;
  area?: string;
};

/** No chosen type means every type. */
export function filterPets(pets: Pet[], levels: Levels, filters: PetFilters) {
  const query = filters.query.trim().toLowerCase();

  return pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(query) &&
      (filters.types.size === 0 || filters.types.has(pet.type)) &&
      !(filters.hideMaxed && isMaxed(levels, pet.id)) &&
      (filters.area === undefined || pet.areas.includes(filters.area)),
  );
}
