// Per-browser storage. Reads and writes fail quietly: private windows and blocked storage
// fall back to defaults.
export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);

    if (raw === null) return fallback;

    const value: unknown = JSON.parse(raw);

    return typeof value === typeof fallback ? (value as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStored(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable; the choice lasts for this visit only.
  }
}
