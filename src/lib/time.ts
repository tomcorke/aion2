import { TZDate, tz } from "@date-fns/tz";
import {
  addDays,
  addHours,
  addMinutes,
  differenceInSeconds,
  format,
  getDay,
  getHours,
  intervalToDuration,
  parseISO,
  startOfDay,
} from "date-fns";
import type { Zone } from "../preferences/preferences.ts";

// The EU server clock. Boss timers seen in game fit Central European time, but the region's
// true server zone is an open question in the notes repo; change it here if that resolves.
export const SERVER_ZONE = "Europe/Berlin";

const zoneNames: Record<Exclude<Zone, "local">, string> = {
  server: SERVER_ZONE,
  utc: "UTC",
};

/** Server wall-clock times something happens: these hours at this minute, optionally only on these weekdays (0 = Sunday). */
export type Slots = {
  hours: number[];
  minute: number;
  days?: number[];
};

/** Every `step` hours from `start` until midnight, as a list of hours. */
export function everyHours(start: number, step: number) {
  return Array.from(
    { length: Math.ceil((24 - start) / step) },
    (_, i) => start + i * step,
  );
}

/** Seconds until the next slot after `now`. Slots are server wall-clock times, so daylight saving is handled. */
export function secondsUntilNext(now: Date, { hours, minute, days }: Slots) {
  const today = startOfDay(new TZDate(now, SERVER_ZONE));
  const end = addDays(today, 8);

  // Elapsed hours visit both autumn occurrences and skip nonexistent spring hours.
  // Setting a wall hour directly can choose only one side of an ambiguous slot.
  for (let hour = today; hour < end; hour = addHours(hour, 1)) {
    if (!hours.includes(getHours(hour))) continue;
    if (days && !days.includes(getDay(hour))) continue;

    const slot = addMinutes(hour, minute);

    if (slot > now) return differenceInSeconds(slot, now);
  }

  throw new Error("Slots name no weekday");
}

/** "3d 4h", "3h 07m" or "12m 05s". */
export function formatCountdown(seconds: number) {
  const {
    days = 0,
    hours = 0,
    minutes = 0,
    seconds: secs = 0,
  } = intervalToDuration({ start: 0, end: seconds * 1000 });
  const pad = (n: number) => String(n).padStart(2, "0");

  if (days > 0) return `${days}d ${hours}h`;

  if (hours > 0) return `${hours}h ${pad(minutes)}m`;

  return `${minutes}m ${pad(secs)}s`;
}

/** Weekday and clock time in the reader's chosen zone, such as "Wed 16:00". */
export function formatAt(date: Date, zone: Zone) {
  return format(
    date,
    "EEE HH:mm",
    zone === "local" ? undefined : { in: tz(zoneNames[zone]) },
  );
}

export function formatServerClock(now: Date) {
  return format(now, "HH:mm:ss", { in: tz(SERVER_ZONE) });
}

/** An ISO date such as "2026-10-14" as "14 October 2026". */
export function formatDate(isoDate: string) {
  return format(parseISO(isoDate), "d MMMM yyyy");
}
