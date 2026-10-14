// Stored ticks are untrusted: keep only known piece IDs, once each.
export function validOwned(value: unknown, known: ReadonlySet<string>) {
  if (!Array.isArray(value)) return [];

  return [
    ...new Set(
      value.filter(
        (id): id is string => typeof id === "string" && known.has(id),
      ),
    ),
  ];
}

export function toggleOwned(owned: string[], id: string) {
  return owned.includes(id)
    ? owned.filter((other) => other !== id)
    : [...owned, id];
}

export const ownedCount = (pieces: { id: string }[], owned: string[]) =>
  pieces.filter(({ id }) => owned.includes(id)).length;
